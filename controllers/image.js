const Clarifai = require('clarifai');


const app = new Clarifai.App({
    apiKey: 'YOUR API KEY'
});

const handleApiCall = (req, res, db) => {
    console.log('api call', req.body.input)
    app.models.predict(Clarifai.FACE_DETECT_MODEL , req.body.input)
    .then(data=>{
        console.log.data;
        res.json(data)
    })
    .catch(err =>res.status(400).json('Unable to call API'))
}

const handleImage = (req, res, db) => {
    //ker je parameter v bodyu beremo iz bodya
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err =>res.status(400).json('Unable to get count'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}