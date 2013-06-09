<?php

    $callback = 'callback';
    $query = '';
    $pquery = '';
    
    if( isset( $_REQUEST['callback'] ) )
    {
        $callback = $_REQUEST['callback'];
    }
    
    if( isset( $_REQUEST['query'] ) && trim( $_REQUEST['query'] ) )
    {
        $query = trim( $_REQUEST['query'] ) . '_';
        $pquery = trim( $_REQUEST['query'] );
    }

    //$data = json_decode( '{"sug":["Sonia","hedygaga35","sasdasdasd","天天向上","一二三四五六七八九1","sdstest12","jag","medrifter","Goat","共和国防洪"]}' );
    
    $data = array( "sug" => array() );
    
    for( $i = 0; $i < 10; $i++ )
    {
        array_push( $data["sug"], $query . str_pad( $i . '', 5, $i . '' ) );
    }
    
    $data["query"] = $pquery;
    
    echo $callback . '(' . json_encode( $data ) . ')';
?>
