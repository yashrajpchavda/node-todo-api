const { SHA256 } = require( "crypto-js" );
const jwt = require( "jsonwebtoken" );
const bcrypt = require( "bcryptjs" );

const password = "123abc!";

// bcrypt.genSalt( 10, ( err, salt ) => {
//   bcrypt.hash( password, salt, ( err, hash ) => {
//     console.log( hash );
//   } );
// } );

let hashedPassword = "$2a$10$OKVnRsDcE.XiYUX8jbma/OyUlw/mpCyHF282nc2uDBW80uFzLjCdG";

bcrypt.compare( password, hashedPassword, ( err, result ) => {
  console.log( result );
} );

// const data = {
//   id: 9
// };
//
// const token = jwt.sign(data, 'test123');
// console.log( token );
//
// const decoded = jwt.verify( token, 'test123' );
// console.log( 'decoded', decoded );

// const message = "Test string";
// const hash = SHA256( message ).toString();
//
// console.log( `Message: ${message}` );
// console.log( `Hash: ${hash}` );
//
// const data = {
//   id: 4
// };
//
// const token = {
//   data,
//   hash: SHA256( JSON.stringify( data ) + "somesecret" ).toString()
// };
//
// // token.data.id = 5;
// // token.hash = SHA256( JSON.stringify(token.data) ).toString();
//
// const resultHash = SHA256( JSON.stringify( token.data ) + "somesecret" ).toString();
//
// if ( resultHash === token.hash ) {
//   console.log( "Data was not changed!" );
// } else {
//   console.log( "Data was changed. Do not trust!" );
// }