const { MongoClient, ObjectID } = require( "mongodb" );

const url = "mongodb://localhost:27017";
const dbName = "TodoApp";

const LocalMgClient = new MongoClient( url );

LocalMgClient.connect()
  .then( ( client ) => {


    console.log( "Connected to MongoDB server" );

    // deleteMany
    // client.db( dbName ).collection( "Users" )
    //   .deleteMany( { name: "Yashraj" } )
    //   .then( ( result ) => {
    //     console.log( result );
    //   } )
    //   .then( () => {
    //     client.close();
    //   } );

    // deleteOne
    // same as above but deletes the first match

    // findOneAndDelete
    client.db( dbName ).collection( "Users" )
      .findOneAndDelete( { _id: new ObjectID( '5a79aba51fcb8a53f42643bb' ) } )
      .then( ( result ) => {
        console.log( result );
      } )
      .then( () => {
        client.close();
      } );

  } )
  .catch( ( err ) => {
    console.log( "Unable to connect to mongodb server", err );
  } );