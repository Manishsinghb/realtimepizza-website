const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{type:String,reqired:true},
    email:{type:String,reqired:true,unique:true},
    password:{type:String,reqired:true},
    role:{type:String,default:'customer'},
},{timestamps:true})



module.exports = mongoose.model('User',userSchema);