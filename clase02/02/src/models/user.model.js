import mongoose from 'mongoose'

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    firstName: String, 
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true
    }, 
    password: String,
    age: Number
}, {
    versionKey: 'version' // Deshabilita el parámetro "__v"
})

export const userModel = mongoose.model(userCollection, userSchema)