/**
 * 给链接添加自定义参数
 * @className XLinkParams
 * @requires    QWrap,          JS框架 
                add_url_param,  添加URL参数
                del_url_param,  删除URL参数
                
 * @example
                <ul>
                    <li><a href="http://www.baidu.com" data-lks="{key1:'key1val', key2:'key2val', key3:'key3val'}">baidu.com</a></li>
                    <li><a href="http://www.google.com" data-lks="{key1:'key1val', key2:'key2val', key3:'key3val'}">google.com</a></li>
                    <li><a href="http://cn.bing.com" data-lks="{key1:'key1val', key2:'key2val', key3:'key3val'}">bing.com</a></li>
                    <li><a href="http://cn.yahoo.com" id="yahoo" data-lks="{key1:'key1val'}">yahoo.com</a></li>
                    <li><a href="http://sogou.com" id="sogou" data-lks="{key1:'key1val'}">sogou.com</a></li>
                    <li><a href="###test" data-lks="{key1:'key1val', key2:'key2val', key3:'key3val'}">test sharp</a></li>
                    <li><a href="http://www.str.com" data-lks="a=av&b=bv" id="str">for string</a></li>
                </ul>
                
                <script>
                //
                //这里是添加 data-lks 属性 自动执行
                //
                Dom.ready
                (
                    function()
                    {        
                        XLinkParams.exec
                        (
                            {
                                'data_key': 'data-lks'
                            }
                        );
                    }
                );
                //
                //这里是使用 invoke 方法, 手动执行
                //如果 A 标签被JS阻止了冒泡行为的话, 则可以使用这个方法手动执行
                // 
                W('#sogou').on
                (
                    'click',
                    function($evt)
                    {
                        $evt.stopPropagation();
                    
                        XLinkParams.invoke( this );
                    }
                );
                W('#yahoo').on
                (
                    'click',
                    function($evt)
                    {
                        $evt.stopPropagation();
                    
                        var data = {key2:'key2val', key3:'key2val'};
                        
                        XLinkParams.invoke( this, data );
                    }
                );
                W('#str').on
                (
                    'click',
                    function($evt)
                    {
                        $evt.stopPropagation();
                        XLinkParams.invoke( this );
                    }
                );
                </script>
                          
 * @author      x@btbtd.org
 * @date        2012/6/4
 */ 
void function()
{    
    var DEFAULT_PARAMS_KEY = 'data-lks';

    function Control( $params )
    {
        this.model = new Model($params).init();
    }
    
    Control.exec =
    function( $params )
    {
        return new Control( $params ).init();
    };
    
    Control.invoke = 
    function( $ele, $data, $data_key )
    {
        if( !$ele ) return;
    
        $data_key = $data_key || DEFAULT_PARAMS_KEY;
        
        $ele = W($ele);
        
        $ele.forEach
        (
            function($ele)
            {
                
                var data = Model.getData($ele, $data_key);
                
                if( data )
                {                    
                    if( $data )
                    {
                        for( var key in $data)
                        {
                            data[key] = $data[key];
                        }
                    }
                }
                else
                {
                    if( $data )
                    {
                        data = $data;
                    }
                }
                
                if( !data ) return;
                
                W($ele).attr( $data_key, Object.stringify( data ) );
                
                Model.inner_invoke( $ele, $data_key );
            }
        );        
    };
    
    Control.prototype =
    {
        init:
        function()
        {
            var p = this;
            
            W(document).delegate
            (
                p.model.selector, 
                "click",
                function( $evt )
                {                    
                    Model.inner_invoke( this, p.model.data_key );
                }                
            );
        
            return this;
        }    
    }
    
    function Model($params)
    {
        this.selector = 'a';
        this.data_key = DEFAULT_PARAMS_KEY;    
        
        for( var k in $params ) this[k] = $params[k];
    }
    
    Model.prototype =
    {
        init:
        function()
        {            
            return this;
        }
    };
    
    Model.inner_invoke = 
    function( $ele, $data_key )
    {
        if( window.navigator.userAgent )
        {
            if( /spider|baidu/i.test( window.navigator.userAgent ) )
            {
                return;
            }
        }
        
        var cur = W($ele);
        var data = Model.getData($ele, $data_key);
        if(!data) return;
        
        var url = cur.get('href');                    
        url = url.replace( /[#]+/g, '#' );
        
        for( var key in data )
        {
            if( !data[key] ) continue;
            url = add_url_param( url, { 'key': key, 'value': data[key]} );
        }
        
        cur.set( 'href', url );
    };
    
    Model.getData = 
    function( $ele, $data_key )
    {
        var r = null;
        var cur = W($ele);
        
        r = cur.attr($data_key);
        
        if( !r ) return r;
        
        r = r.trim();
        if( !r.length ) return r;
        
        try
        { 
            if( /^\{/.test( r ) && /\}$/.test(r) )
            {
                r = r.evalExp();
            }
            else
            {   
                var t = r.split('&');
                r = {};
                for( var i = 0; i < t.length; i++ )
                {
                    var titem = t[i].split('=');
                    r[ titem[0] ] = titem[1];
                }
            }
             
        }catch(ex){ r = null; };
        
        return r;
    };
    
    window.XLinkParams = Control;
}();
