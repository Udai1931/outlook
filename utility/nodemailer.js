const nodemailer = require("nodemailer");

module.exports.sendEmail = async function sendEmail(email,link) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "udaigupta19311@gmail.com", // generated ethereal user
      pass: "nhebvcburdhpgfau", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>${link}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
}