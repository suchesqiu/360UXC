;(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    /**
     * 表单常用功能类 UXC.Form
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/uxc_docs/classes/UXC.Form.html' target='_blank'>API docs</a>
     * | <a href='../../comps/Form/_demo' target='_blank'>demo link</a></p>
     * @namespace UXC
     * @class Form
     * @static
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @date    2013-06-11
     */
    window.UXCForm = UXC.Form = {
        /**
         * 禁用按钮一定时间, 默认为1秒
         * @method  disableButton
         * @static
         * @param   {selector}  _selector   要禁用button的选择器
         * @param   {int}       _durationMs 禁用多少时间, 单位毫秒, 默认1秒
         */
        'disableButton':
            function( _selector, _durationMs ){
                if( !_selector ) return;
                _selector = $(_selector);
                _durationMs = _durationMs || 1000;
                _selector.attr('disabled', true);
                setTimeout( function(){
                    _selector.attr('disabled', false);
                }, _durationMs);
            }
    };
}(jQuery));

 ;(function($){
    /**
     * 初始化 checkbox 全选反选功能
     * <br />只要引用本脚本, 页面加载完毕时就会自动初始化全选反选功能
     * <br /><br />动态添加的 DOM 需要显式调用 UXC.Form.initCheckAll( domSelector ) 进行初始化
     * <br /><br />要使页面上的全选反选功能能够自动初始化, 需要在全选反选按钮上加入一些HTML 属性
     * <br /><b>checktype</b>: all | inverse, all=全选/全不选, inverse=反选
     * <br /><b>checkfor</b>: selector, 要全选/反选的 checkbox 选择器语法
     * <br /><b>checkall</b>: selector, 全选按钮的选择器, 这个只有反选按钮需要, 反选时变更全选按钮的状态
     * @method  initCheckAll
     * @static
     * @for UXC.Form
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @date    2013-06-11
     * @param   {selector}  _selector   要初始化的全选反选的父级节点
     * @example
            <h2>AJAX data:</h2>
            <dl class="def example24">
                <dt>checkall example 24</dt>
                <dd>
                <input type="checkbox" id="checkall24" checktype="all" checkfor="dl.example24 input[type=checkbox]"><label for="checkall24">全选</label>
                <input type="checkbox" id="checkall24_inverse" checktype="inverse" checkfor="dl.example24 input[type=checkbox]" checkall="dl.example24 input[checktype=all]"><label for="checkall24_inverse">反选</label>
                </dd>
                <dd>
                <input type="checkbox" id="checkall24_1" value="" name="" checked />
                <label for="checkall24_1">checkall24_1</label>
                <input type="checkbox" id="checkall24_2" value="" name="" checked />
                <label for="checkall24_2">checkall24_2</label>
                <input type="checkbox" id="checkall24_3" value="" name="" checked />
                <label for="checkall24_3">checkall24_3</label>
                <input type="checkbox" id="checkall24_4" value="" name="" checked />
                <label for="checkall24_4">checkall24_4</label>
                <input type="checkbox" id="checkall24_5" value="" name="" checked />
                <label for="checkall24_5">checkall24_5</label>
                </dd>
            </dl>

            <script>
            $(document).delegate( 'button.js_ajaxTest', 'click', function(){
                var _p = $(this);
                _p.prop('disabled', true);
                setTimeout( function(){ _p.prop('disabled', false); }, 1000 );

                $.get( './data/initCheckAll.php?rnd='+new Date().getTime(), function( _r ){
                    var _selector = $(_r);
                    $( $( 'body' ).children().first() ).before( _selector );
                    UXC.Form.initCheckAll( _selector );
                });
            });
            </script>
     */
    UXC.Form.initCheckAll = 
        function( _selector ){
            _selector = $( _selector );
            var _ls = _selector.find( 'input[type=checkbox][checktype][checkfor]' );
            _ls.each( function(){
                var _p = $(this)
                    , _type = _p.attr('checktype').toLowerCase()
                    , _for = _p.attr('checkfor');
                if( _type != 'all' || !_for ) return;
                fixCheckAllStatus( _p, _for );

                if( !_p.data('initedCheckall') ){
                    _p.data('initedCheckall', true);
                    $(document).delegate( _for, 'click', function( _evt ){
                        var _sp = $(this);
                        if( isControler( _sp ) ) return;
                        fixCheckAllStatus( _p, _for );
                    });
                }
            });
        };

    $(document).ready( function( _evt ){
        UXC.Form.initCheckAll( $(document) );
    });
    /**
     * 监听 全选/反选 按钮的点击事件
     */
    $(document).delegate( 'input[type=checkbox][checktype][checkfor]', 'click', function( _evt ){
        var _p = $(this)
            , _type = _p.attr('checktype').toLowerCase()
            , _for = _p.attr('checkfor');
            UXC.log( _type, _for );

        switch( _type ){
            case 'all':
                {
                    $(_for).each( function(){
                        var _sp = $(this);
                        if( isControler( _sp ) ) return;
                        _p.prop('checked') && _sp.prop('checked', true);
                        !_p.prop('checked') && _sp.prop('checked', false);
                        
                    });
                    break;
                }

            case 'inverse':
                {
                    $(_for).each( function(){
                        var _sp = $(this);
                        if( isControler( _sp ) ) return;
                        if( _sp.prop('checked') ) _sp.prop('checked', false);
                        else _sp.prop('checked', true);
                    });

                    if( _p.is('[checkall]') ) fixCheckAllStatus( _p.attr('checkall'), _for );
                    break;
                }
        }
    });
    /**
     * 判断 input 是否为 全选反选 按钮
     */
    function isControler( _selector ){
        _selector = $( _selector );
        return _selector.is( '[checktype]' ) && _selector.is( '[checkfor]');
    }
    /**
     * input 改变状态时, 全选按钮也改为正确的状态
     */
    function fixCheckAllStatus( _all, _for ){
        var _isAll = true, _all = $(_all), _for = $(_for);
        _for.each( function(){
            var _sp = $(this);
            if( _sp.is( '[checktype]' ) || _sp.is( '[checkfor]') ) return;
            if( !_sp.prop('checked') ) return _isAll = false;
        });
        UXC.log( '_isAll: ', _isAll );
        _all && _all.length && _all.prop( 'checked', _isAll );
    }
}(jQuery));

 ;(function($){
    /**
     * 初始化 级联下拉框
     * <br />只要引用本脚本, 页面加载完毕时就会自动初始化级联下拉框功能
     * <br /><br />动态添加的 DOM 需要显式调用 UXC.Form.initAutoSelect( domSelector ) 进行初始化
     * <br /><br />要使页面上的级联下拉框功能能够自动初始化, 需要在select标签上加入一些HTML 属性
     * <br /><b>defaultselect</b>: none, 该属性声明这是级联下拉框的第一个下拉框, <b>这是必填项,初始化时以这个为入口</b>
     * <br /><b>selectvalue</b>: string, 下拉框的默认选中值
     * <br /><b>selecturl</b>: string, 下拉框的数据请求接口, 符号 {0} 代表下拉框值的占位符
     * <br /><b>selecttarget</b>: selector, 下一级下拉框的选择器语法
     * <br /><b>defaultoption</b>: none, 声明默认 option 选项, 更新option时, 有该属性的项不会被清除
     * <p>
     *      数据格式: [ [id, name], [id, name] ... ]
     *      <br /> 如果获取到的数据格式不是默认格式,
     *      可以通过 <a href='UXC.Form.html#property_initAutoSelect.dataFilter'>UXC.Form.initAutoSelect.dataFilter</a> 属性自定义函数, 进行数据过滤
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
                UXC.Form.initAutoSelect( _selector );
            });

            UXC.Form.initAutoSelect.dataFilter = 
                function( _data, _select ){
                    var _r = _data;
                    if( _data && !_data.length && _data.data ){
                        _r = _data.data;
                    }
                    return _r;
                };
        </script>
     */
    UXC.Form.initAutoSelect = 
        function( _selector ){
            _selector = $( _selector );
            _selector.find( 'select[defaultselect]' ).each( function(){
                var _tmp = getSelectList( this );
                if( !(_tmp && _tmp.length ) ) return;
                $.each( _tmp, function( _ix, _item ){
                    $(_item).on('change', changeEvent);
                });
                $(_tmp[ _tmp.length - 1 ]).data('isLastSelect', true);
                $(_tmp[0]).data('isFirstSelect', true);
                _tmp[0].trigger('change');
            });
        };
    /**
     * 是否自动隐藏空值的级联下拉框, 起始下拉框不会被隐藏
     * @property    initAutoSelect.hideEmpty
     * @type    bool
     * @default false
     * @static
     * @example
            UXC.Form.initAutoSelect.hideEmpty = true;
     */
    UXC.Form.initAutoSelect.hideEmpty = false;
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
             UXC.Form.initAutoSelect.dataFilter = 
                function( _data, _select ){
                    var _r = _data;
                    if( _data && !_data.length && _data.data ){
                        _r = _data.data;
                    }
                    return _r;
                };
     */
    UXC.Form.initAutoSelect.dataFilter;
    /**
     * 页面加载完毕时, 延时进行自动化, 延时可以避免来自其他逻辑的干扰
     */
    $(document).ready( function( _evt ){
        setTimeout( function(){ UXC.Form.initAutoSelect( document ); }, 100 );
    });
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
                    if( _target.is( '[selecturl]' ) ){
                        var  _reqval = _val
                            , _url = add_url_params( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                        if( _target.data('parentSelect') ){
                            _reqval = _target.data('parentSelect').val();
                        }
                        _url = _url.replace( /\{0\}/g, _reqval );

                        getData( _target, _url, _selectval, triggerChange);
                    }
                }
            }else{
                UXC.log( 1, 2 );
                if( _p.is( '[selecturl]' ) ){
                    var  _reqval = _val
                        , _url = add_url_params( _p.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                    if( _p.data('parentSelect') ){
                        _reqval = _p.data('parentSelect').val();
                    }
                _url = _url.replace( /\{0\}/g, _reqval );

                getData( _p, _url, _val, function( _select ){
                    if( _select.is( '[selecttarget]' ) ){
                        var _target = $(_select.attr('selecttarget'));
                        if( _target.is( '[selectvalue]' ) ){
                            _val = _target.attr('selectvalue');
                            _target.removeAttr('selectvalue');
                        }
                        if( _target.is( '[selecturl]' ) ){
                            var  _reqval = _val
                                , _url = add_url_params( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                            if( _target.data('parentSelect') ){
                                _reqval = _target.data('parentSelect').val();
                            }
                            _url = _url.replace( /\{0\}/g, _reqval );

                            getData( _target, _url, _val, triggerChange);
                        }
                    }
                });
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
                    var _selectval = _val;
                    if( _target.is( '[selectvalue]' ) ){
                        _selectval = _target.attr('selectvalue');
                        _target.removeAttr('selectvalue');
                    }

                    if( _target.is( '[selecturl]' ) ){
                        UXC.log( 2, 1, 1, 1, _selectval );
                        var  _reqval = _val
                            , _url = add_url_params( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );

                        if( _target.data('parentSelect') ){
                            _reqval = _target.data('parentSelect').val();
                        }
                        _url = _url.replace( /\{0\}/g, _reqval );

                        getData( _target, _url, _selectval, triggerChange);
                    }
                }else{
                    UXC.log( 2, 1, 2 );
                    var _target = _p;
                    if( _target.is( '[selecturl]' ) ){
                        var  _reqval = _val
                            , _url = add_url_params( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                        if( _target.data('parentSelect') ){
                            _reqval = _target.data('parentSelect').val();
                        }
                        UXC.log( _reqval );
                        _url = _url.replace( /\{0\}/g, _reqval );
                        /**
                         * 如果是最后一个SELECT, 那么取消数据请求
                         */
                        if( _target.data('isLastSelect') ){
                            if( ( parseInt( _reqval ) || 0 ) < 1 ){
                                removeOption( _target );
                                UXC.Form.initAutoSelect.hideEmpty && _target.hide();
                            }
                           return;
                        }
                        getData( _target, _url, _val, triggerChange);
                    }

                }
            }else{
                UXC.log( 2, 2 );
                var _val = '', _url = add_url_params( _p.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                _p.data('parentSelect') && ( _val = _p.data('parentSelect').val() );
                _url = _url.replace( /\{0\}/g, _val );

                if( !_p.data('isFirstSelect') && ( (parseInt( _val, 10 ) || 0) < 1 ) ){
                    removeOption( _p );
                    triggerChange( _p );
                    UXC.Form.initAutoSelect.hideEmpty && _p.hide();
                }else getData( _p, _url, _val, triggerChange );
            }
        }
    }//end changeEvent
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
            //TODO: 这里应该添加返回数据处理回调
            if( UXC.Form.initAutoSelect.dataFilter ){
                _r = UXC.Form.initAutoSelect.dataFilter( _r, _select );
            }
            if( !_r ) return;
            removeOption( _select );

            if( UXC.Form.initAutoSelect.hideEmpty ){
                !_r.length && _select.hide();
                _r.length && _select.show();
            }

            var _optls = [];
            for( var i = 0, j = _r.length; i < j; i++ )
                _optls.push( '<option value="'+_r[i][0]+'">'+ _r[i][1] +'</option>' );

            $( _optls.join('') ).appendTo( _select );
            hasVal( _select, _selectval ) ? _select.val( _selectval ) : selectFirst( _select );
            _callback && _callback( _select );
        });
    }//end getData
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
}(jQuery));


 ;(function($){
    /**
     * 表单自动填充 URL GET 参数
     * <br />只要引用本脚本, DOM 加载完毕后, 页面上所有带 class js_autoFillUrlForm 的 form 都会自动初始化默认值
     * <p><b>requires</b>: <a href='window.jQuery.html'>jQuery</a></p>
     * <p><a href='https://github.com/suchesqiu/360UXC.git' target='_blank'>UXC Project Site</a>
     * | <a href='http://uxc.btbtd.org/docs/uxc_docs/classes/UXC.Form.html' target='_blank'>API docs</a>
     * @method  initAutoFill
     * @static
     * @for UXC.Form
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @date    2013-06-13
     * @param   {selector|url string}   _selector   显示指定要初始化的区域, 默认为 document
     * @param   {string}                _url        显示指定, 取初始化值的 URL, 默认为 location.href
     * @example
     *      UXC.Form.initAutoFill( myCustomSelector, myUrl );
     */
     UXC.Form.initAutoFill =
        function( _selector, _url ){
            if( !(_selector && _selector.length ) ) _selector = $(document);
            _url = _url || location.href;

            UXC.log( 'UXC.Form.initAutoFill' );

            _selector.find('form.js_autoFillUrlForm').each( function(){
                var _p = $(this);
                
                _p.find( 'input[type=text][name],input[type=password][name],textarea[name]' ).each( function(){
                    var _sp = $(this);
                    if( has_url_param( _url, _sp.attr('name') ) ){
                        _sp.val( get_url_param( _url, _sp.attr('name') ) );
                    }
                });

                _p.find( 'select[name]' ).each( function(){
                    var _sp = $(this), _uval = get_url_param( _url, _sp.attr('name') ) ;
                    if( has_url_param( _url, _sp.attr('name') ) ){
                        if( selectHasVal( _sp, _uval ) ){
                            _sp.val( get_url_param( _url, _sp.attr('name') ) );
                        }else{
                            _sp.attr( 'selectvalue', _uval );
                        }
                    }
                });

            });
        };

    $(document).ready( function( _evt ){ UXC.Form.initAutoFill(); });

    /**
     * 判断下拉框的option里是否有给定的值
     * @method  initAutoFill.selectHasVal
     * @private
     * @static
     * @param   {selector}  _select
     * @param   {string}    _val    要查找的值
     */
    function selectHasVal( _select, _val ){
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
}(jQuery));

