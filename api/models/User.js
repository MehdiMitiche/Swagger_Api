const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone : {
        type : String,
        required : "Phone is required"
    },
    lastName : {
        type : String,
        required : " last name is required"
    },
    firstName : {
        type : String,
        required : "first name is required "
    },
    adresse : {
        type : String,
        required : "adresse is required"
    }
})

module.exports = User = mongoose.model('User',userSchema);