const dbHandler = require('../dbHandler');
const EventService = require('../../src/lib/service/eventService');
const { events: eventNames } = require('../../src/lib/events/index');

const VehicleSchema = require('../../src/lib/schema/Vehicle');

const http = require('http');
const socket = require('../../src/lib/socket');

const socketClient = require('socket.io-client');
const VehicleService = require('../../src/lib/service/vehicleService');

describe('Event Service', () => {
    
    // Refer: https://medium.com/@tozwierz/testing-socket-io-with-jest-on-backend-node-js-f71f7ec7010f
    
    let ioServer, httpServer, httpServerAddr, ioClient;

    beforeAll(async () => {
        await dbHandler.connect();
        httpServer = http.createServer();
        httpServerAddr = httpServer.listen().address();
        ioServer = socket.init(httpServer);
    });

    afterAll(async () => {
        ioServer.close();
        httpServer.close();
        await dbHandler.closeDatabase();
    });

    beforeEach((done) => {
        ioClient = socketClient.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true,
            transports: ['websocket'],
          });

          ioClient.on('connect', () => {
              done();
          });
    })

    afterEach(async (done) => {
        if (ioClient.connected) {
            ioClient.disconnect();
        }
        await dbHandler.clearDatabase();
        done();
    });

    test('emits vehicle registration event', async (done) => {
        const postData = { id: "1234" };
        const vehicleId = postData['id'];
        const payload = { vehicleId, postData };
        const event = eventNames.VehicleRegistration;

        const output = await EventService.emitEvent(payload, event);

        expect(output.length).toBe(2);
        expect(output[0].vehicleId).toBe(vehicleId);
        expect(output[0].type).toBe(eventNames.AttemtingVehicleRegistration);
        expect(output[1].type).toBe(eventNames.VehicleRegistration);

        ioClient.on(event, ({ vehicleId, markerColor }) => {
            expect(vehicleId).toBe(postData['id']);
            expect(markerColor).not.toBe(null);
            done();
        });
    });

    describe('test location update and deregistration', () => {
        let vehicleSchema, savedVehicle, savedVehicleSpy
        let vehicleId = "1234";

        beforeEach(async () => {
            vehicleSchema = new VehicleSchema({ vehicleId });
            
            savedVehicleSpy = VehicleService.findById = jest.fn();
            
            savedVehicle = await vehicleSchema.save();
            savedVehicleSpy.mockReturnValue(savedVehicle);
        });

        test('emits vehicle location update event within boundry', async (done) => {
            const postData = { "lat": 52.53297, "lng": 13.42691, "at": "2017-09-01T12:00:00Z" };
  
            const payload = {vehicleId, data: postData};
            const event = eventNames.VehicleLocationUpdate;
    
            const output = await EventService.emitEvent(payload, event);
    
            expect(output.length).toBe(3);
            expect(output[0].vehicleId).toBe(vehicleId);
            expect(output[0].type).toBe(eventNames.AttemptingVehicleLocationUpdate);
            expect(output[1].type).toBe(eventNames.VehicleInBoundries);
            expect(output[2].type).toBe(eventNames.VehicleLocationUpdate);
    
            ioClient.on(event, ({ vehicleId: vId, markerColor, lat, lng }) => {
                expect(vId).toBe(vehicleId);
                expect(markerColor).not.toBe(null);
                expect(lat).toBe(postData['lat']);
                expect(lng).toBe(postData['lng']);
                done();
            });
    
        });
    
        test('vehicle location update outside boundry', async (done) => {
            const postData = { "lat": 13.53, "lng": 45.1, "at": "2017-09-01T12:00:00Z" };
            const vehicleId = "1234";

            const payload = {vehicleId, data: postData};
            const event = eventNames.VehicleLocationUpdate;
    
            const output = await EventService.emitEvent(payload, event);
    
            expect(output.length).toBe(3);
            expect(output[0].vehicleId).toBe(vehicleId);
           
            expect(output[0].type).toBe(eventNames.AttemptingVehicleLocationUpdate);
            expect(output[1].type).toBe(eventNames.VehicleNotInBoundries);
            expect(output[2].type).toBe(eventNames.VehicleDisregardLocationUpdate);
    
            done();
        });

        test('emits vehicle deregistration event', async (done) => {
            
            const payload = { vehicleId};
            const event = eventNames.VehicleDeregisration;

            const output = await EventService.emitEvent(payload, event);
            
            expect(output.length).toBe(2);
            expect(output[0].vehicleId).toBe(vehicleId);
           
            expect(output[0].type).toBe(eventNames.AttemtingVehicleDeregistration);
            expect(output[1].type).toBe(eventNames.VehicleDeregisration);


            ioClient.on(event, ({ vehicleId: vId, markerColor}) => {
                expect(vId).toBe(vehicleId);
                expect(markerColor).not.toBe(null);
                done();
            });
        });    
    });
});