const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
const knex = require('knex')
const morgan = require('morgan')

const register = require('./controllers/register')
const image = require('./controllers/image')
const profile = require('./controllers/profile')
const signin = require('./controllers/signin')
const auth = require('./controllers/authorization')


const app = express();
app.use(bodyParser.json());
app.use(cors())

console.log(process.env.POSTGRES_HOST);
console.log(process.env.POSTGRES_USER);
console.log(process.env.POSTGRES_PASSWORD);
console.log(process.env.POSTGRES_DB);
console.log(process.env.REDIS_URI);
const db = knex({
    client: 'pg',
    /*
    connection: {
      host : process.env.POSTGRES_HOST,
      //host : 'postgresql-deep-25299',
      user : process.env.POSTGRES_USER,
      password : process.env.POSTGRES_PASSWORD,
      database : process.env.POSTGRES_DB
    }
    */
    
    connection: {
      host : '127.0.0.1',
      //host : 'postgresql-deep-25299',
      user : 'postgres',
      password : 'isRucu74',
      database : 'brain'
    }
    
    /*
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl:true
    }
    */
});
//app.use(morgan('combined'));

app.get('/',(req, res) => {res.send('it is working');})
//dependency injection
//app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)})
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register',  (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', auth.requireAuth, (req, res) => profile.handleProfileGet(req, res, db))
app.post('/profile/:id', auth.requireAuth, (req, res) => profile.handleProfileUpdate(req, res, db))
//test
app.put('/image', auth.requireAuth, (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', auth.requireAuth, (req, res) => {image.handleApiCall(req, res, db)})



app.listen(process.env.PORT || 3001,()=>{
    console.log(`App is running on port ${process.env.PORT}`, process.env.DATABASE_URL);
})
