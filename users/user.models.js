const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name:{
        type:String,
        unique:true,
        required:[true, 'You Must Include a name']
    }
})

const UserModel = mongoose.model("User", UserSchema);

module.exports = {UserModel}