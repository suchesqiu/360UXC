/**
 * 划动菜单( 同时移动多个项 ), 支持 垂直 和 水平 方向
 * @className   XItemSlider
 *  
 * @example
    <code>
        <script>
        //
        //最爱欢迎 - 垂直划动
        //       
        XItemSlider.vexec
        (
            {
                prev: 'pop_pre',
                next: 'pop_next',
                list: 'pop_list',
                
                "fixPosition": true,
                "itemHeight": 100,
                "mainHeight": 330
            }
        );
        //
        //圈内视频 - 水平划动
        //         
        XItemSlider.exec
        (
            {
                prev: 'circleslidePrev',
                next: 'circleslideNext',
                list: 'circleslideList',
                
                "fixPosition": true,
                "itemWidth": 102,
                "mainWidth": 562
            }
        );  
        </script> 
    </code>
 *  
 * @author      x@btbtd.org
 * @date        2011-7-22
 * @update      version1.1 2012/6/15   
 */ 
void function()
{    
    function Control( $params )
    {
        switch( $params.model )
        {
            case Control.HORIZONTAL:
            {
                this.model = new Model($params).init();
                this.view = new View( this.model ).init();
                break;
            } 
            
            case Control.VERTICAL:
            {
                this.model = new VerticalModel($params).init();
                this.view = new VerticalView( this.model ).init();
                break;
            }
        }
    }
    /**
     * 水平划动
     */         
    Control.HORIZONTAL = 1;
    Control.exec =
    function( $params )
    {
        $params = $params ||{};
        $params.model = Control.HORIZONTAL;
        
        return new Control( $params ).init();
    };
    /**
     * 垂直划动
     */        
    Control.VERTICAL = 2; 
    Control.vexec =
    function( $params )
    {
        $params = $params ||{};
        $params.model = Control.VERTICAL;
        
        return new Control( $params ).init();
    };
    
    Control.prototype =
    {
        init:
        function()
        {
            var p = this;
            
            if( this.model && this.model.prev )
            {
                this.model.prev.onclick =
                function( $evt )
                {
                    preventDefault($evt);
                    if( p.model.totalPages() < 2 ) return false;
                    
                    p.view.moving( false );
                    
                    return false;
                };
            }
            
            if( this.model && this.model.next )
            {
                this.model.next.onclick =
                function($evt)
                {
                    preventDefault($evt);
                    if( p.model.totalPages() < 2 ) return false;
                    
                    p.view.moving( true );
                    
                    return false;
                };
            }
            
            if( !(this.model && this.model.list) )
            {
                return;
            }
            
            return this;
        } 
    }
    
    function VerticalModel($params)
    {
        this.prev;
        this.next;
        this.list;
                
        this.pointer = 0;
        
        this.date = new Date();
        
        this.movingIntervalMs = 2;        
        this.effect_intervalMs = 200;
        
        this.displayItem = 3;
        this.itemHeight = 168;
        this.mainHeight = 890;
        
        this.fixPosition = false;
        
        this.interval;
        this.itemSpace;
        
        for( var k in $params ) this[k] = $params[k];
    }
    
    VerticalModel.prototype =
    {
        init:
        function()
        {          
            this.prev = getId( this.prev );
            this.next = getId( this.next );
            this.list = getId( this.list );
        
            this.itemSpace = Math.floor( ( this.mainHeight - this.itemHeight * this.displayItem ) / ( this.displayItem - 1) ) - 1;
        
            return this;
        },
        
        items:
        function()
        {
            var r = [];            
            var t = this.list.getElementsByTagName('li'); 
                      
            for( var i = 0, j = t.length; i < j; i++ ) 
            {
                r.push( t[i] );
                
                if( t.length > this.displayItem )
                {
                    if( this.fixPosition ) t[i].style.position = "absolute";
                } 
                else
                {
                    if( this.fixPosition ) t[i].style.position = "static";
                }
            }     
                  
            return r;
        },
        
        totalPages:
        function()
        {
            var r = 0, items = this.items();
            
            if( !items.length )
            {
                r = 0;
            }
            else if( items.length <= this.displayIte )
            {
                r = 1;
            }
            else
            {
                r = Math.ceil( items.length / this.displayItem )
            }
            
            return r;
        },
        
        getPage:
        function($p)
        {
            var r = [], list = this.items();
            
            var begin = $p * this.displayItem;
            var end = begin + this.displayItem;
            
            for( ; begin < end; begin++ )
            {
                if( list[begin] )
                {
                    r.push( list[begin] );
                }
            }
            
            return r;
        },
        
        currentList:
        function()
        {
            return this.getPage( this.pointer );
        },
        
        assistList:
        function( $isNext )
        {
            var p;
            
            if( $isNext )
            {
                p = this.pointer + 1;
                
                if( p >= this.totalPages() )
                {
                    p = 0;
                }
            }
            else
            {
                p = this.pointer - 1;
                
                if( p < 0 )
                {
                    p = this.totalPages() - 1;
                }
            }
            return this.getPage( p );
        },
        
        setNextPointer:
        function( $isNext )
        {
            if( $isNext )
            {
                this.pointer++;
                
                if( this.pointer >= this.totalPages() )
                {
                    this.pointer = 0;
                }
            }
            else
            {
                this.pointer--;
                
                if( this.pointer < 0 )
                {
                    this.pointer = this.totalPages() - 1;
                }
            }
        }
    };
    
    function VerticalView( $model )
    {
        this.model = $model;
    }
    
    VerticalView.prototype = 
    {
        init:
        function()
        {
            if( !(this.model.prev&&this.model.next&&this.model.list) ) return this;
            this.fixPosition( true  );
            
            return this;
        },
        
        fixPosition:
        function( $isNext )
        {
            this.hideAll();
            
            var currentList = this.model.currentList();    
            var pos;        
            for( var i = 0, j = currentList.length; i < j; i++ )
            {
                currentList[i].style.display = 'block';
                pos = this.model.itemHeight * i + i * this.model.itemSpace;
                currentList[i].style.top = pos + 'px';
                currentList[i].pos = pos;
            }
            
            var assistList = this.model.assistList( $isNext );            
            for( var i = 0, j = assistList.length; i < j; i++ )
            {
                var item = assistList[i];
                
                if( $isNext )
                {
                    if( this.model.totalPages() < 2 )
                    {
                        pos = 0 + this.model.itemHeight * i + this.model.itemSpace * i;
                    }
                    else
                    {
                        pos = this.model.mainHeight + this.model.itemHeight * i + this.model.itemSpace * i;
                    }
                    
                }
                else
                {
                    pos = -(this.model.mainHeight - this.model.itemHeight * i - this.model.itemSpace * i);
                }     
                
                item.style.top = pos + 'px';
                item.pos = pos;                 
                item.style.display = 'block';   
            }
            
        },
        
        hideAll:
        function()
        {
            var list = this.model.items();
            for( var i = 0, j = list.length; i < j; i++ ) list[i].style.display = 'none';    
        },
        
        moving:
        function( $isNext )
        {
            var _ = this;
            
            if( _.model.interval )
            {
                innerClearInterval();
            }
                                    
            this.fixPosition( $isNext );
            var currentList = _.model.currentList();
            var assistList = _.model.assistList($isNext);
            
            var count = 0;      
            var step = _.model.effect_intervalMs / _.model.movingIntervalMs;            
            var countDate = new Date();
            
            
            _.model.interval = 
            setInterval
            (
                function()
                {
                    var datePass = new Date() - countDate;
                    
                    count = datePass / _.model.effect_intervalMs *  _.model.mainHeight ;
                    if( datePass >= _.model.effect_intervalMs )
                    {
                        count = _.model.mainHeight;
                    }
                    
                    if( $isNext )
                    {                        
                        for( var i = 0, j = currentList.length; i < j; i++ )
                        {
                            var item = currentList[i];                            
                            item.style.top = item.pos - count + 'px';
                        }
                        
                        for( var i = 0, j = assistList.length; i < j; i++ )
                        {
                            var item = assistList[i];                            
                            item.style.top = (item.pos||0) - count + 'px';
                        }
                    }
                    else
                    {                 
                        for( var i = 0, j = currentList.length; i < j; i++ )
                        {
                            var item = currentList[i];                            
                            item.style.top = item.pos + count + 'px';
                        }
                        
                        for( var i = 0, j = assistList.length; i < j; i++ )
                        {
                            var item = assistList[i];                            
                            item.style.top = (item.pos||0) + count + 'px';
                        }
                    }
                    
                    if( Math.ceil(count) >= _.model.mainHeight  )
                    {
                        innerClearInterval();     
                    }
                }
                , _.model.movingIntervalMs
            );
            
            
            function innerClearInterval()
            {
                clearInterval( _.model.interval );
                _.model.interval = null;  
                _.model.setNextPointer( $isNext );
                _.fixPosition( $isNext );          
                
                //alert('clear')
            }
        }
    };
    
    function Model($params)
    {
        this.prev;
        this.next;
        this.list;
                
        this.pointer = 0;
        
        this.date = new Date();
        
        this.movingIntervalMs = 2;        
        this.effect_intervalMs = 200;
        
        this.displayItem = 5;
        this.itemWidth = 168;
        this.mainWidth = 890;
        
        this.fixPosition = false;
        
        this.interval;
        this.itemSpace;
        
        for( var k in $params ) this[k] = $params[k];
    }
    
    Model.prototype =
    {
        init:
        function()
        {          
            this.prev = getId( this.prev );
            this.next = getId( this.next );
            
            this.list = getId( this.list );
        
            this.itemSpace = Math.floor( ( this.mainWidth - this.itemWidth * this.displayItem ) / ( this.displayItem - 1) ) - 1;
        
            return this;
        },
        
        items:
        function()
        {
            var r = [];          
            
            var t = this.list.getElementsByTagName('li'); 
                      
            for( var i = 0, j = t.length; i < j; i++ ) 
            {
                r.push( t[i] );
                
                if( t.length > this.displayItem )
                {
                    if( this.fixPosition ) t[i].style.position = "absolute";
                } 
                else
                {
                    if( this.fixPosition ) t[i].style.position = "static";
                }
            }     
                  
            return r;
        },
        
        totalPages:
        function()
        {
            var r = 0, items = this.items();
            
            if( !items.length )
            {
                r = 0;
            }
            else if( items.length <= this.displayIte )
            {
                r = 1;
            }
            else
            {
                r = Math.ceil( items.length / this.displayItem )
            }
            
            return r;
        },
        
        getPage:
        function($p)
        {
            var r = [], list = this.items();
            
            var begin = $p * this.displayItem;
            var end = begin + this.displayItem;
            
            for( ; begin < end; begin++ )
            {
                if( list[begin] )
                {
                    r.push( list[begin] );
                }
            }
            
            return r;
        },
        
        currentList:
        function()
        {
            return this.getPage( this.pointer );
        },
        
        assistList:
        function( $isNext )
        {
            var p;
            
            if( $isNext )
            {
                p = this.pointer + 1;
                
                if( p >= this.totalPages() )
                {
                    p = 0;
                }
            }
            else
            {
                p = this.pointer - 1;
                
                if( p < 0 )
                {
                    p = this.totalPages() - 1;
                }
            }
            return this.getPage( p );
        },
        
        setNextPointer:
        function( $isNext )
        {
            if( $isNext )
            {
                this.pointer++;
                
                if( this.pointer >= this.totalPages() )
                {
                    this.pointer = 0;
                }
            }
            else
            {
                this.pointer--;
                
                if( this.pointer < 0 )
                {
                    this.pointer = this.totalPages() - 1;
                }
            }
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
            if( !(this.model.prev&&this.model.next&&this.model.list) ) return this;
            this.fixPosition( true  );
            
            return this;
        },
        
        fixPosition:
        function( $isNext )
        {
            this.hideAll();
            
            var currentList = this.model.currentList();    
            var pos;        
            for( var i = 0, j = currentList.length; i < j; i++ )
            {
                currentList[i].style.display = 'block';
                pos = this.model.itemWidth * i + i * this.model.itemSpace;
                currentList[i].style.left = pos + 'px';
                currentList[i].pos = pos;
            }
            
            var assistList = this.model.assistList( $isNext );            
            for( var i = 0, j = assistList.length; i < j; i++ )
            {
                var item = assistList[i];
                
                if( $isNext )
                {
                    if( this.model.totalPages() < 2 )
                    {
                        pos = 0 + this.model.itemWidth * i + this.model.itemSpace * i;
                    }
                    else
                    {
                        pos = this.model.mainWidth + this.model.itemWidth * i + this.model.itemSpace * i;
                    }
                    
                }
                else
                {
                    pos = -(this.model.mainWidth - this.model.itemWidth * i - this.model.itemSpace * i);
                }     
                
                item.style.left = pos + 'px';
                item.pos = pos;                 
                item.style.display = 'block';   
            }
            
        },
        
        hideAll:
        function()
        {
            var list = this.model.items();
            for( var i = 0, j = list.length; i < j; i++ ) list[i].style.display = 'none';    
        },
        
        moving:
        function( $isNext )
        {
            var _ = this;
            
            if( _.model.interval )
            {
                innerClearInterval();
            }
                                    
            this.fixPosition( $isNext );
            var currentList = _.model.currentList();
            var assistList = _.model.assistList($isNext);
            
            var count = 0;      
            var step = _.model.effect_intervalMs / _.model.movingIntervalMs;            
            var countDate = new Date();
            
            
            _.model.interval = 
            setInterval
            (
                function()
                {
                    var datePass = new Date() - countDate;
                    
                    count = datePass / _.model.effect_intervalMs *  _.model.mainWidth ;
                    if( datePass >= _.model.effect_intervalMs )
                    {
                        count = _.model.mainWidth;
                    }
                    
                    if( $isNext )
                    {                        
                        for( var i = 0, j = currentList.length; i < j; i++ )
                        {
                            var item = currentList[i];                            
                            item.style.left = item.pos - count + 'px';
                        }
                        
                        for( var i = 0, j = assistList.length; i < j; i++ )
                        {
                            var item = assistList[i];                            
                            item.style.left = (item.pos||0) - count + 'px';
                        }
                    }
                    else
                    {                 
                        for( var i = 0, j = currentList.length; i < j; i++ )
                        {
                            var item = currentList[i];                            
                            item.style.left = item.pos + count + 'px';
                        }
                        
                        for( var i = 0, j = assistList.length; i < j; i++ )
                        {
                            var item = assistList[i];                            
                            item.style.left = (item.pos||0) + count + 'px';
                        }
                    }
                    
                    //document.title = Math.ceil(count) + ', ' + _.model.itemWidth
                    
                    if( Math.ceil(count) >= _.model.mainWidth  )
                    {
                        innerClearInterval();     
                    }
                }
                , _.model.movingIntervalMs
            );
            
            
            function innerClearInterval()
            {
                clearInterval( _.model.interval );
                _.model.interval = null;  
                _.model.setNextPointer( $isNext );
                _.fixPosition( $isNext );          
                
                //alert('clear')
            }
        }
    };
    /**
     * 从对象ID取得DOM对象
     * @date        2011-7-21      
     */         
    function getId($id)
    {
        return typeof $id==="string"?document.getElementById($id):$id;
    }
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
    
    window.XItemSlider = Control;
}();
