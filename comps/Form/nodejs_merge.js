var fs = require('fs');

var dir = __dirname + '/';

var path1 = dir + 'UXC.Form.js';
var path2 = dir + 'UXC.Form.initCheckAll.js';
var path4 = dir + 'UXC.Form.initAutoFill.js';
var path3 = dir + 'UXC.Form.initAutoSelect.js';
var path5 = dir + 'UXC.Form.initNumericStepper.js';

var outPath = dir + 'Form.js';

if( !( fs.existsSync( path1 ) 
        && fs.existsSync( path2 ) 
        && fs.existsSync( path3 ) 
        && fs.existsSync( path5 ) 
        && fs.existsSync( path4 )  ) ) return;

var tmp = [];
    tmp.push( fs.readFileSync( path1, 'utf8') );
    tmp.push( fs.readFileSync( path2, 'utf8') );
    tmp.push( fs.readFileSync( path3, 'utf8') );
    tmp.push( fs.readFileSync( path4, 'utf8') );
    tmp.push( fs.readFileSync( path5, 'utf8') );

fs.writeFileSync( outPath, tmp.join('\n') );

fs.unlinkSync( path1 );
fs.unlinkSync( path2 );
fs.unlinkSync( path3 );
fs.unlinkSync( path4 );
fs.unlinkSync( path5 );
