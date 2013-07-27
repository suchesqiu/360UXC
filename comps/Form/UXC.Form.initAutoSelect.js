 ;(function($){
    /**
     * 初始化 级联下拉框
     * <br />只要引用本脚本, 页面加载完毕时就会自动初始化级联下拉框功能
     * <br /><br />动态添加的 DOM 需要显式调用 AutoSelect( domSelector ) 进行初始化
     * <br /><br />要使页面上的级联下拉框功能能够自动初始化, 需要在select标签上加入一些HTML 属性
     * <br /><b>defaultselect</b>: none, 该属性声明这是级联下拉框的第一个下拉框, <b>这是必填项,初始化时以这个为入口</b>
     * <br /><b>selectvalue</b>: string, 下拉框的默认选中值
     * <br /><b>selecturl</b>: string, 下拉框的数据请求接口, 符号 {0} 代表下拉框值的占位符
     * <br /><b>selecttarget</b>: selector, 下一级下拉框的选择器语法
     * <br /><b>defaultoption</b>: none, 声明默认 option 选项, 更新option时, 有该属性的项不会被清除
     * <p>
     *      数据格式: [ [id, name], [id, name] ... ]
     *      <br /> 如果获取到的数据格式不是默认格式,
     *      可以通过 <a href='UXC.Form.html#property_initAutoSelect.dataFilter'>AutoSelect.dataFilter</a> 属性自定义函数, 进行数据过滤
     * </p>
     * @method  initAutoSelect
     * @static
     * @for UXC.Form
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @date    2013-06-11
     * @param   {selector}  _selector   要初始化的级联下拉框父级节点
     * @example
        <h2>AJAX 返回内容</h2>
        <code>
            <dd>    
                <select name='select102_1' defaultselect selecturl="data/shengshi_with_error_code.php?id=0" selecttarget="select[name=select102_2]">
                    <option value="-1" defaultoption>请选择</option>
                </select>
                <select name='select102_2' selecturl="data/shengshi_with_error_code.php?id={0}" selecttarget="select[name=select102_3]">
                    <option value="-1" defaultoption>请选择</option>
                </select>
                <select name='select102_3' selecturl="data/shengshi_with_error_code.php?id={0}">
                    <option value="-1" defaultoption>请选择</option>
                </select>
            </dd>
        </code>
        <script>
            $.get( './data/shengshi_html.php?rnd='+new Date().getTime(), function( _r ){
                var _selector = $(_r);
                $( 'dl.def > dt' ).after( _selector );
                AutoSelect( _selector );
            });

            AutoSelect.dataFilter = 
                function( _data, _select ){
                    var _r = _data;
                    if( _data && !_data.length && _data.data ){
                        _r = _data.data;
                    }
                    return _r;
                };
        </script>
     */
    UXC.Form.initAutoSelect = AutoSelect;

    function AutoSelect( _selector ){
        var _ins = [];
        _selector && ( _selector = $(_selector) );

        if( AutoSelect.isSelect( _selector ) ){
            _ins.push( new Control( _selector ) );
        }else if( _selector && _selector.length ){
            _selector.find( 'select[defaultselect]' ).each( function(){
                _ins.push( new Control( $(this ) ));
            });
        }
        return _ins;
    }
    var AutoSelectProp = {
        isSelect: 
            function( _selector ){
                var _r;
                _selector 
                    && ( _selector = $(_selector) ) 
                    && _selector.is( 'select' ) 
                    && _selector.is( '[defaultselect]' )
                    && ( _r = true );
                return _r;
            }

         /**
         * 是否自动隐藏空值的级联下拉框, 起始下拉框不会被隐藏
         * @property    initAutoSelect.hideEmpty
         * @type    bool
         * @default false
         * @static
         * @example
                AutoSelect.hideEmpty = true;
         */
        , hideEmpty: false
        /**
         * 级联下拉框的数据过滤函数
         * <br />默认数据格式: [ [id, name], [id, name] ... ]
         * <br />如果获取到的数据格式非默认格式, 可通过本函数进行数据过滤
         * <p><b>注意, 这个是全局过滤, 如果要使用该函数进行数据过滤, 判断逻辑需要比较具体</b></p>
         * @property    initAutoSelect.dataFilter
         * @type    function
         * @default undefined
         * @static
         * @example
                 AutoSelect.dataFilter = 
                    function( _data, _select ){
                        var _r = _data;
                        if( _data && !_data.length && _data.data ){
                            _r = _data.data;
                        }
                        return _r;
                    };
         */
        , dataFilter: null

        , initedCallback: null
        , initedDoneCallback: null
        , AllDoneCallback: null

        , processUrlCallback: null

        , triggerInitChange: false
        , randomurl: false

        , getInstance:
            function( _selector, _ins ){
                var _r;
                _selector 
                    && ( _selector = $( _selector ) ) 
                    && ( typeof _ins != 'undefined' && _selector.data('SelectIns', _ins )
                            , _r = _selector.data('SelectIns') );
                return _r;
            }
    };
    for( var k in AutoSelectProp ) AutoSelect[k] = AutoSelectProp[k];

    function Control( _selector ){
        this._model = new Model( _selector );
        this._view = new View( this._model, this );

        this._init();
    }

    Control.prototype = {
        _init:
            function(){
                var _p = this;

                $.each( _p._model.items(), function( _ix, _item ){
                    AutoSelect.getInstance( $(_item), _p );
                });

                _p._model.initedcb() && _p.on('SelectInited', _p._model.initedcb() );

                _p.trigger('SelectInited');

                _p.on('SelectInitedDone', function(){
                    var _tmp = _p._model.first();
                    while( _p._model.next( _tmp ) ){
                        _tmp.on( 'change', _p._responeChange );
                        _tmp = _p._model.next( _tmp );
                    }
                });
                
                _p._update( _p._model.first(), _p._firstInitCb );
                
                return _p;
            }    

        , _responeChange:
            function( _evt ){
                var _sp = $(this)
                    , _p = AutoSelect.getInstance( _sp )
                    , _next = _p._model.next( _sp );
                    ;
                UXC.log( '_responeChange:', _sp.attr('name'), _sp.val() );

                if( !( _next&& _next.length ) ){
                    _p.trigger( 'SelectChange' );
                }else{
                    _p._update( _next, _p._changeCb, _sp.val() );
                }
            }

        , _changeCb:
            function( _selector, _data ){
                var _p = this
                    , _next = _p._model.next( _selector );
                ;

                if( _p._model.isLast( _selector ) ){
                    _p.trigger( 'SelectAllChange' );
                }else{
                    _p.trigger( 'SelectChange' );
                }

                if( _next && _next.length ){
                    UXC.log( '_changeCb:', _selector.val(), _next.attr('name'), _selector.attr('name') );
                    _p._update( _next, _p._firstInitCb, _selector.val() );
                }
                return this;
            }

        , _firstInitCb:
            function( _selector, _data ){
                var _p = this
                    , _next = _p._model.next( _selector );
                ;

                AutoSelect.triggerInitChange && _selector.trigger('change');

                if( _p._model.isLast( _selector ) ){
                    _p.trigger( 'SelectInitedDone' );
                    _p.trigger( 'SelectAllChange' );
                }else{
                    _p.trigger( 'SelectChange' );
                }

                if( _next && _next.length ){
                    UXC.log( '_firstInitCb:', _selector.val(), _next.attr('name'), _selector.attr('name') );
                    _p._update( _next, _p._firstInitCb, _selector.val() );
                }

                return this;
            }

        , on:
            function( _evt, _cb ){
                $(this).on( _evt, _cb );
                return this;
            }

        , trigger:
            function( _evt, _args ){
                $(this).trigger( _evt, _args );
                return this;
            }

        , _update:
            function( _selector, _cb, _pid ){
                if( this._model.isStatic( _selector ) ){
                    this._updateStatic( _selector, _cb, _pid );
                }else if( this._model.isAjax( _selector ) ){
                    this._updateAjax( _selector, _cb, _pid );
                }else{
                    this._updateNormal( _selector, _cb, _pid );
                }
                return this;
            }

        , _updateStatic:
            function( _selector, _cb, _pid ){
                var _p = this, _data;
                UXC.log( 'static select' );
                if( _p._model.isFirst( _selector ) ){
                    typeof _pid == 'undefined' && ( _pid = _p._model.selectparentid( _selector ) || '' );
                    if( typeof _pid != 'undefined' ){
                        _data = _p._model.selectdatacb( _selector )( _pid );
                    }
                }else{
                    _data = _p._model.selectdatacb( _selector )( _pid );
                }
                _p._view.update( _selector, _data );
                _cb && _cb.call( _p, _selector, _data );
                return this;
            }

        , _updateAjax:
            function( _selector, _cb, _pid ){
                var _p = this, _data, _next = _p._model.next( _selector ), _url;
                UXC.log( 'ajax select' );
                //if( !( _next && _next.length ) ) return this;

                if( _p._model.isFirst( _selector ) ){
                    typeof _pid == 'undefined' && ( _pid = _p._model.selectparentid( _selector ) || '' );
                    if( typeof _pid != 'undefined' ){
                        _url = _p._model.selecturl( _selector, _pid );
                        $.get( _url, function( _data ){
                            _data = $.parseJSON( _data );
                            _p._view.update( _selector, _data );
                            _cb && _cb.call( _p, _selector, _data );
                        });
                    }
                }else{
                   _url = _p._model.selecturl( _selector, _pid );
                    $.get( _url, function( _data ){
                        UXC.log( '_url:', _url, _pid );
                        _data = $.parseJSON( _data );
                        _p._view.update( _selector, _data );
                        _cb && _cb.call( _p, _selector, _data );
                    });
                }
                return this;
            }

        , _updateNormal:
            function( _selector, _cb, _pid ){
               var _p = this, _data;
                UXC.log( 'normal select' );
                if( _p._model.isFirst( _selector ) ){
                    var _next = _p._model.next( _selector );
                    if( _next && _next.length ){
                        _p._update( _next, _cb, _selector.val() );
                        return this;
                    }
                }else{
                    _data = _p._model.selectdatacb( _selector )( _pid );
                }
                _p._view.update( _selector, _data );
                _cb && _cb.call( _p, _selector, _data );
                return this;
            }
    }
    
    function Model( _selector ){
        this._selector = _selector;
        this._items = [];

        this._init();
    }
    
    Model.prototype = {
        _init:
            function(){
                this._findAllItems( this._selector );
                UXC.log( 'select items.length:', this._items.length );
                this._initRelationship();
                return this;
            }

        , _findAllItems:
            function( _selector ){
                this._items.push( _selector );
                if( _selector.is( '[selecttarget]' ) ) 
                    this._findAllItems( $( _selector.attr('selecttarget') ) );
            }

        , _initRelationship:
            function(){
                this._selector.data( 'FirstSelect', true );
                if( this._items.length > 1 ){
                    this._items[ this._items.length - 1 ].data('LastSelect', true);
                    for( var i = 0; i < this._items.length; i ++ ){
                        var item = this._items[i]
                            , preItem = this._items[i-1];
                            ;
                        if( preItem ){
                            item.data('PrevSelect', preItem);
                            preItem.data('NextSelect', item );
                        }
                    }
                }
            }

        , items: function(){ return this._items; }

        , first:
            function(){
                return this._items[0];
            }

        , last:
            function(){
                return this._items[ this._items -1 ];
            }

        , next:
            function( _selector ){
                return _selector.data('NextSelect');
            }

        , prev:
            function( _selector ){
                return _selector.data('PrevSelect');
            }

        , isFirst:
            function( _selector ){
                return !!_selector.data('FirstSelect');
            }

        , isLast:
            function( _selector ){
                return !!_selector.data('LastSelect');
            }

        , isStatic:
            function( _selector ){
                return _selector.is('[selectdatacb]');
            }

        , isAjax:
            function( _selector ){
                return _selector.is('[selecturl]');
            }

        , initedcb:
            function(){
                var _r;
                this.first().attr('selectinitedcb') 
                    && ( _r = window[ this.first().attr('selectinitedcb') ] )
                    ;
                return _r;
            }

        , selectdatacb:
            function( _selector ){
                var _r;
                _selector.attr('selectdatacb') 
                    && ( _r = window[ _selector.attr('selectdatacb') ] )
                    ;
                return _r;
            }

        , selectparentid:
            function( _selector ){
                var _r;
                _selector.attr('selectparentid') 
                    && ( _r = _selector.attr('selectparentid') )
                    ;
                _selector.removeAttr( 'selectparentid' );
                return _r || '';
            }

        , selectvalue:
            function( _selector ){
                var _r = _selector.attr('selectvalue');
                _selector.removeAttr( 'selectvalue' );
                return _r || '';
            }

        , randomurl:
            function( _selector ){
                var _r = AutoSelect.randomurl;
                _selector.is('[selectrandomurl]')
                    && ( _r = parseBool( _selector.attr('selectrandomurl') ) )
                    ;
                return _r;
            }

        , selecturl:
            function( _selector, _pid ){
                var _cb = AutoSelect.processUrlCallback, _r = _selector.attr('selecturl') || '';
                    _selector.attr('selectprocessurlcb') 
                        && window[ _selector.attr('selectprocessurlcb' ) ]
                        && ( _cb = window[ _selector.attr('selectprocessurlcb' ) ] )
                        ;
                    _r = printf( _r, _pid );
                    this.randomurl( _selector ) && ( _r = add_url_params( _r, {'rnd': new Date().getTime() } ) );
                    _cb && ( _r = _cb( _r, _pid ) );
                return _r;
            }

        , _userdatafilter:
            function( _selector ){
                var _r;
                _selector.attr('selectdatafilter') 
                    && ( _r = window[ _selector.attr('selectdatafilter') ] )
                    ;
                return _r;
            }

        , dataFilter:
            function( _selector, _data ){
                var _filter = this._userdatafilter( _selector ) || AutoSelect.dataFilter;
                _filter && ( _data = _filter( _data ) );
                return _data;
            }
    };
    
    function View( _model, _control ){
        this._model = _model;
        this._control = _control;

        this._init();
    }
    
    View.prototype = {
        _init:
            function() {
                return this;
            }

        , update:
            function( _selector, _data ){
                var _default = this._model.selectvalue( _selector );
                _data = this._model.dataFilter( _selector, _data );
                _selector.data('SelectData', _data );
                
                this._control.trigger( 'beforeupdate', [ _selector, _data ] );
                this._removeExists( _selector );

                var _html = [], _tmp, _selected;
                for( var i = 0, j = _data.length; i < j; i++ ){
                    _tmp = _data[i];
                    _html.push( printf( '<option value="{0}" {2}>{1}</option>', _tmp[0], _tmp[1], _selected ) );
                }
                $( _html.join('') ).appendTo( _selector );

                if( hasVal( _selector, _default ) ){
                    _selector.val( _default );
                }
            }

        , _removeExists:
            function( _selector ){
                _selector.find('> option:not([defaultoption])').remove();
            }
        
    };

    /**
     * 下拉框改变选项时的响应函数
     * @method  initAutoSelect.changeEvent
     * @private
     * @static
     * @param   {event}   _evt  dom event
     */
    function changeEvent( _evt ){
        var _p = $(this), _val;
        UXC.log( _p.prop( 'name' ) );

        if( _p.is('[selectvalue]') ){
            _val = $.trim( _p.attr('selectvalue') );
            _p.removeAttr( 'selectvalue' );
            UXC.log( 1, '_val', _val );
            if( hasVal( _p, _val ) ){
                UXC.log( 1, 1 );
                _p.val( _val );
                var _selectval = _val;
                if( _p.is( '[selecttarget]' ) ){
                    var _target = $(_p.attr('selecttarget'));
                    if( _target.is( '[selectvalue]' ) ){
                        _selectval = _target.attr('selectvalue');
                        _target.removeAttr('selectvalue');
                    }
                    var  _reqval = _val, _url;
                    if( _target.attr('selectdatacb') ){
                        window[ _target.attr('selectdatacb') ] 
                            && processData( _target, _selectval, triggerChange
                                    , window[ _target.attr('selectdatacb') ]( getParentId( _target ) ) );
                    }else if( _target.attr('selecturl') ){
                        _url = add_url_params( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                        if( _target.data('parentSelect') ){
                            _reqval = _target.data('parentSelect').val();
                        }
                        _url = _url.replace( /\{0\}/g, _reqval );

                        getData( _target, _url, _selectval, triggerChange);
                    }
                }
            }else{
                UXC.log( 1, 2 );
                var _reqval = _val, _url;
                    _p.data('parentSelect') && ( _reqval = _p.data('parentSelect').val() );

                function cb_1_2( _select ){
                    if( _select.is( '[selecttarget]' ) ){
                        var _target = $(_select.attr('selecttarget'));
                        if( _target.is( '[selectvalue]' ) ){
                            _val = _target.attr('selectvalue');
                            _target.removeAttr('selectvalue');
                        }else _val = '';
                        var _reqval = _val, _url;

                        if( _target.attr('selectdatacb') ){
                            window[ _target.attr('selectdatacb') ] 
                                && processData( _target, _val, triggerChange, 
                                        window[ _target.attr('selectdatacb') ]( getParentId( _target ) ) );
                        }else if( _target.is( '[selecturl]' ) ){
                            _url = add_url_params( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                            if( _target.data('parentSelect') ){
                                _reqval = _target.data('parentSelect').val();
                            }
                            _url = _url.replace( /\{0\}/g, _reqval );

                            getData( _target, _url, _val, triggerChange);
                        }
                    }
                }

                if( _p.attr('selectdatacb') ){
                    window[ _p.attr('selectdatacb') ] 
                        && processData( _p, _val, cb_1_2
                                , window[ _p.attr('selectdatacb') ]( getParentId( _p ) ) );
                }else if( _p.attr('selecturl') ){
                    _url = add_url_params( _p.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                    if( _p.data('parentSelect') ){
                        _reqval = _p.data('parentSelect').val();
                    }
                    _url = _url.replace( /\{0\}/g, _reqval );
                    getData( _p, _url, _val, cb_1_2 );
                }
            }
        }else{
            _val = _p.val();
            UXC.log( 2, '_val', _val );
            if( hasItem( _p ) ){
                UXC.log( 2, 1 );
                if( _p.is( '[selecttarget]' ) ){
                    UXC.log( 2, 1, 1 );
                    var _target = $( _p.attr('selecttarget') );
                    var _selectval = '';
                    if( _target.is( '[selectvalue]' ) ){
                        _selectval = _target.attr('selectvalue');
                        _target.removeAttr('selectvalue');
                    }
                    var _reqval = _val, _url;

                    if( _target.attr('selectdatacb') ){
                        window[ _target.attr('selectdatacb') ] 
                            && processData( _target, _selectval, triggerChange, 
                                    window[ _target.attr('selectdatacb') ]( getParentId( _target ) ) );
                    }else if( _target.is( '[selecturl]' ) ){
                        UXC.log( 2, 1, 1, 1, _selectval );
                        _url = add_url_params( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );

                        if( _target.data('parentSelect') ){
                            _reqval = _target.data('parentSelect').val();
                        }
                        _url = _url.replace( /\{0\}/g, _reqval );

                        getData( _target, _url, _selectval, triggerChange);
                    }
                }else{
                    UXC.log( 2, 1, 2 );
                    var _target = _p, _reqval = _val, _url;
                    if( _target.data('parentSelect') ){
                        _reqval = _target.data('parentSelect').val();
                    }
                    /**
                     * 如果是最后一个SELECT, 那么取消数据请求
                     */
                    if( _target.data('isLastSelect') ){
                        if( ( parseInt( _reqval ) || 0 ) < 1 ){
                            //removeOption( _target );
                            //AutoSelect.hideEmpty && _target.hide();
                        }
                       //return;
                    }

                    if( _target.attr('selectdatacb') ){
                        if( _target.data('isLastSelect') && _target.data('parentSelect').val() == _reqval ){
                            return;
                        }
                        window[ _target.attr('selectdatacb') ] 
                            && processData( _target, _val, triggerChange, 
                                    window[ _target.attr('selectdatacb') ]( getParentId( _target ) ) );
                    }else if( _target.is( '[selecturl]' ) ){
                        _url = add_url_params( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                        UXC.log( _reqval );
                        _url = _url.replace( /\{0\}/g, _reqval );
                        if( _target.data('isLastSelect') && _target.data('parentSelect').val() == _reqval ){
                            return;
                        }
                        getData( _target, _url, _val, triggerChange);
                    }
                }
            }else{
                UXC.log( 2, 2 );
                var _val = '', _url;
                    _p.data('parentSelect') && ( _val = _p.data('parentSelect').val() );

                if( _p.attr('selectdatacb') ){
                    window[ _p.attr('selectdatacb') ] 
                        && processData( _p, _val, triggerChange
                                , window[ _p.attr('selectdatacb') ]( getParentId( _p ) ) );
                }else if( _p.attr('selecturl') ){
                    _url = add_url_params( _p.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                    _url = _url.replace( /\{0\}/g, _val );

                    if( !_p.data('isFirstSelect') && ( (parseInt( _val, 10 ) || 0) < 1 ) ){
                        removeOption( _p );
                        triggerChange( _p );
                        AutoSelect.hideEmpty && _p.hide();
                    }else getData( _p, _url, _val, triggerChange );
                }

            }
        }
    }//end changeEvent


    /**
     * 获取 select 的父ID, 这个方便就用于静态数据的联动框
     * @method  initAutoSelect.getParentId
     * @private 
     * @static
     * @param   {selector}  _select     下拉框的选择器对象
     */
    function getParentId( _select ){
        var _r = '';
        if( _select.attr('selectparentid') ){
            _r = _select.attr('selectparentid');
        }else if( _select.data('parentSelect') ) {
            _r = _select.data('parentSelect').val();
        }
        return _r;
    }
    /** 
     * 触发下一级下拉框的change事件
     * @method  initAutoSelect.triggerChange
     * @private 
     * @static
     * @param   {selector}  _select     下拉框的选择器对象
     */
    function triggerChange( _select ){
        if( _select.is( '[selecttarget]' )  ){
            $( _select.attr('selecttarget') ).trigger('change');
        } 
    }
    /**
     * AJAX请求数据, 并处理结果
     * @method      initAutoSelect.getData
     * @private
     * @static
     * @param   {selector}  _select     下拉框的选择器对象
     * @param   {string}    _url        请求数据的URL接口
     * @param   {string}    _selectval  默认选中值
     * @param   {function}  _callback   结果处理完毕后的回调函数
     */
    function getData( _select, _url, _selectval, _callback ){
        $.getJSON( _url, function( _r ){
            processData( _select, _selectval, _callback, _r );
        });
    }
    /**
     * 处理数据结果
     * @method      initAutoSelect.processData
     * @private
     * @static
     * @param   {selector}  _select     下拉框的选择器对象
     * @param   {string}    _selectval  默认选中值
     * @param   {function}  _callback   结果处理完毕后的回调函数
     * @param   {array}     _r          select 数据
     */
    function processData( _select, _selectval, _callback, _r ){
        if( AutoSelect.dataFilter ){
            _r = AutoSelect.dataFilter( _r, _select );
        }
        if( !_r ) return;
        removeOption( _select );

        if( AutoSelect.hideEmpty ){
            !_r.length && _select.hide();
            _r.length && _select.show();
        }

        var _optls = [];

        if( _select.attr('selectcustomrendercb') ){
            _optls = window[ _select.attr('selectcustomrendercb') ].call( _select, _r );
        }else{
            for( var i = 0, j = _r.length; i < j; i++ )
                _optls.push( '<option value="'+_r[i][0]+'">'+ _r[i][1] +'</option>' );
        }

        $( _optls.join('') ).appendTo( _select );
        hasVal( _select, _selectval ) ? _select.val( _selectval ) : selectFirst( _select );
        _callback && _callback( _select );
    }
    /**
     * 判断下拉框是否为空
     * <br />带 defaultoption 属性的 option 判断时被忽略
     * @method  initAutoSelect.isEmpty
     * @private
     * @static
     * @param   {selector}  _select
     */
    function isEmpty( _select ){
        var _r = true;
        _select.find('option').each( function(){
            var _tmp = $(this);
            if( !_tmp.is( '[defaultoption]' ) ){
                return _r = false;
            }
        });
        return _r;
    }
    /**
     * 选中下拉框的第一个option
     * @method  initAutoSelect.selectFirst
     * @private
     * @static  
     * @param   {selector}  _select
     */
    function selectFirst( _select ){
        var _ls = _select.find('option');
        if( _ls.length ){
            _select.val( _ls.first().val() );
        }
    }
    /**
     * 清空下拉框的内容
     * <br />带 defaultoption 属性的 option 判断时被忽略
     * @method  initAutoSelect.removeOption
     * @private
     * @static
     * @param   {selector}  _select
     */
    function removeOption( _select ){
        var _ls = _select.find('option');
        for( var i = _ls.length - 1; i >= 0; i-- ){
            var _item = $(_ls[i]);
            if( _item.is( '[defaultoption]' ) ) continue;
            _item.remove();
        }
    }
    /**
     * 判断下拉框的option里是否有给定的值
     * @method  initAutoSelect.hasVal
     * @private
     * @static
     * @param   {selector}  _select
     * @param   {string}    _val    要查找的值
     */
    function hasVal( _select, _val ){
        var _r = false, _val = _val.toString();
        _select.find('option').each( function(){
            var _tmp = $(this);
            if( _tmp.val() == _val ){
                _r = true;
                return false;
            }
        });
        return _r;
    }
    /**
     * 判断下拉框是否有数据项
     * <br />带 defaultoption 属性的 option 判断时被忽略
     * @method  initAutoSelect.hasItem
     * @private
     * @static
     * @param   {selector}  _select
     */
    function hasItem( _select ){
        var _r = false;
        _select.find('option').each( function(){
            var _tmp = $(this);
            if( _tmp.is( '[defaultoption]' ) ) return;
            _r = true;
            return false;
        });
        return _r;
    }
    /**
     * 取得某一类级联下拉框的所有下拉框
     * @method  initAutoSelect.getSelectList
     * @private
     * @static
     * @param   {selector}  _select     调用时, _select 为起始下拉框, 带 defaultselect 属性
     * @param   {array}     _ar         返回结果, 该参数不需要显示赋予
     */
    function getSelectList( _select, _ar ){
        _select = $(_select);
        if( !_ar ){
            _ar =[ _select ];
            arguments.callee( _select, _ar );
        }else if( _select.length && _select.is( '[selecttarget]' ) ){
            var _target = $(_select.attr('selecttarget'));
            if( _target.length ){
                _target.data( 'parentSelect', _ar[ _ar.length - 1 ] );
                _ar.push( _target );
                arguments.callee( _target, _ar );
            }
        }
        return _ar;
    }
    /**
     * 页面加载完毕时, 延时进行自动化, 延时可以避免来自其他逻辑的干扰
     */
    $(document).ready( function( _evt ){
        setTimeout( function(){ AutoSelect( document ); }, 100 );
    });

}(jQuery));

