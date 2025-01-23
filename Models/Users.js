const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a Mongoose schema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    age: { type: Number, min: 18, max: 100 },
    createdAt: { type: Date, default: Date.now },
    isAdmin: {type: Boolean, default: false}
});
userSchema.index({_id:1});
// Create a Mongoose model from the schema
const User = mongoose.model('Users', userSchema);

module.exports = User;