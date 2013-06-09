/**
 * 通用遮罩层
 * @className   XMask 
 * @require     getMaxIndex         获取页面最大z-index函数
                viewport_f          获取页面屏幕大小的函数 
                attach_event_f      动态添加事件函数
                
 * @author      suches@btbtd.org
 * @date        2012-2-19
 * @css
    <style>
        .mask_iframe
        {
            position:absolute;
            width: 100%;
            height: 100%;
            background: #fff;
            left: 0;
            top: 0;
            opacity: .35;
            filter: alpha(opacity=35)
        }
        
        .mask_div
        {
            position:absolute;
            width: 100%;
            height: 100%;
            background: #fff;
            left: 0;
            top: 0;
            opacity: .35;
            filter: alpha(opacity=35)
        }  
    </style>
 *  
 * @example
 *      XMask.exec().show()
 *      XMask.exec().hide();   
 */ 
void function()
{    
    var isIE6 = !-[1,] && !window.XMLHttpRequest;
    
    function Control( $params )
    {
        this.model = new Model($params).init();
        this.view = new View( this.model ).init();
    }
    
    Control.exec =
    function( $params )
    {
        return window.XMASK || new Control( $params ).init();
    };
    
    Control.isHide =
    function()
    {
        var mask = document.getElementById("mask_div__");
        
        if( !mask ) return true;
        
        if( mask.style.display != 'none' ) return false;
        
        return true;
    };
    
    Control.prototype =
    {
        init:
        function()
        {
            window.XMASK = this;
            
            this.model.mask_iframe__ = document.getElementById("mask_iframe__");
            this.model.mask_div__ = document.getElementById("mask_div__");
            
            if( !(this.model.mask_iframe__ && this.model.mask_div__) )
            {            
                this.model.box = document.createElement('div');
                this.model.box.innerHTML = 
                [
                "    <iframe src=\"about:blank\" id='mask_iframe__' class=\"mask_iframe\" frameborder=\"0\" style=\"display:none\"></iframe>\n"
                ,"    <div class=\"mask_div\" id='mask_div__' style=\"display:none\"></div>\n"
                ].join('');
                
                document.body.appendChild( this.model.box );
            }
            
            this.model.mask_iframe__ = document.getElementById("mask_iframe__");
            this.model.mask_div__ = document.getElementById("mask_div__");
            
            attach_event_f( window, 'resize', function(){ window.XMASK.updateSize(); } );
            attach_event_f( window, 'scroll', function(){ window.XMASK.updateSize(); } );
            
            return this;
        }
        
        , show: function(){ this.view.show(); }
        , hide: function(){ this.view.hide(); }
        , isShow: function(){ return this.model.isShow; }
        , updateSize: function(){ this.view.updateSize(); }
    }
    
    function Model($params)
    {
        this.box;
        
        this.mask_iframe__;
        this.mask_div__;
        
        this.isShow = false;
        
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
        },
        
        show:
        function()
        {
            this.model.isShow = true;
            
            this.model.mask_iframe__.style.zIndex = getMaxIndex();
            this.model.mask_div__.style.zIndex = getMaxIndex();
            
            this.model.mask_iframe__.style['display'] = 'block';
            this.model.mask_div__.style['display'] = 'block';
                
            this.updateSize();
        },
        
        updateSize:
        function()
        {            
            if( XMask.isHide() ) return;
        
            var viewport = viewport_f();
            
            if( isIE6 )
            {            
                var mask_css =     
                {
                    "position": "absolute"
                    , "left": 0
                    , "top": 0
                    , "width": viewport.max_width + 'px'
                    , "height": viewport.max_height + 'px'
                    , "display": "block"
                };
            }
            else
            {
                var mask_css =     
                {
                    "position": "fixed"
                    , "left": 0
                    , "top": 0
                    , "width": viewport.width + 'px'
                    , "height": viewport.height + 'px'
                };
            }
            
            for( var k in mask_css )
            {
                this.model.mask_iframe__.style[k] = mask_css[k];
                this.model.mask_div__.style[k] = mask_css[k];
            }
        },
        
        hide:
        function()
        {
            this.model.isShow = false;
            
            this.model.mask_iframe__.style.display = 'none';
            this.model.mask_div__.style.display = 'none';
        }
    };
    
    window.XMask = Control;
}();
