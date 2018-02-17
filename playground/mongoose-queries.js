const { ObjectID } = require( "mongodb" );
const { mongoose } = require( "./../server/db/mongoose" );
const { Todo } = require( "./../server/models/todo" );
const { User } = require( "./../server/models/user" );

// let id = "5a87d8b592be1d3582449fe9";
//
// Todo.find( {
//   _id: id
// } ).then( ( todos ) => {
//   console.log( "Todos", todos );
// } );
//
// Todo.findOne( {
//   _id: id
// } ).then( ( todo ) => {
//   console.log( "Todo", todo );
// } );

// if( !ObjectID.isValid( id )) {
//   console.log( 'id not valid' );
// }
//
// Todo.findById( id ).then( ( todo ) => {
//   if ( !todo ) {
//     return console.log( "id not found" );
//   }
//   console.log( "Todo by id", todo );
// } ).catch( ( e ) => console.log( e ) );

let userId = "5a85b8e0d88ff916d5859061";

User.findById( userId )
  .then( ( user ) => {
    if ( !user ) {
      return console.log( "user not found" );
    }

    console.log( "User", JSON.stringify( user, undefined, 2 ) );
  } )
  .catch( ( e ) => console.log( e ) );