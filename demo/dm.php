<?php
$dm=$_POST['dm'];
$color=$_POST['color'];
$time=$_POST['tm'];
$json=json_decode(file_get_contents('./testdm.json'),true);
$num=count($json['danmaku']);
$new=$num+1;
$json['danmaku'][$new]['text']=$dm;
$json['danmaku'][$new]['color']=$color;
$json['danmaku'][$new]['ts']=$time;
file_put_contents('./testdm.json',json_encode($json,true));
?>