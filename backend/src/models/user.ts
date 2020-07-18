import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let User = new Schema({
    type: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    fullName: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    date: {
        type: String
    },
    place: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    approved: {
        type: Boolean
    },
    transporters: [String]
});

export default mongoose.model('User', User);