/**
 * 通用会话提示 基类
 * @className   XDialog
 *   
 * @require     XMask			遮罩层蒙板, 类
                getMaxIndex		取得页面最高的 z-index, 函数
                stopPropagation		阻止事件冒泡, 函数
                xeach			遍历键值对象或数组, 函数
                getClass		从 css class 获取DOM节点, 函数
                attach_event_f		兼容各浏览器的附加事件函数
                viewport_f		取屏幕的可用大小相关值, 函数
                remove_array_item	删除数组指定索引, 函数
                KillClass		删除 css class, 函数
                AddClass		添加 css class, 函数  
                isFF            判断是否为 Firefox 浏览器
 *             
 * @example
                <button id="test">test</button>
                <script>
                    var test = document.getElementById("test");
                    var count = 1;
                    
                    test.onclick = 
                    function()
                    {
                        newDialog();
                    };
                    
                    var popup =
                    [
                    "<div style=\"width: 500px; height: 200px; border:1px solid #fff; bacground:#fff\">\n"
                    ,"    <p class=\"close__\" style=\"text-align:right;\">X</p>\n"
                    ,"    <div class=\"text__\"></div>\n"
                    ,"    <p>\n"
                    ,"        <button type=\"button\" class=\"submit__\">submit</button>        \n"
                    ,"        <button type=\"button\" class=\"cancel__\">cancel</button>        \n"
                    ,"    </p>\n"
                    ,"</div>\n"
                    ].join('');
                    
                    function newDialog()
                    {
                        XDialog.exec
                        (
                            {
                                "tpl": popup
                                , "msg": "test content, " + (count++)
                                , "submitCallback": newDialog
                                , "cancelCallback": cancelCallback
                            }
                        );
                        
                        return false;
                    }
                    
                    function cancelCallback()
                    {
                        alert( this.model.getDialog().innerHTML )
                    }
                </script>
 *           
 * @css
                <style>
                    .MASK_OVERFLOW
                    {
                        overflow-x:hidden;
                    }
                </style>
 *          
 * @update      2012-3-22 
 * @author      suches@btbtd.org
 * @date        2011-8-1 
 * @version     1.1 
 */ 
