const express = require("express")
const cors = require("cors")
const App = express()
require("dotenv").config()
const dns=require("dns")
 dns.setServers(["8.8.8.8","1.1.1.1"])
const mongoose = require("mongoose")
const nodemailer = require("nodemailer");

App.use(cors())
App.use(express.json())
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongodb connected")).catch((err)=> console.log(err))


const credential = mongoose.model("credential",{},"bulkmail")

App.post("/sendmail", function (req,res) {

    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function (data) {
        console.log(data)

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user:"sbarathsubramani2005@gmail.com",
                pass:"vopa vchy qilc hysg",
            },
        });

          new Promise(async function (resolve,reject) {

        try {
            for(var i=0 ;i<emailList.length ; i++)
             {
                await transporter.sendMail(
                    {
                        from: "sbarathsubramani2005@gmail.com",
                        to: emailList[i],
                        subject: "A message from bulk mail App",
                        text:msg
                    }


                )
                console.log("sent email to:"+emailList[i])
               

            }
            resolve("success")

        }
        catch (error) {
            console.log("mailer:",error)
            reject("failed")

        }

    }).then(function () {
        res.send(true)
    }).catch(function (error) {
        console.log(error)
        res.send(false)
    })


    }).catch(function (error) {
        
        console.log(error)
    })

  
})

App.listen(5000, function () {
    console.log("server started...")
})