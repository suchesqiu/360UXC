/**
 * 微博 @ 字符自动提示 for input[text]/textarea
 * @className   XAtComplete
 *  
 * @requires            
                getMaxIndex,        获取页面上最大的z-index值, 并+1            
                getId,              从对象ID取得DOM对象
                add_url_param,      添加URL参数
                XAppendScript,      DOM方式添加脚本块
                attach_event_f,     兼容各浏览器的附加事件函数
                keycode_f,          取得键盘按键charcode
                ele_pos_f,          取某个元素的座标和大小
                get_cursor,         获取 控件 光标位置
                set_cursor,         设置 控件 光标位置
                stopPropagation,    阻止事件冒泡
                preventDefault,     阻止事件默认行为
                AddClass,           给标签添加 CSS class
                KillClass,          删除标签的 CSS class
                HasClass,           判断标签是否有某个 CSS class
                
 * @example
                <link rel="stylesheet" type="text/css" href="res/style.css" />
                
                <textarea id="txa" class="txa xat_control_"></textarea>
                
                <dl class="xat_box" style="right: 200px; bottom: 200px;">
                    <dt>选择昵称或轻敲空格完成输入</dt>
                    <dd>
                        <ul>
                            <li>盛大创新院</li>
                            <li>盛大创新院搜索主题院</li>
                            <li class="on">盛大创新院</li>
                            <li>盛大创新院搜索主题院</li>
                            <li>盛大创新院</li>
                            <li class="sloading" isset="1">数据加载中, 请稍候...</li>
                            <li>盛大创新院搜索主题院</li>
                        </ul>
                    </dd>
                </dl>    
                
                <script src="../XAtComplete.js"></script>
                <script src="res/common.js"></script>
                <script>   
                           
                XAtComplete.updateQuanloo =
                function( $data )
                {
                    if( $data && $data.sug )
                    {
                        XAtComplete.update( $data.sug, $data.query );
                    }    
                };
                
                onload = 
                function()
                {
                    XAtComplete.exec
                    (
                        {
                            "trigger": 'txa'
                            , "data_url": 'res/data.php?callback=XAtComplete.updateQuanloo'
                            , "queryKey": 'query'
                        }
                    );
                };
                                
                </script>
     
 * @author      x@btbtd.org
 * @date        2012/7/4
 */ 
