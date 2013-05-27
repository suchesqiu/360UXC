(function($){
    !window.UXC && (window.UXC = { log:function(){} });
    window.Valid = UXC.Valid = Valid;
    /**
     * 表单验证
     * @class Valid
     * @global
     * @alias UXC.Valid 
     * @alias window.Valid
     * @classdesc 
     *      全局访问请使用 UXC.Valid 或 Valid<br />
     * @requires jQuery
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | {@link http://uxc.360.cn|360 UXC-FE Team}
     * @date    2013-05-22
     */
    function Valid(){}
    /**
     * 验证一个表单项, 如 文本框, 下拉框, 复选框, 单选框, 文本域, 隐藏域
     * @method
     * @memberof Valid
     * @param      {elements}    _item -   需要验证规则正确与否的表单项
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
    Valid.check =  
        function( _item ){ 
            var _r = true, _item = $(_item), _type = _item.length ? _item.prop('nodeName').toLowerCase() : '';
            if( _item.length ){
                if( _type == 'form' ){
                    $( _item[0].elements ).each( function(){
                        !_logic.parse( $(this) ) && ( _r = false );
                    });
                } else _r = _logic.parse( _item );
            }
            return _r;
        };
    /**
     * 这个方法是 {@link Valid.check} 的别名
     * @method
     * @memberof Valid
     * @see Valid.check
     */
    Valid.checkAll = Valid.check;
     /**
     * 清除Valid生成的错误样式
     * @method
     * @memberof Valid
     * @param   {form|input|textarea|select|file|password}  _selector -     需要清除错误的选择器
     * @example
     *          UXC.Valid.clearError( 'form' );
     *          UXC.Valid.clearError( 'input.some' );
     */
    Valid.clearError = 
        function( _selector ){
            $( _selector ).each( function(){
                var _item = $(this);
                UXC.log( 'clearError: ' + _item.prop('nodeName') );
                switch( _item.prop('nodeName').toLowerCase() ){
                    case 'form': 
                        {
                            $( _item[0].elements ).each( function(){
                                if( $(this).is('[disabled]') ) return;
                                _logic.valid( $(this) );
                            });

                            break;
                        }
                    default: _logic.valid( $(this) ); break;
                }
            });
        };
        $(document).delegate( 'input[type=TEXT], input[type=PASSWORD], textarea', 'blur', function($evt){
            UXC.log( $(this).attr('name'), UXC.Valid.check( this ) );
        });

        $(document).delegate( 'select, input[type=file]', 'change', function($evt){
            UXC.log( $(this).attr('name'), UXC.Valid.check( this ) );
        });
    /**
     * @private
     */
    var _logic =
        {
            parse: 
                function( _fmItem ){

                    var _r = true, _fmItem = $(_fmItem);

                    _fmItem.each( function(){

                        if( !_logic.isValidItem(this) ) return;
                        var _item = $(this), _dt = _logic.getDatatype( _item ), _subdt = _logic.getSubdatatype( _item );

                        if( _item.is('[disabled]') ) return;

                        UXC.log( _dt, _subdt );

                        if( _item.is('[reqmsg]') ){
                            if( ! _logic.datatype['reqmsg']( _item ) ) {
                                _r = false;
                                return;
                             }
                        }

                        if( !_logic.datatype['length']( _item ) ){
                            _r = false;
                            return;
                        }

                        if( _dt in _logic.datatype && _item.val() ){
                            if( !_logic.datatype[ _dt ]( _item ) ){
                                _r = false;
                                return;
                            }
                        }
                        
                        if( _subdt && _subdt in _logic.subdatatype && ( _item.val() || _subdt == 'alternative' ) ){
                            if( !_logic.subdatatype[ _subdt ]( _item ) ){
                                _r = false;
                                return;
                            }
                        }

                        _logic.valid( _item );
                    });

                    return _r;
                }

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
            
            , valid:
                function( _item ){
                    if( !_logic.isValidItem( _item ) ) return;
                    _item.removeClass('error');
                    _item.find('~ em').show();
                    _item.find('~ em.error').hide();
                }

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

            , getElement: 
                function( _selector ){
                    /**
                     * 这个是向后兼容qwrap, qwrap DOM参数都为ID
                     */
                    if( /^[\w-]+$/.test( _selector ) ) _selector = '#' + _selector;
                    return $(_selector );
                }
            
            , getDatatype: 
                function( _item ){
                    return ( _item.attr('datatype') || 'text').toLowerCase().replace(/\-.*/, '');
                }
           
            , getSubdatatype: 
                function( _item ){
                    return ( _item.attr('subdatatype') || 'text').toLowerCase().replace(/\-.*/, '');
                }

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

                    return _msg.trim();
                }

            , bytelen: 
                function( _s ){
                    return _s.replace(/[^\x00-\xff]/g,"11").length;
                }

            , getTimestamp:
                function( _date_str ){
                    _date_str = _date_str.replace( /[^\d]/g, '' );
                    return new Date( _date_str.slice(0,4), parseInt( _date_str.slice( 4, 6 ), 10 ) - 1, _date_str.slice( 6, 8) ).getTime();
                }

            , subdatatype: {
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
                        !_r && _target.length && _target.each( function(){ _logic.error( $(this), 'alternativemsg', true ); } );
                        _r && _target.length && _target.each( function(){ _logic.valid( $(this) ); } );

                        return _r;
                    }

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

            , datatype:{
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

                , time: 
                    function( _item ){
                        var _r = /^(([0-1]\d)|(2[0-3])):[0-5]\d:[0-5]\d$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , minute: 
                    function( _item ){
                        var _r = /^(([0-1]\d)|(2[0-3])):[0-5]\d$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }


                , bankcard:
                    function( _item ){
                        var _r = /^[1-9][\d]{3}(?: |)(?:[\d]{4}(?: |))(?:[\d]{4}(?: |))(?:[\d]{4})(?:(?: |)[\d]{3}|)$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , cnname:
                    function( _item ){
                        var _r = _logic.bytelen( _item.val() ) < 32 && /^[\u4e00-\u9fa5a-zA-Z.\u3002\u2022]{2,32}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , username:
                    function( _item ){
                        var _r = /^[a-zA-Z0-9][\w-]{2,29}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , idnumber:
                    function( _item ){
                        var _r = /^[0-9]{15}(?:[0-9]{2}(?:[0-9xX]|)|)$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , mobilecode: 
                    function( _item ){
                        var _r =  /^(13|15|18|14)\d{9}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , mobilezonecode: 
                    function( _item ){
                        var _r = /^(?:\+[0-9]{1,6} |)(?:0|)(?:13|15|18|14)\d{9}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , phone:
                    function( _item ){
                        var _r = /^(?:0(?:10|2\d|[3-9]\d\d)(?: |\-|)|)[1-9]\d{6,7}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , phoneall:
                    function( _item ){
                        var _r = /^(?:\+[\d]{1,6}(?: |\-)|)(?:0[\d]{2,3}(?:\-| |)|)[1-9][\d]{6,7}(?:(?: |)\#[\d]{1,6}|)$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , phonezone: 
                    function( _item ){
                        var _r = /^[0-9]{3,4}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , phonecode: 
                    function( _item ){
                        var _r =  /^[0-9]{7,8}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
                
                , phoneext: 
                    function( _item ){
                        var _r =  /^[0-9]{1,6}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

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
                
                , reqmsg: 
                    function( _item ){
                        var _r;
                        if( _item.val() && _item.val().constructor == Array ){
                            _r = !!( ( _item.val().join('') + '' ).trim() );
                        }else{
                            _r = !!( ( _item.val() ||'').trim() );
                        }

                        !_r && _logic.error( _item, 'reqmsg' );
                        UXC.log( 'regmsgValid: ' + _r );
                        return _r;
                    }

                , reg: 
                    function( _item ){
                        var _r = true, _pattern;
                        if( _item.is( '[reg-pattern]' ) ) _pattern = _item.attr( 'reg-pattern' );
                        if( !_pattern ) _pattern = _item.attr('datatype').trim().replace(/^reg(?:\-|)/i, '');

                        _pattern.replace( /^\/([\s\S]*)\/([\w]{0,3})$/, function( $0, $1, $2 ){
                            UXC.log( $1, $2 );
                            _r = new RegExp( $1, $2 || '' ).test( _item.val() );
                        });

                        !_r && _logic.error( _item );

                        return _r;
                    }

                , vcode:
                    function( _item ){
                        var _r, _len = parseInt( _item.attr('datatype').trim().replace( /^vcode(?:\-|)/i, '' ), 10 ) || 4; 
                        UXC.log( 'vcodeValid: ' + _len );
                        _r = new RegExp( '^[0-9a-zA-Z]{'+_len+'}$' ).test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , text: function(_item){ return true; }
                , bytetext: function(_item){ return true; }
                , richtext: function(_item){ return true; }
               
                , url: 
                    function( _item ){
                        var _r = /^((http|ftp|https):\/\/|)[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , email: 
                    function( _item ){
                        var _r = /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , zipcode: 
                    function( _item ){
                        var _r = /^[0-9]{6}$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }

                , domain:
                    function( _item ){
                        var _r = /^(?:(?:f|ht)tp\:\/\/|)((?:(?:(?:\w[\.\-\+]?)*)\w)*)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})(?:\/|)$/.test( _item.val() );
                        !_r && _logic.error( _item );
                        return _r;
                    }
            }//datatype
        };//_logic

}(jQuery))
