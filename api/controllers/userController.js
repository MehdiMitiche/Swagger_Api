'use strict';

const User = require('../models/User');
const db = require('../helpers/database');
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  getUsers,
  getUserById,
  addUser,
  editUser
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function hello(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  //var name = req.swagger.params.name.value || 'stranger';

}

function getUsers(req, res) {
  const query = {}

  db.openConnection();
  
  User.find(query, (err, users) => {
      if(err){
        res.json(err)
      }else{
        res.json({ users })
      }  
  }).then(()=>{
    db.closeConnection();
  })
}

function getUserById(req,res){
  const phoneSearched = req.swagger.params.userId.value;

  db.openConnection();

  User.findOne({phone : phoneSearched },(err,user) =>{
    if(err){
      res.json(err)
    }else{
      if(user){
        res.json(user)
      }else{
        res.json({message : "User Not found"})
      }
    }
  }).then(()=>{
    db.closeConnection();
  })
}

function addUser(req,res){
  req.checkBody('phone','the phone is required');
  req.checkBody('firstName','the first name is required');
  req.checkBody('lastName','the last name is required');
  req.checkBody('adresse','the addresse is resuired');

  const err = req.validationErrors();
  if(err){
    res.json(err)
  }else{
    db.openConnection();

    const newUser = new User({
      phone : req.body.phone,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      adresse : req.body.adresse
    })

    newUser.save((err,user)=>{
      if(err){
        res.json(err)
      }else{ 
        res.json(user)
      }
    }).then(()=>{
      db.closeConnection();
    })
  }
}

function editUser(req,res){
  const phoneSearched = req.swagger.params.userId.value;

  req.checkBody('phone','the phone is required');
  req.checkBody('firstName','the first name is required');
  req.checkBody('lastName','the last name is required');
  req.checkBody('adresse','the addresse is resuired');

  const err = req.validationErrors();

  if(err){
    res.json(err)
  }else{

    db.openConnection();

    const updatedUser = {
      phone : req.body.phone,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      adresse : req.body.adresse
    }
  
    User.findOneAndUpdate({phone : phoneSearched} ,updatedUser,(err,user) =>{
      if(err){
        res.json(err)
      }else{
        User.findById(user._id,(err,updatedUser)=>{
          res.json(updatedUser);
        })
      }
    }).then(()=>{
      db.closeConnection();
    })
  }
}
