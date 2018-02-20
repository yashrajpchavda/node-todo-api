require( "./config/config" );

const _ = require( "lodash" );
const express = require( "express" );
const bodyParser = require( "body-parser" );
const { ObjectID } = require( "mongodb" );
const bcrypt = require( "bcryptjs" );

const { mongoose } = require( "./db/mongoose" );
const { Todo } = require( "./models/todo" );
const { User } = require( "./models/user" );
const { authenticate } = require( "./middleware/authenticate" );

const app = express();

const port = process.env.PORT;

app.use( bodyParser.json() );

app.post( "/todos", authenticate, ( req, res ) => {

  let todo = new Todo( {
    text: req.body.text,
    _creator: req.user._id
  } );

  todo.save()
    .then( ( doc ) => {
      res.send( doc );
    } )
    .catch( ( err ) => {
      res.status( 400 ).send( err );
    } );

} );

app.get( "/todos", authenticate, ( req, res ) => {

  Todo.find( { _creator: req.user._id } )
    .then( ( todos ) => {
      res.send( { todos } );
    } )
    .catch( ( err ) => {
      res.status( 400 ).send( err );
    } );

} );

app.get( "/todos/:id", authenticate, ( req, res ) => {

  const todoId = req.params.id;

  // validate the id
  if ( !ObjectID.isValid( todoId ) ) {
    return res.status( 404 ).send();
  }

  Todo.findOne( {
    _id: todoId,
    _creator: req.user._id
  } )
    .then( ( todo ) => {

      if ( !todo ) {
        return res.status( 404 ).end();
      }

      return res.send( { todo } );
    } )
    .catch( ( e ) => res.status( 400 ).send( e ) );

} );

app.delete( "/todos/:id", authenticate, ( req, res ) => {

  const todoId = req.params.id;

  if ( !ObjectID.isValid( todoId ) ) {
    return res.status( 404 ).send();
  }

  Todo.findOneAndRemove( {
    _id: todoId,
    _creator: req.user._id
  } )
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

app.patch( "/todos/:id", authenticate, ( req, res ) => {

  const todoId = req.params.id;
  const body = _.pick( req.body, [ "text", "completed" ] );

  if ( !ObjectID.isValid( todoId ) ) {
    return res.status( 404 ).send();
  }

  if ( _.isBoolean( body.completed ) && body.completed ) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate( { _id: todoId, _creator: req.user._id }, { $set: body }, { new: true } )
    .then( ( todo ) => {
      if ( !todo ) {
        return res.status( 404 ).send();
      }
      res.send( { todo } );
    } )
    .catch( ( err ) => {
      res.status( 400 ).send( err );
    } );

} );

// POST /users
app.post( "/users", ( req, res ) => {

  const body = _.pick( req.body, [ "email", "password" ] );
  const user = new User( body );

  user.save()
    .then( () => {
      return user.generateAuthToken();
    } )
    .then( ( token ) => {
      res.header( "x-auth", token ).send( user );
    } )
    .catch( ( err ) => {
      res.status( 400 ).send( err );
    } );

} );

app.get( "/users/me", authenticate, ( req, res ) => {

  res.send( req.user );

} );

app.post( "/users/login", ( req, res ) => {

  const { email, password } = req.body;

  User.findByCredentials( email, password )
    .then( ( user ) => {
      user.generateAuthToken().then( ( token ) => {
        res.header( "x-auth", token ).send( user );
      } );
    } )
    .catch( ( err ) => {
      res.status( 400 ).send();
    } );

} );

app.delete( "/users/me/token", authenticate, ( req, res ) => {

  req.user.removeToken( req.token )
    .then( () => {
      res.status( 200 ).send();
    } )
    .catch( () => {
      res.status( 400 ).send();
    } );

} );

app.listen( port, () => {
  console.log( `started on port ${port}` );
} );

module.exports = { app };

