var fs = require('fs-extra');
var compressor = require('node-minify');

var dir = __dirname + '/';
var cpath = dir + 'compressed/';

fs.removeSync( cpath );
fs.mkdirSync( cpath );

var tmp = [];
    tmp.push( fs.readFileSync( dir + 'UXC.Panel.js', 'utf8') );
    tmp.push( fs.readFileSync(  dir + 'UXC.Popup.js', 'utf8') );
    tmp.push( fs.readFileSync( dir + 'UXC.Dialog.js', 'utf8') );


fs.writeFileSync( cpath + 'Panel.js', tmp.join('\n') );

new compressor.minify({
    type: 'yui-js',
    fileIn: cpath + 'Panel.js',
    fileOut: cpath + 'Panel.min.js',
    callback: function(err){
    }
});

fs.copy( dir + '_demo', cpath + '_demo' );
fs.copy( dir + 'res', cpath + 'res' );

new compressor.minify({
    type: 'yui-css',
    fileIn: cpath + 'res/default/style.css',
    fileOut: cpath + 'res/default/style.min.css',
    callback: function(err){
    }
});
