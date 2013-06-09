(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    window.Panel = UXC.Panel = Panel;
    /**
     * 弹出层基础类 UXC.Panel
     * <br /><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>https://github.com/suchesqiu/360UXC.git</a>
     * <br /><a href='http://uxc.btbtd.org/docs/uxc_docs/' target='_blank'>http://uxc.btbtd.org/docs/uxc_docs</a>
     * @namespace UXC
     * @class Panel
     * @constructor
     * @uses window.jQuery
     * @param   {selector|string}   _selector   自定义弹框模板, 如果 _selector不能解析为 HTML, 将视为@param _headers 
     * @param   {string}            _headers    定义模板的 header 文字, 如果 _selector 不能解析为HTML, 视视为@param _bodys
     * @param   {string}            _bodys      定义模板的 body 文字, 如果 _selector 不能解析为HTML, 视视为@param _footers
     * @param   {string}            _footers    定义模板的 footer 文字
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @date    2013-06-04
     * @example
            <script src="../../../lib.js"></script>
            <script>UXC.use( 'Panel' ); </script>
            <script>
                var btnstr = [
                    '<div style="text-align:center" class="UButton">'
                    , '<button type="button" eventtype="confirm">确定</button>'
                    , '<button type="button" eventtype="cancel">取消</button>\n'
                    , '</div>'
                ].join('');
                $(document).ready( function(_evt){
                    tmpPanel = new UXC.Panel( '默认panel', '<h2>test content</h2>' + btnstr, 'test footer');
                    tmpPanel.on('close', function(_evt, _panel){
                        UXC.log('user close evnet');
                    });
                    tmpPanel.show( 0 );
                });
            </script>
     */
    function Panel( _selector, _headers, _bodys, _footers ){
        this._model = new Model( _selector, _headers, _bodys, _footers );
        this._view = new View( this._model );

        this._init();
    }
    /**
     * 监听Panel的所有点击事件
     * <br />如果事件源有 eventtype 属性, 则会触发eventtype的事件类型
     * @event   Panel click
     * @private
     */
    $(document).delegate( 'div.UPanel', 'click', function( _evt ){
        var _panel = $(this), _src = $(_evt.target || _evt.srcElement), _evtName;
        if( _src && _src.length && _src.is("[eventtype]") ){
            _evtName = _src.attr('eventtype');
            UXC.log( _evtName, _panel.data('PanelInstace') );
            _evtName && _panel.data('PanelInstace') && _panel.data('PanelInstace').trigger( _evtName, _src, _evt );
        }
    });
    
    Panel.prototype = {
        /**
         * 初始化Panel
         * @method  _init
         * @private
         */
        _init:
            function(){
                var _p = this;
                this._view.getPanel().data('PanelInstace', this);

                /**
                 * 初始化Panel 默认关闭事件
                 * @event   close_default
                 * @type    function
                 * @private
                 */
                this._model.addEvent( 'close_default'
                                    , function( _evt, _panel ){ _panel._view.close(); } );

                this._model.addEvent( 'show_default'
                                    , function( _evt, _panel ){ _panel._view.show(); } );

                this._model.addEvent( 'hide_default'
                                    , function( _evt, _panel ){ _panel._view.hide(); } );

                this._model.addEvent( 'confirm_default'
                                    , function( _evt, _panel ){ _panel.trigger('close'); } );

                this._model.addEvent( 'cancel_default'
                                    , function( _evt, _panel ){ _panel.trigger('close'); } );
               
               return this;
            }    
        /**
         * 为Panel绑定事件
         * <br /> 内置事件类型有 show, hide, close, center, confirm, cancel
         * , beforeshow, beforehide, beforeclose, beforecenter
         * <br /> 用户可通过 HTML eventtype 属性自定义事件类型
         * @method on
         * @param   {string}    _evtName    要绑定的事件名
         * @param   {function}  _cb         要绑定的事件回调函数
         * @example
                //绑定内置事件
                <button type="button" eventtype="close">text</button>
                <script>
                panelInstace.on( 'close', function( _evt, _panel ){ do something } );
                </script>

                //绑定自定义事件
                <button type="button" eventtype="userevent">text</button>
                <script>
                panelInstace.on( 'userevent', function( _evt, _pan:el ){ do something } );
                </script>
         */
        , on:
            function( _evtName, _cb ){
                _evtName && _cb && this._model.addEvent( _evtName, _cb );
            }
        /**
         * 显示Panel
         * <br /> Panel初始后, 默认是隐藏状态, 显示 Panel 需要显式调用 show 方法
         * @method  show
         * @param   {int}   _position   指定 panel 要显示的位置, 目前只有参数 0, 表示屏幕居中显示
         * @example
         *      //默认显示
         *      panelInstace.show();
         *
         *      //居中显示
         *      panelInstace.show( 0 );
         */
        , show:
            function( _position ){
                var _p = this;
                setTimeout(
                    function(){
                        if( _position != undefined ){
                            switch( _position ){
                                case 0: _p.center(); break;
                            }
                        }
                    }, 50);
                this.trigger('beforeshow', this._view.getPanel() );
                this.trigger('show', this._view.getPanel() );
            }
        , hide:
            function(){
                this.trigger('beforehide', this._view.getPanel() );
                this.trigger('hide', this._view.getPanel() );
            }

        , close:
            function(){
                UXC.log('Panel.close');
                this.trigger('beforeclose', this._view.getPanel() );
                this.trigger('close', this._view.getPanel() );
            }

        , center:
            function(){
                this.trigger('beforecenter', this._view.getPanel() );
                this._view.center();
                this.trigger('center', this._view.getPanel() );
            }

        , selector: function(){ return this._view.getPanel(); }

        , trigger:
            function( _evtName, _srcElement ){
                UXC.log( 'Panel.trigger', _evtName );

                var _p = this, _evts = this._model.getEvent( _evtName ), _processDefEvt = true;
                if( _evts && _evts.length ){
                    _srcElement && (_srcElement = $(_srcElement) ) 
                        && _srcElement.length && (_srcElement = _srcElement[0]);

                    $.each( _evts, function( _ix, _cb ){
                        if( _cb.call( _srcElement, _evtName, _p ) === false ) 
                            return _processDefEvt = false; 
                    });
                }

                if( _processDefEvt ){
                    var _defEvts = this._model.getEvent( _evtName + '_default' );
                    if( _defEvts && _defEvts.length ){
                        $.each( _defEvts, function( _ix, _cb ){
                            if( _cb.call( _srcElement, _evtName, _p ) === false ) 
                                return false; 
                        });
                    }
                }
            }

        , header:
            function( _html ){
                if( typeof _html != 'undefined' ) this._view.getHeader( _html );
                var _selector = this._view.getHeader();
                if( _selector && _selector.length ) return _selector.html();
            }

        , body:
            function( _html ){
                if( typeof _html != 'undefined' ) this._view.getBody( _html );
                var _selector = this._view.getBody();
                if( _selector && _selector.length ) return _selector.html();
            }

        , footer:
            function( _html ){
                if( typeof _html != 'undefined' ) this._view.getFooter( _html );
                var _selector = this._view.getFooter();
                if( _selector && _selector.length ) return _selector.html();
            }

        , panel:
            function( _html ){
                if( typeof _html != 'undefined' ) this._view.getPanel( _html );
                var _selector = this._view.getPanel();
                if( _selector && _selector.length ) return _selector.html();
            }
    }
    
    function Model( _selector, _headers, _bodys, _footers ){

        this.selector = _selector;
        this.headers = _headers;
        this.bodys = _bodys;
        this.footers = _footers;
        this.panel;

        this._events = {};

        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                var _selector = typeof this.selector != 'undefined' ? $(this.selector) : undefined;
                if( _selector && _selector.length ){
                    this.selector = _selector;
                    UXC.log( 'user tpl', this.selector.parent().length );
                    if( !this.selector.parent().length ){
                        this.selector.appendTo( $(document.body ) );
                    }
                }else if( !_selector || _selector.length === 0 ){
                    this.footers = this.bodys;
                    this.bodys = this.headers;
                    this.headers = this.selector;
                    this.selector = undefined;
                }
                return this;
            }

        , addEvent:
            function( _evtName, _cb ){
                if( !(_evtName && _cb ) ) return;
                _evtName && ( _evtName = _evtName.toLowerCase() );
                if( !(_evtName in this._events ) ){
                    this._events[ _evtName ] = []
                }
                if( /\_default/i.test( _evtName ) ) this._events[ _evtName ].unshift( _cb );
                else this._events[ _evtName ].push( _cb );
            }

        , getEvent:
            function( _evtName ){
                return this._events[ _evtName ];
            }

    };
    
    function View( _model ){
        this._model = _model;
        this._tpl = _deftpl;

        this._init();
    }
    
    View.prototype = {
        _init:
            function(){
                if( !this._model.panel ){
                    if( this._model.selector ){
                        this._model.panel = this._model.selector;
                    }else{
                        this._model.panel = $(this._tpl);
                        this._model.panel.hide().appendTo(document.body);
                    }
                }

                this.getHeader();
                this.getBody();
                this.getFooter();

                return this;
            }

        , show:
            function(){
                this.getPanel().show();
            }

        , hide:
            function(){
                this.getPanel().hide();
            }

        , close:
            function(){
                UXC.log( 'Panel._view.close()');
                this.getPanel().remove();
            }

        , getPanel:
            function( _udata ){
                if( typeof _udata != 'undefined' ){
                    this.getPanel().html( _udata );
                }
                return this._model.panel;
            }

        , getHeader:
            function( _udata ){
                var _selector = this.getPanel().find('div.UPContent > div.hd');
                if( typeof _udata != 'undefined' ) this._model.headers = _udata;
                if( typeof this._model.headers != 'undefined' ){
                    if( !_selector.length ){
                        this.getPanel().find('div.UPContent > div.bd')
                            .before( _selector = $('<div class="hd">弹出框</div>') );
                    }
                    _selector.html( this._model.headers );
                    this._model.headers = undefined;
                }
                return _selector;
            }

        , getBody:
            function( _udata ){
                var _selector = this.getPanel().find('div.UPContent > div.bd');
                if( typeof _udata != 'undefined' ) this._model.bodys = _udata;
                if( typeof this._model.bodys!= 'undefined' ){
                    _selector.html( this._model.bodys);
                    this._model.bodys = undefined;
                }
                return _selector;
            }


        , getFooter:
            function( _udata ){
                var _selector = this.getPanel().find('div.UPContent > div.ft');
                if( typeof _udata != 'undefined' ) this._model.footers = _udata;
                if( typeof this._model.footers != 'undefined' ){
                    if( !_selector.length ){
                        this.getPanel().find('div.UPContent > div.bd')
                            .after( _selector = $('<div class="ft" ></div>'));
                    }
                    _selector.html( this._model.footers );
                    this._model.footers = undefined;
                }
                return _selector;
            }

        , center:
            function( ){
                var _layout = this.getPanel(), _lw = _layout.width(), _lh = _layout.height()
                    , _x, _y, _winw = $(window).width(), _winh = $(window).height()
                    , _scrleft = $(document).scrollLeft(), _scrtop = $(document).scrollTop()
                    ;

                _layout.css( {'left': '-9999px', 'top': '-9999px'} ).show();
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
    };
    /**
     * Panel 显示前会触发的事件<br/>
     * 这个事件在用户调用 _panelInstance.show() 时触发
     * @event   beforeshow
     * @type    function
     * @example     
     *      panelInstace.on( 'beforeshow', function( _evt, _panelInstance ){ do something });
     */
    /**
     * 显示Panel时会触发的事件
     * @event   show
     * @type    function
     * @example     
     *      panelInstace.on( 'show', function( _evt, _panelInstance ){ do something });
     */
    /**
     * Panel 隐藏前会触发的事件<br/>
     * <br />这个事件在用户调用 _panelInstance.hide() 时触发
     * @event   beforehide
     * @type    function
     * @example     
     *      panelInstace.on( 'beforehide', function( _evt, _panelInstance ){ do something });
     */
    /**
     * Panel 隐藏时会触发的事件<br/>
     * <br />这个事件在用户调用 _panelInstance.hide() 时触发
     * @event   hide
     * @type    function
     * @example     
     *      panelInstace.on( 'hide', function( _evt, _panelInstance ){ do something });
     */
    /**
     * Panel 关闭前会触发的事件<br/>
     * 这个事件在用户调用 _panelInstance.close() 时触发
     * @event   beforeclose
     * @type    function
     * @example     
     *      <button type="button" eventtype="close">text</button>
     *      <script>
     *      panelInstace.on( 'beforeclose', function( _evt, _panelInstance ){ do something });
     *      </script>
     */
    /**
     * 关闭事件
     * @event   close
     * @type    function
     * @example     
     *      <button type="button" eventtype="close">text</button>
     *      <script>
     *      panelInstace.on( 'close', function( _evt, _panelInstance ){ do something });
     *      </script>
     */
    /**
     * Panel 居中显示前会触发的事件<br/>
     * 这个事件在用户调用 _panelInstance.center() 时触发
     * @event   beforecenter
     * @type    function
     * @example     
     *      panelInstace.on( 'beforecenter', function( _evt, _panelInstance ){ do something });
     */
    /**
     * Panel 居中后会触发的事件
     * @event   center
     * @type    function
     * @example     
     *      panelInstace.on( 'center', function( _evt, _panelInstance ){ do something });
     */
    /**
     * Panel 点击确认按钮触发的事件
     * @event   confirm
     * @type    function
     * @example     
     *      <button type="button" eventtype="confirm">text</button>
     *      <script>
     *      panelInstace.on( 'confirm', function( _evt, _panelInstance ){ do something });
     *      </script>
     */
    /**
     * Panel 点击确取消按钮触发的事件
     * @event   cancel
     * @type    function
     * @example     
     *      <button type="button" eventtype="cancel">text</button>
     *      <script>
     *      panelInstace.on( 'cancel', function( _evt, _panelInstance ){ do something });
     *      </script>
     */

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
