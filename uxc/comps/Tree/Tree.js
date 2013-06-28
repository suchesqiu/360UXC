;( function( $ ){
    !window.UXC && (window.UXC = { log:function(){} });
    window.Tree = UXC.Tree = Tree;
    
    function Tree( _container, _data ){
        this._model = new Model( _container, _data );
        this._view = new View( this._model );
    }
    
    Tree.prototype = {
        init:
            function(){
                this._view.init();
                return this;
            }    
    }
    
    function Model( _container, _data ){

        this._container = _container;
        this._data = _data;
        this._id = 'tree_' + new Date().getTime() + '_';
        
        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                return this;
            }
        , container: function(){ return this._container; }
        , id: function( _id ){ return this._id + _id; }
        , data: function(){ return this._data; }
        , root: function(){ return this._data.root; }
        , child: function( _id ){ return this._data.data[ _id ]; }
        , hasChild: function( _id ){ return _id in this._data.data; }
    };
    
    function View( _model ){
        this._model = _model;
    }
    
    View.prototype = {
        init:
            function() {
                if( !( this._model.data() && this._model.root() ) ) return;
                this._process( this._model.child( this._model.root()[0] ), this._initRoot() );
                return this;
            }

        , _process:
            function( _data, _parentNode ){
                for( var i = 0, j = _data, _item, _isLast; i < j; i++ ){
                    _item = _data[i];
                    _isLast = i === j - 1;

                    if( this._model.hasChild( _item[0] ) ){
                        this._initFolder( _parentNode, _item, _isLast );
                    }else{
                        this._initFile( _parentNode, _item, _isLast );
                    }
                }
            }

        , _initFolder:
            function( _parentNode, _data, _isLast ){
            }

        , _initFile:
            function( _parentNode, _data, _isLast ){
            }

        , _initRoot:
            function(){
                var _p = this;

                if( !_p._model.data().root ) return;

                var _root = $( '<li class="folder_open"></li>' );
                    _root.attr( 'id', _p._model.id( _p._model.root()[0] ) );
                    _root.data( 'data', _p._model.root() );
                    _root.html( printf( '<span class="folder_img_root folderRoot folder_img_open">&nbsp;</span><div class="node_ctn">{0}</div>', _p._model.root()[1] ) );

                var _wrap = $( '<ul class="tree_wrap"></ul>' )
                    _root.appendTo( _wrap );
                    _wrap.appendTo( _p._model.container() );

                    $( '<ul style="" class="tree_wrap_inner"></ul>' ).appendTo( _wrap );

                return _wrap;
            }
        
    };
/**
 * 按格式输出字符串
 * @method printf
 * @param   {string}    _str
 * @example
 *      printf( 'asdfasdf{0}sdfasdf{1}', '000', 1111 );
 *      //return asdfasdf000sdfasdf1111
 */
function printf( _str ){
    for(var i = 1, _len = arguments.length; i < _len; i++){
        _str = _str.replace( new RegExp('\\{'+( i - 1 )+'\\}'), arguments[i] );
    }
    return _str;
}
 
}(jQuery));
