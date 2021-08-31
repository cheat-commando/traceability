const express = require('express');
const path = require('path');
const Rollbar = require('rollbar')

let rollbar = new Rollbar({
    accessToken: 'eac284207de144c2a6e4fff3bb06e11e',
    captureUncaught: true,
    captureUnhandledRejections: true
})

let currentId = 1
const peoplesInterest = []

const app = express();
app.use(express.json());

app.use('/styles', express.static('../client/styles.css'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'))
    rollbar.info('html file served successfully', {author: 'Carston'})
});

function makeNewEntry(req, res) {
    const { favClass, favGame, favColor } = req.body
    if (favClass.toLowerCase() === 'math') {
        rollbar.critical('User thinks math is cool')
    }
    if (favColor.toLowerCase() === 'green') {
        rollbar.warning('User has no artistic side')
    }
    const newEntry = {
        id: currentId,favClass, favGame, favColor
    }
    let isThereNull = false
    for (piece in newEntry) {
        if (piece === 'none') {
            isThereNull = true
        } 
    } 
    if (!isThereNull) {
        newEntry++
        peoplesInterest.push(newEntry)
        rollbar.info('User successfully entered their favorites', {faveHero, faveAnime, favColor})
        res.status(200).send(newEntry)
    } else {
        rollbar.error('User left a field blank')
        res.status(406)
    }
}

app.post('/newInfo', () => {
    try {
        makeNewEntry
    } catch (error) {
        rollbar.error(error)
    }
})

app.get('/healthCheck/:health', (req, res) => {
    if (req.params.health === 20) {
        rollbar.error('User has created an OP character')
    }
    res.status(200)
})

const port = process.env.PORT || 4005;



app.listen(port, () => console.log(`running on port ${port}`));