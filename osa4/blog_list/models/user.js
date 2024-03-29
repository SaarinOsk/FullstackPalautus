const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    password: String,
    name: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})


userSchema.set('toJSON', {
    transform: (document, retObj) => {
        retObj.id = retObj._id.toString(),
        delete retObj.__v
        delete retObj._id,
        delete retObj.password
    }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
