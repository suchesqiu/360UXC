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

    };
    /**
     * @private
     */
    Valid.prototype = {
        parse: 
            function(  ){
                var _p = this, _r = true;

                _p.items.each( function( _ix, _e ){

                    var _item = $(_e), _type = _p.getType( _item );

                    UXC.log( _type );

                    if( _item.is('[reqmsg]') ){
                        if( ! _p['reqmsgValid']( _item ) ) {
                            _r = false;
                            return;
                         }
                    }

                    _p.hasOwnProperty( _type ) && ( 
                        !_p[ _type ]( _item ) && ( _r = false )
                    );
                });

                return _r;
            }
        
        , getType: 
            function( _item ){
                return ( _item.attr('datatype') || 'text').toLowerCase() + 'Valid';
            }

        , triggerError: 
            function( _item, _msgAttr ){
                var _msg = this.getMsg.apply( this, [].slice.call( arguments ) );

                _item.addClass( 'error' );
                _item.find('+ em').hide();

                var _errEm = _item.find('+ em.error');
                if( !_errEm.length ){
                    ( _errEm = $('<em class="error"></em>') ).insertAfter( _item );
                }
                _errEm.html( _msg ).show();

                return false;
            }

        , getMsg: 
            function( _item, _msgAttr ){
                var _msg = _item.attr('errMsg') || _item.attr('regmsg') || '';
                _msgAttr && (_msg = _item.attr( _msgAttr ) || _msg );

                if( _msg && !/^[\s]/.test( _msg ) ){
                    switch( _item.prop('type').toLowerCase() ){
                        case 'text': _msg = '请填写' + _msg; break;
                        case 'select': _msg = '请选择' + _msg; break;
                    }
                }

                UXC.log( '_msg: ' + _msg );

                return _msg;
            }

        , toString:
            function(){
                return 'UXC.Valid';
            }
        
        , reqmsgValid: 
            function( _item ){
                var _r = false, _type = _item.prop('type').toLowerCase();

                _r = !!( _item.val().trim() );

                !_r && this.triggerError( _item, 'reqmsg' );

                return _r;
            }

        , textValid: 
            function(){
                //alert('text');
                UXC.log( 'parseType.text', this.toString() );
            }
        
        , urlValid: 
            function(){

            }

        , emailValid: 
            function(){

            }

        , zipcodeValid: 
            function(){

            }


    };

}(jQuery))
