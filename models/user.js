const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        validate:[function(){
            return this.name.length>2
        },"Please Provide name with length greater than 2"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: [function () {
            return validator.isEmail(this.email)
        },"Provide a valid Email"]
    },
    password:{
        type:String,
        required:true,
        validate:[function(){
            return this.password.length>=8
        },"Password min Length is 8"]
    },
    confirmPassword:{
        type:String,
        required:true,
        validate:[function(){
            return this.password==this.confirmPassword
        },"Passwords do not match"]
    },
    resetToken : {
        type:String,
        default:""
    },
    sent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"mailModel"
    }],
    received:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"mailModel"
    }]
},{timestamps:true})

userSchema.pre('save',async function(){
    let hashedPassword = await bcrypt.hash(this.password,10)
    // console.log(hashedPassword)
    this.password=this.confirmPassword=hashedPassword
})

userSchema.methods.createResetToken=function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    return resetToken; 
}

userSchema.methods.resetPassword = async function(newPassword){
    this.password = this.confirmPassword = newPassword;
    this.resetToken = "";
}

const userModel = mongoose.model('userModel',userSchema);

module.exports = userModel;