import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Garden = new Schema({
    owner: String,
    ownerEmail: String,
    name: String,
    place: String,
    rows: Number,
    cols: Number,
    free: Number,
    water: Number,
    temperature: Number,
    lastUpdate: String,
    plants: [{
        row: Number,
        col: Number,
        plant: {
            name: String,
            companyName: String,
            companyUsername: String
        },
        startDate: String, 
        finishDate: String,
        progress: Number
    }],
    products: [{
        id: {
            type: String
        },
        name: {
            type: String
        },
        type: {
            type: String
        },
        companyName: {
            type: String
        },
        companyUsername: {
            type: String
        },
        amount: {
            type: Number
        },
        time: {
            type: Number
        },
        orderId: {
            type: Number
        },
        deliveryDate: {
            type: String
        },
    }]
});

export default mongoose.model('Garden', Garden);