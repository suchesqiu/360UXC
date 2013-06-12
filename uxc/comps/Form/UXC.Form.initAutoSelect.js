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
            _selector.find( 'select[defaultselect]' ).each( function(){
                var _tmp = getSelectList( this );
                if( !(_tmp && _tmp.length ) ) return;
                $.each( _tmp, function( _ix, _item ){
                    $(_item).on('change', changeEvent);
                });
                $(_tmp[ _tmp.length - 1 ]).data('isLastSelect', true);
                _tmp[0].trigger('change');
            });
        };

    UXC.Form.initAutoSelect.hideEmpty = false;

    $(document).ready( function( _evt ){
        UXC.Form.initAutoSelect( document );
    });

    function changeEvent( _evt ){
        var _p = $(this), _val;
        UXC.log( _p.prop( 'name' ) );

        if( _p.is('[selectvalue]') ){
            _val = $.trim( _p.attr('selectvalue') );
            _p.removeAttr( 'selectvalue' );
            UXC.log( 1, '_val', _val );
            if( hasVal( _p, _val ) ){
                UXC.log( 1, 1 );
                _p.val( _val );
                var _selectval = _val;
                if( _p.is( '[selecttarget]' ) ){
                    var _target = $(_p.attr('selecttarget'));
                    if( _target.is( '[selectvalue]' ) ){
                        _selectval = _target.attr('selectvalue');
                        _target.removeAttr('selectvalue');
                    }
                    if( _target.is( '[selecturl]' ) ){
                        var  _reqval = _val
                            , _url = add_url_param_x( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                        if( _target.data('parentSelect') ){
                            _reqval = _target.data('parentSelect').val();
                        }
                        _url = _url.replace( /\{0\}/g, _reqval );

                        getData( _target, _url, _selectval, triggerChange);
                    }
                }
            }else{
                UXC.log( 1, 2 );
                if( _p.is( '[selecturl]' ) ){
                    var  _reqval = _val
                        , _url = add_url_param_x( _p.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                    if( _p.data('parentSelect') ){
                        _reqval = _p.data('parentSelect').val();
                    }
                _url = _url.replace( /\{0\}/g, _reqval );

                getData( _p, _url, _val, function( _select ){
                    if( _select.is( '[selecttarget]' ) ){
                        var _target = $(_select.attr('selecttarget'));
                        if( _target.is( '[selectvalue]' ) ){
                            _val = _target.attr('selectvalue');
                            _target.removeAttr('selectvalue');
                        }
                        if( _target.is( '[selecturl]' ) ){
                            var  _reqval = _val
                                , _url = add_url_param_x( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                            if( _target.data('parentSelect') ){
                                _reqval = _target.data('parentSelect').val();
                            }
                            _url = _url.replace( /\{0\}/g, _reqval );

                            getData( _target, _url, _val, triggerChange);
                        }
                    }
                });
                }
            }
        }else{
            _val = _p.val();
            UXC.log( 2, '_val', _val );
            if( hasItem( _p ) ){
                UXC.log( 2, 1 );
                if( _p.is( '[selecttarget]' ) ){
                    UXC.log( 2, 1, 1 );
                    var _target = $( _p.attr('selecttarget') );
                    var _selectval = _val;
                    if( _target.is( '[selectvalue]' ) ){
                        _selectval = _target.attr('selectvalue');
                        _target.removeAttr('selectvalue');
                    }

                    if( _target.is( '[selecturl]' ) ){
                        UXC.log( 2, 1, 1, 1 );
                        var  _reqval = _val
                            , _url = add_url_param_x( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );

                        if( _target.data('parentSelect') ){
                            _reqval = _target.data('parentSelect').val();
                        }
                        _url = _url.replace( /\{0\}/g, _reqval );

                        getData( _target, _url, _val, triggerChange);
                    }
                }else{
                    UXC.log( 2, 1, 2 );
                    var _target = _p;
                    if( _target.is( '[selecturl]' ) ){
                        var  _reqval = _val
                            , _url = add_url_param_x( _target.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                        if( _target.data('parentSelect') ){
                            _reqval = _target.data('parentSelect').val();
                        }
                        UXC.log( _reqval );
                        _url = _url.replace( /\{0\}/g, _reqval );
                        /**
                         * 如果是最后一个SELECT, 那么取消数据请求
                         */
                        if( _target.data('isLastSelect') ){
                            if( ( parseInt( _reqval ) || 0 ) < 1 ){
                                removeOption( _target );
                            }
                           return;
                        }
                        getData( _target, _url, _val, triggerChange);
                    }

                }
            }else{
                UXC.log( 2, 2 );
                var _val = '', _url = add_url_param_x( _p.attr( 'selecturl' ), { 'rnd': new Date().getTime() } );
                _p.data('parentSelect') && ( _val = _p.data('parentSelect').val() );
                _url = _url.replace( /\{0\}/g, _val );

                getData( _p, _url, _val, triggerChange );
            }
        }
    }//end changeEvent

    function triggerChange( _select ){
        if( _select.is( '[selecttarget]' )  ){
            $( _select.attr('selecttarget') ).trigger('change');
        }
    }

    function getData( _select, _url, _selectval, _callback ){
        $.getJSON( _url, function( _r ){
            //TODO: 这里应该添加返回数据处理回调
            if( !_r ) return;
            removeOption( _select );

            if( UXC.Form.initAutoSelect.hideEmpty ){
                !_r.length && _select.hide();
                _r.length && _select.show();

            }

            var _optls = [];
            for( var i = 0, j = _r.length; i < j; i++ )
                _optls.push( '<option value="'+_r[i][0]+'">'+ _r[i][1] +'</option>' );

            $( _optls.join('') ).appendTo( _select );
            hasVal( _select, _selectval ) ? _select.val( _selectval ) : selectFirst( _select );
            _callback && _callback( _select );
        });
    }//end getData

    function isEmpty( _select ){
        var _r = true;
        _select.find('option').each( function(){
            var _tmp = $(this);
            if( !_tmp.is( '[defaultoption]' ) ){
                return _r = false;
            }
        });
        return _r;
    }

    function selectFirst( _select ){
        var _ls = _select.find('option');
        if( _ls.length ){
            _select.val( _ls.first().val() );
        }
    }

    function removeOption( _select ){
        var _ls = _select.find('option');
        for( var i = _ls.length - 1; i >= 0; i-- ){
            var _item = $(_ls[i]);
            if( _item.is( '[defaultoption]' ) ) continue;
            _item.remove();
        }
    }

    function hasVal( _select, _val ){
        var _r = false, _val = _val.toString();
        _select.find('option').each( function(){
            var _tmp = $(this);
            if( _tmp.val() == _val ){
                _r = true;
                return false;
            }
        });
        return _r;
    }

    function hasItem( _select ){
        var _r = false;
        _select.find('option').each( function(){
            var _tmp = $(this);
            if( _tmp.is( '[defaultoption]' ) ) return;
            _r = true;
            return false;
        });
        return _r;
    }

    function getSelectList( _select, _ar ){
        _select = $(_select);
        if( !_ar ){
            _ar =[ _select ];
            arguments.callee( _select, _ar );
        }else if( _select.length && _select.is( '[selecttarget]' ) ){
            var _target = $(_select.attr('selecttarget'));
            if( _target.length ){
                _target.data( 'parentSelect', _ar[ _ar.length - 1 ] );
                _ar.push( _target );
                arguments.callee( _target, _ar );
            }
        }
        return _ar;
    }

    /**
     * 取URL参数的值
     * x@btbtd.org  2012/4/24 
     * @example
            var defaultTag = get_url_param(location.href, 'tag');  
     */ 
    function get_url_param( $url, $key )
    {
        var result = '';
        if( $url.indexOf('#') > -1 ) $url = $url.split('#')[0];
        
        if( $url.indexOf('?') > -1 )
        {
            var paramAr = $url.split('?')[1].split('&');
            for( var i = 0; i < paramAr.length; i++ )
            {
                var items = paramAr[i].split('=');
                
                items[0] = items[0].replace(/^\s+|\s+$/g, '');
                 
                if( items[0].toLowerCase() == $key.toLowerCase() )
                {
                    result = items[1];
                    break;
                } 
            }
        }
        
        return result;
    }
     
    /**
     * 添加URL参数
     * x@btbtd.org  2012/4/24 
     * @example
            var url = add_url_param( location.href, {'key': 'tag', 'value': tag } );
     */ 
    function add_url_param( $url, $param )
    {
        var sharp = '';
        if( $url.indexOf('#') > -1 )
        {
            sharp = $url.split('#')[1];
            $url = $url.split('#')[0];
        }
        
        $url = del_url_param($url, $param.key);
        
        if( $url.indexOf('?') > -1 )
        {
            $url += '&' + $param.key +'=' + $param.value;
        }
        else
        {
            $url += '?' + $param.key +'=' + $param.value;
        }
        
        if( sharp )
        {
            $url += '#' + sharp;
        }
        
        $url = $url.replace(/\?\&/g, '?' );
        
        return $url;   
    }
    /**
     * 批量添加URL参数
     * require: add_url_param
     * x@btbtd.org 2013/3/22  
     */ 
    function add_url_param_x( $url, $param )
    {
        for( var k in $param ) $url = add_url_param( $url, {'key': k, 'value': $param[k]} );
        return $url;
    }
     
    /**
     * 删除URL参数
     * x@btbtd.org  2012/4/24  
     * @example
            var url = del_url_param( location.href, 'tag' );
     */ 
    function del_url_param( $url, $key )
    {
        var sharp = '';
        if( $url.indexOf('#') > -1 )
        {
            sharp = $url.split('#')[1];
            $url = $url.split('#')[0];
        }
        
        if( $url.indexOf('?') > -1 )
        {
            var params = $url.split('?')[1];
            var $url = $url.split('?')[0];
            
            var paramAr = params.split('&');
            var newParamAr = [];
            for( var i = 0; i < paramAr.length; i++ )
            {
                var items = paramAr[i].split('=');
                
                items[0] = items[0].replace(/^\s+|\s+$/g, '');
                 
                if( items[0].toLowerCase() == $key.toLowerCase() )
                {
                    continue;
                } 
                newParamAr.push( items.join('=') )
            }
            $url += '?' + newParamAr.join('&');
        }
        
        if( sharp )
        {
            $url += '#' + sharp;
        }
        
        return $url;
    }

}(jQuery));

