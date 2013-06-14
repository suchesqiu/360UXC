<?php
    $tmstart = isset( $_GET['tmstart'] ) ? $_GET['tmstart'] : '';
    $tmstart = isset( $_GET['tmover'] ) ? $_GET['tmover'] : '';

    $posthandler = isset( $_POST['tmitem'] ) ? $_POST['tmitem'] : '';

    $filename = dirname( __FILE__ ) . '/json.js';
    $file = fopen( $filename, 'r+');
    $contents = json_decode( trim(fread($file, filesize($filename))) );


    if( isset( $_POST['tmitem'] ) && $posthandler ){
        echo 'posthandler';
    }

    fclose($file);

?>
