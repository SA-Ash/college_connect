import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    commonName:{type:String, required:true},
    phoneNumber:{type:mongoose.Schema.Types.ObjectId, required:true},
    email:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}
})

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;