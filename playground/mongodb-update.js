const { MongoClient, ObjectID } = require( "mongodb" );

const url = "mongodb://localhost:27017";
const dbName = "TodoApp";

const LocalMgClient = new MongoClient( url );

LocalMgClient.connect()
  .then( ( client ) => {


    console.log( "Connected to MongoDB server" );

    // const todosCollection = client.db( dbName ).collection( "Todos" );
    //
    // todosCollection
    //   .findOneAndUpdate( {
    //     text: "Watch movie"
    //   }, {
    //     $set: {
    //       completed: true
    //     }
    //   }, {
    //     returnOriginal: false
    //   } )
    //   .then( ( res ) => {
    //     console.log( JSON.stringify( res, undefined, 2 ) );
    //   } )
    //   .then( () => {
    //     client.close();
    //   } );

    const usersCollection = client.db( dbName ).collection( "Users" );

    usersCollection
      .findOneAndUpdate( {
        _id: new ObjectID( "5a792ec9cfb76d56266b4015" )
      }, {
        $set: {
          name: "James Anderson"
        },
        $inc: {
          age: 1
        }
      }, {
        returnOriginal: false
      } )
      .then( ( res ) => {
        console.log( JSON.stringify( res, undefined, 2 ) );
      } )
      .then( () => {
        client.close();
      } );

  } )
  .catch( ( err ) => {
    console.log( "Unable to connect to mongodb server", err );
  } );