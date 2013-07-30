(function($){
    /**
     * alert 提示 popup
     * <br /> 这个是不带 蒙板的 popup 弹框
     * <br /><b>注意, 这是个方法, 写 @class 属性是为了生成文档</b>
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a>, <a href='UXC.Panel.html'>Panel</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/uxc_docs/classes/UXC.alert.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Panel/_demo' target='_blank'>demo link</a></p>
     * @namespace UXC
     * @class   alert
     * @static
     * @constructor
     * @param   {string}    _msg        提示内容
     * @param   {selector}  _popupSrc   触发弹框的事件源 selector, 不为空显示 缓动效果, 为空居中显示
     * @param   {int}       _status     显示弹框的状态, 0: 成功, 1: 错误, 2: 警告
     * @param   {function}  _cb         点击弹框确定按钮的回调
     * @return  <a href='UXC.Panel.html'>UXC.Panel</a>
     */
    UXC.alert = 
        function( _msg, _popupSrc, _status, _cb ){
            return _logic.popup( _logic.tpls.alert, _msg, _popupSrc, _status, _cb );
        };
    /**
     * confirm 提示 popup
     * <br /> 这个是不带 蒙板的 popup 弹框
     * <br /><b>注意, 这是个方法, 写 @class 属性是为了生成文档</b>
     * <p>private property see: <a href='UXC.alert.html'>UXC.alert</a>
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a>, <a href='UXC.Panel.html'>Panel</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/uxc_docs/classes/UXC.confirm.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Panel/_demo' target='_blank'>demo link</a></p>
     * @namespace UXC
     * @class   confirm
     * @static
     * @constructor
     * @param   {string}    _msg        提示内容
     * @param   {selector}  _popupSrc   触发弹框的事件源 selector, 不为空显示 缓动效果, 为空居中显示
     * @param   {int}       _status     显示弹框的状态, 0: 成功, 1: 错误, 2: 警告
     * @param   {function}  _cb         点击弹框确定按钮的回调
     * @return  <a href='UXC.Panel.html'>UXC.Panel</a>
     */
    UXC.confirm = 
        function( _msg, _popupSrc, _status, _cb ){
            return _logic.popup( _logic.tpls.confirm, _msg, _popupSrc, _status, _cb );
        };
    /**
     * 隐藏 或 从DOM清除所有 UXC.alert/UXC.confirm
     * <br /><b>注意, 这是个方法, 写 @class 属性是为了生成文档</b>
     * @namespace UXC
     * @class hideAllPopup
     * @static
     * @constructor
     * @param   {bool}  _isClose    为真从DOM清除UXC.alert/UXC.confirm, 为假隐藏, 默认为false
     * @example
     *      UXC.hideAllPopup();         //隐藏所有UXC.alert, UXC.confirm
     *      UXC.hideAllPopup( true );   //从 DOM 清除所有 UXC.alert, UXC.confirm
     */
    UXC.hideAllPopup =
        function( _isClose ){
            if( _isClose ){
                $('body > div.UPanelPopup_identifer').remove();
            }else{
                $('body > div.UPanelPopup_identifer').hide();
            }
        };
    /**
     * 从 HTML 属性 自动执行 UXC.alert / UXC.confirm
     * @attr    {string}    paneltype           弹框类型, alert | confirm
     * @attr    {string}    panelmsg            弹框提示
     * @attr    {string}    panelstatus         弹框状态, 0|1|2
     * @attr    {function}  panelcallback       confirm 回调
     * @attr    {function}  panelcancelcallback cancel  回调
     */
    $(document).on( 'click', function( _evt ){
        var _p = $(_evt.target||_evt.srcElement)
            , _paneltype = _p.attr('paneltype'), _panelmsg = _p.attr('panelmsg');
        if( !(_paneltype && _panelmsg ) ) return;
        _paneltype = _paneltype.toLowerCase();

        _p.prop('nodeName') && _p.prop('nodeName').toLowerCase() == 'a' && _evt.preventDefault();

        var  _panelstatus = ( parseInt( _p.attr('panelstatus'), 10 ) || 0 )
           , _callback = _p.attr('panelcallback')
           , _cancelcallback = _p.attr('panelcancelcallback');
        
        _callback && ( _callback = window[ _callback ] );
        _cancelcallback && ( _cancelcallback = window[ _cancelcallback ] );

        if( !(_paneltype in UXC) ) return;

        var _panel = UXC[ _paneltype ]( _panelmsg, _p, _panelstatus );
        if( _callback ) _panel.on( 'confirm', _callback );
        if( _cancelcallback ) _panel.on( 'cancel', _cancelcallback );
    });
    /**
     * 响应窗口改变大小 
     */
    $(window).on('resize', function( _evt ){
        $('body > div.UPanelPopup_identifer').each( function(){
            var _p = $(this);
            _p.data('PopupInstance') && _logic.onresize( _p.data('PopupInstance') );
        });
    });
    /**
     * 弹框逻辑处理方法集
     * @property    _logic
     * @for UXC.alert
     * @private
     */
    var _logic = {
        /**
         * 弹框最小宽度
         * @property    _logic.minWidth
         * @for UXC.alert
         * @type        int
         * @default     180
         * @private
         */
        minWidth: 180
        /**
         * 弹框最大宽度
         * @property    _logic.maxWidth
         * @for UXC.alert
         * @type        int
         * @default     500
         * @private
         */
        , maxWidth: 500
        /**
         * 显示时 X轴的偏移值
         * @property    _logic.xoffset
         * @type    number
         * @default 9
         * @for UXC.alert
         * @private
         */
        , xoffset: 9
        /**
         * 显示时 Y轴的偏移值
         * @property    _logic.yoffset
         * @type    number
         * @default 3
         * @for UXC.alert
         * @private
         */
        , yoffset: 3
        /**
         * 设置弹框的唯一性
         * @method  _logic.popupIdentifier
         * @for UXC.alert
         * @private
         * @param   {UXC.Panel} _panel  
         */
        , popupIdentifier:
            function( _panel ){
                if( !_panel ){
                    $('body > div.UPanelPopup_identifer').remove();
                    $('body > div.UPanel_TMP').remove();
                }else{
                    _panel.selector().addClass('UPanelPopup_identifer');
                    _panel.selector().data('PopupInstance', _panel);
                }
            }
        /**
         * 弹框通用处理方法
         * @method  _logic.popup
         * @for UXC.alert
         * @private
         * @param   {string}    _tpl        弹框模板
         * @param   {string}    _msg        弹框提示
         * @param   {selector}  _popupSrc   弹框事件源对象  
         * @param   {int}       _status     弹框状态
         * @param   {function}  _cb         confirm 回调
         * @return  UXC.Panel
         */
        , popup:
        function( _tpl, _msg, _popupSrc, _status, _cb ){
            if( !_msg ) return;
            _logic.popupIdentifier();

            _popupSrc && ( _popupSrc = $(_popupSrc) );

            var _tpl = _tpl
                        .replace(/\{msg\}/g, _msg)
                        .replace(/\{status\}/g, _logic.getStatusClass(_status||'') );
            var _ins = new UXC.Panel(_tpl);
            _logic.popupIdentifier( _ins );
            _ins.selector().data('popupSrc', _popupSrc);
            _logic.fixWidth( _msg, _ins );

            _cb && _ins.on('confirm', _cb);
            if( !_popupSrc ) _ins.center();

            _ins.on('show_default', function(){
                UXC.log('user show_default');
                if( _popupSrc && _popupSrc.length ){
                    _logic.showEffect( _ins, _popupSrc, function(){
                    });
                    return false;
                }
            });

            _ins.on('close_default', function(){
                UXC.log('user close_default');
                if( _popupSrc && _popupSrc.length ){
                    _logic.hideEffect( _ins, _popupSrc, function(){
                        _ins.selector().remove();
                        _ins = null;
                    });
                }
                return false;
            });

            _ins.on('hide_default', function(){
                UXC.log('user hide_default');
                if( _popupSrc && _popupSrc.length ){
                    _logic.hideEffect( _ins, _popupSrc, function(){
                        _ins.selector().hide();
                    });
                    return false;
                }
            });

            if( _popupSrc && _popupSrc.length )_ins.selector().css( { 'left': '-9999px', 'top': '-9999px' } );

            _ins.selector().css( 'z-index', window.ZINDEX_COUNT++ );
            _ins.show();

            return _ins;
        }
        /**
         * 隐藏弹框缓动效果
         * @method  _logic.hideEffect
         * @for UXC.alert
         * @private
         * @param   {UXC.Panel}     _panel
         * @param   {selector}      _popupSrc
         * @param   {function}      _doneCb 缓动完成后的回调
         */
        , hideEffect:
            function( _panel, _popupSrc, _doneCb ){
                _popupSrc && ( _popupSrc = $(_popupSrc) );
                if( !(_popupSrc && _popupSrc.length ) ) return;

                var _poffset = _popupSrc.offset(), _selector = _panel.selector();
                var _dom = _selector[0];

                _dom.interval && clearInterval( _dom.interval );
                _dom.defaultWidth && _selector.width( _dom.defaultWidth );
                _dom.defaultHeight && _selector.height( _dom.defaultHeight );

                var _pw = _popupSrc.width(), _sh = _selector.height();
                _dom.defaultWidth = _selector.width();
                _dom.defaultHeight = _selector.height();

                var _left = _logic.getLeft( _poffset.left, _pw, _selector.width() );
                var _top = _logic.getTop( _poffset.top, _popupSrc.height(), _sh );
                    _top = _top - _sh - _logic.yoffset;

                _selector.height(0);
                _selector.css( { 'left': _left  + 'px' } );

                _dom.interval = 
                    easyEffect( function( _curVal ){
                        _selector.css( {
                            'top': _top + _curVal + 'px'
                            , 'height': _sh - _curVal + 'px'
                        });

                        if( _sh === _curVal ) _selector.hide();
                    }, _sh );

            }
        /**
         * 隐藏弹框缓动效果
         * @method  _logic.showEffect
         * @for UXC.alert
         * @private
         * @param   {UXC.Panel}     _panel
         * @param   {selector}      _popupSrc
         */
        , showEffect:
            function( _panel, _popupSrc ){
                _popupSrc && ( _popupSrc = $(_popupSrc) );
                if( !(_popupSrc && _popupSrc.length ) ) return;

                var _poffset = _popupSrc.offset(), _selector = _panel.selector();
                var _dom = _selector[0];

                _dom.interval && clearInterval( _dom.interval );
                _dom.defaultWidth && _selector.width( _dom.defaultWidth );
                _dom.defaultHeight && _selector.height( _dom.defaultHeight );

                var _pw = _popupSrc.width(), _sh = _selector.height();
                _dom.defaultWidth = _selector.width();
                _dom.defaultHeight = _selector.height();

                var _left = _logic.getLeft( _poffset.left, _pw, _selector.width() );
                var _top = _logic.getTop( _poffset.top, _popupSrc.height(), _sh, _logic.xoffset );

                _selector.height(0);
                _selector.css( { 'left': _left  + 'px' } );

                UXC.log( _top, _poffset.top );

                if( _top > _poffset.top ){
                    _dom.interval = 
                        easyEffect( function( _curVal ){
                            _selector.css( {
                                'top': _top - _sh - _logic.yoffset + 'px'
                                , 'height': _curVal + 'px'
                            });
                        }, _sh );

                }else{
                    _dom.interval = 
                        easyEffect( function( _curVal ){
                            _selector.css( {
                                'top': _top - _curVal - _logic.yoffset + 'px'
                                , 'height': _curVal + 'px'
                            });
                        }, _sh );
                }

            }
        /**
         * 设置 Panel 的默认X,Y轴
         * @method  _logic.onresize
         * @private
         * @for UXC.alert
         * @param   {selector}  _panel
         */
        , onresize:
            function( _panel ){
                if(  !_panel.selector().is(':visible') ) return;
                var _selector = _panel.selector(), _popupSrc = _selector.data('popupSrc');
                if( !(_popupSrc && _popupSrc.length) ){
                    _panel.center();
                }else{
                    var _srcoffset = _popupSrc.offset();
                    var _srcTop = _srcoffset.top
                        , _srcHeight = _popupSrc.height()
                        , _targetHeight = _selector.height()
                        , _yoffset = 0
                        
                        , _srcLeft = _srcoffset.left
                        , _srcWidth = _popupSrc.width()
                        , _targetWidth = _selector.width()
                        , _xoffset = 0
                        ;

                    var _left = _logic.getLeft( _srcLeft, _srcWidth
                                , _targetWidth, _xoffset ) + _logic.xoffset;
                    var _top = _logic.getTop( _srcTop, _srcHeight
                                , _targetHeight, _yoffset ) - _targetHeight - _logic.yoffset;

                    _selector.css({
                        'left': _left + 'px', 'top': _top + 'px'
                    });
                }
            }
        /**
         * 取得弹框最要显示的 y 轴
         * @method  _logic.getTop
         * @for UXC.alert
         * @private
         * @param   {number}    _scrTop         滚动条Y位置
         * @param   {number}    _srcHeight      事件源 高度
         * @param   {number}    _targetHeight   弹框高度
         * @param   {number}    _offset         Y轴偏移值
         * @return  {number}
         */
        , getTop:
            function( _srcTop, _srcHeight, _targetHeight, _offset  ){
                var _r = _srcTop
                    , _scrTop = $(document).scrollTop()
                    , _maxTop = $(window).height() - _targetHeight;

                _r - _targetHeight < _scrTop && ( _r = _srcTop + _srcHeight + _targetHeight + _offset );

                return _r;
            }
        /**
         * 取得弹框最要显示的 x 轴
         * @method  _logic.getLeft
         * @for UXC.alert
         * @private
         * @param   {number}    _scrTop         滚动条Y位置
         * @param   {number}    _srcHeight      事件源 高度
         * @param   {number}    _targetHeight   弹框高度
         * @param   {number}    _offset         Y轴偏移值
         * @return  {number}
         */
        , getLeft:
            function( _srcLeft, _srcWidth, _targetWidth, _offset  ){
                _offset == undefined && ( _offset = 5 );
                var _r = _srcLeft + _srcWidth / 2 + _offset - _targetWidth / 2
                    , _scrLeft = $(document).scrollLeft()
                    , _maxLeft = $(window).width() + _scrLeft - _targetWidth;

                _r > _maxLeft && ( _r = _maxLeft - 2 );
                _r < _scrLeft && ( _r = _scrLeft + 1 );

                return _r;
            }
        /**
         * 修正弹框的默认显示宽度
         * @method  _logic.fixWidth
         * @for     UXC.alert
         * @private
         * @param   {string}    _msg    查显示的文本
         * @param   {UXC.Panel} _panel
         */
        , fixWidth:
            function( _msg, _panel ){
                var _tmp = $('<div class="UPanel_TMP" style="position:absolute; left:-9999px;top:-9999px;">' + _msg + '</div>').appendTo('body'), _w = _tmp.width() + 80;
                    _tmp.remove();
                _w > _logic.maxWidth && ( _w = _logic.maxWidth );
                _w < _logic.minWidth && ( _w = _logic.minWidth );

                _panel.selector().css('width', _w);
            }
        /**
         * 获取弹框的显示状态, 默认为0(成功)
         * @method  _logic.fixWidth
         * @for     UXC.alert
         * @private
         * @param   {int}   _status     弹框状态: 0:成功, 1:失败, 2:警告
         * @return  {int}
         */
        , getStatusClass:
            function ( _status ){
                var _r = 'UPanelSuccess';
                switch( _status ){
                    case 0: _r = 'UPanelSuccess'; break;
                    case 1: _r = 'UPanelError'; break;
                    case 2: _r = 'UPanelAlert'; break;
                }
                return _r;
            }
        /**
         * 保存弹框的所有默认模板
         * @property    _logic.tpls
         * @type        Object
         * @for         UXC.alert
         * @private
         */
        , tpls: {
            /**
             *  alert 弹框的默认模板
             *  @property   _logic.tpls.alert
             *  @type       string
             *  @private
             */
            alert:
                [
                '<div class="UPanel UPanelPopup {status}" >'
                ,'    <div class="UPContent">'
                ,'        <div class="bd">'
                ,'            <dl>'
                ,'                <dd class="UPopupContent">'
                ,'                <button class="UIcon" align="absMiddle" ></button><div class="UText"><button type="button" class="UPlaceholder"></button>{msg}</div>'
                ,'                </dd>'
                ,'                <dd class="UButton">'
                ,'                    <button type="button" class="UPanel_confirm" eventtype="confirm">确定</button>'
                ,'                </dd>'
                ,'            </dl>'
                ,'        </div>'
                ,'    </div><!--end UPContent-->'
                ,'</div>'
                ].join('')
            /**
             *  confirm 弹框的默认模板
             *  @property   _logic.tpls.confirm
             *  @type       string
             *  @private
             */
            , confirm:
                [
                '<div class="UPanel UPanelPopup {status}" >'
                ,'    <div class="UPContent">'
                ,'        <div class="bd">'
                ,'            <dl>'
                ,'                <dd class="UPopupContent">'
                ,'                <button class="UIcon" align="absMiddle" ></button><div class="UText"><button type="button" class="UPlaceholder"></button>{msg}</div>'
                ,'                </dd>'
                ,'                <dd class="UButton">'
                ,'                    <button type="button" class="UPanel_confirm" eventtype="confirm">确定</button>'
                ,'                    <button type="button" class="UPanel_cancel" eventtype="cancel">取消</button>'
                ,'                </dd>'
                ,'            </dl>'
                ,'        </div>'
                ,'    </div><!--end UPContent-->'
                ,'</div>'
                ].join('')
        }
    };

}(jQuery));
