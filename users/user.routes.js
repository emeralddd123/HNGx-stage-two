const express = require('express')

const { addUser, getUser, updateUser, deleteUser } = require('./user.controllers')

const userRouter = express.Router()

userRouter.post('/', addUser)
userRouter.get('/:id', getUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

module.exports = { userRouter }
