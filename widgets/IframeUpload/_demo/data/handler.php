<?php
    $cb = isset( $_REQUEST['cb'] ) ? $_REQUEST['cb'] : 'IFRAME_UPLOAD';
    $r = array( 'errorno' => 1, 'data' => array() );
    if( isset( $_REQUEST['info'] ) ){
        $r['data']['info'] = $_REQUEST['info'];
        $r['errorno'] = 0;
    }
?>
<script>
    if( window.parent ){ 
        window.parent['<?php echo $cb; ?>']( <?php echo json_encode( $r ); ?> );
    }
</script>

