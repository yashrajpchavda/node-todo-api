const expect = require( "expect" );
const request = require( "supertest" );
const { ObjectID } = require( "mongodb" );

const { app } = require( "./../server" );
const { Todo } = require( "./../models/todo" );

const { todos, populateTodos, users, populateUsers } = require( "./seed/seed" );

beforeEach( populateUsers );
beforeEach( populateTodos );

describe( "POST /todos", () => {

  it( "should create a new todo", ( done ) => {
    let text = "Test todo";
    request( app )
      .post( "/todos" )
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
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todos.length ).toBe( 2 );
      } )
      .end( done );
  } );
} );

describe( "GET /todos/:id", () => {

  it( "should return the matching todo for the specified id", ( done ) => {

    request( app )
      .get( `/todos/${ todos[ 0 ]._id.toHexString()}` )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo.text ).toBe( todos[ 0 ].text );
      } )
      .end( done );

  } );

  it( "should return 404 if todo not found", ( done ) => {

    const newId = new ObjectID().toHexString();

    request( app )
      .get( `/todos/${newId}` )
      .expect( 404 )
      .end( done );

  } );

  it( "should return 404 if the invalid id was specified", ( done ) => {
    const invalidId = "234242adsfa";

    request( app )
      .get( `/todos/${invalidId}` )
      .expect( 404 )
      .end( done );
  } );

} );

describe( "DELETE /todos/:id", () => {

  it( "should remove a todo", ( done ) => {

    const todoId = todos[ 1 ]._id.toHexString();

    request( app )
      .delete( `/todos/${todoId}` )
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

  it( "should return 404 if todo not found", ( done ) => {

    const todoId = new ObjectID().toHexString();

    request( app )
      .delete( `/todos/${todoId}` )
      .expect( 404 )
      .end( done );

  } );

  it( "should return 404 if object id is not valid", ( done ) => {

    request( app )
      .delete( "/todos/2314asdfads" )
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
      .send( requestData )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo ).toInclude( requestData );
        expect( res.body.todo.completedAt ).toBeA( "number" );
      } )
      .end( done );

  } );

  it( "should clear the completedAt when todo is not completed", ( done ) => {

    const todoId = todos[ 1 ]._id.toHexString();
    const requestData = { text: "Update from the test", completed: false };

    request( app )
      .patch( `/todos/${todoId}` )
      .send( requestData )
      .expect( 200 )
      .expect( ( res ) => {
        expect( res.body.todo ).toInclude( requestData );
        expect( res.body.todo.completedAt ).toNotExist();
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
        expect( res.headers[ "x-auth" ] ).toExist();
        expect( res.body._id ).toExist();
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