const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name:{type:String,reqired:true},
    image:{type:String,reqired:true},
    price:{type:Number,reqired:true},
    size:{type:String,reqired:true},
})



module.exports = mongoose.model('Menu',menuSchema);