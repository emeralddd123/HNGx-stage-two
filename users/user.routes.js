const express = require('express')

const { addUser, getUser, updateUser, deleteUser } = require('./user.controllers')

const userRouter = express.Router()

userRouter.post('/', addUser)
userRouter.get('/:name', getUser)
userRouter.put('/:name', updateUser)
userRouter.delete('/:name', deleteUser)

module.exports = { userRouter }
