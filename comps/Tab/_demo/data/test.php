<?php
    $count = isset( $_COOKIE['TabTestCk'] ) ? (int) $_COOKIE['TabTestCk'] : 20;
    $count++;
    setcookie( 'TabTestCk', $count, time() + 60 * 60 * 24 );

    $r = array( "errorno" => 1, "errmsg" => "" );
    $r["data"] = $count . "asdfjaslefasdfjlsdflsakdfjksadfklsdfaskdlflkasdfasdkfl";

    echo json_encode( $r );
?>
