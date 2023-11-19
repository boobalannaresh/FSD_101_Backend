const express = require("express");
const { CheckUser } = require("../controllers/login");
const { InsertVerifyUser, InsertSignUpUser } = require("../controllers/signin");
var router = express.Router();


router.get("/:token", async (req, res) => {
      try{
        const response = await InsertSignUpUser(req.params.token)
        res.status(200).send(response)
      }catch (e){
          console.log(e)
          res.status(500).send(
            `<html>
          <body>
          <h4> Registeration failed </h4>
          <h5>Unexpected error happenned .......😧 </h5>
          <p>Regards</p>
          <p>Team</p>
          </body>
          </html>
          `);
      }
})

router.post("/verify", async (req, res) => {

    try {

        const { name, email, password } = await req.body;
        // console.log(name, password, email);

        const registerCredentials = await CheckUser(email)
        // console.log(registerCredentials)

        if (registerCredentials === false) {
            await InsertVerifyUser(name, email, password)
            console.log(InsertVerifyUser)
            res.status(200).send(true)

        } else if (registerCredentials === true) {
            res.status(200).send(false)

        } else if (registerCredentials === "Server Busy") {
            res.status(500).send("Server Busy")
        }

    } catch (e) {
        console.log(e)
    }

});

module.exports = router;