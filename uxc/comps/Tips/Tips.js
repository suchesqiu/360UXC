;(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    window.ZIDNEX_COUNT = window.ZINDEX_COUNT || 50001;

    $(document).ready( function( _devt ){
        setTimeout( function(){
            if( !UXC.Tips.autoInit ) return;
            
            $(document).delegate('*', 'mouseover', function( _evt ){
                var _p = $(this);
                if( _p.data('initedTips') ) return;
                if( !_p.attr('title') ) return;
                UXC.log( _p.prop( 'nodeName' ) );
                UXC.Tips.init( _p );
                tipMouseover.call( this, _evt );
            });
        }, 10);
    });

    window.Tips = UXC.Tips = {
        init: 
            function( _selector ){
                if( !_selector ) return;
                _selector = $(_selector);
                if( !_selector.length ) return;
                var _r;
                _selector.each( function(){
                    var _p = $(this);
                    if( _p.data('initedTips') ) return;
                    _r = new Tips( _p );
                });
                return _r;
            }

        , autoInit: true
        , tpl: null
        , offset: {
            'bottom': { 'x': 15, 'y': 15 }
            , 'left': { 'x': -28, 'y': 5 }
            , 'top': { 'x': -2, 'y': -22 }
        }
    };

    function Tips( _selector ){
        _selector = $(_selector);
        if( !(_selector && _selector.length ) ) return;

        this._model = new Model( _selector );
        this._view = new View( this._model );

        this._init();
    }
    
    Tips.prototype = {
        _init:
            function(){
                var _p = this;
                this._model.selector().data('tipIns', _p);
                this._model.selector().on( 'mouseover', tipMouseover );
                return this;
            }    

        , show:
            function( _evt ){
                this._view.show( _evt );
            }

        , hide: function(){ this._view.hide(); }
        , selector: function(){ return this._model.selector(); }
        , layout: function(){ return this._view.layout(); }
    }

    function tipMouseover( _evt ){
        var _sp = $(this), _p = _sp.data('tipIns');
        try{ $(window).unbind( 'mousemove', tipMousemove ); }catch(_ex){}
        _p.show( _evt );

        $(document).on('mousemove', tipMousemove );
        UXC.log( 'tipMouseover' );

        function tipMousemove( _wevt ){
            UXC.log( new Date().getTime() );
            _wevt.stopPropagation();
            if( !pointInRect( {x: _wevt.pageX, y: _wevt.pageY }, selectorRect( _p.selector() ) ) ){
                $(document).unbind( 'mousemove', tipMousemove );
                _p.hide();
                UXC.log( 'false xxx' );
                return;
            }
            _p.show( _wevt );
        }
    }

    function pointInRect( _point, _rectPoint ){
        var _r = true;
        !( _point && _rectPoint ) && ( _r = false );

        _r && _point.y < _rectPoint.p1.y && ( _r = false );
        _r && _point.y > _rectPoint.p3.y && ( _r = false );
        _r && _point.x < _rectPoint.p1.x && ( _r = false );
        _r && _point.x > _rectPoint.p2.x && ( _r = false );

        return _r;
    }
    /**
     * 返回选择器的 矩形 位置
     * @param   {selector}  _selector
     * @return  Object  p1: left top, p2: right top, p3: right bottom, p4: left bottom
     */
    function selectorRect( _selector ){
        _selector = $( _selector );
        var _offset = _selector.offset()
            , _w = _selector.prop('offsetWidth')
            , _h = _selector.prop('offsetHeight');

        return {
            p1: { x: _offset.left, y: _offset.top }
            , p2: { x: _offset.left + _w, y: _offset.top }
            , p3: { x: _offset.left + _w, y: _offset.top + _h }
            , p4: { x: _offset.left, y: _offset.top + _h }
        }
    }

    function Model( _selector ){
        this.tpl = _defTpl;
        this._selector = _selector;
        this._data;

        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                if( !this._selector.attr('title') ) return;
                this._data = this._selector.attr('title');
                this._selector.removeAttr('title');
                if( this._selector.data('initedTips') ) return;
                this._selector.data('initedTips', true);
                return this;
            }

        , data:
            function(){
                return this._data;
            }

        , selector: function(){ return this._selector; }
    };
    
    function View( _model ){
        this._model = _model;
        this._layout;

        this._init();
    }
    
    View.prototype = {
        _init:
            function() {
                return this;
            }
        , show:
            function( _evt ){
                UXC.log( 'tips view show' );
                var _x = _evt.pageX, _y = _evt.pageY;

                _x += UXC.Tips.offset.bottom.x;
                _y += UXC.Tips.offset.bottom.y;

                var _stop = $(document).scrollTop(), _sleft = $(document).scrollLeft();
                var _wwidth = $(window).width(), _wheight = $(window).height();
                var _lwidth = this.layout().width(), _lheight = this.layout().height();
                var _maxX = _sleft + _wwidth - _lwidth, _minX = _sleft;
                var _maxY = _stop + _wheight - _lheight, _minY = _stop;
                var _outright = false, _outbottom = false;

                _x > _maxX && ( _x = _x - _lwidth + UXC.Tips.offset.left.x
                                    , _y += UXC.Tips.offset.left.y
                                    , _outright = true );
                _x < _minX && ( _x = _minX );
                _y > _maxY && ( _y = _y - _lheight + UXC.Tips.offset.top.y
                                , _x += UXC.Tips.offset.top.x
                                , _outbottom = true);
                _y < _minY && ( _y = _minY );

                _outright && _outbottom && ( _y -= 5 );

                this.layout().css( { 'left': _x + 'px', 'top': _y + 'px' } );
                this.layout().show();
            }

        , hide: function(){ this.layout().hide(); }

        , layout: 
            function(){ 
                if( !this._layout ){
                    this._layout = $('#UXCTipsLayout');
                    if( !(this._layout && this._layout.length) ){
                        this._layout = $(UXC.Tips.tpl || this._model.tpl);
                        this._layout.attr('id', 'UXCTipsLayout');
                        this._layout.appendTo(document.body);
                    }
                }
                this._layout.html( this._model.data() );
                return this._layout; 
            }
    };

    var _defTpl = '<div class="UTips"></div>';

}(jQuery));
