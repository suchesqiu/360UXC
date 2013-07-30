(function($){

    window.ZINDEX_COUNT = window.ZINDEX_COUNT || 50001;
    var isIE6 = !!window.ActiveXObject && !window.XMLHttpRequest;
    /**
     * 带蒙板的会话弹框
     * <br /><b>注意, 这是个方法, 写 @class 属性是为了生成文档</b>
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a>, <a href='UXC.Panel.html'>Panel</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/uxc_docs/classes/UXC.Dialog.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Panel/_demo' target='_blank'>demo link</a></p>
     * @namespace UXC
     * @class   Dialog
     * @static
     * @constructor
     * @param   {selector|string}   _selector   自定义弹框模板, 如果 _selector不能解析为 HTML, 将视为@param _headers 
     * @param   {string}            _headers    定义模板的 header 文字, 如果 _selector 不能解析为HTML, 视视为@param _bodys
     * @param   {string}            _bodys      定义模板的 body 文字, 如果 _selector 不能解析为HTML, 视视为@param _footers
     * @param   {string}            _footers    定义模板的 footer 文字
     * @return  <a href='UXC.Panel.html'>UXC.Panel</a>
     */
    var Dialog = window.Dialog = UXC.Dialog = 
        function( _selector, _headers, _bodys, _footers ){
            if( _logic.timeout ) clearTimeout( _logic.timeout );

            if( UXC.Panel.getInstance( _selector ) ){
                UXC.Panel.getInstance( _selector ).center().show();
                return UXC.Panel.getInstance( _selector );
            }

            _logic.dialogIdentifier();

            var _ins = new UXC.Panel( _selector, _headers, _bodys, _footers );
            _logic.dialogIdentifier( _ins );

            _logic.showMask();
            _ins.selector().css( 'z-index', window.ZINDEX_COUNT++ );

            _ins.on('close_default', function( _evt, _panel){
                _logic.hideMask();
            });

            _ins.on('hide_default', function( _evt, _panel){
                _logic.hideMask();
            });

            _ins.on('show_default', function( _evt, _panel){
                _logic.showMask();
            });
            
            _logic.timeout = setTimeout( function(){
                _ins.show( 0 );
            }, _logic.showMs );

            return _ins;
        };
    /**
     * 会话框 alert 提示
     * <br /><b>注意, 这是个方法, 写 @class 属性是为了生成文档</b>
     * <p>private property see: <a href='UXC.Dialog.html'>UXC.Dialog</a>
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a>, <a href='UXC.Panel.html'>Panel</a>, <a href='UXC.Dialog.html'>Dialog</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/uxc_docs/classes/UXC.Dialog.alert.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Panel/_demo' target='_blank'>demo link</a></p>
     * @namespace UXC.Dialog
     * @class   alert
     * @static
     * @constructor
     * @param   {string}    _msg        提示内容
     * @param   {int}       _status     显示弹框的状态, 0: 成功, 1: 错误, 2: 警告
     * @param   {function}  _cb         点击弹框确定按钮的回调
     * @return  <a href='UXC.Panel.html'>UXC.Panel</a>
     */
    UXC.Dialog.alert = 
        function(_msg, _status, _cb){
            if( !_msg ) return;
            var _tpl = _logic.tpls.alert
                        .replace(/\{msg\}/g, _msg)
                        .replace(/\{status\}/g, _logic.getStatusClass(_status||'') );
            var _ins = UXC.Dialog(_tpl);
            _logic.fixWidth( _msg, _ins );
            _cb && _ins.on('confirm', _cb);

            return _ins;
        };
    /**
     * 会话框 confirm 提示
     * <br /><b>注意, 这是个方法, 写 @class 属性是为了生成文档</b>
     * <p>private property see: <a href='UXC.Dialog.html'>UXC.Dialog</a>
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a>, <a href='UXC.Panel.html'>Panel</a>, <a href='UXC.Dialog.html'>Dialog</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/uxc_docs/classes/UXC.Dialog.confirm.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Panel/_demo' target='_blank'>demo link</a></p>
     * @namespace UXC.Dialog
     * @class   confirm
     * @static
     * @constructor
     * @param   {string}    _msg        提示内容
     * @param   {int}       _status     显示弹框的状态, 0: 成功, 1: 错误, 2: 警告
     * @param   {function}  _cb         点击弹框确定按钮的回调
     * @return  <a href='UXC.Panel.html'>UXC.Panel</a>
     */
    UXC.Dialog.confirm = 
        function(_msg, _status, _cb){
            if( !_msg ) return;
            var _tpl = _logic.tpls.confirm
                        .replace(/\{msg\}/g, _msg)
                        .replace(/\{status\}/g, _logic.getStatusClass(_status||'') );
            var _ins = UXC.Dialog(_tpl);
            _logic.fixWidth( _msg, _ins );
            _cb && _ins.on('confirm', _cb);

            return _ins;
        };
    /**
     * 显示或隐藏 蒙板
     * <br /><b>注意, 这是个方法, 写 @class 属性是为了生成文档</b>
     * @namespace   UXC.Dialog
     * @class   mask
     * @static
     * @constructor
     * @param   {bool}  _isHide     空/假 显示蒙板, 为真 隐藏蒙板
     */
    UXC.Dialog.mask =
        function( _isHide ){
            !_isHide && _logic.showMask();
            _isHide && _logic.hideMask();
        };
    /**
     * 从 HTML 属性 自动执行 UXC.Dialog.alert / UXC.Dialog.confirm
     * @attr    {string}    paneltype           弹框类型, Dialog.alert | Dialog.confirm
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
        if( !/dialog\./.test( _paneltype ) ) return;
        _paneltype = _paneltype.replace( /.*?\./, '');

        _p.prop('nodeName') && _p.prop('nodeName').toLowerCase() == 'a' && _evt.preventDefault();

        var  _panelstatus = ( parseInt( _p.attr('panelstatus'), 10 ) || 0 )
           , _callback = _p.attr('panelcallback')
           , _cancelcallback = _p.attr('panelcancelcallback');
        
        _callback && ( _callback = window[ _callback ] );
        _cancelcallback && ( _cancelcallback = window[ _cancelcallback ] );

        if( !(_paneltype in UXC.Dialog) ) return;

        var _panel = UXC.Dialog[ _paneltype ]( _panelmsg, _panelstatus );
        if( _callback ) _panel.on( 'confirm', _callback );
        if( _cancelcallback ) _panel.on( 'cancel', _cancelcallback );

    });
    /**
     * 响应窗口改变大小和滚动 
     */
    $(window).on('resize scroll', function( _evt ){
        $('body > div.UPanelDialog_identifer').each( function(){
            var _p = $(this);
            if( _p.data('DialogInstance') ){
                if(  !_p.data('DialogInstance').selector().is(':visible') ) return;
                if( _evt.type.toLowerCase() == 'resize' ) _p.data('DialogInstance').center(); 
                _logic.setMaskSizeForIe6();
            }
        });
    });
    /**
     * 会话弹框逻辑处理方法集
     * @property    _logic
     * @for UXC.Dialog
     * @private
     */
    var _logic = {
        /**
         * 延时处理的指针属性
         * @property    _logic.timeout
         * @type    setTimeout
         * @private
         * @for UXC.Dialog
         */
        timeout: null
        /**
         * 延时显示弹框
         * <br />延时是为了使用户绑定的 show 事件能够被执行
         * @property    _logic.showMs
         * @type    int     millisecond
         * @private
         * @for UXC.Dialog
         */
        , showMs: 10
        /**
         * 弹框最小宽度
         * @property    _logic.minWidth
         * @for UXC.Dialog
         * @type        int
         * @default     180
         * @private
         */
        , minWidth: 180
        /**
         * 弹框最大宽度
         * @property    _logic.maxWidth
         * @for UXC.Dialog
         * @type        int
         * @default     500
         * @private
         */
        , maxWidth: 500
        /**
         * 设置会话弹框的唯一性
         * @method  _logic.dialogIdentifier
         * @for UXC.Dialog
         * @private
         * @param   {UXC.Panel} _panel  
         */
        , dialogIdentifier:
            function( _panel ){
                if( !_panel ){
                    _logic.hideMask();
                    $('body > div.UPanelDialog_identifer').hide();
                    $('body > div.UPanel_TMP').remove();
                }else{
                    _panel.selector().addClass('UPanelDialog_identifer');
                    _panel.selector().data('DialogInstance', _panel);
                }
            }
        /**
         * 显示蒙板
         * @method  _logic.showMask
         * @private
         * @for UXC.Dialog
         */
        , showMask:
            function(){
                var _mask = $('#UPanelMask'), _iframemask = $('#UPanelMaskIfrmae');
                if( !_mask.length ){
                    $( _logic.tpls.mask ).appendTo('body');
                    _mask = $('#UPanelMask'), _iframemask = $('#UPanelMaskIfrmae');
                }
                _iframemask.show(); _mask.show();

                _logic.setMaskSizeForIe6();

                _iframemask.css('z-index', window.ZINDEX_COUNT++ );
                _mask.css('z-index', window.ZINDEX_COUNT++ );
            }
        /**
         * 隐藏蒙板
         * @method  _logic.hideMask
         * @private
         * @for UXC.Dialog
         */
        , hideMask:
            function(){
                var _mask = $('#UPanelMask'), _iframemask = $('#UPanelMaskIfrmae');
                if( _mask.length ) _mask.hide();
                if( _iframemask.length ) _iframemask.hide();
            }
        /**
         * 窗口改变大小时, 改变蒙板的大小,
         * <br />这个方法主要为了兼容 IE6
         * @method  _logic.setMaskSizeForIe6
         * @private
         * @for UXC.Dialog
         */
        , setMaskSizeForIe6:
            function(){
                var _mask = $('#UPanelMask'), _iframemask = $('#UPanelMaskIfrmae');
                if( !( _mask.length && _iframemask.length ) ) return;

                var _css = {
                    'position': 'absolute'
                    , 'top': '0px'
                    , 'left': $(document).scrollLeft() + 'px'
                    , 'height': $(document).height() + 'px'
                    , 'width': $(window).width()  + 'px'
                };

                _mask.css( _css );
                _iframemask.css( _css );
            }
        /**
         * 获取弹框的显示状态, 默认为0(成功)
         * @method  _logic.fixWidth
         * @for     UXC.Dialog
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
         * 修正弹框的默认显示宽度
         * @method  _logic.fixWidth
         * @for     UXC.Dialog
         * @private
         * @param   {string}    _msg    查显示的文本
         * @param   {UXC.Panel} _panel
         */
        , fixWidth:
            function( _msg, _panel ){
                var _tmp = $('<div class="UPanel_TMP" style="position:absolute; left:-9999px;top:-9999px;">' + _msg + '</div>').appendTo('body'), _w = _tmp.width() + 80;
                _w > _logic.maxWidth && ( _w = _logic.maxWidth );
                _w < _logic.minWidth && ( _w = _logic.minWidth );

                _panel.selector().css('width', _w);
            }
        /**
         * 保存会话弹框的所有默认模板
         * @property    _logic.tpls
         * @type        Object
         * @for         UXC.Dialog
         * @private
         */
        , tpls: {
            /**
             *  alert 会话弹框的默认模板
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
             *  confirm 会话弹框的默认模板
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
            /**
             *  会话弹框的蒙板模板
             *  @property   _logic.tpls.mask
             *  @type       string
             *  @private
             */
            , mask:
                [
                    '<div id="UPanelMask" class="UPanelMask"></div>'
                    , '<iframe src="about:blank" id="UPanelMaskIfrmae"'
                    , ' frameborder="0" class="UPanelMaskIframe"></iframe>'
                ].join('')
        }
    };

}(jQuery));
