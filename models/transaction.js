//const { type } = require("express/lib/response");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const transactionSchema=new Schema({
    id:Number,
    title:String,
    description:String,
    price:{
        type:Number,
        required:true,
    },
    image:{
        url:String,
    },
    category:String,
    dateOfSold:{
        type:Date,
    },
    sold:{
        type:Boolean,
        default:false,
    },
},{timestamps:true});

//Module.exports=mongoose.model("transaction",transactionSchema);
const Transaction=mongoose.model("Transaction",transactionSchema);
module.exports=Transaction;