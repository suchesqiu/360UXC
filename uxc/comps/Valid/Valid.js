(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    /**
     * 表单验证<br />
     * 全局访问请使用 UXC.Valid 或 Valid<br />
     * @namespace UXC
     * @class Valid
     * @static
     * @uses jQuery
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | {@link http://uxc.360.cn|360 UXC-FE Team}
     * @date    2013-05-22
     */
    var Valid = UXC.Valid = window.Valid =
    {
        /**
         * 验证一个表单项, 如 文本框, 下拉框, 复选框, 单选框, 文本域, 隐藏域
         * @method check
         * @static
         * @param      {elements}    _item -   需要验证规则正确与否的表单/表单项
         * @example 
         *          UXC.Valid.check( $('input.needValid') );
         *          UXC.Valid.check( document.getElementById('inputNeedValid') );
         *
         *          if( !UXC.Valid.check( $('form') ) ){
         *              _evt.preventDefault();
         *              return false;
         *          }
         * @return    {boolean}
         */
        check:  
            function( _item ){ 
                var _r = true, _item = $(_item), _type = _item.length ? _item.prop('nodeName').toLowerCase() : '';
                if( _item.length ){
                    if( _type == 'form' ){
                        for( var i = 0, j = _item[0].length; i < j; i++ ){
                            !_logic.parse( $(_item[0][i]) ) && ( _r = false );
                        }
                    } else _r = _logic.parse( _item );
                }
                return _r;
            }
         /**
         * 清除Valid生成的错误样式
         * @method clearError
         * @static
         * @param   {form|input|textarea|select|file|password}  _selector -     需要清除错误的选择器
         * @example
         *          UXC.Valid.clearError( 'form' );
         *          UXC.Valid.clearError( 'input.some' );
         */
        , clearError:
        function( _selector ){
            $( _selector ).each( function(){
                var _item = $(this);
                UXC.log( 'clearError: ' + _item.prop('nodeName') );
                switch( _item.prop('nodeName').toLowerCase() ){
                    case 'form': 
                        {
                            for( var i = 0, j = _item[0].length; i < j; i++ ){
                                var tmp = $(_item[0][i]);
                                if( tmp.is('[disabled]') ) return;
                                _logic.valid( tmp );
                            }
                            break;
                        }
                    default: _logic.valid( $(this) ); break;
                }
            });
        }

    };
    /**
     * 这个方法是 {@link Valid.check} 的别名
     * @method checkAll
     * @static
     * @param      {elements}    _item -   需要验证规则正确与否的表单/表单项
     * @see Valid.check
     */
    Valid.checkAll = Valid;

    /**
     * 响应表单子对象的 blur事件, 触发事件时, 检查并显示错误或正确的视觉效果
     * @private
     */
    $(document).delegate( 'input[type=text], input[type=password], textarea', 'blur', function($evt){
        UXC.Valid.check( this )
    });
    /**
     * 响应表单子对象的 change 事件, 触发事件时, 检查并显示错误或正确的视觉效果
     * @private
     */
    $(document).delegate( 'select, input[type=file]', 'change', function($evt){
        UXC.Valid.check( this )
    });
    /**
     * 私有逻辑处理对象, 验证所需的所有规则和方法都存放于此对象
     * @private
     */
    var _logic =
        {
            /**
             * 分析_item是否附合规则要求
             * @param   {selector}  _item 
             */
            parse: 
                function( _item ){

                    var _r = true, _item = $(_item);

                    _item.each( function(){

                        if( !_logic.isValidItem(this) ) return;
                        var _sitem = $(this), _dt = _logic.getDatatype( _sitem ), _subdt = _logic.getSubdatatype( _sitem );

                        if( _sitem.is('[disabled]') ) return;

                        UXC.log( _dt, _subdt );

                        if( _sitem.is('[reqmsg]') ){
                            if( ! _logic.datatype['reqmsg']( _sitem ) ) {
                                _r = false;
                                return;
                             }
                        }

                        if( !_logic.datatype['length']( _sitem ) ){
                            _r = false;
                            return;
                        }

                        if( _dt in _logic.datatype && _sitem.val() ){
                            if( !_logic.datatype[ _dt ]( _sitem ) ){
                                _r = false;
                                return;
                            }
                        }
                        
                        if( _subdt && _subdt in _logic.subdatatype && ( _sitem.val() || _subdt == 'alternative' ) ){
                            if( !_logic.subdatatype[ _subdt ]( _sitem ) ){
                                _r = false;
                                return;
                            }
                        }

                        _logic.valid( _sitem );
                    });

                    return _r;
                }
            /**
             * 检查 _item 是否为 Valid 的检查对象
             * @param   {selector}  _item
             */
            , isValidItem: 
                function( _item ){
                    _item = $(_item);
                    var _r, _tmp;

                    _item.each( function(){
                        _tmp = $(this);
                        if( _tmp.is( '[datatype]' ) || _tmp.is( '[subdatatype]' ) 
                            || _tmp.is( '[minlength]' ) || _tmp.is( '[maxlength]' )  
                            || _tmp.is( '[reqmsg]' ) ) 
                            _r = true;
                    });

                    return _r;
                }
            /**
             * 显示正确的视觉效果
             * @param   {selector}  _item
             */
            , valid:
                function( _item ){
                    if( !_logic.isValidItem( _item ) ) return;
                    _item.removeClass('error');
                    _item.find('~ em').show();
                    _item.find('~ em.error').hide();
                }
            /**
             * 显示错误的视觉效果
             * @param   {selector}  _item
             */
            , error: 
                function( _item, _msgAttr, _fullMsg ){
                    if( !_logic.isValidItem( _item ) ) return;

                    var _msg = _logic.getMsg.apply( null, [].slice.call( arguments ) ), _errEm;

                    _item.addClass( 'error' );
                    _item.find('~ em:not(.error)').hide();

                    if( _item.is( '[emEl]' ) ){
                        ( _errEm = _logic.getElement( _item.attr( 'emEl' ) ) ) && _errEm.length && _errEm.addClass('error');
                    }
                    !( _errEm && _errEm.length ) && ( _errEm = _item.find('~ em.error') );
                    if( !_errEm.length ){
                        ( _errEm = $('<em class="error"></em>') ).insertAfter( _item );
                    }
                    UXC.log( 'error: ' + _msg );
                    _errEm.html( _msg ).show() 

                    return false;
                }
            /**
             * 获取 _selector 对象
             * 这个方法的存在是为了向后兼容qwrap, qwrap DOM参数都为ID
             * @param   {selector}  _item
             */
            , getElement: 
                function( _item ){
                    if( /^[\w-]+$/.test( _item ) ) _item = '#' + _item;
                    return $(_item );
                }
            /**
             * 获取 _item 的检查类型, 所有可用的检查类型位于 _logic.datatype 对象
             * @param   {selector}  _item
             */
            , getDatatype: 
                function( _item ){
                    return ( _item.attr('datatype') || 'text').toLowerCase().replace(/\-.*/, '');
                }
           /**
             * 获取 _item 的检查子类型, 所有可用的检查子类型位于 _logic.subdatatype 对象
             * @param   {selector}  _item
             */
            , getSubdatatype: 
                function( _item ){
                    return ( _item.attr('subdatatype') || 'text').toLowerCase().replace(/\-.*/, '');
                }
            /**
             * 获取对应的错误信息, 默认的错误信息有 reqmsg, errmsg, <br />
             * 注意: 错误信息第一个字符如果为空格的话, 将完全使用用户定义的错误信息, 将不会动态添加 请上传/选择/填写
             * @param   {selector}  _item
             * @param   {string}    _msgAttr    - 显示指定需要读取的错误信息属性名, 默认为 reqmsg, errmsg, 通过该属性可以指定别的属性名
             * @param   {bool}      _fullMsg    - 显示指定错误信息为属性的值, 而不是自动添加的 请上传/选择/填写
             */
            , getMsg: 
                function( _item, _msgAttr, _fullMsg ){
                    var _msg = _item.is('[errmsg]') ? ' ' + _item.attr('errmsg') : _item.is('[reqmsg]') ? _item.attr('reqmsg') : '';
                    _msgAttr && (_msg = _item.attr( _msgAttr ) || _msg );
                    _fullMsg && _msg && ( _msg = ' ' + _msg );

                    if( _msg && !/^[\s]/.test( _msg ) ){
                        switch( _item.prop('type').toLowerCase() ){
                            case 'file': _msg = '请上传' + _msg; break;

                            case 'select-multiple':
                            case 'select-one':
                            case 'select': _msg = '请选择' + _msg; break;

                            case 'textarea':
                            case 'password':
                            case 'text': _msg = '请填写' + _msg; break;
                        }
                    }

                    UXC.log( '_msg: ' + _msg, _item.prop('type').toLowerCase() );

                    return $.trim(_msg);
                }
            /**
             * 计算字符串的字节长度, 非 ASCII 0-255的字符视为两个字节
             * @param   {string}    _s
             */
            , bytelen: 
                function( _s ){
                    return _s.replace(/[^\x00-\xff]/g,"11").length;
                }
            /**
             * 获取日期字符串的 timestamp, 字符串格式为 YYYY[^\d]*?MM[^\d]*?DD
             * @param   {string}    _date_str
             */
            , getTimestamp:
                function( _date_str ){
                    _date_str = _date_str.replace( /[^\d]/g, '' );
                    return new Date( _date_str.slice(0,4), parseInt( _date_str.slice( 4, 6 ), 10 ) - 1, _date_str.slice( 6, 8) ).getTime();
                }
            /**
             * 此对象存储可供检查的子类型
             */
            , subdatatype: {
                /**
                 * 此类型检查 2|N个对象必须至少有一个是有输入内容的, 
                 * 常用于 手机/电话 二填一
                 * @param   {selector}  _item
                 * @example
                        <dd>
                        <div class="f-l label">
                            <label>(datatype phonezone, phonecode, phoneext)电话号码:</label>
                        </div>
                        <div class="f-l">
                            <input type='TEXT' name='company_phonezone' style="width:40px;" value='' size="4" 
                                datatype="phonezone" emEl="#phone-err-em" errmsg="请填写正确的电话区号" />
                            - <input type='TEXT' name='company_phonecode' style="width:80px;" value='' size="8" 
                                datatype="phonecode" subdatatype="alternative" datatarget="input[name=company_mobile]" alternativemsg="电话号码和手机号码至少填写一个"
                                errmsg="请检查电话号码格式" emEl="#phone-err-em" />
                            - <input type='TEXT' name='company_phoneext' style="width:40px;" value='' size="4" 
                                datatype="phoneext" emEl="#phone-err-em" errmsg="请填写正确的分机号" />
                            <em id="phone-err-em"></em>
                        </div>
                        </dd>

                        <dd>
                        <div class="f-l label">
                            <label>(datatype mobilecode)手机号码:</label>
                        </div>
                        <div class="f-l">
                            <input type="TEXT" name="company_mobile" 
                                datatype="mobilecode" subdatatype="alternative" datatarget="input[name=company_phonecode]" alternativemsg=" "
                                errmsg="请填写正确的手机号码">
                        </div>
                        </dd>
                 */
                alternative:
                    function( _item ){
                        var _r = true, _target;

                        UXC.log( 'alternative' );

                        if( _item.is( '[datatarget]' ) && (_target = $(_item.attr('datatarget')) ).length && !_item.val() ){
                            var _hasVal = false;
                            _target.each( function(){ if( $(this).val() ){ _hasVal = true; return false; } } );
                            _r = _hasVal;
                        }

                        !_r && _logic.error( _item, 'alternativemsg', true );
                        !_r && _target && _target.length && _target.each( function(){ _logic.error( $(this), 'alternativemsg', true ); } );
                        _r && _target && _target.length && _target.each( function(){ _logic.valid( $(this) ); } );

                        return _r;
                    }
                /**
                 * 此类型检查 2|N 个对象填写的值必须一致
                 * 常用于注意时密码验证/重置密码
                 * @param   {selector}  _item
                 * @example
                        <dd>
                        <div class="f-l label">
                            <label>(datatype text, subdatatype reconfirm)用户密码:</label>
                        </div>
                        <div class="f-l">
                            <input type="PASSWORD" name="company_pwd" 
                            datatype="text" subdatatype="reconfirm" datatarget="input[name=company_repwd]" reconfirmmsg="用户密码和确认密码不一致"
                            minlength="6" maxlength="15" reqmsg="用户密码" errmsg="请填写正确的用户密码">
                        </div>
                        </dd>

                        <dd>
                        <div class="f-l label">
                            <label>(datatype text, subdatatype reconfirm)确认密码:</label>
                        </div>
                        <div class="f-l">
                            <input type="PASSWORD" name="company_repwd" 
                            datatype="text" subdatatype="reconfirm" datatarget="input[name=company_pwd]" reconfirmmsg="确认密码和用户密码不一致"
                            minlength="6" maxlength="15" reqmsg="确认密码" errmsg="请填写正确的确认密码">
                        </div>
                        </dd>
                 */
                , reconfirm:
                    function( _item ){
                        var _r = true, _target;

                        UXC.log( 'reconfirm' );

                        if( _item.is( '[datatarget]' ) && (_target = $(_item.attr('datatarget')) ).length ){
                            _target.each( function(){ if( _item.val() != $(this).val() ) return _r = false; } );
                        }

                        !_r && _logic.error( _item, 'reconfirmmsg', true );
                        !_r && _target.length && _target.each( function(){ _logic.error( $(this), 'reconfirmmsg', true ); } );
                        _r && _target.length && _target.each( function(){ _logic.valid( $(this) ); } );

                        return _r;
                    }

            }//subdatatype
            /**
             * 此对象存储可供检查的类型
             */
            , datatype:{
                /**
                 * 检查是否为正确的数字<br />
                 * 默认范围 0 - Math.pow(10, 10)
                 * @param   {selector}  _item
                 * @attr    {require}               datatype    - n | n-整数位数.小数位数
                 * @attr    {integer|optional}      minvalue    - 数值的下限
                 * @attr    {integer|optional}      maxvalue    - 数值的上限
                 *
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_n" errmsg="请填写正确的正整数" datatype="n" >
                        </div>
                        <div class="f-l">
                            <input type="TEXT" name="company_n1" errmsg="请填写正确的数字, 范围1-100" datatype="n" minvalue="1", maxvalue="100" >
                        </div>
                        <div class="f-l">
                            <input type="TEXT" name="company_n2" errmsg="请填写正确的数字" datatype="n-7.2" >
                        </div>
                 *
                 */
                n: 
                    function( _item ){
                        var _r = true, _valStr = _item.val(), _val = +_valStr,_min = 0, _max = Math.pow( 10, 10 ), _n, _f, _tmp;

                        if( !isNaN( _val ) && _val >= 0 ){
                            _item.attr('datatype').replace( /^n\-(.*)$/, function( $0, $1 ){
                                _tmp = $1.split('.');
                                _n = _tmp[0];
                                _f = _tmp[1];
                            });
                            if( _item.is('[minvalue]') ) _min = +_item.attr('minvalue') || _min;
                            if( _item.is('[maxvalue]') ) _max = +_item.attr('maxvalue') || _max;

                            if( _val >= _min && _val <= _max ){
                                typeof _n != 'undefined' && typeof _f != 'undefined' && ( _r = new RegExp( '^(?:[\\d]{0,'+_n+'}|)(?:\\.[\\d]{1,'+_f+'}|)$' ).test( _valStr ) );
                                typeof _n != 'undefined' && typeof _f == 'undefined' && ( _r = new RegExp( '^[\\d]{1,'+_n+'}$' ).test( _valStr ) );
                                typeof _n == 'undefined' && typeof _f != 'undefined' && ( _r = new RegExp( '^\\.[\\d]{1,'+_f+'}$' ).test( _valStr ) );
                                typeof _f == 'undefined' && /\./.test( _valStr ) && ( _r = false );
                            } else _r = false;

                            UXC.log( 'nValid', _val, typeof _n, typeof _f, typeof _min, typeof _max, _min, _max );
                        }else _r = false;

                        !_r && _logic.error( _item );

                        return _r;
                    }
                /**
                 * 检查是否为合法的日期,
                 * 日期格式为 YYYYMMDD, YYYY/MM/DD, YYYY-MM-DD, YYYY.MM.DD
                 * @param   {selector}  _item
                 * @attr    {require}               datatype    - d
                 * @attr    {date string|optional}  minvalue    - 日期的下限
                 * @attr    {date string|optional}  maxvalue    - 日期的上限
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_d" errmsg="请填写正确的日期范围2013-05-01 - 2013-05-31" datatype="daterange" minvalue="2013-05-01" maxvalue="2013-05-31" >
                        </div>
                 */
                , d: 
                    function( _item ){
                        var _val = _item.val().trim(), _r, _re = /^[\d]{4}([\/.-]|)[01][\d]\1[0-3][\d]$/;
                        if( !_val ) return true;
                            
                        if( _r = _re.test( _val ) ){
                            var _utime = _logic.getTimestamp( _item.val() ), _minTime, _maxTime;

                            if( _item.is('[minvalue]') && ( _r = _re.test( _item.attr('minvalue') ) ) ){
                                _minTime = _logic.getTimestamp( _item.attr('minvalue') );
                                _utime < _minTime && ( _r = false );
                            }

                            if( _r && _item.is('[maxvalue]') && ( _r = _re.test( _item.attr('maxvalue') ) ) ){
                                _maxTime = _logic.getTimestamp( _item.attr('maxvalue') );
                                _utime > _maxTime && ( _r = false );
                            }
                        }

                        !_r && _logic.error( _item );

                        return _r;
                    }
                /**
                 * 检查两个输入框的日期
                 * 日期格式为 YYYYMMDD, YYYY/MM/DD, YYYY-MM-DD, YYYY.MM.DD
                 * @param   {selector}  _item
                 * @attr    {require}               datatype    - datarange
                 * @attr    {selector|optional}     fromDateEl  - 起始日期选择器
                 * @attr    {selector|optional}     toDateEl    - 结束日期选择器
                 * @attr    {date string|optional}  minvalue    - 日期的下限
                 * @attr    {date string|optional}  maxvalue    - 日期的上限
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_daterange" errmsg="请填写正确的日期范围,并且起始日期不能大于结束日期" id="start_date" 
                                datatype="daterange" toDateEl="end_date" emEl="date-err-em" >
                            - <input type="TEXT" name="company_daterange" errmsg="请填写正确的日期范围,并且起始日期不能大于结束日期" id="end_date" 
                                datatype="daterange" fromDateEl="start_date" emEl="date-err-em" >
                            <br /><em id="date-err-em"></em>
                        </div>
                 */
                , daterange:
                    function( _item ){
                        var _r = _logic.datatype.d( _item ), _mind, _maxd;

                        if( _r ){
                        
                            if( _r ){
                                var _fromDateEl, _toDateEl;
                                if( _item.is( '[fromDateEl]' ) ) _fromDateEl = _logic.getElement( _item.attr('fromDateEl') );
                                if( _item.is( '[toDateEl]' ) ) _toDateEl = _logic.getElement( _item.attr('toDateEl') );
                                if( _fromDateEl && _fromDateEl.length || _toDateEl && _toDateEl.length ){

                                    _fromDateEl && _fromDateEl.length && !( _toDateEl && _toDateEl.length ) && ( _toDateEl = _item );
                                    !(_fromDateEl && _fromDateEl.length) && _toDateEl && _toDateEl.length && ( _fromDateEl = _item );

                                    UXC.log( 'daterange', _fromDateEl.length, _toDateEl.length );

                                    if( _toDateEl[0] != _fromDateEl[0] ){


                                        _r && ( _r = _logic.datatype.d( _toDateEl ) );
                                        _r && ( _r = _logic.datatype.d( _fromDateEl ) );

                                        _r && _logic.getTimestamp( _fromDateEl.val() ) > _logic.getTimestamp( _toDateEl.val() ) && ( _r = false );

                                        _r && _logic.valid( _fromDateEl );
                                        _r && _logic.valid( _toDateEl );

                                    }
                                }
                            }
                        }

                        !_r && _logic.error( _item );

                        return _r;
                    }
                /**
                 * 检查时间格式, 格式为 mm:dd:ss
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_time" errmsg="正确的时间, 格式为 hh:nn:ss" datatype="time" >
                        </div>
                 */
                , time: 
                    function( _item ){
                        var _r = /^(([0-1]\d)|(2[0-3])):[0-5]\d:[0-5]\d$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查时间格式, 格式为 mm:dd:ss
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_time" errmsg="正确的时间, 格式为 hh:nn" datatype="minute" >
                        </div>
                 */
                , minute: 
                    function( _item ){
                        var _r = /^(([0-1]\d)|(2[0-3])):[0-5]\d$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查银行卡号码<br />
                 * 格式为 d{19} | d{16} | 1111 1111 1111 1111 111 | 1111 1111 1111 1111111
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_idnumber" 
                                datatype="idnumber" errmsg="请填写正确的身份证号码">
                        </div>
                 */
                , bankcard:
                    function( _item ){
                        var _r = /^[1-9][\d]{3}(?: |)(?:[\d]{4}(?: |))(?:[\d]{4}(?: |))(?:[\d]{4})(?:(?: |)[\d]{3}|)$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查中文姓名<br />
                 * 格式: 汉字和大小写字母
                 * 规则: 长度 2-32个字节, 非 ASCII 算2个字节
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_cnname" 
                                datatype="cnname" reqmsg="姓名" errmsg="请填写正确的姓名">
                        </div>
                 */
                , cnname:
                    function( _item ){
                        var _r = _logic.bytelen( _item.val() ) < 32 && /^[\u4e00-\u9fa5a-zA-Z.\u3002\u2022]{2,32}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查注册用户名<br />
                 * 格式: a-zA-Z0-9_-
                 * 规则: 首字母必须为 [a-zA-Z0-9], 长度 2 - 29
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_username" 
                                datatype="username" reqmsg="用户名" errmsg="请填写正确的用户名">
                        </div>
                 */
                , username:
                    function( _item ){
                        var _r = /^[a-zA-Z0-9][\w-]{2,29}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查身份证号码<br />
                 * 目前只使用最简单的位数判断~ 有待完善
                 * @param   {selector}  _item
                 * @example
                    <div class="f-l">
                        <input type="TEXT" name="company_idnumber" 
                            datatype="idnumber" errmsg="请填写正确的身份证号码">
                    </div>
                 */
                , idnumber:
                    function( _item ){
                        var _r = /^[0-9]{15}(?:[0-9]{2}(?:[0-9xX]|)|)$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查手机号码<br />
                 * @param   {selector}  _item
                 * @example
                    <div class="f-l">
                        <input type="TEXT" name="company_mobile" 
                            datatype="mobilecode" subdatatype="alternative" datatarget="input[name=company_phonecode]" alternativemsg=" "
                            errmsg="请填写正确的手机号码">
                    </div>
                 */
                , mobilecode: 
                    function( _item ){
                        var _r =  /^(?:13|14|15|16|18|19)\d{9}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查手机号码加强方法
                 * 格式: [+国家代码] [零]11位数字
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_mobilezone" 
                                datatype="mobilezonecode" 
                                errmsg="请填写正确的手机号码">
                        </div>
                 */
                , mobilezonecode: 
                    function( _item ){
                        var _r = /^(?:\+[0-9]{1,6} |)(?:0|)(?:13|14|15|16|18|19)\d{9}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查电话号码
                 * 格式: [区号]7/8位电话号码
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_phone" 
                                datatype="phone" 
                                errmsg="请填写正确的电话号码">
                        </div>
                 */
                , phone:
                    function( _item ){
                        var _r = /^(?:0(?:10|2\d|[3-9]\d\d)(?: |\-|)|)[1-9]\d{6,7}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查电话号码
                 * 格式: [+国家代码][ ][电话区号][ ]7/8位电话号码[#分机号]
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_mobilezone" 
                                datatype="phoneall" 
                                errmsg="请填写正确的电话号码">
                        </div>
                 */
                , phoneall:
                    function( _item ){
                        var _r = /^(?:\+[\d]{1,6}(?: |\-)|)(?:0[\d]{2,3}(?:\-| |)|)[1-9][\d]{6,7}(?:(?: |)\#[\d]{1,6}|)$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查电话区号
                 * @param   {selector}  _item
                 * @example
                        <div>
                            <input type='TEXT' name='company_phonezone' style="width:40px;" value='' size="4" 
                                datatype="phonezone" emEl="#phone-err-em" errmsg="请填写正确的电话区号" />
                        </div>
                 */
                , phonezone: 
                    function( _item ){
                        var _r = /^[0-9]{3,4}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查电话号码
                 * 格式: 7/8位数字
                 * @param   {selector}  _item
                 * @example
                        <div>
                            <input type='TEXT' name='company_phonecode' style="width:80px;" value='' size="8" 
                                datatype="phonecode" errmsg="请检查电话号码格式" emEl="#phone-err-em" />
                        </div>
                 */
                , phonecode: 
                    function( _item ){
                        var _r =  /^[0-9]{7,8}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查电话分机号码
                 * @param   {selector}  _item
                 * @example
                        <div>
                            <input type='TEXT' name='company_phoneext' style="width:40px;" value='' size="4" 
                                datatype="phoneext" emEl="#phone-err-em" errmsg="请填写正确的分机号" />
                        </div>
                 */
                , phoneext: 
                    function( _item ){
                        var _r =  /^[0-9]{1,6}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查内容的长度
                 * @param   {selector}  _item
                 * @attr    {string}    datatype        数字类型 text|bytetext|richtext
                 *
                 * @attr    {integer}   minlength       内容最小长度
                 * @attr    {integer}   maxlength       内容最大长度
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_name" minlength="2" maxlength="120" reqmsg="公司名称" errmsg="请检查格式,长度2-120" /> <em>公司名称描述</em>
                        </div>
                 */
                , 'length': 
                    function( _item ){
                        var _r = true, _dt = _logic.getDatatype( _item ), _min, _max, _val = _item.val(), _len;

                        if( _item.is( '[minlength]' ) ){
                            UXC.log( 'minlength' );
                            _min = parseInt( _item.attr( 'minlength' ), 10 ) || 0;
                        }
                        
                        if( _item.is( '[maxlength]' ) ){
                            UXC.log( 'maxlength' );
                            _max = parseInt( _item.attr( 'maxlength' ), 10 ) || 0;
                        }
                        /**
                         * 根据特殊的 datatype 实现不同的计算方法
                         */
                        switch( _dt ){
                            case 'richtext':
                            case 'bytetext':
                                {
                                    _len = _logic.bytelen( _val );
                                    break;
                                }
                            default:
                                {
                                    _len = _val.length;
                                    break;
                                }
                        }

                        _min && ( _len < _min ) && ( _r = false );
                        _max && ( _len > _max ) && ( _r = false );

                        UXC.log( 'lengthValid: ', _min, _max, _r );

                        !_r && _logic.error( _item );

                        return _r;
                    }
                /**
                 * 检查内容是否为空,
                 * 如果声明了该属性, 那么 value 须不为空
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_name" reqmsg="公司名称" /> <em>公司名称描述</em>
                        </div>
                 */
                , reqmsg: 
                    function( _item ){

                        var _r;
                        if( _item.val() && _item.val().constructor == Array ){
                            _r = !!( ( _item.val().join('') + '' ).trim() );
                        }else{
                            _r = !!$.trim( _item.val() ||'') ;
                        }

                        !_r && _logic.error( _item, 'reqmsg' );
                        UXC.log( 'regmsgValid: ' + _r );
                        return _r;
                    }
                /**
                 * 自定义正则校验
                 * @param   {selector}  _item
                 *
                 * @attr    {string}    datatype        reg|reg-/规则/选项
                 * @attr    {string}    reg-pattern     正则规则 /规则/选项
                 *
                 * @example
                            <div><input type="TEXT" name="company_addr" datatype="reg" reg-pattern="/^[\s\S]{2,120}$/i" errmsg="请填写正确的地址"></div>
                            <div><input type="TEXT" name="company_addr" datatype="reg-/^[\s\S]{2,120}$/i" errmsg="请填写正确的地址"></div>
                 */
                , reg: 
                    function( _item ){
                        var _r = true, _pattern;
                        if( _item.is( '[reg-pattern]' ) ) _pattern = _item.attr( 'reg-pattern' );
                        if( !_pattern ) _pattern = $.trim(_item.attr('datatype')).replace(/^reg(?:\-|)/i, '');

                        _pattern.replace( /^\/([\s\S]*)\/([\w]{0,3})$/, function( $0, $1, $2 ){
                            UXC.log( $1, $2 );
                            _r = new RegExp( $1, $2 || '' ).test( _item.val() );
                        });

                        !_r && _logic.error( _item );

                        return _r;
                    }
                /**
                 * 检查验证码<br />
                 * 格式: 为 0-9a-zA-Z, 长度 默认为4
                 * @param   {selector}  _item
                 * @attr    {string}    datatype    vcode|vcode-[\d]+
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_vcode" style="width: 40px;"
                                datatype="vcode" reqmsg="验证码" errmsg="请填写正确的验证码">
                        </div>
                        <div class="f-l">
                            <input type="TEXT" name="company_vcode" style="width: 40px;"
                                datatype="vcode-5" errmsg="请填写正确的验证码">
                        </div>
                 */
                , vcode:
                    function( _item ){
                        var _r, _len = parseInt( _item.attr('datatype').trim().replace( /^vcode(?:\-|)/i, '' ), 10 ) || 4; 
                        UXC.log( 'vcodeValid: ' + _len );
                        _r = new RegExp( '^[0-9a-zA-Z]{'+_len+'}$' ).test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查文本长度
                 * @see _logic.datatype.length
                 * @attr    {string}    datatype    text
                 */
                , text: function(_item){ return true; }
                /**
                 * 检查文本的字节长度
                 * @see _logic.datatype.length
                 * @attr    {string}    datatype    bytetext
                 */
                , bytetext: function(_item){ return true; }
                /**
                 * 检查富文本的字节
                 * @see _logic.datatype.length
                 * @attr    {string}    datatype    richtext
                 */
                , richtext: function(_item){ return true; }
                /**
                 * 检查URL
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_url" datatype="url" errmsg="请填写正确的网址">
                        </div>
                 */
                , url: 
                    function( _item ){
                        var _r = /^((http|ftp|https):\/\/|)[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查域名
                 * @param   {selector}  _item
                        <div class="f-l">
                            <input type="TEXT" name="company_domain" datatype="domain" reqmsg="域名" errmsg="请填写正确的域名">
                        </div>
                 */
                , domain:
                    function( _item ){
                        var _r = /^(?:(?:f|ht)tp\:\/\/|)((?:(?:(?:\w[\.\-\+]?)*)\w)*)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})(?:\/|)$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查电子邮件
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_email" datatype="email" reqmsg="邮箱" errmsg="请填写正确的邮箱">
                        </div>
                 */
                , email: 
                    function( _item ){
                        var _r = /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                /**
                 * 检查邮政编码
                 * @param   {selector}  _item
                 * @example
                        <div class="f-l">
                            <input type="TEXT" name="company_zipcode" datatype="zipcode" errmsg="请填写正确的邮编">
                        </div>
                 */
                , zipcode: 
                    function( _item ){
                        var _r = /^[0-9]{6}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
            }//datatype
        };//_logic

}(jQuery))
