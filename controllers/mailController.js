const mailModel = require('../models/mail');
const userModel = require('../models/user');

module.exports.getMail = async function (req, res) {
    try{
        let user = await userModel.findOne({email:req.user.email});
        await user.populate("received");
        res.json({
            message:"Mail retrieved Successfully",
            data:user.received
        })
    }catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports.postMail = async function (req, res) {
    try {
        const from = req.user.email || ""
        const { to, subject = "", body } = req.body
        if (!from || !to || !body) {
            res.json({
                message: "Please provide all fields"
            })
            return;
        }
        let mail = await mailModel.create({ from, to, subject, body });
        let user1 = await userModel.findOne({email:from});
        let user2 = await userModel.findOne({email:to});
        if(user1){
            user1.sent.push(mail._id);
            await user1.save();
        }
        if(user2){
            user2.received.push(mail._id);
            await user2.save();
        }
        res.json({
            message:"Mail sent Successfully",
            data:mail
        })
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}
