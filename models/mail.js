const { default: mongoose } = require("mongoose");
const validator = require('validator');

let mailSchema = new mongoose.Schema({
    from:{
        type:String,
        required:true,
        validate:[function(){
            return validator.isEmail(this.from)
        },"Please provide a valid Email"]
    },
    to:{
        type:String,
        required:true,
        validate:function(){
            return validator.isEmail(this.to)
        }
    },
    subject:{
        type:String,
        default:""
    },
    body:{
        type:String,
        required:true,
        default:""
    }
});

const mailModel = mongoose.model('mailModel',mailSchema);
module.exports = mailModel;