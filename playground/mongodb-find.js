const { MongoClient, ObjectID } = require( "mongodb" );

const url = "mongodb://localhost:27017";
const dbName = "TodoApp";

const LocalMgClient = new MongoClient( url );

LocalMgClient.connect()
  .then( ( client ) => {


    console.log( "Connected to MongoDB server" );

    // client.db( dbName ).collection( 'Todos' ).insertOne( {
    //   text: 'Something to do',
    //   completed: false
    // } ).then( ( result ) => {
    //
    //   console.log( JSON.stringify( result.ops, undefined, 2 ) );
    //
    // } ).catch( ( err ) => {
    //   return console.log( 'Unable to insert', err );
    // } );
    //
    // client.db( dbName ).collection( "Todos" )
    // // .find( { completed: true } )
    //   .find( { "_id": new ObjectID( "5a79ab9a5b962f53d2de0a4b" ) } )
    //   .toArray()
    //   .then( ( documents ) => {
    //     console.log( JSON.stringify( documents, undefined, 2 ) );
    //   } )
    //   .catch( ( err ) => {
    //     console.log( "unable to fetch todos", err );
    //   } )
    //   .then( () => {
    //     client.close()
    //       .then( () => {
    //         console.log( "successfully closed connection" );
    //       } )
    //       .catch( () => {
    //         console.log( "error closing connection" );
    //       } );
    //   } );

    // client.db( dbName ).collection( "Todos" )
    // // .find( { completed: true } )
    //   .count( {} )
    //   .then( ( count ) => {
    //     console.log( `Todos count is: ${ count }` );
    //   } )
    //   .catch( ( err ) => {
    //     console.log( "unable to fetch todos", err );
    //   } )
    //   .then( () => {
    //     client.close()
    //       .then( () => {
    //         console.log( "successfully closed connection" );
    //       } )
    //       .catch( () => {
    //         console.log( "error closing connection" );
    //       } );
    //   } );

    client.db( dbName ).collection( "Users" )
      .find( { "name": "Rupal" } )
      .toArray()
      .then( ( users ) => {
        console.log( JSON.stringify( users, undefined, 2 ) );
      } )
      .catch( ( err ) => {
        console.log( "Unable to fetch users", err );
      } )
      .then( () => {
        client.close()
          .then( () => {
            console.log( "successfully closed connection" );
          } )
          .catch( () => {
            console.log( "error closing connection" );
          } );
      } );

  } )
  .catch( ( err ) => {
    console.log( "Unable to connect to mongodb server", err );
  } );