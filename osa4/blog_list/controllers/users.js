const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const bd = req.body

    if (!("password" in bd) || bd.password === undefined || bd.password.length < 3) {
        res.status(400).json({error: "invalid password"})
        return
    }
      
    const saltRounds = 10
    const hash = await bcrypt.hash(bd.password, saltRounds)

    const user = new User({
        username: bd.username,
        password: hash,
        name: bd.name 
    })
    try {
        const saved = await user.save()
        res.status(201).json(saved)
    } catch(e) {
        res.status(400).json({error: e.message})
    }
    
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    res.json(users)
})




module.exports = usersRouter