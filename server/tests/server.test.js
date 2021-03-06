const expect = require( "expect" );
const request = require( "supertest" );
const { ObjectID } = require( "mongodb" );

const { app } = require( "./../server" );
const { Todo } = require( "./../models/todo" );
const { User } = require( "./../models/user" );

const { todos, populateTodos, users, populateUsers } = require( "./seed/seed" );

beforeEach( populateUsers );
beforeEach( populateTodos );

describe( "POST /todos", () => {

  it( "should create a new todo", ( done ) => {
    let text = "Test todo";
    request( app )
      .post( "/todos" )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .send( { text } )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.text ).toBe( text );
      } )
      .end( ( err, res ) => {
        if ( err ) {
          return done( err );
        }

        Todo.find( { text } ).then( ( todos ) => {
          expect( todos.length ).toBe( 1 );
          expect( todos[ 0 ].text ).toBe( text );
          done();
        } ).catch( ( e ) => done( e ) );

      } );
  } );

  it( "should not create todo with invalid data", ( done ) => {
    request( app )
      .post( "/todos" )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .send( {} )
      .expect( 400 )
      .end( ( err, res ) => {
        if ( err ) {
          return done( err );
        }

        Todo.find().then( ( todos ) => {
          expect( todos.length ).toBe( 2 );
          done();
        } ).catch( ( e ) => done( e ) );

      } );
  } );

} );

describe( "GET /todos", () => {
  it( "should return all the todos", ( done ) => {
    request( app )
      .get( "/todos" )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todos.length ).toBe( 1 );
      } )
      .end( done );
  } );
} );

describe( "GET /todos/:id", () => {

  it( "should return the matching todo for the specified id", ( done ) => {

    request( app )
      .get( `/todos/${ todos[ 0 ]._id.toHexString()}` )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo.text ).toBe( todos[ 0 ].text );
      } )
      .end( done );

  } );

  it( "should not return the todo created by other user", ( done ) => {

    request( app )
      .get( `/todos/${ todos[ 1 ]._id.toHexString()}` )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .expect( 404 )
      .end( done );

  } );

  it( "should return 404 if todo not found", ( done ) => {

    const newId = new ObjectID().toHexString();

    request( app )
      .get( `/todos/${newId}` )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .expect( 404 )
      .end( done );

  } );

  it( "should return 404 if the invalid id was specified", ( done ) => {
    const invalidId = "234242adsfa";

    request( app )
      .get( `/todos/${invalidId}` )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .expect( 404 )
      .end( done );
  } );

} );

describe( "DELETE /todos/:id", () => {

  it( "should remove a todo", ( done ) => {

    const todoId = todos[ 1 ]._id.toHexString();

    request( app )
      .delete( `/todos/${todoId}` )
      .set( "x-auth", users[ 1 ].tokens[ 0 ].token )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo._id ).toBe( todoId );
      } )
      .end( ( err, res ) => {
        if ( err ) {
          return done( err );
        }

        Todo.findById( todoId )
          .then( ( todo ) => {
            expect( todo ).toBe( null );
            done();
          } )
          .catch( ( err ) => done( err ) );

      } );

  } );

  it( "should not remove todo of other user", ( done ) => {

    const todoId = todos[ 0 ]._id.toHexString();

    request( app )
      .delete( `/todos/${todoId}` )
      .set( "x-auth", users[ 1 ].tokens[ 0 ].token )
      .expect( 404 )
      .end( ( err, res ) => {
        if ( err ) {
          return done( err );
        }

        Todo.findById( todoId )
          .then( ( todo ) => {
            expect( todo ).toBeTruthy();
            done();
          } )
          .catch( ( err ) => done( err ) );

      } );

  } );

  it( "should return 404 if todo not found", ( done ) => {

    const todoId = new ObjectID().toHexString();

    request( app )
      .delete( `/todos/${todoId}` )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .expect( 404 )
      .end( done );

  } );

  it( "should return 404 if object id is not valid", ( done ) => {

    request( app )
      .delete( "/todos/2314asdfads" )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .expect( 404 )
      .end( done );

  } );

} );

