;(function($){
    !window.UXC && (window.UXC = { log:function(){} });

    window.Tab = UXC.Tab = Tab;
    /**
     * Tab 菜单类
     * <br />DOM 加载完毕后
     * , 只要鼠标移动到具有识别符的Tab上面, Tab就会自动初始化, 目前可识别: <b>.js_autoTab</b>( CSS class )
     * <br />需要手动初始化, 请使用: var ins = new UXC.Tab( _tabSelector );
     * <p>
     *      <h2> Tab 容器的HTML属性 </h2>
     *      <br /><b>tablabels</b>: 声明 tab 标签的选择器语法
     *      <br /><b>tabcontainers</b>: 声明 tab 容器的选择器语法
     *      <br /><b>tabactiveclass</b>: 声明 tab当前标签的显示样式名, 默认为 cur
     *      <br /><b>tablabelparent</b>: 声明 tab的当前显示样式是在父节点, 默认为 tab label 节点
     *      <br /><b>tabactivecallback</b>: 当 tab label 被触发时的回调
     *      <br /><b>tabchangecallback</b>: 当 tab label 变更时的回调
     * </p>
     * <p><b>require</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/uxc_docs/classes/UXC.Tab.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Tab/_demo/' target='_blank'>demo link</a></p>
     * @namespace UXC
     * @class Tab
     * @constructor
     * @param   {selector|string}   _selector   要初始化的 Tab 选择器
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 75 Team
     * @date    2013-07-04
     * @example
            <link href='../../../comps/Tab/res/default/style.css' rel='stylesheet' />
            <script src="../../../lib.js"></script>
            <script>
                UXC.debug = 1;
                UXC.use( 'Tab' );

                httpRequire();

                function tabactive( _evt, _container, _tabIns ){
                    var _label = $(this);
                    UXC.log( 'tab ', _evt.type, _label.html(), new Date().getTime() );
                    if( UXC.Tab.isAjax( _label ) && ! UXC.Tab.isAjaxInited( _label ) ){
                        _container.html( '<h2>内容加载中...</h2>' );
                    }
                }

                function tabchange( _container, _tabIns ){
                    var _label = $(this);
                    UXC.log( 'tab change: ', _label.html(), new Date().getTime() );
                }

                $(document).ready( function(){
                    UXC.Tab.ajaxCallback =
                        function( _data, _label, _container ){
                            _data && ( _data = $.parseJSON( _data ) );
                            if( _data && _data.errorno === 0 ){
                                _container.html( printf( '<h2>UXC.Tab.ajaxCallback</h2>{0}', _data.data ) );
                            }else{
                                Tab.isAjaxInited( _label, 0 );
                                _container.html( '<h2>内容加载失败!</h2>' );
                            }
                        };
                });

                function ajaxcallback( _data, _label, _container ){
                    _data && ( _data = $.parseJSON( _data ) );
                    if( _data && _data.errorno === 0 ){
                        _container.html( printf( '<h2>label attr ajaxcallback</h2>{0}', _data.data ) );
                    }else{
                        Tab.isAjaxInited( _label, 0 );
                        _container.html( '<h2>内容加载失败!</h2>' );
                    }
                };
            </script>

            <dl class="def">
                <dt>UXC.Tab 示例 - 静态内容</dt>
                <dd>
                <div class="le-tabview js_autoTab" tablabels="ul.js_tabLabel > li > a" tabcontainers="div.js_tabContent > div" 
                                                    tabactiveclass="active" tablabelparent="li" 
                                                    tabactivecallback="tabactive" tabchangecallback="tabchange"
                                                    >
                        <ul class="le-tabs js_tabLabel">
                            <li class="active"><a href="javascript:">电视剧</a></li>
                            <li><a href="javascript:">电影</a></li>
                            <li><a href="javascript:">综艺</a></li>
                            <li><a href="javascript:">热点</a></li>
                        </ul>
                        <div class="views js_tabContent">
                            <div class="view-item active">1. 集地议送能拿距还杨雷火，永鲜提只风超洋轻绿动视落清各只江执口。</div>
                            <div class="view-item">2. 相送黄血富打万念却烟会华它表本雷烟形烟消卷效难标否标滑固小实。</div>
                            <div class="view-item">3. 理往局背剧养认被站推简沉形括於穿短，精白自没路绿往优八益是入。</div>
                            <div class="view-item">4. 鲁杆格滑那双来班五材实死听顶脱本续克修先课丝另乡型茶父报孔图。</div>
                        </div>
                    </div>
                </dd>
            </dl>

            <dl class="def">
                <dt>UXC.Tab 示例 - 动态内容 - AJAX</dt>
                <dd>
                <div class="le-tabview js_autoTab" tablabels="ul.js_tabLabel2 > li > a" tabcontainers="div.js_tabContent2 > div" 
                                                    tabactiveclass="active" tablabelparent="li" 
                                                    tabactivecallback="tabactive" tabchangecallback="tabchange"
                                                    >
                        <ul class="le-tabs js_tabLabel2">
                            <li class="active"><a href="javascript:">电视剧</a></li>
                            <li><a href="javascript:" tabajaxurl="data/test.php" tabajaxmethod="post" 
                                                      tabajaxdata="{a:1,b:2}" tabajaxcallback="ajaxcallback" >电影</a></li>
                            <li><a href="javascript:" tabajaxurl="data/test.php" tabajaxcallback="ajaxcallback" >综艺</a></li>
                            <li><a href="javascript:" tabajaxurl="data/test.php" >热点</a></li>
                        </ul>
                        <div class="views js_tabContent2">
                            <div class="view-item active">1. 集地议送能拿距还杨雷火，永鲜提只风超洋轻绿动视落清各只江执口。</div>
                            <div class="view-item"></div>
                            <div class="view-item"></div>
                            <div class="view-item"></div>
                        </div>
                    </div>
                </dd>
            </dl>
     */
    function Tab( _selector, _triggerTarget ){
        _selector && ( _selector = $( _selector ) );
        _triggerTarget && ( _triggerTarget = $( _triggerTarget) );
        if( Tab.getInstance( _selector ) ) return Tab.getInstance( _selector );

        this._model = new Model( _selector, _triggerTarget );
        this._view = new View( this._model );

        UXC.log( 'initing tab' );
        this._init();
    }

    Tab.autoInit = true;
    Tab.activeClass = 'cur';
    Tab.activeEvent = 'click';

    Tab.getInstance = 
        function( _selector, _setter ){
            var _r;
            _selector && ( _selector = $(_selector) ).length && (
                typeof _setter != 'undefined' && _selector.data('TabInstance', _setter)
                , _r =  _selector.data('TabInstance')
            );
            return _r;
        };

    Tab.ajaxCallback = null;
    Tab.ajaxRandom = true;
    Tab.isAjax =
        function( _label ){
            return $(_label).attr('tabajaxurl');
        };
    Tab.isAjaxInited =
        function( _label, _setter ){
            _setter != 'undefined' && ( $(_label).data('TabAjaxInited', _setter ) );
            return $(_label).data('TabAjaxInited');
        }

    Tab.prototype = {
        _init:
            function(){
                if( !this._model.layoutIsTab() ) return this;
                Tab.getInstance( this._model.layout(), this );
                this._view.init();

                var _triggerTarget = $(this._model.triggerTarget());
                _triggerTarget && _triggerTarget.length 
                && this._model.tablabel( _triggerTarget ) && _triggerTarget.trigger('click');

                return this;
            }    

        , active:
            function( _label ){
                var _ix;
                if( typeof _label == 'number' ) _ix = _label;
                else{
                    _label && $(_label).length && ( _ix = this._model.tabindex( _label ) );
                }

                typeof _ix != 'undefined' && ( this._view.active( _ix ) );
            }
    }
    
    function Model( _selector, _triggerTarget ){
        this._layout = _selector;
        this._triggerTarget = _triggerTarget;

        this._tablabels;
        this._tabcontainers;

        this.currentIndex;
        
        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                if( !this.layoutIsTab() ) return;
                var _p = this;
                this._tablabels = $( this.layout().attr('tablabels') );
                this._tabcontainers = $( this.layout().attr('tabcontainers') );

                this._tablabels.each( function(){ _p.tablabel( this, 1 ); } );
                this._tabcontainers.each( function(){ _p.tabcontent( this, 1 ); } );
                this._tablabels.each( function( _ix ){ _p.tabindex( this, _ix ); });

                return this;
            }

        , layout: function(){ return this._layout; }
        , tablabels: function( _ix ){ 
            if( typeof _ix != 'undefined' ) return $( this._tablabels[_ix] );
            return this._tablabels; 
        }
        , tabcontainers: function( _ix ){ 
            if( typeof _ix != 'undefined' ) return $( this._tabcontainers[_ix] );
            return this._tabcontainers; 
        }
        , triggerTarget: function(){ return this._triggerTarget; }
        , layoutIsTab: function(){ return this.layout().attr('tablabels') && this.layout().attr('tabcontainers'); }
        , activeClass: function(){ return this.layout().attr('tabactiveclass') || Tab.activeClass; }
        , activeEvent: function(){ return this.layout().attr('tabactiveevent') || Tab.activeEvent; }
        , tablabel: 
            function( _label, _setter ){
                _label && ( _label = $( _label ) );
                if( !( _label && _label.length ) ) return;
                typeof _setter != 'undefined' && _label.data( 'TabLabel', _setter );
                return _label.data( 'TabLabel' );
            }
        , tabcontent: 
            function( _content, _setter ){
                _content && ( _content = $( _content ) );
                if( !( _content && _content.length ) ) return;
                typeof _setter != 'undefined' && _content.data( 'TabContent', _setter );
                return _content.data( 'TabContent' );
            }
        , tabindex: 
            function( _label, _setter ){
                _label && ( _label = $( _label ) );
                if( !( _label && _label.length ) ) return;
                typeof _setter != 'undefined' && _label.data( 'TabIndex', _setter );
                return _label.data( 'TabIndex' );
            }
        , tabactivecallback:
            function(){
                var _r;
                this.layout().attr('tabactivecallback') && ( _r = window[ this.layout().attr('tabactivecallback') ] );
                return _r;
            }
        , tabchangecallback:
            function(){
                var _r;
                this.layout().attr('tabchangecallback') && ( _r = window[ this.layout().attr('tabchangecallback') ] );
                return _r;
            }
        , tablabelparent:
            function( _label ){
                var _tmp;
                this.layout().attr('tablabelparent') 
                    && ( _tmp = _label.parent( this.layout().attr('tablabelparent') ) ) 
                    && _tmp.length && ( _label = _tmp );
                return _label;
            }
        , tabajaxurl: function( _label ){ return _label.attr('tabajaxurl'); }
        , tabajaxmethod: function( _label ){ return (_label.attr('tabajaxmethod') || 'get').toLowerCase(); }
        , tabajaxdata: 
            function( _label ){ 
                var _r;
                _label.attr('tabajaxdata') && ( eval( '(_r = ' + _label.attr('tabajaxdata') + ')' ) );
                _r = _r || {};
                Tab.ajaxRandom && ( _r.rnd = new Date().getTime() );
                return _r;
            }
        , tabajaxcallback: 
            function( _label ){ 
                var _r = Tab.ajaxCallback, _tmp;
                _label.attr('tabajaxcallback') && ( _tmp = window[ _label.attr('tabajaxcallback') ] ) && ( _r = _tmp );
                return _r;
            }
    };
    
    function View( _model ){
        this._model = _model;
    }
    
    View.prototype = {
        init:
            function() {
                UXC.log( 'Tab.View:', new Date().getTime() );
                var _p = this;
                this._model.tablabels().on( this._model.activeEvent(), function( _evt ){
                    var _sp = $(this), _r;
                    if( typeof _p._model.currentIndex !== 'undefined' 
                        && _p._model.currentIndex === _p._model.tabindex( _sp ) ) return;
                    _p._model.currentIndex = _p._model.tabindex( _sp );

                    _p._model.tabactivecallback() 
                        && ( _r = _p._model.tabactivecallback().call( this, _evt, _p._model.tabcontainers( _p._model.currentIndex ), _p ) );
                    if( _r === false ) return;
                    _p.active( _p._model.tabindex( _sp ) );
                });

                return this;
            }

        , active:
            function( _ix ){
                if( typeof _ix == 'undefined' ) return;
                var _p = this, _r, _activeClass = _p._model.activeClass(), _activeItem = _p._model.tablabels( _ix );
                _p._model.tablabels().each( function(){
                    _p._model.tablabelparent( $(this) ).removeClass( _activeClass );
                });
                _activeItem = _p._model.tablabelparent( _activeItem );
                _activeItem.addClass( _activeClass );

                _p._model.tabcontainers().hide();
                _p._model.tabcontainers( _ix ).show();

                _p._model.tabchangecallback() 
                    && ( _r = _p._model.tabchangecallback().call( _p._model.tablabels( _ix ), _p._model.tabcontainers( _ix ), _p ) );
                if( _r === false ) return;

                _p.activeAjax( _ix );
            }

        , activeAjax:
            function( _ix ){
                var _p = this, _label = _p._model.tablabels( _ix );
                if( !Tab.isAjax( _label ) ) return;
                if( Tab.isAjaxInited( _label ) ) return;
                var _url = _p._model.tabajaxurl( _label );
                if( !_url ) return;

                UXC.log( _p._model.tabajaxmethod( _label )
                        , _p._model.tabajaxdata( _label )
                        , _p._model.tabajaxcallback( _label )
                        );

                Tab.isAjaxInited( _label, 1 );
                $[ _p._model.tabajaxmethod( _label ) ]( _url, _p._model.tabajaxdata( _label ), function( _r, _textStatus, _jqXHR ){

                     _p._model.tabajaxcallback( _label ) 
                        && _p._model.tabajaxcallback( _label )( _r, _label, _p._model.tabcontainers( _ix ), _p, _textStatus, _jqXHR );

                    !_p._model.tabajaxcallback( _label ) && _p._model.tabcontainers( _ix ).html( _r );
                });
            }
    };

    $(document).delegate( '.js_autoTab', 'mouseover', function( _evt ){
        if( !Tab.autoInit ) return;
        var _p = $(this), _tab, _src = _evt.target || _evt.srcElement;
        if( Tab.getInstance( _p ) ) return;
        _src && ( _src = $(_src) );
        UXC.log( new Date().getTime(), _src.prop('nodeName') );
        _tab = new Tab( _p, _src );
    });

}(jQuery));
