const { ObjectID } = require( "mongodb" );
const { mongoose } = require( "./../server/db/mongoose" );
const { Todo } = require( "./../server/models/todo" );
const { User } = require( "./../server/models/user" );


// to remove all
// Todo.remove( {} ).then( ( results ) => {
//   console.log( results );
// } );

// to find one and remove, returns the found document
// Todo.findOneAndRemove( {_id: "5a885de8ec403134d6c9d194"} ).then( ( result ) => {
//   console.log( result );
// } );

// to find by id and remove, returns the found document
Todo.findByIdAndRemove( "5a885de8ec403134d6c9d194" ).then( ( todo ) => {
  console.log( todo );
} );