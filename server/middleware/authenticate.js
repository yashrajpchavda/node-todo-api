const { User } = require( "./../models/user" );

const authenticate = async ( req, res, next ) => {

  try {

    let token = req.header( "x-auth" );

    const user = await User.findByToken( token );
    if ( !user ) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();

  } catch ( e ) {
    res.status( 401 ).send();
  }

};

module.exports = { authenticate };