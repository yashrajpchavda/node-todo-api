const express = require( "express" );
const bodyParser = require( "body-parser" );
const { ObjectID } = require( "mongodb" );

const { mongoose } = require( "./db/mongoose" );
const { Todo } = require( "./models/todo" );
const { User } = require( "./models/user" );

const app = express();

const port = process.env.PORT || 3000;

app.use( bodyParser.json() );

app.post( "/todos", ( req, res ) => {

  let todo = new Todo( {
    text: req.body.text
  } );

  todo.save()
    .then( ( doc ) => {
      res.send( doc );
    } )
    .catch( ( err ) => {
      res.status( 400 ).send( err );
    } );

} );

app.get( "/todos", ( req, res ) => {

  Todo.find()
    .then( ( todos ) => {
      res.send( { todos } );
    } )
    .catch( ( err ) => {
      res.status( 400 ).send( err );
    } );

} );

app.get( "/todos/:id", ( req, res ) => {

  const todoId = req.params.id;

  // validate the id
  if ( !ObjectID.isValid( todoId ) ) {
    return res.status( 404 ).send();
  }

  Todo.findById( todoId )
    .then( ( todo ) => {

      if ( !todo ) {
        return res.status( 404 ).end();
      }

      return res.send( { todo } );
    } )
    .catch( ( e ) => res.status( 400 ).send( e ) );

} );

app.delete( "/todos/:id", ( req, res ) => {

  const todoId = req.params.id;

  if ( !ObjectID.isValid( todoId ) ) {
    return res.status( 404 ).send();
  }

  Todo.findByIdAndRemove( todoId )
    .then( ( todo ) => {
      if ( !todo ) {
        return res.status( 404 ).send();
      }
      return res.send( { todo } );
    } )
    .catch( ( err ) => {
      return res.status( 400 ).send();
    } );

} );

app.listen( port, () => {
  console.log( `started on port ${port}` );
} );

module.exports = { app };