void function()
{    
    window.CUR_XATCOMPLETE = window.CUR_XATCOMPLETE || null;
    var CURSOR_POSITION = { "start": 0, "end": 0};
    var isIE6 = /IE 6/i.test( navigator.userAgent );
    var isIE7 = /IE 7/i.test( navigator.userAgent );

    function Control( $params )
    {
        this.model = new Model($params).init();
        this.view = new View( this.model ).init();
    }
    
    Control.exec =
    function( $params )
    {
        return new Control( $params ).init();
    };
    /**
     * 更新列表框数据
     */         
    Control.update =
    function( $data, $query )
    {
        if( !window.CUR_XATCOMPLETE ) return;
        window.CUR_XATCOMPLETE.view.update( $data, $query );
    };
    /**
     * 重置缓存
     */         
    Control.reset =
    function( $to )
    {
        reset_cache_f( $to );
    };
    
    Control.prototype =
    {
        init:
        function()
        {
            init_global_event();
            
            var p = this;
            
            if( !p.model.trigger ) return this;
            
            attach_event_f
            ( 
                p.model.trigger, 'focus',
                function()
                {
                    /**
                     * 设置当前对象为全局可访问
                     */
                    window.CUR_XATCOMPLETE = p;
                }
            );
            
            attach_event_f
            ( 
                p.model.trigger, 'click',
                function( $evt )
                {                   
                    p.view.hide();
                    
                    if( p.model.isSameCursor() ) return;    
                    stopPropagation( $evt );                  
                    p.view.show(0);                    
                }
            );
            /**
             * 响应 回车 及 空格 事件
             */                         
            attach_event_f
            ( 
                p.model.trigger, 'keypress',
                function($evt)
                {
                    $evt = $evt || window.event;
                    var kc = keycode_f( $evt );
                    /**
                     * 检测POPUP是否为显示状态 及 是否有选中相关内容
                     */
                    if( kc.keyCode === 13 )//回车
                    {
                        if( p.view.isShow() )
                        {
                            preventDefault( $evt );                            
                            p.view.updateTrigger();
                        }
                    
                        p.view.hide();
                    }
                    
                    if( kc.keyCode === 32 )//空格
                    {
                        p.view.hide();
                    }
                }
            );
            
            attach_event_f
            ( 
                p.model.trigger, 'keydown',
                function( $evt )
                {
                    $evt = $evt || window.event;
                    var kc = keycode_f( $evt );   
                    
                    if( kc.keyCode === 27 )//ESC fix for ie
                    {
                        preventDefault( $evt );  
                        stopPropagation( $evt );
                        p.view.hide();
                        return;
                    }            
                    
                    if( p.view.isShow() )
                    {
                        /**
                         * 响应 上下 键
                         */                                                 
                        switch( kc.keyCode )
                        {
                            case 38: //up key
                            {
                                preventDefault($evt);                               
                                p.view.selectPrevPopupItem(); 
                                return;   
                            }
                            
                            case 40: //down key
                            {
                                preventDefault($evt);
                                p.view.selectNextPopupItem();
                                return; 
                            }
                        }
                    }
                }
            );
            
            attach_event_f
            ( 
                p.model.trigger, 'keyup',
                function($evt)
                {
                    $evt = $evt || window.event;
                    var kc = keycode_f( $evt );  
                    var cc = p.model.cursorChar();
                    //document.title = kc.keyCode;   
                    /**
                     * 响应 方向 键
                     */                                         
                    switch( kc.keyCode )
                    {
                        case 37: //left key
                        case 39: //right key
                        
                        case 38: //up key
                        case 40: //down key
                        
                        case 8: //退格键
                        {
                            if( kc.keyCode === 38 || kc.keyCode === 40 )
                            {
                                if( p.view.isShow() ) return;
                            }
                        
                            var cursor = p.model.getCursorPosistion();
                            var popCur = p.model.getRightPopupPosition();
                            
                            if( cursor !== popCur )
                            {                            
                                if( popCur >= 0 ) 
                                {
                                    p.view.show();
                                }
                            }
                            else
                            {
                                p.view.hide();
                            }
                            return;   
                        }
                    }
                    /**
                     * 判断全角字符
                     */          
                    if( /[　]/.test( cc ) )
                    {
                        p.view.hide();
                        return;
                    }                              
                    /**
                     * 响应输入 @/＠ 字符
                     */                      
                    if( /[@＠]/.test( cc ) ) 
                    {            
                        if( p.model.isInQuery() ) preventDefault($evt);                        
                        p.view.show();
                        return;              
                    }
                    /**
                     * 用户输入内容时, 实时查询新列表
                     */                                         
                    if( p.view.isShow() && p.model.isInQuery() )
                    {
                        p.view.show();
                    }
                }
            );
            
            return this;
        }    
    }
    
    function Model($params)
    {
        this.trigger;   //触发自动完成的 input[text] 或者 textarea
        this.popup;     //显示自动完成内容的弹框
        this.data_url;  //请求自动完成的URL
        this.queryKey;  //查询关键字的 url get key 名
        this.debug;     //是否为测试模式
        
        this.encodeFunc = encodeURIComponent;
        this.decodeFunc = decodeURIComponent;
                
        for( var k in $params ) this[k] = $params[k];
    }
    
    Model.prototype =
    {
        init:
        function()
        {              
            this.trigger = getId( this.trigger );
            this.queryKey = this.queryKey || 'query';
            
            if( this.popup )
            {
                this.popup = getId( this.popup );
                if( !this.popup ) this.popup = popup_box_f();
            }
            else
            {
                this.popup = popup_box_f();
            }
        
            return this;
        }
        //取得游标的所在位置
        , getCursorPosistion:
        function()
        {
            return get_cursor( this.trigger );
        }
        //返回所有的POPUP项
        , popupItems:
        function()
        {
            var r = [];
            if( this.popup )
            {
                r = this.popup.getElementsByTagName('li');
            }
            return r;
        }
        //返回选中的POPUP项
        , selectedPopupItem:
        function()
        {
            var r = null;
            
            if( this.popup )
            {
                var lis = this.popupItems();
                
                if( lis.length )
                {
                    for( var i = 0; i < lis.length; i++ )
                    {
                        if( HasClass( lis[i], 'on' ) )
                        {
                            r = { 'item': lis[i], 'index': i };
                            break;
                        }
                    }
                }
            }
            
            return r;
        }
        /**
         * 取基于@字符的正确POPUP显示位置
         */      
        , getRightPopupPosition:          
        function ()
        {
            var cursorPos = this.getCursorPosistion();
            var r = cursorPos;
            var $content = this.trigger.value;
            
            while( cursorPos > 0 )
            {
                if( /[\r\n 　]/.test( $content.slice( cursorPos - 1, cursorPos) ) )
                {
                    break;
                }
                else if( /[@＠]/.test( $content.slice( cursorPos - 1, cursorPos) ) )
                {
                    r = cursorPos - 1;
                    break;
                }
                cursorPos--;
            }
            
            if( r < 0 ) r = 0;
            
            return r;
        }
        /**
         * 检测游标所在位置是否满足查询数据, 如果没有@或者@之前有空白字符, 则为假
         */                 
        , isInQuery:
        function()
        {
            var r = false;
            
            var content = this.trigger.value;
            var tempPos = this.getCursorPosistion();
            
            while( tempPos > 0 )
            {
                if( /[\r\n 　]/.test( content.slice( tempPos - 1, tempPos) ) )
                {
                    break;
                }
                else if( /[@＠]/.test( content.slice( tempPos - 1, tempPos) ) )
                {
                    r = true;
                    break;
                }
                
                tempPos--;
            }
            return r;
        }
        /**
         * 获取用于查询数据的关键字, @字符 到 游标所在的内容
         */                 
        , getQueryString:
        function()
        {
            var r = [];
            var content = this.trigger.value;
            var cur = this.getCursorPosistion();
            var $pos = this.getRightPopupPosition();
            
            if( content.slice( $pos, $pos + 1) == '@' || content.slice( $pos, $pos + 1) == '＠')
            {
                $pos++;
            }
            
            for( var i = $pos; i < content.length; i++ )
            {                
                if( i >= cur )
                {
                    break;
                }
                
                var c = content.slice( i, i + 1 );
                if( !/[\r\n 　@＠]/m.test( c ) )
                {
                    r.push( c );
                }
                else
                {
                    
                    break;
                }
            }
            
            return r.join('');
        }
        /**
         * 请求 JSONP 数据
         */                 
        , queryData:
        function( $query )
        {        
            var url = this.data_url;
            url = add_url_param( url, { 'key': this.queryKey, 'value': this.encodeFunc( $query ) } );
            url = add_url_param( url, { 'key': 'rnd', 'value': Math.random() } )
            
            XAppendScript( url, req_box_f() );
        }
        /**
         * 判断弹框位置 和 游标位置是否相同
         */                 
        , isSameCursor:
        function()
        {
            return this.getCursorPosistion() === this.getRightPopupPosition();
        }
        , cursorChar:
        function()
        {
            var pos = this.getCursorPosistion();
            var r = '';
            
            if(this.trigger.value.length && pos > 0 )
            {
                r = this.trigger.value.slice( pos - 1, pos );
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
            return this;
        }        
        /**
         * 隐藏列表框
         */                 
        , hide:
        function()
        {
            var p = this;
            p.model.popup.style.display = 'none';
        }
        /** 
         * 显示列表框
         */                 
        , show:
        function( $afterOffset )
        {
            $afterOffset = $afterOffset || 0;
            var p = this;
            var maskBox = mask_box_f();
            
            var triggerPos = ele_pos_f( p.model.trigger );
            
            //把MASK的坐标设置为TEXTAREA的坐标   
            maskBox.style.left = triggerPos.left + 'px';
            maskBox.style.top = triggerPos.top + 'px';
            
            //把MASK的大小设置为TEXTAREA的大小
            maskBox.style.width = triggerPos.width + 'px';
            maskBox.style.height = triggerPos.height + 'px';
            
            //取TEXTAREA 从开始到光标位置的文本内容, 并赋值给MASK
            CURSOR_POSITION.start = p.model.getRightPopupPosition();
            CURSOR_POSITION.end = p.model.getCursorPosistion() + $afterOffset;
            var content = p.model.trigger.value.slice( 0, CURSOR_POSITION.start );
            mask_box_f( content.replace(/[ ]/g, 'a'), p );
            
            var query = p.model.getQueryString();        
            var cache = get_cache_data_f( query );     
            
            if( typeof cache !== "boolean" )
            {
                p.update( cache, query );
            }
            else
            {
                p.model.queryData( query );
            }              
            
            //显示并设置列表弹出框的坐标
            var mark = maskBox.getElementsByTagName('span');
            if( mark.length ) 
            {
                var popPos = ele_pos_f( mark[0] );
                if( isIE6 || isIE7 ) popPos.top += 4;
                                
                p.model.popup.style.left = popPos.left + 'px';
                p.model.popup.style.top = popPos.top + 13 - p.model.trigger.scrollTop + 'px';
            }
            
            p.model.popup.style.zIndex = getMaxIndex();
            p.model.popup.style.display = 'block';
            
            update_debug_f( content, this );
            
            p.initItemsEvent();  
        }        
        //POPUP是否为显示状态
        , isShow:
        function()
        {
            return this.model.popup.style.display != 'none';
        }
        /**
         * 初始化弹框项的事件
         */         
        , initItemsEvent:
        function()
        {
            var p = this;
            var items = p.model.popupItems();
            
            for( var i = 0; i < items.length; i++ )
            {
                var item = items[i];
                
                if( !item.getAttribute("isset") )
                {
                    item.setAttribute("isset", 1);
                }
                else
                {
                    continue;
                }
                
                var a = item.getElementsByTagName('a');
                if( a.length )
                {
                    for( var j = 0; j < a.length; j++ )
                    {
                        attach_event_f
                        ( 
                            a[i], 'click',
                            function( $evt )
                            {
                                preventDefault( $evt );
                            }
                        );
                    }
                }
            
                attach_event_f
                ( 
                    item, 'mouseover',
                    function( $evt )
                    {
                        p.setCurrentItem( this );
                    }
                );
                
                attach_event_f
                ( 
                    item, 'click',
                    function( $evt )
                    {                  
                        p.updateTrigger();    
                        p.hide();
                    }
                );
            }
        }
        /**
         * 把参数项设置为选中状态
         */                 
        , setCurrentItem:
        function( $item )
        {
            if( HasClass( $item, 'sloading') ) return;
            
            var p = this;            
            var items = p.model.popupItems();
               
            for( var i = 0; i < items.length; i++ )
            {
                KillClass( items[i], 'on' );
            }
             
            AddClass( $item, 'on' );
        }
        /**
         * 返回列表框选中项的内容
         */                 
        , selectedItemData:
        function()
        {
            var r = null;
              
            var selItemObj = this.model.selectedPopupItem();
            
            if( selItemObj && selItemObj.item )
            {
                r = { "text": selItemObj.item.getAttribute('title') || selItemObj.item.innerHTML, "obj": selItemObj };
            }
            
            return r;
        }
        /**
         * 获取列表框里选中的前一个项
         */                 
        , selectPrevPopupItem:
        function()
        {
            var items = this.model.popupItems();
            var r = null;
            
            if( items.length )
            {
                var pointer = 0;
                
                var selItem = this.model.selectedPopupItem();
                if( selItem )
                {
                    pointer = selItem.index - 1;
                }
                
                if( pointer < 0  ) pointer = items.length - 1;
                
                r = items[ pointer ];                
                this.setCurrentItem( r );
            }
            
            return r;
        }
        /**
         * 获取列表框里选中的后一个项
         */                 
        , selectNextPopupItem:
        function()
        {
            var items = this.model.popupItems();
            var r = null;
            
            if( items.length )
            {
                var pointer = 0;
                
                var selItem = this.model.selectedPopupItem();
                if( selItem )
                {
                    pointer = selItem.index + 1;
                }
                
                if( pointer >= items.length  ) pointer = 0;
                
                r = items[ pointer ];
                this.setCurrentItem( r );
            }
            
            return r;
        }
        /**
         * 更新 文本框 或 文本域 的内容
         */                 
        , updateTrigger: 
        function()
        {
            var p = this;
            var item = this.selectedItemData();            
            if( !item ) return;
            
            var selPos = CURSOR_POSITION.end;
            var pos = CURSOR_POSITION.start + 1;
            
            var str = this.model.trigger.value;
            var before = str.slice(0, pos);
            var after = str.slice(selPos);
            
            before = before.replace(/[＠@]$/, '@');
            
            var space = '';
            if( after.length )
            {
                if( !/[ 　]/.test( after.slice( 0, 1) )  )
                {
                    space = ' ';
                }
            }
            else
            {
                space = ' ';
            }
            
            var str = before + item.text + space + after;
            this.model.trigger.value = str;
            curPos = pos + item.text.length + 1;
            
            set_cursor( p.model.trigger, curPos );
            
            update_debug_f( [
                'before: ' + before 
                , 'text: ' + item.text + space
                , 'after: ' + after
                , 'selPos: ' + selPos
                , 'pos: ' + pos
            ].join('\n\n'), this );
        }
        /**
         * 更新列表框的内容
         */                 
        , update:
        function( $data, $query )
        {
            var ul = this.model.popup.getElementsByTagName('ul');
            if( !ul.length ) return;
            ul = ul[0];
            
            if( typeof $query != 'undefined' )
            {
                set_cache_data_f( this.model.decodeFunc( $query ), $data );
            }
            
            if( !($data && $data.length ) )
            {             
                ul.innerHTML = '<li class="sloading" isset="1">没有相关数据</li>';                
                return;
            }
                        
            var list = [];
            
            var textLen = 25;
            for( var i = 0; i < $data.length; i++ )
            {
                var str = $data[i];
                if( str.length > textLen )
                {
                    str = str.slice( 0, textLen );
                }
                
                var on = '';
                if( i === 0 )
                {
                    on = ' class="on" ';
                }
                
                list.push( '<li title="' + $data[i] + '"' + on + '>' + str + '</li>' );
            }
            
            ul.innerHTML = list.join('');
            
            this.initItemsEvent();
        }
    };
    /**
     * 初始化全局事件
     */         
    function init_global_event()
    {   
        if( window.XATCOMPLETE_INIT_LOCK ) return;         
        window.XATCOMPLETE_INIT_LOCK = true;
        
        //响应ESC退出键
        attach_event_f
        ( 
            window, 'keyup',
            function( $evt )
            {
                if( !window.CUR_XATCOMPLETE ) return;
                
                var kc = keycode_f( $evt );                
                if( kc.keyCode === 27 ) window.CUR_XATCOMPLETE.view.hide();
            }
        );
        //响应window全局点击, 并隐藏popup
        attach_event_f
        ( 
            window, 'click',
            function()
            {
                if( !window.CUR_XATCOMPLETE ) return;
                window.CUR_XATCOMPLETE.view.hide();
            }
        );
        //响应窗口大小变化
        attach_event_f
        ( 
            window, 'resize',
            function()
            {
                if( !window.CUR_XATCOMPLETE ) return;
                
                if( window.CUR_XATCOMPLETE.view.isShow() )
                {
                    window.CUR_XATCOMPLETE.view.show();
                }
            }
        );
        //响应滚动条状态
        attach_event_f
        ( 
            window, 'scroll',
            function()
            {
                if( !window.CUR_XATCOMPLETE ) return;
                
                if( window.CUR_XATCOMPLETE.view.isShow() )
                {
                    window.CUR_XATCOMPLETE.view.show();
                }
            }
        );
        
        reset_cache_f();
    }
    /**
     * 每隔 X分钟 重置缓存
     */         
    function reset_cache_f( $to )
    {
        window.XAT_CACHE = {};
        if( window.XAT_RESET_TO ) try{ clearTimeout( window.XAT_RESET_TO ); }catch(ex){}
        
        window.XAT_RESET_TO =
        setTimeout
        (
            function()
            {
                reset_cache_f( $to );
            }
            , $to || 1000 * 60 * 5
        );
    }
    /**
     * 取缓存中的数据
     */         
    function get_cache_data_f( $k )
    {
        window.XAT_CACHE = window.XAT_CACHE || {};
        
        var r = false;
        
        if( $k in window.XAT_CACHE )
        {
            r = window.XAT_CACHE[ $k ];
        }
        
        return r;
    }
    /**
     * 设置缓存中的数据
     */         
    function set_cache_data_f( $k, $v )
    {
        window.XAT_CACHE = window.XAT_CACHE || {};
        if( typeof $k === 'undefined' ) return;        
        window.XAT_CACHE[ $k ] = $v;
    }
    /**
     * 用于存储请求 JSONP 数据的容器, 确保同时只有一个数据请求;
     */         
    function req_box_f()
    {
        var box = window.XATCOMPLETE_DATA_BOX;
        
        if( !box )
        {
            box = document.createElement('div');
            box.style.display = 'none';
            box.setAttribute( 'for_read', 'XATCOMPLETE_DATA_BOX' ); 
            window.XATCOMPLETE_DATA_BOX = box;
            document.body.appendChild( box );
        }
        
        box.innerHTML = '';
        
        return box;
    }
    /**
     * 用于模拟textarea内容的DIV 
     */
    function mask_box_f( $text, $p )
    {
        var box = window.XATCOMPLETE_MASK_BOX;
        
        if( !box )
        {
            box = document.createElement('div');
            box.className = "xat_mask";
            box.setAttribute( 'for_read', 'XATCOMPLETE_MASK_BOX' );
            window.XATCOMPLETE_MASK_BOX = box; 
            document.body.appendChild( box );
        }
        
        if( $p ) set_style_f( $p.model.trigger, box );
        
        if( typeof $text != 'undefined' )
        {
            var str = $text || '';        
            str = str.replace( /\r\n/g, '<br />' );
            str = str.replace( /\r/g, '<br />' );
            str = str.replace( /\n/g, '<br />' );
            
            box.innerHTML = str + '<span class="mark">x</span>';
        }
        
        return box;
    }       
    /**
     * 用于显示数据的弹框
     */
    function popup_box_f( $data )
    {
        var box = window.XATCOMPLETE_POPUP_BOX;
        
        if( !box )
        {
            box = document.createElement('dl');
            box.className = 'xat_box';
            box.setAttribute( 'for_read', 'XATCOMPLETE_POPUP_BOX' );
            window.XATCOMPLETE_POPUP_BOX = box;
            box.style.display = 'none';
            box.innerHTML =
            [
            "    <dt>选择昵称或轻敲空格完成输入</dt>\n"
            ,"    <dd>\n"
            ,"        <ul class=\"slist\">\n"
            ,'            <li class="sloading" isset="1">数据加载中, 请稍候...</li>'
            ,"        </ul>\n"
            ,"    </dd>\n"
            ].join('');
            document.body.appendChild( box );
        }
        
        if( typeof $data != 'undefined' && typeof $data == 'string' )
        {
            box.innerHTML = $data;
        }
        
        return box;
    }       
    /**
     * 显示调试信息, 如果 debug 为真
     */
    function update_debug_f( $text, $p )
    {
        if( !$p.model.debug ) return;
        
        var xat_debug_ = document.getElementById("xat_debug_");
        if( !xat_debug_ )
        {
            xat_debug_ = document.createElement('textarea');
            xat_debug_.id = 'xat_debug_';
            document.body.appendChild( xat_debug_ );
        }
        xat_debug_.disabled = true;
        if( $p ) set_style_f( $p.model.trigger, xat_debug_ );
        
        xat_debug_.style.width = $p.model.trigger.offsetWidth + 'px';
        xat_debug_.style.height = $p.model.trigger.offsetHeight + 'px';        
        //document.title = $p.model.trigger.offsetWidth + ', ' + $p.model.trigger.offsetHeight;
        xat_debug_.value = $text;
    }
    /**
     * 设置对应的特殊样式
     */              
    function set_style_f( $src, $tar )
    {
        $tar.style.paddingTop = style_f( $src, 'paddingTop' ) || 0;
        $tar.style.paddingRight = style_f( $src, 'paddingRight' ) || 0;
        $tar.style.paddingBottom = style_f( $src, 'paddingBottom' ) || 0;
        $tar.style.paddingLeft = style_f( $src, 'paddingLeft' ) || 0;
    }        
    
    window.XAtComplete = Control;
}();
