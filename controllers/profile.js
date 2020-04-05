const handleProfileGet = (req, res, db) => {
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
}

const handleProfileUpdate = (req, res, db) => {
    const {id} = req.params;
    const {name, age} = req.body.formInput;
    db('users').where({id}).update({name}).then(resp => {
        if(resp){
            res.json("success");
        }else{
            res.status("400").json("unble to update");
        }
    }).catch(err =>res.status(400).json('Error updating user'))
}

module.exports = {
    handleProfileGet,
    handleProfileUpdate
}