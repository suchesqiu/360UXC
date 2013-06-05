/**
 * 通用会话提示 功能扩展  
 * @require     mergeObject
 * @author      suches@btbtd.org
 * @date        2011-8-1 
 * @example
 * <code>
        <link rel="stylesheet" href="dialog/dialog.css" type="text/css" />
        <script src='../XDialog.js'></script>
        <script src='../XDialog_extend.js'></script>
        <script>
        
        XDialog.alert( 'hello' );
        XDialog.confirm( 'hello', function(){ alert(111) } );
        
        </script>
 * </code>      
 */ 
void function()
{
    if( !window.XDialog ) return;
        
    XDialog.alert =
    function( $msg, $callback, $cancelCallback, $params )
    {
        var p = 
        {
            msg: $msg,
            callback: $callback,
            cancelCallback: $cancelCallback,
            
            tpl: 
            [
            "<div class=\"dialog_ts_box dialog_cfix\">\n"
            ,"	<div class=\"dialog_ts_boxA dialog_cfix\">\n"
            ,"    	<div class=\"dialog_ts_boxB\">\n"
            ,"    		<p class=\"three\"><a href=\"#\" title=\"\" class='close__'></a></p>\n"
            ,"    		<p class=\"one text__\">您确定要清除所有记录么？</p>\n"
            ,"    		<p class=\"two\">\n"
            ,"                <input type=\"button\" class=\"dialog_image submit__\" />\n"
            ,"            </p>\n"
            ,"    	</div>\n"
            ,"	</div>\n"
            ,"</div>\n"
            ].join('')
             
        };        
        p = mergeObject( p, $params );
        
        if( $params ){ for( var k in $params) p[k] = $params[k]; }        
    
        return XDialog.exec( p );
    };
    
    
    XDialog.confirm =
    function( $msg, $callback, $cancelCallback, $params )
    {
        var p = 
        {
            msg: $msg,
            callback: $callback,
            cancelCallback: $cancelCallback,
            
            tpl: 
            [
            "<div class=\"dialog_ts_box dialog_cfix\">\n"
            ,"	<div class=\"dialog_ts_boxA dialog_cfix\">\n"
            ,"    	<div class=\"dialog_ts_boxB\">\n"
            ,"    		<p class=\"three\"><a href=\"#\" title=\"\" class='close__'></a></p>\n"
            ,"    		<p class=\"one text__\">您确定要清除所有记录么？</p>\n"
            ,"    		<p class=\"two\">\n"
            ,"                <input type=\"button\" class=\"dialog_image submit__ \" />\n"
            ,"                <a href=\"#\" title=\"\" class='cancel__'>取消</a>\n"
            ,"            </p>\n"
            ,"    	</div>\n"
            ,"	</div>\n"
            ,"</div>\n"
            ].join('')
             
        };        
        p = mergeObject( p, $params );
        
        if( $params ){ for( var k in $params) p[k] = $params[k]; }        
    
        return XDialog.exec( p );
    };
}();
