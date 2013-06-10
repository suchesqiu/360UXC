var fs = require('fs-extra');
var compressor = require('node-minify');

var dir = __dirname + '/';

var tmp = [];
    tmp.push( fs.readFileSync( dir + 'jquery.js', 'utf8') );
    tmp.push( fs.readFileSync(  dir + 'UXC.js', 'utf8') );


fs.writeFileSync( dir + 'lib.js', tmp.join('\n') );
