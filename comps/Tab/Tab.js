;(function($){
    !window.UXC && (window.UXC = { log:function(){} });

    window.Tab = UXC.Tab = Tab;

    function Tab( _selector, _triggerTarget ){
        _selector && ( _selector = $( _selector ) );
        _triggerTarget && ( _triggerTarget = $( _triggerTarget) );
        if( Tab.inited( _selector ) ) return Tab.inited( _selector );

        this._model = new Model( _selector, _triggerTarget );
        this._view = new View( this._model );

        UXC.log( 'initing tab' );
        this._init();
    }

    Tab.autoInit = true;

    Tab.inited = 
        function( _selector, _setter ){
            var _r;
            _selector && ( _selector = $(_selector) ).length && (
                typeof _setter != 'undefined' && _selector.data('TabInited', _setter)
                , _r =  _selector.data('TabInited')
            );
            return _r;
        };

    Tab.prototype = {
        _init:
            function(){
                Tab.inited( this._model.layout(), this );
                
                return this;
            }    
    }
    
    function Model( _selector, _triggerTarget ){
        this._layout = _selector;
        this._triggerTarget = _triggerTarget;
        
        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                return this;
            }

        , layout: function(){ return this._layout; }
        , triggerTarget: function(){ return this._triggerTarget; }
    };
    
    function View( _model ){
        this._model = _model;

        this._init();
    }
    
    View.prototype = {
        _init:
            function() {
                return this;
            }
    };

    $(document).delegate( '.js_autoTab', 'click', function( _evt ){
        if( !Tab.autoInit ) return;
        var _p = $(this), _tab, _src = _evt.target || _evt.srcElement;
        if( Tab.inited( _p ) ) return;
        _src && ( _src = $(_src) );     UXC.log( new Date().getTime(), _src.prop('nodeName') );
        _tab = new Tab( _p, _src );

    });

}(jQuery));
