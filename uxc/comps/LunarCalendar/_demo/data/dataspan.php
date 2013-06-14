<?php
    $tmstart = isset( $_GET['tmstart'] ) ? $_GET['tmstart'] : '';
    $tmstart = isset( $_GET['tmover'] ) ? $_GET['tmover'] : '';

    $posthandler = isset( $_POST['tm'] ) ? $_POST['tm'] : '';

    $filename = dirname( __FILE__ ) . '/json.js';
    $json = json_decode( trim( file_get_contents( $filename ) ), true );
    $result = array( 'errorno' => 1, "errmsg" => '' );

    /*
     tm: item timestamp, timestamp is id
       
     action: 
        1: workday
        2: holiday
        3: comment
        4: comment + holiday
        5: comment + workday
        6: add comment
        7: edit comment
        8: delete comment

     cm: comment data, action = 6/7
     */
    if( $posthandler ){
        $action = isset( $_POST['action'] ) ? $_POST['action'] : '';
        if( $action ){
            switch( $action ){
                case "1":
                {
                    if( !array_key_exists( $posthandler, $json ) ){
                        $json[ $posthandler ] = array();
                    }

                    $json[ $posthandler ]['isWorkday'] = 1;
                    $tmp = json_encode( $json );
                    file_put_contents( $filename, $tmp );
                    $result['errorno'] = 0;
                    break;
                }
            }
        }
    }


    echo json_encode( $result );

?>
