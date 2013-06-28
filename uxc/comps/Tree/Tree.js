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
                for( var i = 0, j = _data.length, _item, _isLast; i < j; i++ ){
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
                var _last = '', _last1 = '';
                    _isLast && ( _last = 'folder_span_lst ', _last1 = 'folder_last' );
                var _node = $( printf( '<li><span class="folder_img_closed folder {1}">&nbsp;</span><div class="node_ctn">{0}</div></li>', _data[1], _last ) );
                    _node.addClass( printf( 'folder_closed {0} folder', _last1 ));
                    _node.attr('id', this._model.id( _data[0] ) );

                var _r =  $( '<ul style="display:none;"></ul>' )
                    _r.appendTo( _node );

                    _node.appendTo( _parentNode );
                    this._process( this._model.child( _data[0] ), _r );
            }

        , _initFile:
            function( _parentNode, _data, _isLast ){
                var _last = 'folder_img_bottom ', _last1 = '';
                    _isLast && ( _last = 'folder_img_last ', _last1 = '' );
                var _node = $( printf( '<li><span class="{1}file">&nbsp;</span><div class="node_ctn">{0}</div></li>', _data[1], _last ) );
                    _node.addClass( 'folder_closed file');
                    _node.attr('id', this._model.id( _data[0] ) );
                    _node.appendTo( _parentNode );
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

                var _r =  $( '<ul style="" class="tree_wrap_inner"></ul>' )
                    _r.appendTo( _wrap );

                return _r;
            }
        
    };
}(jQuery));
