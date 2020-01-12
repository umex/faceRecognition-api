const handleRegister = (req, res, db, bcrypt) => {
    console.log(req.body);

    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);

    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }

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
    
}

module.exports = {
    handleRegister: handleRegister
}