var fs = require('fs');

var dir = __dirname + '/';

var path1 = dir + 'UXC.Calendar.js';
var path2 = dir + 'UXC.Calendar.pickWeek.js';

var outPath = dir + 'Calendar.js';

if( !( fs.existsSync( path1 ) && fs.existsSync( path2 )) ) return;

var tmp = [];
    tmp.push( fs.readFileSync( path1, 'utf8') );
    tmp.push( fs.readFileSync( path2, 'utf8') );

fs.writeFileSync( outPath, tmp.join('\n') );

fs.unlinkSync( path1 );
fs.unlinkSync( path2 );
