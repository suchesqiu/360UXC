(function($){
    if( window.UXC ) UXC.Valid = Valid;
    /**
     * @global
     * @desc   这是 {@link Valid|Valid} 组件的全局别名
     * @see Valid
     */
    window.UXCValid = Valid;
    /**
     * 表单验证类
     * @class
     * @global
     * @alias UXC.Valid
     *
     * @classdesc 
     *      全局访问请使用 UXC.Valid 或 UXCValid<br />
     *
     *      提供两个静态方法供外部调用, 分别为: <br />
     *          Valid.check      return  bool     验证一个表单项, 如文本框/选择框<br/>     
     *          Valid.checkAll   return  bool     验证整个表单
     *
     * @requires jQuery
     *
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org>
     * @date    2013-05-22
     */
    function Valid(){

    }
    /**
     * 验证一个表单项, 如 文本框, 下拉框, 复选框, 单选框, 文本域, 隐藏域
     * @method
     * @memberof Valid
     *
     * @param      {elements}    _fmItem -   需要验证规则正确与否的表单项
     *
     * @example 
     *          UXC.Valid.check( $('input.needValid') );
     *          UXC.Valid.check( document.getElementById('inpuNeedValid') );
     *
     * @return    {boolean}
     */
    Valid.check = function( _fmItem ){

    };
     /**
     * 验证整个表单是否符合规则
     * @method
     * @memberof Valid
     *
     * @param      {elements}   _fm -       需要验证规则正确与否的表单项
     * @returns    {boolean}
     */
    Valid.checkAll = function( _fm ){

    };

    Valid.prototype = {

    };

}(jQuery))
