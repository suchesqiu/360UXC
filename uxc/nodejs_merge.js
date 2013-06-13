var fs = require('fs-extra');

var dir = __dirname + '/';

if( !( fs.existsSync( dir + 'jquery.js' ) && fs.existsSync( dir + 'UXC.js' ) ) ) return;

var tmp = [];
    tmp.push( fs.readFileSync( dir + 'jquery.js', 'utf8') );
    tmp.push( fs.readFileSync(  dir + 'UXC.js', 'utf8') );


fs.writeFileSync( dir + 'lib.js', tmp.join('\n') );

fs.unlinkSync( dir + 'jquery.js' );
fs.unlinkSync( dir + 'UXC.js' );
