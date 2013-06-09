(function($){
    /**
     * alert 提示 popup
     * <br /> 这个是不带 蒙板的 popup 弹框
     * <br /><b>注意, 这是个方法, 写 @class 属性是为了生成文档用的</b>
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a>, <a href='UXC.Panel.html'>Panel</a></p>
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
     * <br /><b>注意, 这是个方法, 写 @class 属性是为了生成文档用的</b>
     * <p>private property see: <a href='UXC.alert.html'>UXC.alert</a>
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a>, <a href='UXC.Panel.html'>Panel</a></p>
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
            if( _logic.ins )
                try{ 
                    _logic.ins.close(); 
                    _logic.ins = null; 
                }catch(ex){};

            _popupSrc && ( _popupSrc = $(_popupSrc) );

            var _tpl = _tpl
                        .replace(/\{msg\}/g, _msg)
                        .replace(/\{status\}/g, _logic.getStatusClass(_status||'') );
            var _ins = _logic.ins = new UXC.Panel(_tpl);
            _logic.fixWidth( _msg, _ins );

            _cb && _ins.on('confirm', _cb);
            if( !_popupSrc ) _ins.center();

            _ins.on('show_default', function(){
                UXC.log('user show_default');
                _logic.showEffect( _ins, _popupSrc, function(){
                });
                return false;
            });

            _ins.on('close_default', function(){
                UXC.log('user close_default');
                _logic.hideEffect( _ins, _popupSrc, function(){
                    _ins.selector().remove();
                    _ins = null;
                });
                return false;
            });

            _ins.on('hide_default', function(){
                UXC.log('user hide_default');
                _logic.hideEffect( _ins, _popupSrc, function(){
                    _ins.selector().hide();
                });
                return false;
            });

            if( _popupSrc && _popupSrc.length )_ins.selector().css( { 'left': '-9999px', 'top': '-9999px' } );

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
                    _top = _top - _sh - 2;

                _selector.height(0);
                _selector.css( { 'left': _left  + 'px' } );

                _dom.interval = 
                    _logic.easyEffect( function( _curVal ){
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
                var _top = _logic.getTop( _poffset.top, _popupSrc.height(), _sh, 9 );

                _selector.height(0);
                _selector.css( { 'left': _left  + 'px' } );

                UXC.log( _top, _poffset.top );

                if( _top > _poffset.top ){
                    _dom.interval = 
                        _logic.easyEffect( function( _curVal ){
                            _selector.css( {
                                'top': _top - _sh - 3 + 'px'
                                , 'height': _curVal + 'px'
                            });
                        }, _sh );

                }else{
                    _dom.interval = 
                        _logic.easyEffect( function( _curVal ){
                            _selector.css( {
                                'top': _top - _curVal - 3 + 'px'
                                , 'height': _curVal + 'px'
                            });
                        }, _sh );
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
                    , _maxLeft = $(window).width() - _targetWidth;

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
                var _tmp = $('<div style="position:absolute; left:-9999px;top:-9999px;">' + _msg + '</div>').appendTo('body'), _w = _tmp.width() + 80;
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
         * 缓动函数, 动画效果为按时间缓动 
         * @method  _logic.easyEffect
         * @for     UXC.alert
         * @private
         * @param   {function}  _cb         缓动运动时的回调
         * @param   {number}    _maxVal     缓动的最大值
         * @param   {number}    _minVal     缓动的起始值
         * @param   {number}    _duration   缓动的总时间, 单位毫秒
         */
        , easyEffect:
            function( _cb, _maxVal, _minVal, _duration, _stepMs ){
                var _beginDate = new Date(), _timepass
                    , _maxVal = _maxVal || 200, _minVal = _minVal || 0
                    , _duration = _duration || 200, _stepMs = _stepMs || 2;
                var _interval = setInterval(
                    function(){
                        _timepass = new Date() - _beginDate;
                        _minVal = _timepass / _duration * _maxVal;

                        if( _minVal > _maxVal ){
                            _minVal = _maxVal
                            clearInterval( _interval );
                        }
                        _cb && _cb( _minVal );
                    }, _stepMs );

                return _interval;
            }
        /**
         * 弹框的实例, 同一时间只能出现一个弹框
         * @property    _logic.ins
         * @type    UXC.Panel
         * @for     UXC.alert
         * @private
         */
        , ins: null
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
                '<div class="UPanel UPanelPopup {status}" >\n'
                ,'    <div class="UPContent">\n'
                ,'        <div class="bd">\n'
                ,'            <dl>\n'
                ,'                <dd class="UPopupContent">\n'
                ,'                <button class="UIcon" align="absMiddle" ></button><div class="UText"><button type="button" class="UPlaceholder"></button>{msg}</div>\n'
                ,'                </dd>\n'
                ,'                <dd class="UButton">\n'
                ,'                    <button type="button" eventtype="confirm">确定</button>\n'
                ,'                </dd>\n'
                ,'            </dl>\n'
                ,'        </div>\n'
                ,'    </div><!--end UPContent-->\n'
                ,'</div><!--end UPanel-->\n'
                ].join('')
            /**
             *  confirm 弹框的默认模板
             *  @property   _logic.tpls.confirm
             *  @type       string
             *  @private
             */
            , confirm:
                [
                '<div class="UPanel UPanelPopup {status}" >\n'
                ,'    <div class="UPContent">\n'
                ,'        <div class="bd">\n'
                ,'            <dl>\n'
                ,'                <dd class="UPopupContent">\n'
                ,'                <button class="UIcon" align="absMiddle" ></button><div class="UText"><button type="button" class="UPlaceholder"></button>{msg}</div>\n'
                ,'                </dd>\n'
                ,'                <dd class="UButton">\n'
                ,'                    <button type="button" eventtype="confirm">确定</button>'
                ,'                    <button type="button" eventtype="cancel">取消</button>\n'
                ,'                </dd>\n'
                ,'            </dl>\n'
                ,'        </div>\n'
                ,'    </div><!--end UPContent-->\n'
                ,'</div><!--end UPanel-->\n'
                ].join('')
        }
    };

}(jQuery));
