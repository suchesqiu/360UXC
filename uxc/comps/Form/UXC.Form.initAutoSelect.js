 ;(function($){
    /**
     * 初始化 级联下拉框
     * @method  initAutoSelect
     * @static
     * @for UXC.Form
     * @version dev 0.1
     * @author  qiushaowei   <suches@btbtd.org> | 360 UXC-FE Team
     * @date    2013-06-11
     * @param   {selector}  _selector   要初始化的级联下拉框父级节点
     * @example
     */
    UXC.Form.initAutoSelect = 
        function( _selector ){
            _selector = $( _selector );

            var _ls = [];

            _selector.find( 'select[defaultselect]' ).each( function(){
                var _tmp = getSelectList( this );
                    _ls.push( _tmp );
                UXC.log( _tmp.length );
            });
        };

    $(document).ready( function( _evt ){
        UXC.Form.initAutoSelect( document );
    });

    function getSelectList( _select, _ar ){
        _select = $(_select);
        if( !_ar ){
            _ar =[ _select ];
            arguments.callee( _select, _ar );
        }else if( _select.length && _select.is( '[selecttarget]' ) ){
            var _target = $(_select.attr('selecttarget'));
            if( _target.length ){
                _ar.push( _target );
                arguments.callee( _target, _ar );
            }
        }
        return _ar;
    }

}(jQuery));