describe( "PATCH /todos/:id", () => {

  it( "should update the todo", ( done ) => {

    const todoId = todos[ 0 ]._id.toHexString();
    const requestData = { text: "From the test case", completed: true };

    request( app )
      .patch( `/todos/${todoId}` )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .send( requestData )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo ).toMatchObject( requestData );
        expect( typeof res.body.todo.completedAt ).toBe( "number" );
      } )
      .end( done );

  } );

  it( "should not update the todo of other users", ( done ) => {

    const todoId = todos[ 0 ]._id.toHexString();
    const requestData = { text: "From the test case", completed: true };

    request( app )
      .patch( `/todos/${todoId}` )
      .set( "x-auth", users[ 1 ].tokens[ 0 ].token )
      .send( requestData )
      .expect( 404 )
      .end( done );

  } );

  it( "should clear the completedAt when todo is not completed", ( done ) => {

    const todoId = todos[ 1 ]._id.toHexString();
    const requestData = { text: "Update from the test", completed: false };

    request( app )
      .patch( `/todos/${todoId}` )
      .set( "x-auth", users[ 1 ].tokens[ 0 ].token )
      .send( requestData )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo ).toMatchObject( requestData );
        expect( res.body.todo.completedAt ).toBeFalsy();
      } )
      .end( done );

  } );

} );

describe( "GET /users/me", () => {

  it( "should return user if authenticated", ( done ) => {
    request( app )
      .get( "/users/me" )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body._id ).toBe( users[ 0 ]._id.toHexString() );
        expect( res.body.email ).toBe( users[ 0 ].email );
      } )
      .end( done );
  } );

  it( "should return 401 if not authenticated", ( done ) => {
    request( app )
      .get( "/users/me" )
      .expect( 401 )
      .expect( ( res ) => {
        expect( res.body ).toEqual( {} );
      } )
      .end( done );
  } );

} );

describe( "POST /users", () => {

  it( "should create a user", ( done ) => {

    const email = "example@example.com";
    const password = "123mnb!";

    request( app )
      .post( "/users" )
      .send( { email, password } )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.headers[ "x-auth" ] ).toBeTruthy();
        expect( res.body._id ).toBeTruthy();
        expect( res.body.email ).toBe( email );
      } )
      .end( done );

  } );

  // it( "should return validation errors if request invalid", ( done ) => {
  //
  // } );
  //
  // it( "should not create user if email in use", ( done ) => {
  //
  // } );

} );

describe( "POST /users/login", () => {

  it( "should authenticate the user if credentials are valid", ( done ) => {

    const email = "yash@ab.com";
    const password = "userOnePass";

    request( app )
      .post( "/users/login" )
      .send( { email, password } )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.headers[ "x-auth" ] ).toBeTruthy();
        expect( res.body._id ).toBeTruthy();
        expect( res.body.email ).toBe( email );
      } )
      .end( done );

  } );

  it( "should return 400 is the credentials are not valid", ( done ) => {

    const email = "yash@ab.com";
    const password = "wrongPass";

    request( app )
      .post( "/users/login" )
      .send( { email, password } )
      .expect( 400 )
      .end( done );

  } );

} );

describe( "DELETE /users/me/token", () => {

  it( "should remove the user's token from the database and invalidate it", ( done ) => {

    request( app )
      .delete( "/users/me/token" )
      .set( "x-auth", users[ 0 ].tokens[ 0 ].token )
      .send()
      .expect( 200 )
      .end( ( res ) => {
        // find the user by id
        console.log( "inside expect" );
        User.findById( users[ 0 ]._id ).then( ( res ) => {
          expect( res.tokens.length ).toBe( 0 );
          done();
        } ).catch( ( err ) => {
          console.log( err );
        } );
      } );

  } );

} );