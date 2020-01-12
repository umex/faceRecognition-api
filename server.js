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
      host : 'postgresql-deep-25299',
      user : 'postgres',
      password : 'isRucu74',
      database : 'brain'
    }
});


app.get('/',(req, res) => {res.send('it is working');})
//dependency injection
app.post('/signin',(req, res) => {signin.handleSignIn(req, res, db, bcrypt)})
app.post('/register',  (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id',(req, res) => profile.handleProfile(req, res))
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res, db)})



app.listen(process.env.PORT || 3001,()=>{
    console.log('App is running on port ${process.env.PORT}!');
})
