const { ObjectID } = require( "mongodb" );
const jwt = require( "jsonwebtoken" );

const { Todo } = require( "./../../models/todo" );
const { User } = require( "./../../models/user" );


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [ {
  _id     : userOneId,
  email   : "yash@ab.com",
  password: "userOnePass",
  tokens  : [ {
    access: "auth",
    token : jwt.sign( { _id: userOneId, access: "auth" }, "abc123" ).toString()
  } ]
}, {
  _id     : userTwoId,
  email   : "rupam@ab.com",
  password: "userTwoPass"
} ];

const todos = [ {
  _id : new ObjectID(),
  text: "First test todo"
}, {
  _id        : new ObjectID(),
  text       : "Second test todo",
  completed  : true,
  completedAt: 13241234134
} ];

const populateUsers = ( done ) => {

  User.remove( {} ).then( () => {

    const userOneSave = new User( users[ 0 ] ).save();
    const userTwoSave = new User( users[ 1 ] ).save();

    return Promise.all( [ userOneSave, userTwoSave ] );

  } ).then( () => done() );

};

const populateTodos = ( done ) => {
  Todo.remove( {} ).then( () => {
    return Todo.insertMany( todos );
  } ).then( () => done() );
};

module.exports = { todos, populateTodos, users, populateUsers };