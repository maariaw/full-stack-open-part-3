const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phonebook-backend:${password}@cluster0.klygk.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
}

if (process.argv.length === 4) {
  console.log('Please provide both name and number as arguments: node mongo.js <password> <name> <number>')
  process.exit(1)
}

if (process.argv.length > 5) {
  console.log('Too many arguments! Put quotation marks around names and numbers containing spaces.')
  process.exit(1)
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

person.save().then(result => {
  console.log(`Added ${result.name} with number ${result.number} to phonebook`)
  mongoose.connection.close()
})
