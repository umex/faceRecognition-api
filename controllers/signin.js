var jwt = require('jsonwebtoken');
const redis = require("redis");

//setup redis:
//const redisClient = redis.createClient(process.env.REDIS_URI); - for docker
const redisClient = redis.createClient({host:'localhost'});


const handleSignIn = (req, res, db, bcrypt, ) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        return Promise.reject('wrong credentials');
      }
    })
    .catch(err => err)
}


const getAuthTokenId = (req, res) =>{
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).send('Unauthorized');
    }
    return res.json({id: reply})
  });
}

const signToken = (email) => {
  const jwtPayload = {email};
  console.log("signing token", email)
 return jwt.sign(jwtPayload, 'jwt-secret', {expiresIn:'2 days'}); //drugi parameter je secrett in tega se v produkciji ne daje na git - uporabi env. variablo
}

//const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id));
}


const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: 'true', userid: id, token, user }
    })
    .catch("test");
};



const createSessions = (user) => {
  //JWT token, return usuer data
  const {email,id} = user;
  const token = signToken(email);
  return {success: 'true', userid: id, token}
}
const signinAuthentication = (db, bcrypt) => (req, res) => {
    const {authorization} = req.headers;
    return authorization ? getAuthTokenId(req, res) : handleSignIn(req, res, db, bcrypt)
        .then(data => {
          return data.id && data.email ? createSession(data) : Promise.reject(data)
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
    
}

module.exports = {
    //handleSignIn: handleSignIn,
    signinAuthentication: signinAuthentication,
    redisClient: redisClient
}


/*
const handleSignIn = (req, res, db, bcrypt) => {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json('incorrect form submission');
    }
    
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
    //.catch(err => res.status(400).json(err))
    .catch(err => res.status(400).json('submission'))
}

const handleSignIn = (req, res, db, bcrypt) => {
    console.log('handleSignIn')
    const { email, password } = req.body;
    if (!email || !password) {
      return Promise.reject('invalid username or password')
    }
    
    return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        Promise.reject('wrong credentials 2')
      }
    })
    //.catch(err => res.status(400).json(err))
    .catch(err => Promise.reject('submission'))
}
*/