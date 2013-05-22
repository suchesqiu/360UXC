(function($){
    if( window.UXC ) UXC.Valid = Valid;
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
    function Valid(){
        if( Valid._instance ) throw new Error("UXC.Valid can't be multi-instance!");
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
        return Valid._getInstance.parse( _fmItem );
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
            function( _fmItem ){
                _fmItem = $(_fmItem );
                var _p = this, _type = _p.parseType( _fmItem ), _r = true;

                if( _fmItem.is('[reqmsg]') ){

                }

                if( _p.hasOwnProperty( _type ) ){
                    _r = _p[ _type ]( _fmItem );
                }

                return _r;
            }
        , parseType: 
            function( _fmItem ){
                return (_fmItem.attr('datatype') || 'text') + 'Type';
            }
        , triggerError: 
            function(){

            }

    };

}(jQuery))
