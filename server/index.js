const express = require('express');
const path = require('path');
const Rollbar = require('rollbar');
const cors = require('cors');


let rollbar = new Rollbar({
    accessToken: 'eac284207de144c2a6e4fff3bb06e11e',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express();
app.use(express.json());
app.use(cors());

app.get('/styles', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/styles.css'))
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'))
    rollbar.info('html file served successfully', {author: 'Carston'})
});

function makeNewEntry(req, res) {
    console.log(req.body)
    const { favClass, favGame, favColor } = req.body
    if (favClass === 'math') {
        rollbar.critical('User thinks math is cool')
    }
    if (favColor === 'green') {
        rollbar.warning('User has no artistic taste')
    }
    const newEntry = {
        favClass, favGame, favColor
    }
    let isThereNull = false
    for (piece in newEntry) {
        if (newEntry[piece] === 'none') {
            isThereNull = true
            rollbar.error('User left a field blank')
            res.status(406)
            break
        } 
    }
    if (!isThereNull) {
        rollbar.info('User successfully entered their favorites', {favClass, favGame, favColor})
        res.status(200).send(newEntry)
    }
}

app.post('/newInfo', (req, res) => {
    try {
        makeNewEntry(req, res)
    } catch (error) {
        rollbar.error(error)
    }
})

app.get('/healthCheck', (req, res) => {
    console.log("op char")
    rollbar.error('User has created an OP character')
    res.status(200)
})

const port = process.env.PORT || 4005;



app.listen(port, () => console.log(`running on port ${port}`));