let express = require('express')
let app = express()
let bodyParser = require('body-parser')

let database = require('./database.js')

let user = {
    name: '',
    famName: '',
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/web`))

app.use((req, res, next) => {
    console.log('request method', req.method)
    next()
})

app.get('/index', (req, res) => {
    res.sendFile(`${__dirname}/web/index.html`)
})

app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/web/login.html`)
})

app.get('/new', (req, res) => {
    res.sendFile(`${__dirname}/web/new.html`)
})

app.post('/valUser', (req, res) => {
    let body = req.body

    console.log(body)

    database.get(body.fam)
        .then(data => {
            if (data != undefined) {
                if (data[body.name]) {
                    if (data.pwd == body.pwd) {
                        user.name = body.name
                        user.famName = body.fam
                        console.log(user)
                        res.json({ status: 'valid' })
                    }
                    else {
                        res.json({ status: 'Password is incorrect' })
                    }
                } else {
                    res.json({ status: 'There is no such person in family' })
                }
            } else {
                res.json({ status: 'There is no such family' })
            }
        })
})

app.get('/nameAvail', (req, res) => {
    let query = req.query
    let name = query.name

    database.get(name)
        .then(data => {
            if (data == undefined) {
                res.json({ avail: true })
            } else {
                res.json({ avail: false })
            }
        })
})

app.get('/userDetails', (req, res) => {
    res.json({
        name: user.name,
        fam: user.famName
    })
})

//database links
app.get('/all', (req, res) => {
    res.status(200)
    database.getAll()
        .then(data => {
            res.json(data)
        })
        .catch(err => { console.log(err) })
})

app.get('/getOne', (req, res) => {
    let query = req.query
    database.get(query['fam'])
        .then((dataRes) => {
            console.log(dataRes)
            if (dataRes != undefined) {
                res.json(dataRes)
            } else {
                res.json({ failed: true })
            }
        })
        .catch(err => { console.log(err) })
})

app.post('/create', (req, res) => {

    let query = req.query

    database.create({ names: query.names, fam: query.fam, pwd: query.pwd })
        .then(dataRes => {
            if (dataRes == false) {
                res.status(404)
                res.send('already another with that key')
            } else {
                res.status(200)
                res.send('successfully updated')
            }
        })
        .catch(err => { console.log(err) })

})

app.put('/update', (req, res) => {
    let query = req.query

    database.update({ name: query.name, weight: query.weight, time: query.time, date: query.date, fam: query.fam, pwd: query.pwd })
        .then(dataRes => {
            if (dataRes == false) {
                res.status(404)
                res.send('no such person in database')
            } else {
                res.status(200)
                res.send('successful')
            }
        })
        .catch(err => { console.log(err) })

})

app.delete('/delFam', (req, res) => {
    let query = req.query

    database.delUser(query.fam)
        .then(dataRes => {
            if (dataRes == false) {
                res.status(404)
                res.send('no such family in database')
            } else {
                res.status(200)
                res.send('okay, family has been deleted')
            }
        })
        .catch(err => { console.log(err) })

})

app.use((req, res) => {
    res.header(404)
    res.send('bad request bruv')
})

app.listen(3000)