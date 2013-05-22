(function($){
    if( window.UXC ) UXC.Valid = Valid;
    /**
     * 表单验证类
     * @alias UXC.Valid
     * @class
     * @public
     * @global
     *
     * @desc提供两个静态方法供外部调用
     *      分别为 
     *          Valid.check      return  bool     验证一个表单项, 如文本框/选择框     
     *          Valid.checkAll   return  bool     验证整个表单
     *
     * @author          qiushaowei   2013-05-22
     */
    function Valid(){

    }
    /**
     * 验证一个表单项, 如 文本框, 下拉框, 复选框, 单选框, 文本域, 隐藏域
     * @method
     * @public
     * @memberof Valid
     *
     * @param      {elements}    _fmItem -   需要验证规则正确与否的表单项
     *
     * @example 
     *          UXC.Valid.check( $('input.needValid') );
     *          UXC.Valid.check( document.getElementById('inpuNeedValid') );
     *
     * @returns    {boolean}
     */
    Valid.check = function( _fmItem ){

    };
     /**
     * 验证整个表单是否符合规则
     * @method
     * @public
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
