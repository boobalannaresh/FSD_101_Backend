const User = require("../models/User")

const { sendMail } = require("./SendMail")

const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

var jwt = require('jsonwebtoken');

const dotenv = require("dotenv");
dotenv.config()
const verifyUser = require("../models/verifyUser");


async function InsertVerifyUser(name, email, password) {
    try {

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const token = generateToken(email);

        const newUser = new verifyUser({
            name: name,
            email: email,
            password: hashedPassword,
            token: token
        })

        const activationLink = `https://fsd-101-backend.onrender.com/signin/${token}`;

        const content = `<h4> Hi,there </h4>
        <h5>Welcome to the app 👋🙂 </h5>
        <p>Thank you for signing up. Click on the below link to activate </P>
        <a href="${activationLink}"> Click here </a>
        <p> Regards </p>
        <p>Team</p>
        `;


        await newUser.save();
        sendMail(email, "VerifyUser", content)

    } catch (e) {
        console.log(e)
    }
}


function generateToken(email) {
    const token = jwt.sign(email, process.env.signup_secret_token)
    return token;

}

async function InsertSignUpUser(token){

    try{
        const userVerify = await verifyUser.findOne({token : token})
        if(userVerify){
            const newUser = new User({
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
                forgetPassword: {}
            });
    
            await newUser.save();
            await userVerify.deleteOne({token : token});
            const content = `<h4> Registeration Successfull</h4>
            <h5>Welcome to the app 👋🙂 </h5>
            <p>You are successfully Registered </P>
            <p> Regards </p>
            <p>Team</p>
            `;
    
            sendMail(newUser.email, "Registeration Successfull", content);
            
            return `<h4> Hi,there </h4>
            <h5>Welcome to the app 👋🙂 </h5>
            <p>You are successfully Registered </P>
            <p> Regards </p>
            <p>Team</p>
            `;
        }
        return `<h4> Registeration failed </h4>
        <h5>Link has been expired .......😔 😕 </h5>
        <p>Regards</p>
        <p>Team</p>
        `;
    }catch(e){
      console.log(e);
      return `<html>
      <body>
      <h4> Registeration failed </h4>
      <h5>Unexpected error happenned .......😧 </h5>
      <p>Regards</p>
      <p>Team</p>
      </body>
      </html>
      `;
    }
}

module.exports = { InsertVerifyUser, InsertSignUpUser }