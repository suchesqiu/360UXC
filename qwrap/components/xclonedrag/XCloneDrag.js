/**
 * 克隆拖曳类~ 该类拖曳行为为 克隆节点->拖曳->计算拖曳->结束拖曳
 * @className   XCloneDrag
 *  
 * @require     attach_event_f, 兼容各浏览器的附加事件函数
                preventDefault, 阻止事件默认行为
                ele_pos_f, 取某个元素的座标和大小, 函数
                mouseX, 获取鼠标在屏幕的X轴绝对位置, 函数
                mouseY, 获取鼠标在屏幕的Y轴绝对位置, 函数
                Point, X/Y 轴数据类
                getMaxIndex, 获取页面上最大的z-index值, 并+1
 *
 * @author      x@btbtd.org
 * @date        2012-2-24
 * @version     1.0 
 */ 
void function()
{    
    window.XCLONEDRAG_IS_INITED = window.XCLONEDRAG_IS_INITED || false;

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
    
    Control.prototype =
    {
        init:
        function()
        {
            var p = this;
            
            if( !p.model.dragItem ) return;
            
            p.model.dragItem.xclonedrag = p;
            
            attach_event_f
            (
                p.model.dragItem
                , 'mousedown'
                , p.view.mouseDown
            );
            
            if( !window.XCLONEDRAG_IS_INITED )
            {
                
                attach_event_f
                (
                    document
                    , 'mousemove'
                    , p.view.mouseMove
                );
                
                attach_event_f
                (
                    document
                    , 'mouseup'
                    , p.view.mouseUp
                );
            
                window.XCLONEDRAG_IS_INITED = true;
            }
            
            return this;
        }    
    }
    
    function Model($params)
    {
        this.dragItem;
        
        this.cloneItemAppendNode;
        
        this.offsetDownPoint;
        
        this.afterDownCallback;
        this.afterMoveCallback;
        this.afterUpCallback;
        
        this.checkDownCallback;
        
        for( var k in $params ) this[k] = $params[k];
    }
    
    Model.prototype =
    {
        init:
        function()
        {            
            this.cloneItemAppendNode = this.cloneItemAppendNode || document.body;
        
            return this;
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
        
        , mouseDown:
        function( $e )
        {          
            $e = $e || window.event;
            
            preventDefault( $e ); //for non ie
            
            var p = this.xclonedrag;
            
            resetDragItem();
            
            if( typeof p.model.checkDownCallback == 'function' )
            {
                if( !p.model.checkDownCallback( $e, p.model.dragItem ) )
                {
                    return false;
                }
            }
            
            var pos = ele_pos_f( this );
            
            window.XCLONE_DRAG_ITEM = this.cloneNode( true );
            
            window.XCLONE_DRAG_ITEM.style.zIndex = getMaxIndex();
            window.XCLONE_DRAG_ITEM.style.left = pos.left + 'px';
            window.XCLONE_DRAG_ITEM.style.top = pos.top + 'px';
            window.XCLONE_DRAG_ITEM.style.position = 'absolute';
            window.XCLONE_DRAG_ITEM.p = p;
            
            p.model.offsetDownPoint = new Point( mouseX($e) - pos.left, mouseY($e) - pos.top );
            
            p.model.cloneItemAppendNode.appendChild( window.XCLONE_DRAG_ITEM );
            
            if( typeof p.model.afterDownCallback == 'function' )
            {
                p.model.afterDownCallback.call( p, $e, this, window.XCLONE_DRAG_ITEM );
            }
            
            return false;
        }
        
        , mouseMove:
        function( $e )
        {
            preventDefault( $e ); //for ie
            
            $e = $e || window.event;
            if( !window.XCLONE_DRAG_ITEM ) return;
                        
            window.XCLONE_DRAG_ITEM.style.left = mouseX($e) - window.XCLONE_DRAG_ITEM.p.model.offsetDownPoint.x + 'px';
            window.XCLONE_DRAG_ITEM.style.top = mouseY($e) - window.XCLONE_DRAG_ITEM.p.model.offsetDownPoint.y + 'px';
            
            if( typeof window.XCLONE_DRAG_ITEM.p.model.afterMoveCallback == 'function' )
            {
                window.XCLONE_DRAG_ITEM.p.model.afterMoveCallback.call
                ( 
                    window.XCLONE_DRAG_ITEM.p, 
                    $e, 
                    window.XCLONE_DRAG_ITEM.p.model.dragItem
                    , window.XCLONE_DRAG_ITEM 
                );
            }
        }
        
        , mouseUp:
        function( $e )
        {   
            $e = $e || window.event;
            if( !window.XCLONE_DRAG_ITEM ) return;
            
            if( typeof window.XCLONE_DRAG_ITEM.p.model.afterUpCallback == 'function' )
            {
                window.XCLONE_DRAG_ITEM.p.model.afterUpCallback.call
                ( 
                    window.XCLONE_DRAG_ITEM.p, 
                    $e, 
                    window.XCLONE_DRAG_ITEM.p.model.dragItem
                    , window.XCLONE_DRAG_ITEM 
                );
            }
            
            resetDragItem();
        }
    };
    
    function resetDragItem()
    {            
        if( window.XCLONE_DRAG_ITEM && window.XCLONE_DRAG_ITEM.parentNode )
        {
            window.XCLONE_DRAG_ITEM.parentNode.removeChild( window.XCLONE_DRAG_ITEM );
        }
        
        if( window.XCLONE_DRAG_ITEM && window.XCLONE_DRAG_ITEM.p && window.XCLONE_DRAG_ITEM.p.cloneItemAppendNode )
        {
            window.XCLONE_DRAG_ITEM.p.cloneItemAppendNode.innerHTML = '';
        }
        
        window.XCLONE_DRAG_ITEM = null;
    }
    
    window.XCloneDrag = Control;
}();
