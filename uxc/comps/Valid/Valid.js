(function($){
    if( window.UXC ) UXC.Valid = Valid; else window.UXC = { log:function(){} };
    window.Valid = Valid;
    /**
     * 表单验证类
     * @class
     * @global
     * @alias UXC.Valid
     * @classdesc 
     *      全局访问请使用 UXC.Valid 或 Valid<br />
     * @requires jQuery
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @date    2013-05-22
     */
    function Valid( _fmItem ){
        this.items = $(_fmItem);
    }
    /**
     * 获取 Valid 的唯一实例 
     * @private
     * @return  {Valid}
     */
    Valid._getInstance = 
        function(){
            if( !Valid._instance ) Valid._instance = new Valid();
            return Valid._instance;
        };
    /**
     * 验证一个表单项, 如 文本框, 下拉框, 复选框, 单选框, 文本域, 隐藏域
     * @method
     * @memberof Valid
     * @param      {elements}    _fmItem -   需要验证规则正确与否的表单项
     * @example 
     *          UXC.Valid.check( $('input.needValid') );
     *          UXC.Valid.check( document.getElementById('inpuNeedValid') );
     * @return    {boolean}
     */
    Valid.check = function( _fmItem ){ return new Valid( _fmItem ).parse(); }
     /**
     * 验证整个表单是否符合规则
     * @method
     * @memberof Valid
     * @param      {elements}   _fm -       需要验证规则正确与否的表单项
     * @returns    {boolean}
     */
    Valid.checkAll = function( _fm ){
        _fm = $( _fm );
        var _r = true;

        $( _fm[0].elements ).each( function(){
            !Valid.check( this ) && ( _r = false );
        });
        
        UXC.log( 'Valid.checkAll: ' + _r );

        return _r;
    };
    /**
     * 清除Valid生成的错误样式
     * @method
     * @memberof Valid
     * @param   {form|input|textarea|select|file|password}  _selector -     需要清除错误的选择器
     */
    Valid.clearError = function( _selector ){
        $( _selector ).each( function(){
            var _item = $(this);
            UXC.log( 'clearError: ' + _item.prop('nodeName') );
            switch( _item.prop('nodeName').toLowerCase() ){
                case 'form': 
                    {
                        $( _item[0].elements ).each( function(){
                            if( $(this).is('[disabled]') ) return;
                           Valid.prototype.valid( $(this) );
                        });

                        break;
                    }
                default: Valid.prototype.valid( $(this) ); break;
            }
        });
    }
    /**
     * @private
     */
    Valid.prototype = {
        parse: 
            function(  ){
                var _p = this, _r = true;

                _p.items.each( function( _ix, _e ){

                    var _item = $(_e), _dt = _p.getDatatype( _item ), _subdt = _p.getSubdatatype( _item );

                    if( _item.is('[disabled]') ) return;

                    UXC.log( _dt, _subdt );

                    if( _item.is('[reqmsg]') ){
                        if( ! _p['reqmsgValid']( _item ) ) {
                            _r = false;
                            return;
                         }
                    }

                    if( !_p.lengthValid( _item ) ){
                        _r = false;
                        return;
                    }

                    if( _dt in _p && _item.val() ){
                        if( !_p[ _dt ]( _item ) ){
                            _r = false;
                            return;
                        }
                    }
                    
                    if( _subdt && _subdt in _p && ( _item.val() || _subdt == 'alternativeSubvalid' ) ){
                        if( !_p[ _subdt ]( _item ) ){
                            _r = false;
                            return;
                        }
                    }

                    _p.valid( _item );
                });

                return _r;
            }
        
        , getDatatype: 
            function( _item ){
                return ( _item.attr('datatype') || 'text').toLowerCase().replace(/\-.*/, '') + 'Valid';
            }
       
        , getSubdatatype: 
            function( _item ){
                return ( _item.attr('subdatatype') || 'text').toLowerCase().replace(/\-.*/, '') + 'Subvalid';
            }

        , error: 
            function( _item, _msgAttr, _fullMsg ){
                var _msg = this.getMsg.apply( this, [].slice.call( arguments ) ), _errEm;

                _item.addClass( 'error' );
                _item.find('~ em:not(.error)').hide();

                if( _item.is( '[emEl]' ) ){
                    ( _errEm = $(_item.attr( 'emEl' ) ) ) && _errEm.length && _errEm.addClass('error');
                }
                !( _errEm && _errEm.length ) && ( _errEm = _item.find('~ em.error') );
                if( !_errEm.length ){
                    ( _errEm = $('<em class="error"></em>') ).insertAfter( _item );
                }
                UXC.log( 'error: ' + _msg );
                //setTimeout( function(){ _errEm.html( _msg ).show() }, 200 );
                _errEm.html( _msg ).show() 

                return false;
            }
        
        , valid:
            function( _item ){
                _item.removeClass('error');
                _item.find('~ em').show();
                _item.find('~ em.error').hide();
            }

        , getMsg: 
            function( _item, _msgAttr, _fullMsg ){
                var _msg = _item.is('[errmsg]') ? ' ' + _item.attr('errmsg') : _item.is('[reqmsg]') ? _item.attr('reqmsg') : '';
                _msgAttr && (_msg = _item.attr( _msgAttr ) || _msg );
                _fullMsg && _msg && ( _msg = ' ' + _msg );

                if( _msg && !/^[\s]/.test( _msg ) ){
                    switch( _item.prop('type').toLowerCase() ){
                        case 'file':
                        case 'select': _msg = '请选择' + _msg; break;

                        case 'textarea':
                        case 'password':
                        case 'text': _msg = '请填写' + _msg; break;
                    }
                }

                UXC.log( '_msg: ' + _msg );

                return _msg.trim();
            }

        , toString: function(){ return 'UXC.Valid'; }

        , alternativeSubvalid:
            function( _item ){
                var _r = true, _target, _p = this;

                UXC.log( 'alternativeSubvalid' );

                if( _item.is( '[datatarget]' ) && (_target = $(_item.attr('datatarget')) ).length && !_item.val() ){
                    var _hasVal = false;
                    _target.each( function(){ if( $(this).val() ){ _hasVal = true; return false; } } );
                    _r = _hasVal;
                }

                !_r && this.error( _item, 'alternativemsg', true );
                !_r && _target.length && _target.each( function(){ _p.error( $(this), 'alternativemsg', true ); } );
                _r && _target.length && _target.each( function(){ _p.valid( $(this) ); } );

                return _r;
            }

        , reconfirmSubvalid:
            function( _item ){
                var _r = true, _target, _p = this;

                UXC.log( 'reconfirmSubvalid' );

                if( _item.is( '[datatarget]' ) && (_target = $(_item.attr('datatarget')) ).length ){
                    _target.each( function(){ if( _item.val() != $(this).val() ) return _r = false; } );
                }

                !_r && this.error( _item, 'reconfirmmsg', true );
                !_r && _target.length && _target.each( function(){ _p.error( $(this), 'reconfirmmsg', true ); } );
                _r && _target.length && _target.each( function(){ _p.valid( $(this) ); } );

                return _r;
            }

        , mobilecodeValid: 
            function( _item ){
                var _r = true, _re =  /^(13|15|18|14)\d{9}$/;
                _r = _re.test( _item.val() );
                !_r && this.error( _item );
                return _r;
            }

        , mobilezonecodeValid: 
            function( _item ){
                var _r = true, _re = /^(?:\+[0-9]{1,6}(?: |)|)(?:0|)(?:13|15|18|14)\d{9}$/;
                _r = _re.test( _item.val() );
                !_r && this.error( _item );
                return _r;
            }

        , phonezoneValid: 
            function( _item ){
                var _r = true, _re =  /^[0-9]{3,4}$/;
                _r = _re.test( _item.val() );
                !_r && this.error( _item );
                return _r;
            }

        , phonecodeValid: 
            function( _item ){
                var _r = true, _re =  /^[0-9]{7,8}$/;
                _r = _re.test( _item.val() );
                !_r && this.error( _item );
                return _r;
            }
        
        , phoneextValid: 
            function( _item ){
                var _r = true, _re =  /^[0-9]{1,6}$/;
                _r = _re.test( _item.val() );
                !_r && this.error( _item );
                return _r;
            }

        , lengthValid: 
            function( _item ){
                var _r = true, _dt = this.getDatatype( _item ), _min, _max, _val = _item.val().trim();

                if( _item.is( '[minlength]' ) ){
                    UXC.log( 'minlength' );
                    _min = parseInt( _item.attr( 'minlength' ), 10 ) || 0;
                }
                
                if( _item.is( '[maxlength]' ) ){
                    UXC.log( 'maxlength' );
                    _max = parseInt( _item.attr( 'maxlength' ), 10 ) || 0;
                }
                /**
                 * //TODO 根据特殊的 datatype 实现不同的计算方法
                 */
                switch( _dt ){
                    default:
                        {
                            _min && ( _val.length < _min ) && ( _r = false );
                            _max && ( _val.length > _max ) && ( _r = false );
                            break;
                        }
                }

                UXC.log( 'lengthValid: ', _min, _max, _r );

                !_r && this.error( _item );

                return _r;
            }
        
        , reqmsgValid: 
            function( _item ){
                var _r = true;
                _r = !!( _item.val().trim() );
                !_r && this.error( _item, 'reqmsg' );
                UXC.log( 'regmsgValid: ' + _r );
                return _r;
            }

        , regValid: 
            function( _item ){
                var _r = true, _pattern, _dt, _parts; 
                if( _item.is( '[reg-pattern]' ) ) _pattern = _item.attr( 'reg-pattern' );
                if( !_pattern ) _pattern = _item.attr('datatype').trim().replace(/^reg(?:\-|)/i, '');

                _pattern.replace( /^\/([\s\S]*?)\/([\w]{0,3})$/, function( $0, $1, $2 ){
                    UXC.log( $1, $2 );
                    _r = new RegExp( $1, $2 || '' ).test( _item.val() );
                });

                !_r && this.error( _item );

                return _r;
            }

        , textValid: 
            function( _item ){
                var _r = true;
                UXC.log( 'parseType.text', this.toString() );
                return _r;
            }
        
        , urlValid: 
            function( _item ){
                var _r = true, _re =  /^((http|ftp|https):\/\/|)[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])$/;
                _r = _re.test( _item.val() );
                !_r && this.error( _item );
                return _r;
            }

        , emailValid: 
            function( _item ){
                var _r = true, _re = /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                _r = _re.test( _item.val() );
                !_r && this.error( _item );
                return _r;
            }

        , zipcodeValid: 
            function( _item ){
                var _r = true, _re = /^[0-9]{6}$/;
                _r = _re.test( _item.val() );
                !_r && this.error( _item );
                return _r;
            }

        , domainValid:
            function( _item ){
                var _r = true, _re = /^(?:(?:f|ht)tp\:\/\/|)((?:(?:(?:\w[\.\-\+]?)*)\w)*)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})(?:\/|)$/;
                _r = _re.test( _item.val() );
                !_r && this.error( _item );
                return _r;
            }
    };

}(jQuery))
