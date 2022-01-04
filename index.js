const express = require('express')
const jsonWebToken = require('jsonwebtoken')
const port =  process.env.port || 5000
const app = express()

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome'
    })
})

//route we want to protect
app.get('/posts', verifyToken, (req, res) => {
    jsonWebToken.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            //forbid access
            res.sendStatus(403)
        } else {
            res.json({
                message: 'post created',
                authData
            })
        }
    })
})

app.get('/login', (req, res) => {
    //create a mock user 
    const user = {
        id: 1, 
        username: 'sararita28'
    }
    jsonWebToken.sign({user}, 'secretkey', (err, token) => {
        res.json({
            token
        })
    })
})

// verify token
function verifyToken (req, res, next) {
    // get auth header value
    const bearerHeader = req.headers['authorization']
    // check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // split at the space (since format of token is :bearer <token>)
        const bearer = bearerHeader.split(' ')
        //get token from array (index 1)
        const bearerToken = bearer[1]
        //set the token then call the next middleware 
        req.token = bearerToken
        next()
    } else {
        // send forbidden status
        res.sendStatus(403)
    }
}

app.listen(port, () => console.log(`server listening on ${port}`))