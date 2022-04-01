const express = require('express');
const router = express.Router();
const userModel = require('../models/user')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_KEY } = require('../secret');
const { route } = require('express/lib/application');
const {sendEmail} = require('../utility/nodemailer')

router.route('/signup')
.post(signUp);

router.route('/login')
.post(login)

router.route('/forgetPassword')
.post(forgetPassword)

router.route('/resetPassword/:resetToken')
.post(resetPassword)

router.route('/logout')
.get(logout)

async function signUp(req,res){
    try{
        let {email,name,password,confirmPassword} = req.body;
        if(!email || !name || !password || !confirmPassword){
            res.json({
                message:"Please provide all the fields"
            })
            return;
        }
        let result = await userModel.create({name,email,password,confirmPassword});
        res.json({
            message:"Signed Up",
            data: result
        })
    }catch(err){
        res.json({
            error:err.message
        })
    }
}

async function login(req,res){
    try{
        let {email,password} = req.body;
        if(!email || !password){
            res.json({
                message:"Please provide all the fields"
            })
            return;
        }
        let user = await userModel.findOne({email});
        if(user){
            let same = await bcrypt.compare(password,user.password);
            if(same){
                let uid = user["_id"];
                let token = jwt.sign({payload:uid},JWT_KEY);
                res.cookie("login",token,{httpOnly:true});
                res.json({
                    message:"Login successful",
                    data:user
                })
                //status codes
            }else{
                res.json({
                    message:"Wrong credentials!"
                })
            }
        }else{
            res.json({
                message:"Wrong credentials!"
            })
        }
    }catch(err){
        res.json({
            error:err.message
        })
    }
}

async function forgetPassword(req,res){
    try{
        let {email} = req.body;
        let user = await userModel.findOne({email});
        if(user){
            let resetToken = user.createResetToken();
            await user.save();
            let link = `${req.protocol}://${req.get("host")}/user/resetPassword/${resetToken}`
            sendEmail(email,link);
            res.json({
                message:"Reset mail sent successfully",
                resetLink:link
            })
        }else{
            req.json({
                message:"Wrong Credentials"
            })
        }
    }catch(err){
        res.json({
            message:err.message
        })
    }
}

async function resetPassword(req,res){
    try{
        let {password} = req.body
        if(!password || password.length<8){
            res.json({
                message:"Please provide correct new password"
            })
            return;
        }
        let resetToken = req.params.resetToken
        let user = await userModel.findOne({resetToken});
        // console.log(user)
        if(user){
            user.resetPassword(password);
            user.save();
            res.json({
                message:"Password saved successfully"
            })
        }else{
            res.json({
                message:"Wrong Link"
            })
        }
    }catch(err){
        res.json({
            message:err.message
        })
    }
}

function logout(req,res) {
    res.cookie("login",'',{maxAge:1});
    res.json({
        message:"Logout Successfull."
    })
}

module.exports = router