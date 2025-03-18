import express from 'express'

const app = express()

app.get('/api/bug', (req, res) => {
    res.send('List of bugs')
})

app.get('/api/bug/save', (req, res) => {
    res.send('Saving a bug or update')
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    console.log(req)
    res.send(`Return bug with id: ${bugId}`)

})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const {bugId} = req.params
    res.send(`Remove bug with id: ${bugId}`)
})

app.get('/', (req, res) => res.send('Hello there'))

app.listen(3030, () => console.log('Server ready at port 3030'))