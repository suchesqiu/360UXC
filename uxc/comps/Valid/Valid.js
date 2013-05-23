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
     *      Valid 有且仅有一个实例, 为单例模式<br />
     * @requires jQuery
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org>
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
    Valid.check = function( _fmItem ){
        return new Valid( _fmItem ).parse();
    };
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
     * @private
     */
    Valid.prototype = {
        parse: 
            function(  ){
                var _p = this, _r = true;

                _p.items.each( function( _ix, _e ){

                    var _item = $(_e), _type = _p.getDatatype( _item );

                    if( _item.is('[disabled]') ) return;

                    UXC.log( _type );

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

                    if( _type in _p ){
                        if( !_p[ _type ]( _item ) ){
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
                return ( _item.attr('datatype') || 'text').toLowerCase() + 'Valid';
            }

        , error: 
            function( _item, _msgAttr ){
                var _msg = this.getMsg.apply( this, [].slice.call( arguments ) );

                _item.addClass( 'error' );
                _item.find('~ em').hide();

                var _errEm = _item.find('~ em.error');
                if( !_errEm.length ){
                    ( _errEm = $('<em class="error"></em>') ).insertAfter( _item );
                }
                _errEm.html( _msg ).show();

                return false;
            }
        
        , valid:
            function( _item ){
                _item.removeClass('error');
                _item.find('~ em').show();
                _item.find('~ em.error').hide();
            }

        , getMsg: 
            function( _item, _msgAttr ){
                var _msg = _item.is('[errmsg]') ? ' ' + _item.attr('errmsg') : _item.is('[reqmsg]') ? _item.attr('reqmsg') : '';
                _msgAttr && (_msg = _item.attr( _msgAttr ) || _msg );

                if( _msg && !/^[\s]/.test( _msg ) ){
                    switch( _item.prop('type').toLowerCase() ){
                        case 'text': _msg = '请填写' + _msg; break;
                        case 'select': _msg = '请选择' + _msg; break;
                    }
                }

                UXC.log( '_msg: ' + _msg );

                return _msg.trim();
            }

        , toString:
            function(){
                return 'UXC.Valid';
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

                !_r && this.error( _item );

                return _r;
            }
        
        , reqmsgValid: 
            function( _item ){
                var _r = true;
                _r = !!( _item.val().trim() );
                !_r && this.error( _item, 'reqmsg' );
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
            function(){
                UXC.log( 'parseType.text', this.toString() );
            }
        
        , urlValid: 
            function( _item ){
                var _r = true, _re =  /^((http|ftp|https):\/\/|)[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])$/;
                _r = _re.test( _item.val() );
                !_r && this.error( _item );
                return _r;
            }

        , emailValid: 
            function(){

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
