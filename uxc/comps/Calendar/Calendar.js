(function($){
    !window.UXC && (window.UXC = { log:function(){} });

    UXC.Calendar = window.Calendar = Calendar;

    function Calendar( _selector )
    {
        this._model = new Model( _selector ).init();
        this._view = new View( this.model ).init();
    }
     
    Calendar.pickDate =
        function( _selector ){
            return new Calendar( _selector ).init();
        };

    $(document).ready( function($evt){
        $('input[type=text]').each( function($evt){
            var _p = $(this);
            if( $.trim( _p.attr('datatype') || '').toLowerCase() == 'date' ) Calendar.init( _p );
        });
    });
   
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

