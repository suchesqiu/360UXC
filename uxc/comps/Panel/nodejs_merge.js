var fs = require('fs-extra');
var compressor = require('node-minify');

var dir = __dirname + '/';

var PanelPath = dir + 'UXC.Panel.js';
var PopupPath = dir + 'UXC.Popup.js';
var DialogPath = dir + 'UXC.Dialog.js';

var outPath = dir + 'Panel.js';

if( !( fs.existsSync( PanelPath ) && fs.existsSync( PopupPath ) && fs.existsSync( DialogPath ) ) ) return;

var tmp = [];
    tmp.push( fs.readFileSync( PanelPath, 'utf8') );
    tmp.push( fs.readFileSync( PopupPath, 'utf8') );
    tmp.push( fs.readFileSync( DialogPath, 'utf8') );

fs.writeFileSync( outPath, tmp.join('\n') );

fs.unlinkSync( PanelPath );
fs.unlinkSync( PopupPath );
fs.unlinkSync( DialogPath );
