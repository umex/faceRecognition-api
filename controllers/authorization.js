const redisClient = require('./signin').redisClient;

//next je 3. parameter ki ga dobimo z expressom 
const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json('Unauthorized');
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    console.log('pass')
    return next();
  });
};

module.exports = {
  requireAuth
}