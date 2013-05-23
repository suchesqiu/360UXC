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

                    }


                    if( _p.parseType.hasOwnProperty( _type ) ) {
                        _r = _p.parseType[ _type ].call( _p, _item );
                    }
                });

                return _r;
            }
        
        , getType: 
            function( _item ){
                return ( _item.attr('datatype') || 'text').toLowerCase();
            }

        , parseType: {
            "text": 
                function(){
                    //alert('text');
                    UXC.log( 'parseType.text' );
                }
            , "url": 
                    function(){

                    }
            , "email": 
                function(){

                }
            , "zipcode": 
                function(){

                }
        }

        , triggerError: 
            function(){

            }

    };

}(jQuery))
