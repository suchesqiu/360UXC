(function($){
    !window.UXC && (window.UXC = { log:function(){} });

    UXC.Calendar = window.Calendar = Calendar;
    
    Calendar.pickDate =
        function( _selector ){
            return new Calendar( _selector ).init();
        };

    function Calendar( _selector )
    {
        this.model = new Model( _selector ).init();
        this.view = new View( this.model ).init();
    }
    
    Calendar.prototype =
    {
        init:
        function()
        {
            
            return this;
        }    
    }
    
    function Model(_selector)
    {
        this.selector = _selector;
    }
    
    Model.prototype =
    {
        init:
        function()
        {
            return this;
        }
    };
    
    function View( _model )
    {
        this.model = _model;
    }
    
    View.prototype = 
    {
        init:
        function()
        {
            return this;
        }
    };
    
    
}(jQuery));

