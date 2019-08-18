/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
var express     = require('express');
var app    = express();
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongo    = require('mongodb').MongoClient;
//var db       = require('mongodb').MongoClient;

module.exports = function (app,db ) {
  //Database Connection
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
   var getAllBooks = db.collection("Library").find({}).toArray()  
    
    res.json({getAllBooks})
    })
    
    .post(function (req, res){
   
      //response will contain new book object including atleast _id and title
     // var project = req.params.project; 
      var books= {
        "title": req.body.title,
        "_id": Math.floor(Math.random()* 1000)
      }
     db.collection('Library').insertOne(books, {
       $set: {title: books.title,
             _id: books._id,
             comments: req.params.comment}
     })
     
        res.json({
          "status":"success",
         "_id": books._id,
          "title":books.title,
        })
    
  })
  
  //DELETE ALL BOOKS FROM LIBRARY 
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    db.collection('Library').deleteMany( {}, (err, result) => {
      if (err) {
        console.log(err);
        res.json('Error deleting Books')
      } 
      else {
        res.json('Complete Delete Successful')
      }
    })
   


//Find a book with ID
  app.route('/api/books/:id')
    .get(function (req, res){
      
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    var findBook = db.collection('Library').find(req.body._id).toArray()
    res.json({findBook}).catch(err => {
      console.log(err);
      res.json('error getting book')
    })
    })
//Post a comment on a book
    .post(function(req, res){
      var bookid = ObjectId(req.params.id);
      var comment = ObjectId(req.body.comment);
      //json res format same as .get
    var insertComment= db.collection('Library').findOneAndUpdate({ _id: bookid}, {$push: {comment}, $inc: {commentCount: 1}}, 
    {returnOriginal: false}
    ).catch(err => {
      console.log(err);
      res.json('error updating book')
    })
    res.json ({insertComment});
    })
    
//Delete a Single Book
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    
     if(!req.body._id) {
      res.status(422).send('_id error');
      return;
    }
    var _id = ObjectId(req.body._id)
    
      db.collection('Library').findOneAndDelete({_id})
      .then(doc => {
        if (doc.result.n) {
          res.status(200).send('complete delete successful');
          return;
        } res.status(423).send('could not delete' + req.body._id)
      })
    })
    });
  


};