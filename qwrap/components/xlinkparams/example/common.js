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
/**
 * 添加URL参数
 * x@btbtd.org  2012/4/24 
 * @require     del_url_param, 删除URL参数
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
