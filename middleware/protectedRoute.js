const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { JWT_KEY } = require('../secret');

module.exports = async function (req,res,next){
    try{
        if(req.cookies.login){
            let token = req.cookies.login;
            let payload = jwt.verify(token,JWT_KEY);
            let user = await userModel.findOne({_id:payload.payload})
            if(user){
                req.user = user
                next()
            }
            else    
            res.json({
                message:"Please Login first"
            })
        }else{
            res.json({
                message:"Please Login first"
            })
        }
    }catch(err){
        res.json({
            message:err.message
        })
    }
}