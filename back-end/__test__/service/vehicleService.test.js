const dbHandler = require('../dbHandler');
const VehicleSchema = require('../../src/lib/schema/Vehicle');
const VehicleService = require('../../src/lib/service/vehicleService');

describe('Vehicle Service test', () => {

    beforeAll(async () => {
        await dbHandler.connect();
    });

    afterEach(async () => {
        await dbHandler.clearDatabase();
    });

    afterAll(async () => {
        await dbHandler.closeDatabase();
    });

    let vehicle, id, output;

    beforeEach(async () => {
        id = "abc123" 
        vehicle = new VehicleSchema({ vehicleId: id, isRegistered: true, withInBounds: true });
        output = await vehicle.save();
    });

    test('test find by id', async () => {
        const vehicleId = id;
        const found = await VehicleService.findById(vehicleId);
        expect(output.vehicleId).toBe(found.vehicleId);
        expect(output._id).toStrictEqual(found._id);
    });

    describe('test upsert', () => {

        test('it should find and update value in db', async () => {
            const vehicle2 = new VehicleSchema({ vehicleId: id, isRegistered: false, withInBounds: false });

            const upserted = await VehicleService.upsert(vehicle2);
    
            expect(upserted.vehicleId).toBe(output.vehicleId);
            expect(upserted._id).toStrictEqual(output._id);
            
            expect(output.isRegistered).not.toBe(upserted.isRegistered);
            expect(output.withInBounds).not.toBe(upserted.withInBounds);
    
            expect(upserted.isRegistered).toBe(vehicle2.isRegistered);
            expect(upserted.withInBounds).toBe(vehicle2.withInBounds);
        });

        test('it should create a new instance in db', async () => {
            const newId = "1234abc";

            const vehicle2 = new VehicleSchema({ vehicleId: newId, isRegistered: false, withInBounds: false });

            const upserted = await VehicleService.upsert(vehicle2);
            
            expect(upserted.vehicleId).not.toBe(null);
            expect(upserted._id).not.toBe(null);

            expect(upserted.vehicleId).not.toBe(output.vehicleId);
            expect(upserted._id).not.toStrictEqual(output._id);

        });
        
    });


})