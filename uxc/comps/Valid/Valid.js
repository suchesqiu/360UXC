(function($){
    /**
     * 表单验证类
     * @constructor
     * @public
     * @exports         UXC.Valid
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
     *
     * @param      {dom|jq form ele}    _fmItem -   需要验证规则正确与否的表单项
     * @returns    {boolean}
     *
     * @example 
     *          UXC.Valid.check( $('input.needValid') );
     *          UXC.Valid.check( document.getElementById('inpuNeedValid') );
     */
    Valid.check = function( _fmItem ){

    };
     /**
     * 验证整个表单是否符合规则
     * @method
     * @public
     *
     * @param      {dom form/jq form}   _fm -       需要验证规则正确与否的表单项
     * @returns    {boolean}
     */
    Valid.checkAll = function( _fm ){

    };

    Valid.prototype = {

    };

    if( window.UXC ) UXC.Valid = Valid;
}(jQuery))
