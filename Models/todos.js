const { Schema } = require('mongoose')
const { model } = require('mongoose')
const demo = new Schema({
    todoId: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
})

const todos = model('todos1', demo) 
module.exports = todos    