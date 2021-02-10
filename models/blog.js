const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    required: true,
    unique: false
  },
  author: {
    type: String,
    minlength: 3,
    required: true
  },
  url: {
    type: String,
    minlength: 3,
    required: true
  },
  likes: {
    type: Number,
    minlength: 3,
    required: true
  }
})

blogSchema.plugin(uniqueValidator)

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)