// User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
    businessName: String,
    businessAddress: String,
    phoneNumber: String,
    businessDescription: String,
    Image: String,
    createdAt: { type: Date, default: Date.now },
    profit: { type: Number, default: 0 }, // Seller's profit
});


module.exports = mongoose.model('User', UserSchema);
