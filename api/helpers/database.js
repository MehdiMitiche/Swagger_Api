const mongoose = require('mongoose');

function openConnection(){
    mongoose.connect('mongodb://localhost/Users');
    const db = mongoose.connection
    db.once('open',()=>{
        console.log('Database Connected');
    })
}

function closeConnection(){
    mongoose.connection.close()
}

module.exports = {
    openConnection,
    closeConnection
}