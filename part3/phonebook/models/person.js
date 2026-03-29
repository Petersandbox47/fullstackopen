const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)

const validateNumber = (number) => {
  return /^\d{2,3}-\d+$/.test(number) && number.length >= 8
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required'],
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    validate: {
      validator: validateNumber,
      message: 'Number must be at least 8 characters, formatted as XX-XXXXXX or XXX-XXXXXX',
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
