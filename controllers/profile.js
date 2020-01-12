const handleProfile = (req, res) => {
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

module.exports = {
    handleProfile: handleProfile
}