import express from 'express'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { authService } from './services/auth.back.service.js'
import { userService } from './services/user.service.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/bug', (req, res) => {
    const filterBy = req.query
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot load bugs')
        })
})

//ADD
app.post('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

//EDIT
app.put('/api/bug/:bugId', (req, res) => {
    console.log("🚀 ~ app.put ~ req:", req.body)
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {

    const { bugId } = req.params
    let visitedBugs = req.cookies.visitedBugs || []

    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
    console.log("visitedBugs:", visitedBugs)
    if (visitedBugs.length > 3) {
        console.log('You have reached your limit in free trial')
        return res.status(401).send('You have reached your limit in free trial')
    }
    res.cookie('visitedBugs', visitedBugs, { maxAge: 9 * 1000 })
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {

    const { bugId } = req.params
    console.log('Deleted: ', bugId)
    bugService.remove(bugId)
        .then(() => res.send('Bug removed'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

// User API
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

// Auth API
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(() => res.status(404).send('Invalid Credentials'))
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    userService.add(credentials)
        .then(user => {
            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
        .catch(err => res.status(400).send('Username taken.'))
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

const PORT = 3030

app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)

