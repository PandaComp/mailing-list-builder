const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')
import api, { aud_id } from './creds'


app.use(express.static("public")) // inside my html file, I can just refer to the file relative to "public" folder.
app.use(bodyParser.urlencoded({extended:true})) // now you'll be able to access req.body with app.post

app.get("/", (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})
 
app.post('/', (req, res)=> {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email
    console.log(firstName, lastName, email)
    const data = {
        members : [
            {
                email_address: email, 
                status: 'subscribed',
                merge_fields: 
                {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    }
    const jsonData = JSON.stringify(data)
    const url =  `https://us14.api.mailchimp.com/3.0/lists/${aud_id}`
    const options = {
        method: 'POST',
        auth: `paul1:${api}`
    }

    const request = https.request(url, options, (response)=>{
        if (response.statusCode < 300) {
            console.log(`STATUS: ${response.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
            response.setEncoding('utf8');
            response.on('data', (data)=>{
                console.log(JSON.parse(data))
            }) 
            response.on('end', ()=>{
                console.log("Response is done")
            })
            response.on('error', (e)=>{
                console.log(`something fucked up: ${e}`)
            })
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
            console.log('bad thing happened')
        }

    })

    request.write(jsonData)
    request.end()
}) 

app.listen(3000, (req, res) =>{
    console.log(`listening on port 3000`)
})

