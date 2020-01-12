const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
const knex = require('knex')
const register = require('./controllers/register')
const image = require('./controllers/image')
const profile = require('./controllers/profile')
const signin = require('./controllers/signin')

const app = express();
app.use(bodyParser.json());
app.use(cors())


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'isRucu74',
      database : 'brain'
    }
});

const database = {
    users:[
        {
            id:'123',
            name:'dejan',
            email:'dejan.obrez@gmail.com',
            password: '123',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/',(req, res) => {res.send(database.users);})
//dependency injection
app.post('/signin',(req, res) => {signin.handleSignIn(req, res, db, bcrypt)})
app.post('/register',  (req, res) => {register.handleSignIn(req, res, db, bcrypt)})
app.get('/profile/:id',(req, res) => profile.handleProfile(req, res))
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res, db)})



app.listen(process.env.PORT || 3001,()=>{
    console.log('App is running on port ${process.env.PORT}!');
})
