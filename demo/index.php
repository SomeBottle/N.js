<title>Hello N.js</title>
<style>
.p{
	max-width:70%;
}
</style>
<div class='p' id='p'><img src='pic.jpg' style='width:100%;'></img></div>
<div class='p' id='p2'><img src='pic2.jpg' style='width:100%;'></img></div>
<script src='./N.min.js'></script>
<script>
$N.x('p');
$N.p('color','green');
console.log('Switch to p');
setTimeout(function(){
	$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');$N.c('原谅色赛高');
},1000);
setTimeout(function(){
	$N.p('md','top');$N.p('color','blue');$N.c('蓝色也不错');$N.p('color','#58ACFA');$N.c('亚可真的太可爱了');
},1200);
setTimeout(function(){
	$N.theworld();console.log('The World!');
},1200);
setTimeout(function(){
	console.log('Switch to p2');
	$N.x('p2');
	console.log('Set p2\'s font weight to 700');
	$N.p('bold',700);
	$N.p('md','normal');
	$N.p('color','#58ACFA');
	$N.c('托尔真的有一种反差萌诶~');$N.c('托尔真的有一种反差萌诶~');$N.c('托尔真的有一种反差萌诶~');$N.c('托尔真的有一种反差萌诶~');$N.c('托尔真的有一种反差萌诶~');$N.c('托尔真的有一种反差萌诶~');
	$N.p('md','bottom');
	$N.p('color','#FE9A2E');
	$N.c('托尔色');$N.c('托尔色');$N.c('托尔色');
},1800);
setTimeout(function(){
	$N.theworld();console.log('The World2!');
},3000);
setTimeout(function(){
	$N.x('p');
    console.log('Switch to p');
},3200);
setTimeout(function(){
	$N.theworld();
	console.log('Time start to flow');
},4000);
setTimeout(function(){
	console.log('Switch to p2');
	$N.x('p2');
},4500);
setTimeout(function(){
	$N.theworld();
	console.log('Time start to flow 2');
},5000);
setTimeout(function(){
	$N.theworld(true);
	console.log('THE WORLD!');
	console.log('Every container\'s time has been paused.');
},7000);
setTimeout(function(){
	$N.theworld(true);
	console.log('Time start to flow');
},10000);
</script>