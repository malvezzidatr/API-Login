import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    password: String,
    email: String,
})

export default model('User', UserSchema)