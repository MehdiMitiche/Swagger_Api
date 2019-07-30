const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotItem= new Schema({
    u_id : String,
    state : String
})

const reservationSchema = new Schema({
    date : {
        type: String,
        required : 'the date is required'
    },
    client_capacity : {
        type : Number,
        required : 'Client capacity is required'
    },
    slots : [[slotItem]]
})



module.exports = Reservation = mongoose.model('Reservation',reservationSchema);