void function()
{    
    var INITED = false;
    var BOX;
    
    var INS_COUNT = 0;
    var INS = [];
    
    var isIE6 = !-[1,] && !window.XMLHttpRequest;

    function Control( $params )
    {
        this.model = new Model($params);
        this.view = new View( this.model );
        
        this.model.id = ++INS_COUNT;        
        INS.push( this );    
    }
    
    Control.exec =
    function( $params )
    {
        var ins = new Control( $params ).init();
            
        return ins;
    };
    
    Control.closeAll =
    function()
    {
       for( var i = INS.length -1; i >=0; i-- )
       {
            try{ INS[i].view.close(); }catch(ex){};
       }  
       INS = [];
    };
    
    Control.prototype =
    {
        init:
        function()
        {
            if(!INITED)
            {
                BOX = document.createElement('div');
                document.body.appendChild( BOX) ;
                INITED = true;
            }
            
            this.view.init();
            
            return this;
        },
        
        setIndex:
        function( $ix )
        {
            this.view.setIndex( $ix );
        }
    }
    
    function Model($params)
    {        
        this.id;
        
        this.tpl;
        this.msg;
        
        this.callback;          //.submit__ 的回调
        this.submitCallback;    //同 callback
        
        this.cancelCallback;    //.calcel__ 的回调
        this.closeCallback;     //.close__ 的回调
        this.initCallback;      //初始化后的回调
        
        this.dialog;
        this.autoVertical = true; //垂直方向是否自适应,默认是
        
        for( var k in $params ) this[k] = $params[k];
        
        this.callback = this.callback || this.submitCallback;
        
        this.autoy = true;
    }
    
    Model.prototype =
    {        
        getDialog:
        function()
        {
            var _ = this;
            
            if( !_.dialog )
            {
                _.dialog = document.createElement( 'div' );
                _.dialog.innerHTML = _.tpl;
                BOX.appendChild( this.dialog );              
            }        
            return _.dialog;
        },
        
        topIns:
        function()
        {
            if( !INS.length ) return null;
            
            var r = INS[ INS.length - 1 ] ;
            
            for( var i = INS.length - 2; i >= 0; i-- )
            {
                if( INS[i].model.id > r.model.id ) r = INS[i];
            }
            
            return r;
        }
    };
    
    function View( $model )
    {
        this.model = $model;
    }
    
    View.prototype = 
    {
        init:
        function()
        {
            this.initDialog();
            
            this.displayMask();
            
            this.model.getDialog().style.zIndex  = getMaxIndex();
            this.show();
        },
        
        initDialog:
        function()
        {
            var _ = this;
            var dialog = _.model.getDialog();
            
//             dialog.onclick =            
//             function($evt)
//             {
//                 stopPropagation($evt);
//                 return false;
//             };
                
            xeach
            (
                getClass( 'text__', dialog ),
                function( $e )
                {
                    if( _.model.msg ) $e.innerHTML = _.model.msg;
                }
            );  
            
            xeach
            (
                getClass( 'close__', dialog ),
                function( $e )
                {
                    $e.onclick =
                    function( $evt )
                    {
                        stopPropagation($evt);
                        
                        if( _.model.closeCallback )
                        {
                            if( _.model.closeCallback.call( _, this, $evt ) === false )
                            {
                                return false;
                            }
                        }
                        _.close();
                        return false;
                    };
                }
            );   
            
            xeach
            (
                getClass( 'cancel__', dialog ),
                function( $e )
                {
                    $e.onclick =
                    function( $evt )
                    {
                        stopPropagation($evt);
                        
                        if( _.model.cancelCallback )
                        {
                            if( _.model.cancelCallback.call( _, this, $evt ) === false )
                            {
                                return false;
                            }
                        }
                        _.close();
                        return false;
                    };
                }
            ); 
            
            xeach
            (
                getClass( 'submit__', dialog ),
                function( $e )
                {
                    $e.onclick =
                    function( $evt )
                    {
                        stopPropagation($evt);
                        
                        if( _.model.callback )
                        {
                            if( _.model.callback.call( _, this, $evt ) === false )
                            {
                                return false;
                            }
                        }
                        _.close();
                        return false;
                    };
                }
            );  
            
            attach_event_f
            (  
                window,
                'resize',
                function($evt)
                {
                    if( !_.model.autoy ) return;
                
                    if( !INS.length ) return;
                                 
                    if( XMask.isHide() ) return;
                    _.show();
                }
            );
            
            attach_event_f
            (  
                window,
                'scroll',
                function($evt)
                {
                    if( !_.model.autoVertical ) return;
                    if( !INS.length ) return;
                                 
                    if( XMask.isHide() ) return;
                    _.show();
                }
            );
            if( _.model.initCallback )
            {
                _.model.initCallback.call( this, _.model.getDialog() );
            }
        },
        show:
        function()
        {
            var o = this;
            var dialog = this.model.getDialog();                
            var size = viewport_f();
            
            if( isIE6 )
            {            
                dialog.style.position = 'absolute'; 
                
                dialog.style.left = ( size.max_width - dialog.offsetWidth ) / 2 + 'px';
                dialog.style.top = size.scrollTop + ( size.height - dialog.offsetHeight ) / 2 + 'px';
                         
                if( size.height < dialog.offsetHeight )
                {
                    dialog.style.top = size.scrollTop + 'px';
                }
            }
            else
            {
                dialog.style.position = 'absolute';
                
                dialog.style.left = ( size.max_width - dialog.offsetWidth ) / 2 + 'px';
                dialog.style.top = ( size.height - dialog.offsetHeight ) / 2 + 'px';
                                
                if(o.model.autoVertical)
                {
                    dialog.style.position = 'fixed';
                                        
                    if( size.height < dialog.offsetHeight )
                    {
                        dialog.style.top = '0px';
                    }
                }
                else
                {
                    dialog.style.top = size.scrollTop + ( size.height - dialog.offsetHeight ) / 2 + 'px';  
                    
                    if( size.height < dialog.offsetHeight )
                    {
                        dialog.style.top = size.scrollTop + 'px';
                    }
                }
            }
        },
        
        hide:
        function()
        {
            this.close();
        },
        
        setIndex:
        function( $ix )
        {
            this.model.getDialog().style.zIndex = $ix;
        },                        
        
        close:
        function()
        {
            this.isNull = true;
            
            if( !INS.length ) return;
            
            for( var i = INS.length -1; i >= 0; i-- )
            {
                var item = INS[i];
                
                if( item.model.id === this.model.id )
                {
                    INS = remove_array_item( INS, i );
                    break;
                }
            }
            
            BOX.removeChild( this.model.dialog );
            
            if( !INS.length )
            {
                this.hideMask();
            }
            else
            {
                var topIns = this.model.topIns();
                if( topIns && topIns.setIndex )
                {   
                    topIns.setIndex( getMaxIndex() );
                }
            }
        },
        
        hideMask:
        function()
        {
            if( !isFF() ) KillClass( document.documentElement, 'MASK_OVERFLOW' );
            XMask.exec().hide();
        },
        
        displayMask:
        function()
        {            
            if( !isFF() ) AddClass( document.documentElement, 'MASK_OVERFLOW' );            
            XMask.exec().show();
        }
    };
    
    window.XDialog = Control;
}();
