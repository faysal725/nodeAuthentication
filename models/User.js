const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt= require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter valid email']
    },
    password: {
        type: String,
        required:   [true, 'please enter password'],
        minlength:[6, 'minimum pass length is six char']
    },
})




// fire a function before doc saved to db 
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()     // salt generation 
    this.password = await bcrypt.hash(this.password, salt)
    next()
})



// static method to login user 
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email})

    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user;
        }
        throw Error("incorrect pass")
    }
    throw Error('wrong mail')
}


const User = mongoose.model("user", userSchema)  //for building model u will need a schema which is wrote above



module.exports = User 