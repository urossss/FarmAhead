import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Order = new Schema({
    id: Number,
    companyUsername: String,
    gardenId: String,
    gardenPlace: String,
    orderDate: String,
    deliveryStartDate: String,
    deliveryDate: String,
    products: [{
        id: {
            type: String
        },
        name: {
            type: String
        },
        amount: {
            type: Number
        },
        price: {
            type: Number
        },
    }]
});

export default mongoose.model('Order', Order);