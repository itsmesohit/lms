
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNo: { type: String },
    password: { type: String },
    token: { type: String },
    role: { 
      type: String, 
      enum: ['user', 'instructor', 'admin'], 
      default: 'user'
    },
    region: { 
      type: String, 
      enum: ['USA', 'DUBAI', 'INDIA'], 
      default: 'USA' 
    }
  });
  
  module.exports = mongoose.model('User', UserSchema);