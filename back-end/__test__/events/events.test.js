const { 
    AttemtingVehicleRegistration,
    VehicleRegistration,
    VehicleLocationUpdate,
    VehicleDeregisration,
    VehicleDisregardLocationUpdate,
    VehicleInBoundries,
    AttemptingVehicleLocationUpdate,
    VehicleNotInBoundries,
    AttemtingVehicleDeregistration,
    events,
    saveEvents
} 
= require('../../src/lib/events');

const dbHandler = require('../dbHandler');

describe('Verify events', () => {
    let payload

    beforeEach(() => {
        payload = {vehicleId: "123", payload: { id: "123" }};
    });

    test('vehicle registration', () => {

        let output = AttemtingVehicleRegistration(payload);
    
        expect(output.type).toBe(events.AttemtingVehicleRegistration);

        output = VehicleRegistration(payload);
    
        expect(output.type).toBe(events.VehicleRegistration);
    });

    test('vehicle location update in boundries', () => {

       let output = AttemptingVehicleLocationUpdate(payload);
    
        expect(output.type).toBe(events.AttemptingVehicleLocationUpdate);

        output = VehicleInBoundries(payload);
    
        expect(output.type).toBe(events.VehicleInBoundries);
        
        output = VehicleLocationUpdate(payload);
    
        expect(output.type).toBe(events.VehicleLocationUpdate);

    });

    test('vehicle location update not in boundries', () => {
        let output = AttemptingVehicleLocationUpdate(payload);
    
        expect(output.type).toBe(events.AttemptingVehicleLocationUpdate);

        output = VehicleNotInBoundries(payload);
    
        expect(output.type).toBe(events.VehicleNotInBoundries);

        output = VehicleDisregardLocationUpdate(payload);
    
        expect(output.type).toBe(events.VehicleDisregardLocationUpdate);
    
    
    });

    test('vehicle deregistration', () => {

        let output = AttemtingVehicleDeregistration(payload);

        expect(output.type).toBe(events.AttemtingVehicleDeregistration);

        output = VehicleDeregisration(payload);

        expect(output.type).toBe(events.VehicleDeregisration);


        expect(output.vehicleId).toBe(payload.vehicleId);
    });

    describe('save events in db', () => {

        beforeAll(async () => {
            await dbHandler.connect();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        afterAll(async () => {
            await dbHandler.closeDatabase();
        })

        let event1, event2, eventsArr;

        beforeEach(() => {
            payload = {vehicleId: "123", payload: { id: "123" }};

            event1 = AttemtingVehicleRegistration(payload);
            event2 = VehicleRegistration(payload);
            eventsArr = [event1, event2];
        });

        test('vehicle registration does not throw error', async (done) => {
            expect(async () => await saveEvents(eventsArr)).not.toThrow();

            done();
        });

        test('vehicle registration', async (done) => {

            const savedEvents = await saveEvents(eventsArr);

            expect(savedEvents.length).toBe(2);

            expect(savedEvents[0]['type']).toBe(events.AttemtingVehicleRegistration);

            done();

        });
    });

});