/**
 * 通用 JS 分享类~(分享到新浪/腾讯...)
 * @className   XShare
 * @example
    	<span class="share_" title="分享到新浪微博" data-sns="sina_weibo"></span>
        <span class="share_" title="分享到腾讯微博" data-sns="tencent_weibo"></span>  
        
        <script>
            W( '.share_' ).on
            (
                'click',
                function()
                {
                    var type = W(this).getAttr('data-sns').trim();
                    var url = ''; //box.query('input[name=url]').val().trim();                
                    var content = box.query('textarea').val().trim();
                    
                    XShare.exec( { "type": type, "url": url, "textContent": content } );
                }
            );
        </script>
 *
 * @author      suches@btbtd.org
 * @date        2012-2-21
 * @version     1.0 
 */ 
void function()
{    
    function Control( $params )
    {
        this.model = new Model($params).init();
        this.view = new View( this.model ).init();
    }
    
    Control.sharingCallback = null;
    
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
            this.view.open();
            
            if( Control.sharingCallback )
            {
                Control.sharingCallback( this.model.type, this.model.getUrl(), this.model );
            }            
            
            return this;
        }    
    }
    
    function Model($params)
    {
        this.type; /**
                    * sina_weibo
                    * sohu_weibo         
                    * tencent_weibo                               
                    */                    
        this.url; 
        this.image; 
        this.textContent;   
        
        for( var k in $params ) this[k] = $params[k];
    }
    
    Model.prototype =
    {
        init:
        function()
        {            
            return this;
        },
        
        getUrl:
        function()
        {
            var temp = [];
            var r = '';
            
            switch( this.type )
            {
                case 'sina_weibo':
                {
                    if( this.url ) temp.push( [ 'url', encodeURIComponent(this.url) ].join('=') );
                    if( this.textContent ) temp.push( [ 'title', encodeURIComponent(this.textContent) ].join('=') );
                    if( this.sourceUrl ) temp.push( [ 'source', encodeURIComponent(this.sourceUrl) ].join('=') );
                    if( this.image ) temp.push( [ 'pic', encodeURIComponent(this.image) ].join('=') );
                    
                    if( this.appkey ) temp.push( [ 'appkey', this.appkey ].join('=') );
                    if( this.ralateUid ) temp.push( [ 'ralateUid', this.ralateUid ].join('=') );
                    if( this.source ) temp.push( [ 'source', this.source ].join('=') );
                    if( this.content ) temp.push( [ 'content', this.content ].join('=') );
                   
                    temp.push( [ 'count', 1 ].join('=') );
                    
                    r = 'http://service.weibo.com/share/share.php?'+ temp.join('&');
                    break;
                }
                
                case 'sohu_weibo':
                {
                    if( this.url ) temp.push( [ 'url', encodeURIComponent(this.url) ].join('=') );
                    if( this.textContent ) temp.push( [ 'title', encodeURIComponent(this.textContent + ' ') ].join('=') );
                    if( this.image ) temp.push( [ 'pic', encodeURIComponent(this.image) ].join('=') );
                   
                    temp.push( [ 'content', "utf-8" ].join('=') );
                    
                    r = 'http://t.sohu.com/third/post.jsp?'+ temp.join('&');
                    break;
                }
                
                case 'tencent_weibo':
                {
                    if( this.url ) temp.push( [ 'url', encodeURIComponent(this.url) ].join('=') );
                    if( this.textContent ) temp.push( [ 'title', encodeURIComponent(this.textContent + ' ') ].join('=') );
                    if( this.image ) temp.push( [ 'pic', encodeURIComponent(this.image) ].join('=') );
                    if( this.site ) temp.push( [ 'site', encodeURIComponent(this.site) ].join('=') );
                    
                    if( this.appkey ) temp.push( [ 'appkey', this.appkey ].join('=') );
                    
                    r = 'http://v.t.qq.com/share/share.php?'+ temp.join('&');
                    break;
                }
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
        },
        
        open:
        function()
        {
            var url = this.model.getUrl();
            
            window.open( url, 'XSHARE_WINDOW', this.model.windowParams || '' );
        }
    };
    
    window.XShare = Control;
}();
