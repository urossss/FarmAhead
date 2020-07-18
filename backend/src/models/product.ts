import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Product = new Schema({
    id: Number,
    name: String,
    type: String,
    companyName: String,
    companyUsername: String,
    amount: Number,
    time: Number,
    ratingSum: Number,
    ratingCount: Number,
    price: Number,
    buyers: [
        {
            farmer: String
        }
    ],
    comments: [
        {
            farmer: String,
            rating: Number,
            comment: String
        }
    ]
});

export default mongoose.model('Product', Product);