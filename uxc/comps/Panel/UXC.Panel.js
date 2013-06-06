(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    window.Panel = UXC.Panel = Panel;
    /**
     * 弹出层/会话框/提示框<br />
     * @namespace UXC
     * @class Panel
     * @static
     * @private
     * @uses jQuery
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @link    https://github.com/suchesqiu/360UXC.git
     * @date    2013-06-04
     */
    function Panel( _selector, _headers, _bodys, _footers )
    {
        this._model = new Model( _selector, _headers, _bodys, _footers );
        this._view = new View( this._model );

        this._init();
    }

    $(document).delegate( 'div.UPanel', 'click', function( _evt ){
        var _panel = $(this), _src = $(_evt.target || _evt.srcElement), _evtName;
        if( _src && _src.length && _src.is("[eventtype]") ){
            _evtName = _src.attr('eventtype');
            UXC.log( _evtName, _panel.data('PanelInstace') );
            _evtName && _panel.data('PanelInstace') && _panel.data('PanelInstace').trigger( _evtName, _src, _evt );
        }
    });
    
    Panel.prototype =
    {
        _init:
            function()
            {
                UXC.log('UXC.Panel.init()');
                var _p = this;
                this._model.getPanel().data('PanelInstace', this);
                this._model.events = {
                    'close':   
                        [
                            function( _evt, _panel ){
                                _panel._view.close();
                            }
                        ]
                     , 'show':
                        [
                            function( _evt, _panel ){
                                _panel._view.show();
                            }
                        ]
                     , 'hide':
                        [
                            function( _evt, _panel ){
                                _panel._view.hide();
                            }
                        ]
                };
                return this;
            }    

        , on:
            function( _evtName, _cb ){
                _evtName && ( _evtName = _evtName.toLowerCase() );
                if( !(_evtName in this._model.events) ){
                    this._model.events[ _evtName ] = [];
                }
                if( _cb ) this._model.events[_evtName].unshift( _cb );
            }

        
        , show:
            function(){
                this.trigger('beforeshow', this._model.getPanel() );
                this.trigger('show', this._model.getPanel() );
            }

        , hide:
            function(){
                this.trigger('beforehide', this._model.getPanel() );
                this.trigger('hide', this._model.getPanel() );
            }

        , close:
            function(){
                this.trigger('beforeclose', this._model.getPanel() );
                this.trigger('close', this._model.getPanel() );
            }

        , center:
            function( _with ){
                this.trigger('beforecenter', this._model.getPanel() );
                this._view.center( _with );
                this.trigger('center', this._model.getPanel() );
            }

        , selector: function(){ return this._model.getPanel(); }

        , trigger:
            function( _evtName, _srcElement, _evt ){
                UXC.log( 'Panel.trigger', _evtName );
                var _p = this;
                _evtName && ( _evtName = _evtName.toLowerCase() );
                _srcElement && (_srcElement = $(_srcElement) ) 
                    && _srcElement.length && (_srcElement = _srcElement[0]);

                if( !(this._model.events[_evtName] && this._model.events[_evtName].length) ) return;

                $.each( this._model.events[_evtName], function( _ix, _cb ){
                    if( _cb.call( _srcElement, _evt, _p ) === false ) return false; 
                });

            }

        , header:
            function( _html ){
                if( typeof _html != 'undefined' ) this._model.getHeader( _html );
                var _selector = this._model.getHeader();
                if( _selector && _selector.length ) return _selector.html();
            }

        , body:
            function( _html ){
                if( typeof _html != 'undefined' ) this._model.getBody( _html );
                var _selector = this._model.getBody();
                if( _selector && _selector.length ) return _selector.html();
            }

        , footer:
            function( _html ){
                if( typeof _html != 'undefined' ) this._model.getFooter( _html );
                var _selector = this._model.getFooter();
                if( _selector && _selector.length ) return _selector.html();
            }

        , panel:
            function( _html ){
                if( typeof _html != 'undefined' ) this._model.getPanel( _html );
                var _selector = this._model.getPanel();
                if( _selector && _selector.length ) return _selector.html();
            }
    }
    
    function Model( _selector, _headers, _bodys, _footers )
    {
        this.tpl = _deftpl;

        this._selector = _selector;
        this._headers = _headers;
        this._bodys = _bodys;
        this._footers = _footers;

        this._panel;

        this._init();

        this.events = {};
    }
    
    Model.prototype =
    {
        _init:
            function()
            {
                if( typeof this._selector  == 'undefined' || $(this._selector).length === 0 ){
                    this._footers = this._bodys;
                    this._bodys = this._headers;
                    this._headers = this._selector;
                    this._selector = undefined;
                }

                if( !this._panel ){
                    if( this._selector ){

                    }else{
                        this._panel = $(this.tpl);
                        this._panel.hide().appendTo(document.body);
                    }
                }
                this.getHeader();
                this.getBody();
                this.getFooter();
 
                return this;
            }

        , getPanel:
            function( _udata ){
                if( typeof _udata != 'undefined' ){
                    this.getPanel().html( _udata );
                }
                return this._panel;
            }

        , getHeader:
            function( _udata ){
                var _selector = this.getPanel().find('div.UPContent > div.hd');
                if( typeof _udata != 'undefined' ) this._headers = _udata;
                if( typeof this._headers != 'undefined' ){
                    if( !_selector.length ){
                        this.getPanel().find('div.UPContent > div.bd')
                            .before( _selector = $('<div class="hd">弹出框</div>') );
                    }
                    _selector.html( this._headers );
                    this._headers = undefined;
                }
                return _selector;
            }

        , getBody:
            function( _udata ){
                var _selector = this.getPanel().find('div.UPContent > div.bd');
                if( typeof _udata != 'undefined' ) this._bodys = _udata;
                if( typeof this._bodys!= 'undefined' ){
                    _selector.html( this._bodys);
                    this._bodys = undefined;
                }
                return _selector;
            }


        , getFooter:
            function( _udata ){
                var _selector = this.getPanel().find('div.UPContent > div.ft');
                if( typeof _udata != 'undefined' ) this._footers = _udata;
                if( typeof this._footers != 'undefined' ){
                    if( !_selector.length ){
                        this.getPanel().find('div.UPContent > div.bd')
                            .after( _selector = $('<div class="ft" ></div>'));
                    }
                    _selector.html( this._footers );
                    this._footers = undefined;
                }
                return _selector;
            }


    };
    
    function View( _model )
    {
        this._model = _model;

        this._init();
    }
    
    View.prototype = 
    {
        _init:
            function()
            {
                return this;
            }

        , show:
            function(){
                this._model.getPanel().show();
            }

        , hide:
            function(){
                this._model.getPanel().hide();
            }

        , close:
            function(){
                this._model.getPanel().remove();
            }

        , center:
            function( _with ){
                _with && ( _with = $(_with) );
                var _layout = this._model.getPanel(), _lw = _layout.width(), _lh = _layout.height()
                    , _x, _y, _winw = $(window).width(), _winh = $(window).height()
                    , _scrleft = $(document).scrollLeft(), _scrtop = $(document).scrollTop()
                    ;
                    _layout.css( {'left': '-9999px', 'top': '-9999px'} ).show();

                if( _with && _with.length ){

                }else{
                    _x = (_winw - _lw) / 2 + _scrleft; 
                    _y = (_winh - _lh) / 2 + _scrtop;
                    if( (_winh - _lh  - 100) > 300 ){
                        _y -= 100;
                    }
                    UXC.log( (_winh - _lh / 2 - 100) )

                    if( ( _y + _lh - _scrtop ) > _winh ){
                        UXC.log('y overflow');
                        _y = _scrtop + _winh - _lh;

                    }

                    if( _y < _scrtop || _y < 0 ) _y = _scrtop;

                    _layout.css( {left: _x+'px', top: _y+'px'} );

                    UXC.log( _lw, _lh, _winw, _winh );

                }
            }
    };

    var _deftpl =
        [
        '<div class="UPanel" style="width: 600px;">\n'
        ,'    <div class="UPContent">\n'
        ,'        <div class="bd"></div>\n'
        ,'        <span class="close" eventtype="close"></span>\n'
        ,'    </div><!--end UPContent-->\n'
        ,'</div><!--end UPanel-->\n'
        ].join('')

}(jQuery));
