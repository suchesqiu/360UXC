/**
 * 倒计时类
 * @className   XTimer
 * @example
                <div id="test">离结束还有<span id="timer">8</span>秒</div>
                <div><button id="redo" type="button" style="display:none">redo</button></div>
                
                <script src="../XTimer.js"></script>
                <script>
                    
                    var ele = document.getElementById("timer");
                    var test = document.getElementById("test");
                    var redo = document.getElementById("redo");
                    
                    var second = parseInt( ele.innerHTML );
                    
                    testFunc();
                    
                    function testFunc()
                    {
                        test.style.display = 'block';
                        redo.style.display = 'none';
                            
                        XTimer.exec
                        (
                            {
                                "second": second
                                
                                , "tickCallback": 
                                    function( $second )
                                    {
                                        ele.innerHTML = $second;
                                    }
                                    
                                , "doneCallback":
                                    function( $second )
                                    {
                                        test.style.display = 'none';
                                        redo.style.display = 'block';
                                    }
                            }
                        );
                    }
                    
                    redo.onclick = 
                    function()
                    {
                        testFunc();
                    };
                    
                </script>
 * @author      x@btbtd.org
 * @date        2012-3-28 
 */ 
void function()
{    
    function Control( $params )
    {
        this.model = new Model($params).init();
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
            
            p.model.date = new Date();
            
            p.fireCallback();
                        
            p.model.interval =
            setInterval
            (
                function()
                {
                    p.model.second -= p.model.step;
                    
                    p.fireCallback();
                    
                    if( p.model.second <= 0 )
                    {
                        clearInterval( p.model.interval );
                    }
                }
                , p.model.realStep
            );
            
            return this;
        }
        
        , fireCallback:
        function()
        {
            var p = this;
            
            if( p.model.tickCallback )
            {
                p.model.tickCallback.call( this, p.model.second );
            }
            
            if( p.model.second < p.model.step )
            {
                if( p.model.doneCallback )
                {
                    p.model.doneCallback.call( this, p.model.second );
                }
            }
        }
    }
    
    function Model($params)
    {
        this.second;
        this.step = 1;
        
        this.tickCallback;
        this.doneCallback;
        
        this.date;
        this.interval;
        this.realStep;
        
        for( var k in $params ) this[k] = $params[k];
    }
    
    Model.prototype =
    {
        init:
        function()
        {   
            this.doneCallback = this.doneCallback || this.callback;
            
            this.realStep = this.step * 1000;
             
            return this;
        }
    };
    
    window.XTimer = Control;
}();
