const { MongoClient } = require( "mongodb" );

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
    client.db( dbName ).collection( "Users" ).insertOne( {
      name    : "Yashraj",
      age     : 29,
      location: "Gandhinagar, Gujarat"
    } ).then( ( result ) => {

      console.log( JSON.stringify( result.ops[ 0 ]._id.getTimestamp(), undefined, 2 ) );

    } ).catch( ( err ) => {
      console.log( "Unable to insert", err );
    } ).then( () => {
      console.log( "I am always executed" );
      client.close()
        .then( () => {
          console.log( "successfully closed connection" );
        } )
        .catch( () => {
          console.log( 'error closing connection' );
        } );
    } );


  } )
  .catch( ( err ) => {
    console.log( "Unable to connect to mongodb server", err );
  } );