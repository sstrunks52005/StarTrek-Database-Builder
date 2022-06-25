//express facilitate server connections quicker
const express = require('express')
const app = express()
//connec to external db
const MongoClient = require('mongodb').MongoClient
const PORT = 8005
//hide db credentials in a variable - dotenv - make new .env file and .gitignore
require('dotenv').config()
//dont have to manually restart server - nodemon - add code to package.json file
//setup .env file and .gitignore

let db,
    dbConnectionStr = process.env.DB_STRING,   //this is put in env file to hide and connect to correct cluster
    dbName = 'startrek-aliens-guide'

MongoClient.connect(dbConnectionStr)  //   <- promise, { useUnifiedTopology: true }  
    .then(client => {
        console.log(`Connected to ${dbName} database`)
        db = client.db(dbName)   //establish connection to correct cluster
    })

//middleware - manipulate data as it flows back and forth. middleware before crud methods
app.set('view engine','ejs')
app.use(express.static('public'))               //look in public folder for html,css, js
app.use(express.urlencoded({extended: true}))   //help parse headers
app.use(express.json())                         //this instead of body parser. express to parse json


//setup server to listen to request
app.get('/', (request, response) => {            //pull homepage for GUI
    db.collection('startrek-aliens').find().toArray()   //pull data from db and render to page
    .then(data => {              //take name and 
        let nameList = data.map(item => item.speciesName)   //create array
        console.log(nameList)
        response.render('index.ejs', {info: nameList})   //render index.ejs file to show. put data in array called INFO
    })
    .catch(error => console.log(error))
})                        

//add new item to db
app.post('/api', (request,response) => {
    console.log('post heard')
    db.collection('startrek-aliens').insertOne(
        request.body
    )
    .then(result => {
        console.log(result)
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/updateEntry', (request,response) => {
    console.log(request.body)
    Object.keys(request.body).forEach(key => {
        if (request.body[key] === null || request.body[key] === undefined || request.body[key] === '') {
          delete request.body[key];
        }
      });
    console.log(request.body)
    db.collection('startrek-aliens').findOneAndUpdate(      //mongodb method - find one entry and update
        {name: request.body.name},                         //finds name in the object
        {
            $set:  request.body                           //replaces fields needed. keeps other field same
        },
        // {
        //     upsert: true
        // }
    )
    .then(result => {
        console.log(result)
        response.json('Success')
    })
    .catch(error => console.error(error))
})

app.delete('/deleteEntry', (request, response) => {        //server accept req to /deleteEntry url and send response to client
    db.collection('startrek-aliens').deleteOne(
        {name: request.body.name}            //tell it which one to delete. pass in object. pass in name 
    )
    .then(result => {
        console.log('Entry Deleted')
        response.json('Entry Deleted')          //response delete was completed
    })
    .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

