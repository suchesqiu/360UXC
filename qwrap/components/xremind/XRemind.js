/**
 * 用户提交数据, 显示提示信息, 主要为减少弹窗
 * @author      suches@btbtd.org
 * @date        2011-8-1 
 * @example
 * <code>
        <button type="button" id="test">test</button>
        <div id="box"></div>
        
        <link rel="stylesheet" href="xremind/xremind.css" type="text/css" />
        <script src='../XRemind.js'></script>
        <script>
        
        var btn = document.getElementById("test");
        var box = document.getElementById("box");
        
        btn.onclick =
        function()
        {
            XRemind.exec
            (
                {
                    "type": Math.ceil( Math.random() * 3 ),
                    "msg": 'test sssssssss',
                    "injectCallback":
                    function( $e )
                    {
                        box.appendChild( $e );
                    },
                    "doneCallback": function(){}
                }
            );
        };
        
        </script>
 * </code>   
 */ 
void function()
{    
    function Control( $params )
    {
        this.model = new Model($params);
        this.view = new View( this.model );
    }
    Control.SUCCESS = 1;
    Control.FAILED = 2;
    Control.ALTER = 3;
    Control.CLASSNAME = null; //全局自定义CSS
    Control.TPL = null; //全局自定义HTML模板
    
    /**
     * @params      $params: success/failed/alert
     */         
    Control.exec =
    function( $params )
    {
        return new Control( $params ).init();
    };
    
    Control.prototype =
    {
        init:
        function()
        {
            this.view.init();
            return this;
        }    
    }
    
    function Model($params)
    {
        this.type;
        this.injectCallback;
        this.doneCallback;
        this.tip;
        this.msg;
        this.interval;
        this.timeout;
        this.autoHiddenMs = 3000;
        
        this.classname = 
        {
            'success': 'tishi_A'
            , 'failed': 'tishi_A tishi_B'
            , 'alter': 'tishi_A tishi_C'
        };
        
        this.date = new Date();
        
        this.movingIntervalMs = 2;        
        this.effect_intervalMs = 200;
        
        this.tpl = '<p></p><span>{msg}</span><a href="#" title="" class="close__"></a>';
        
        if( Control.CLASSNAME ) this.classname = Control.CLASSNAME;
        if( Control.TPL ) this.tpl = Control.TPL;
        
        for( var k in $params ) this[k] = $params[k];
    }
    
    Model.prototype =
    {
        getTip:
        function()
        {
            if( !this.tip )
            {
                this.tip = document.createElement('div');
                
                this.tpl = this.tpl.replace( /\{msg\}/gi, this.msg );
                
                this.tip.innerHTML = this.tpl;
                
                switch( this.type )
                {
                    case Control.SUCCESS:
                    {
                        this.tip.className = this.classname.success;
                        break;
                    }
                    case Control.FAILED:
                    {
                        this.tip.className = this.classname.failed;
                        break;
                    }
                    case Control.ALTER:
                    {
                        this.tip.className = this.classname.alter;
                        break;
                    }
                }
            }
            
            return this.tip;
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
            var _ = this;
        
            var tip = _.model.getTip();
            
            if( _.model.injectCallback )
            {
                _.model.injectCallback( tip );
            } 
            else
            {
                document.body.appendChild( tip );
            }
                        
            xeach
            (
                getClass( 'close__', tip ),
                function( $e )
                {
                    $e.onclick =
                    function( $evt )
                    {
                        preventDefault($evt);
                        
                        if( _.model.timeout )
                        {
                            clearTimeout( _.model.timeout );
                            _.model.timeout = null;
                        }
                    
                        if( _.model.interval )
                        {
                            clearInterval( _.model.interval );
                            _.model.interval = null;
                        }
                        try{ tip.parentNode.removeChild( tip ); } catch(ex){}
                    };  
                }
            );
            
            
            _.model.timeout =
            setTimeout
            (
                function()
                {
                    _.hideTip();
                }
                , _.model.autoHiddenMs
            );
        },
        
        hideTip:
        function()
        {
            var _ = this;
            var tip = _.model.getTip();
            //tip.parentNode.removeChild( tip );
            var h = tip.offsetHeight;
            tip.style.height = h + 'px';
            tip.style.overflow = 'hidden';
            
            var count = 0;      
            var step = _.model.effect_intervalMs / _.model.movingIntervalMs;            
            var countDate = new Date();
                        
            _.model.interval =
            setInterval
            (
                function()
                {
                    var datePass = new Date() - countDate;
                    
                    count = datePass / _.model.effect_intervalMs *  h ;
                    if( datePass >= _.model.effect_intervalMs )
                    {
                        count = h;
                    }
                    
                    tip.style.height = h - count + 'px';
                    
                    if( count === h )
                    {
                        clearInterval( _.model.interval );
                        _.model.interval = null;
                        //tip.parentNode.removeChild( tip );
                        try{ tip.parentNode.removeChild( tip ); } catch(ex){}
                        if(  _.model.doneCallback ) _.model.doneCallback();
                    }
                }
                , 2
            );
        }
    };
    
    /**
     * 从 class 获取DOM节点
     * @author      suches@btbtd.org
     * @date        2011-8-1
     * @requires    HasClass               
     */
    function getClass( $class, $box, $r )
    {
        $box = $box || document.body;
        $r = $r || [];
        
        var first = $box.firstChild;
        
        if( first )
        {
            if( HasClass( first, $class ) )
            {
                $r.push( first );
            }
            
            if( first.childNodes.length )
            {
                arguments.callee( $class, first, $r );
            }
            
            while( first = first.nextSibling )
            {
                if( HasClass( first, $class ) )
                {
                    $r.push( first );
                }
            
                if( first.childNodes.length )
                {
                    arguments.callee( $class, first, $r );
                }
            }
        }
        
        return $r;
    }     
    
    //***Returns true if the object has the class assigned, false otherwise.
    function HasClass(obj,cName){ return (!obj || !obj.className)?false:(new RegExp("\\b"+cName+"\\b")).test(obj.className) }
        
    /**
     * 阻止事件默认行为
     * @author      suches@btbtd.org
     * @date        2011-7-26                  
     */                 
    function preventDefault($evt)
    {            
        $evt = $evt || window.event;
        if( $evt.preventDefault ) $evt.preventDefault(); else $evt.returnValue = false;
    }
    
    /**
     * 遍历键值对象或数组
     * @author      suches@btbtd.org
     * @date        2011-7-24
     */        
    function xeach( $list, $callback )
    {
        var count = 0;
        
        if( $list.length )
        {
            for( var i = 0, j = $list.length; i < j; i++ )
            {
                if( inner( i, count, $callback ) === false )
                {
                    return;
                }
                count++;
            }
        }
        else
        {    
            for( var o in $list )
            {
                
                if( inner( o, count, $callback ) === false )
                {
                    return;
                }
                count++;
            }
        }
        
        function inner( $key )
        {
            if( $callback )
            {
                return $callback( $list[$key], count );
            }
        }
    }
    
    window.XRemind = Control;
}();
