var fs = require('fs-extra');

var dir = __dirname + '/';

var path1 = dir + 'UXC.Form.js';
var path2 = dir + 'UXC.Form.initCheckAll.js';
var path3 = dir + 'UXC.Form.initAutoSelect.js';

var outPath = dir + 'Form.js';

if( !( fs.existsSync( path1 ) && fs.existsSync( path2 ) && fs.existsSync( path3 ) ) ) return;

var tmp = [];
    tmp.push( fs.readFileSync( path1, 'utf8') );
    tmp.push( fs.readFileSync( path2, 'utf8') );
    tmp.push( fs.readFileSync( path3, 'utf8') );

fs.writeFileSync( outPath, tmp.join('\n') );

fs.unlinkSync( path1 );
fs.unlinkSync( path2 );
fs.unlinkSync( path3 );
