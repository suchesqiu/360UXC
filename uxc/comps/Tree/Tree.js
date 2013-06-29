;( function( $ ){
    !window.UXC && (window.UXC = { log:function(){} });
    window.Tree = UXC.Tree = Tree;
    
    function Tree( _container, _data ){
        if( _container && $(_container).length ){
            _container = $(_container);
            if( Tree.getInstance( _container ) ) return Tree.getInstance( _container );
            _container.data( 'TreeIns', this );
        }
        this._model = new Model( _container, _data );
        this._view = new View( this._model );
    }
    
    Tree.getInstance = 
        function( _selector ){
            _selector = $(_selector);
            return _selector.data('TreeIns');
        };

    Tree.dataFilter;
    
    Tree.prototype = {
        init:
            function(){
                this._view.init();
                this._view.treeRoot().data( 'TreeIns', this );
                return this;
            }    

        , open:
            function( _nodeId ){
                if( typeof _nodeId == 'undefined' ){
                    this._view.openAll();
                    return this;
                }
                this._view.open( _nodeId );
                return this;
            }

        , close:
            function( _nodeId ){
                if( typeof _nodeId == 'undefined' ){
                    this._view.closeAll();
                    return this;
                }
                this._view.close( _nodeId );
                return this;
            }

        , toggle:
            function( _nodeId ){
                return this;
            }

        , idPrefix: function(){ return this._model.idPrefix(); }

        , getItem:
            function( _nodeId ){
                var _r;
                _nodeId && ( _nodeId = $('#' + this._model.id( _nodeId ) ) );
                return _r;
            }

        , on:
            function( _evtName, _cb ){
                if( !( _evtName && _cb ) ) return this;
                this._model.addEvent( _evtName, _cb );
                return this;
            }
        , event: function( _evtName ){ if( !_evtName ) return; return this._model.event( _evtName ); }

        , highlight:
            function( _item ){
                return this._model.highlight( _item );
            }
    }
    
    function Model( _container, _data ){

        this._container = _container;
        this._data = _data;
        this._id = 'tree_' + new Date().getTime() + '_';
        this._highlight;

        this._events = {};
        
        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                Tree.dataFilter && ( this._data = Tree.dataFilter( this._data ) );
                return this;
            }
        , container: function(){ return this._container; }
        , id: function( _id ){ return this._id + _id; }
        , idPrefix: function(){ return this._id; }
        , data: function(){ return this._data; }
        , root: function(){ return this._data.root; }
        , child: function( _id ){ return this._data.data[ _id ]; }
        , hasChild: function( _id ){ return _id in this._data.data; }
        , event:
            function( _evtName ){
                _evtName = _evtName.toLowerCase();
                return this._events[ _evtName ];
            }
        , addEvent:
            function( _evtName, _cb ){
                _evtName = _evtName.toLowerCase();
                if( !( _evtName in this._events ) ) this._events[ _evtName ] = [];
                this._events[ _evtName ].unshift( _cb );
            }
        , highlight:
            function( _highlight ){
                _highlight && ( this._highlight = _highlight );
                return this._highlight;
            }
    };
    
    function View( _model ){
        this._model = _model;
        this._treeRoot;
    }
    
    View.prototype = {
        init:
            function() {
                if( !( this._model.data() && this._model.root() ) ) return;
                this._process( this._model.child( this._model.root()[0] ), this._initRoot() );
                return this;
            }

        , treeRoot:
            function( _setter ){
                _setter && ( this._treeRoot = _setter );
                return this._treeRoot;
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

                var _label = $('<div class="node_ctn"></div>');
                    _label.attr( 'id', this._model.id( _data[0] ) )
                        .attr( 'dataid', _data[0] )
                        .attr( 'dataname', _data[1] )
                        .data( 'nodeData', _data );

                if( this._model.event( 'RenderLabel' ) ){
                    $.each( this._model.event('RenderLabel'), function( _ix, _cb ){
                        if( _cb.call( _label, _data, _label ) === false ) return false;
                    });
                }else{
                    _label.html( _data[1] || '没有标签' );
                }


                var _node = $( printf( '<li><span class="folder_img_closed folder {1}">&nbsp;</span></li>', _data[1], _last ) );
                    _node.addClass( printf( 'folder_closed {0} folder', _last1 ));
                    _label.appendTo( _node );


                var _r =  $( '<ul style="display:none;" class="folder_ul_lst" ></ul>' )
                    _r.appendTo( _node );

                    _node.appendTo( _parentNode );
                    this._process( this._model.child( _data[0] ), _r );
            }

        , _initFile:
            function( _parentNode, _data, _isLast ){
                var _last = 'folder_img_bottom ', _last1 = '';
                    _isLast && ( _last = 'folder_img_last ', _last1 = '' );

                var _label = $('<div class="node_ctn"></div>');
                    _label.attr( 'id', this._model.id( _data[0] ) )
                        .attr( 'dataid', _data[0] )
                        .attr( 'dataname', _data[1] )
                        .data( 'nodeData', _data );

                if( this._model.event( 'RenderLabel' ) ){
                    $.each( this._model.event('RenderLabel'), function( _ix, _cb ){
                        if( _cb.call( _label, _data, _label ) === false ) return false;
                    });
                }else{
                    _label.html( _data[1] || '没有标签' );
                }


                var _node = $( printf( '<li><span class="{1}file">&nbsp;</span></li>', _data[1], _last ) );
                    _node.addClass( 'folder_closed file');
                    _label.appendTo( _node );

                    _node.appendTo( _parentNode );
            }

        , _initRoot:
            function(){
                var _p = this;

                if( !_p._model.data().root ) return;
                
                var _data = _p._model.data().root;
                var _parentNode = $( '<ul class="tree_wrap"></ul>' );

                var _label = $('<div class="node_ctn"></div>');
                    _label.attr( 'id', this._model.id( _data[0] ) )
                        .attr( 'dataid', _data[0] )
                        .attr( 'dataname', _data[1] )
                        .data( 'nodeData', _data );

                if( this._model.event( 'RenderLabel' ) ){
                    $.each( this._model.event('RenderLabel'), function( _ix, _cb ){
                        if( _cb.call( _label, _data, _label ) === false ) return false;
                    });
                }else{
                    _label.html( _data[1] || '没有标签' );
                }

                var _node = $( '<li class="folder_open"></li>' );
                    _node.html( '<span class="folder_img_root folderRoot folder_img_open">&nbsp;</span>' );
                    _label.appendTo( _node );

                    _node.appendTo( _parentNode );
                    _parentNode.appendTo( _p._model.container() );

                    this.treeRoot( _parentNode );

                var _r =  $( '<ul style="" class="tree_wrap_inner"></ul>' )
                    _r.appendTo( _node );

                return _r;
            }

        , openAll:
            function(){
                if( !this.treeRoot() ) return;
                this.treeRoot().find('span.folder_img_closed').each( function(){
                    $(this).trigger('click');
                });
            }

        , closeAll:
            function(){
                if( !this.treeRoot() ) return;
                this.treeRoot().find('span.folder_img_open, span.folder_img_root').each( function(){
                    if( $(this).hasClass( 'folder_img_closed' ) ) return;
                    $(this).trigger('click');
                });
            }

        , open: 
            function( _nodeId ){
                if( !_nodeId ) return;
                var _tgr = $( '#' + this._model.id( _nodeId ) );
                if( !_tgr.length ) return;

                var lis = _tgr.parents('li');

                if( this._model.highlight() ) this._model.highlight().removeClass('highlight');
                _tgr.addClass( 'highlight' );
                this._model.highlight( _tgr );

                lis.each( function(){
                    var _sp = $(this), _child = _sp.find( '> span.folderRoot, > span.folder' );
                    if( _child.length ){
                        if( _child.hasClass( 'folder_img_open' ) ) return;
                        _child.trigger( 'click' );
                    }
                });
            }

        , close:
            function( _nodeId ){
                if( !_nodeId ) return;
                var _tgr = $( '#' + this._model.id( _nodeId ) );
                if( !_tgr.length ) return;
            }

    };

    Tree.lastHover = null;
    $(document).delegate( 'ul.tree_wrap div.node_ctn', 'mouseenter', function(){
        if( Tree.lastHover ) Tree.lastHover.removeClass('ms_over');
        $(this).addClass('ms_over');
        Tree.lastHover = $(this);
    });
    $(document).delegate( 'ul.tree_wrap div.node_ctn', 'mouseleave', function(){
        if( Tree.lastHover ) Tree.lastHover.removeClass('ms_over');
    });

    $(document).delegate( 'ul.tree_wrap div.node_ctn', 'click', function( _evt ){
        var _p = $(this)
            , _treeContainer = _p.parents( 'ul.tree_wrap' )
            , _treeIns = _treeContainer.data('TreeIns');

        if( !_treeIns ) return;

        var _events = _treeIns.event( 'click' );
        if( _events && _events.length ){
            $.each( _events, function( _ix, _cb ){
                if( _cb.call( _p, _evt ) === false ) return false; 
            });
        }

        if( _treeIns.highlight() ) _treeIns.highlight().removeClass('highlight');
        _p.addClass('highlight');
        _treeIns.highlight( _p );
    });

    $(document).delegate( 'ul.tree_wrap span.folder, ul.tree_wrap span.folderRoot', 'click', function( _evt ){
        var _p = $(this), _pntLi = _p.parent('li'), _childUl = _pntLi.find( '> ul');
        var _treeContainer = _p.parents( 'ul.tree_wrap' )
        , _treeIns = _treeContainer.data('TreeIns');

        var _events = _treeIns.event( 'FolderClick' );
        if( _events && _events.length ){
            $.each( _events, function( _ix, _cb ){
                if( _cb.call( _p, _evt ) === false ) return false; 
            });
        }

        if( _p.hasClass( 'folder_img_open' ) ){
            _p.removeClass( 'folder_img_open' ).addClass( 'folder_img_closed' );
            _childUl.hide();
        }else if( _p.hasClass( 'folder_img_closed' ) ){
            _p.addClass( 'folder_img_open' ).removeClass( 'folder_img_closed' );
            _childUl.show();
        }

        if( _pntLi.hasClass('folder_closed') ){
            _pntLi.addClass('folder_open').removeClass('folder_closed');
        }else if( _pntLi.hasClass('folder_open') ){
            _pntLi.removeClass('folder_open').addClass('folder_closed');
        }
    });

}(jQuery));
