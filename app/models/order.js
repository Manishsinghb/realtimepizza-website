const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
   customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
},
items:{type:Object,required:true},
phone:{type:String,required:true},
address:{type:String,reqired:true},
paymentType:{type:String,default:'COD'},//p
paymentStatus: { type: Boolean, default: false },//p

status:{type:String ,default:'order_placed'},

},{timestamps:true})



module.exports = mongoose.model('Order',orderSchema);