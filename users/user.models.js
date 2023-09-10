const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name:{
        type:String,
        unique:true,
        required:[true, 'You Must Include a name']
    },
    age: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'Age must be an integer.'
        },
    },
    country:{
        type:String,
        required:true
    }

})

const UserModel = mongoose.model("User", UserSchema);

module.exports = {UserModel}