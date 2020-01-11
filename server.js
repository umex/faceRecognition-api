const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
const knex = require('knex')

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

app.get('/',(req, res) => {
    res.send(database.users);
})

app.post('/signin',(req, res) => { 
    const { email, password } = req.body;
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials 2')
      }
    })
    .catch(err => res.status(400).json(err))

})

app.post('/register',(req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(9));
    
    db.transaction(trx => {
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return   trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);      
                    })  
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err =>res.status(400).json('Unable to register'))
    
})

app.get('/profile/:id',(req, res) => {
    //ker je parameter v linku beremo iz parametrov
    const {id} = req.params;
    db.select('*').from('users').where({id:id})
    .then(user=>{
        if(user.length){
            res.json(user[0]);
        }else{
            res.status(400).json('User not found')
        }
        
    })
    .catch(err =>res.status(400).json('Error getting user'))
})

app.put('/image', (req, res) => {
    //ker je parameter v bodyu beremo iz bodya
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err =>res.status(400).json('Unable to get count'))
})



app.listen(3001,()=>{
    console.log('App is running on port 3001!');
})
