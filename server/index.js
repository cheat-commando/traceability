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

// function makeNewEntry(req, res) {
//     const { favHero, favAnime, favColor } = req.body
//     const newEntry = {
//         id: currentId,favHero, favAnime, favColor
//     }
//     newEntry++
//     peoplesInterest.push(newEntry)
//     res.status(200).send(newEntry)
// }

app.post('/newInfo', () => {
    try {
        makeNewEntry
    } catch (error) {
        rollbar.error(error)
    }
})

const port = process.env.PORT || 4005;



app.listen(port, () => console.log(`running on port ${port}`));