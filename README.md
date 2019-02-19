# N.js
-------------------------------
[![Banner](https://ww2.sinaimg.cn/large/ed039e1fgy1fxzuvu16clj20m808cgpi)](https://somebottle.gitee.io/bottlecos/n.js.mp4)  

**可点击↑**

## Compatibility.
  * The project is using CSS3 for scrolling barrages.Maybe there will be some compatibility problems.

## What the heck is this?  
  * A simple JS to create some barrages (We also call it 'the bulletscreen' or 'danmu').  

## How to use ?  
  * 引入JS：  
  ```html  
   <script src='./bueue.min.js' charset='UTF-8'></script>  
  ```  
  * 在页面中创建div，申明id：  
  ```html  
   <div id='container'><img src='./Dreamer.png'></img></div>  
  ```  
  * 初始化：**这条语句原js已经在末尾自带**  
  ```javascript   
   $N.i();   
  ```  
  * 选定要操纵的div：
  ```javascript   
   $N.x(div id);  
  ```  
   &nbsp;例如 **$N.x('container')** 便指定了操纵目标是id为container的div.  
   &nbsp;**PS:这个DIV在之后CSS定位属性会有变更：**
  ```css
   position:relative;  
  ```  
  * 设置**该div内**发送弹幕的属性：  
  ```javascript   
   $N.p(property,value);  
  ```  

   | 属性 | 值 | 内容 |
   | ----- | ----- | ----- |
   | color | 16进制颜色码 | 颜色 |
   | opacity | 0~100 | 透明度0%~100% |
   | time | 秒为单位的时间 | 设置一条弹幕的生命时间（调整速度） |
   | md | normal,top,bottom,random | 设置弹幕的位置，normal为滚动,random是随机行滚动,top和bottom分别为顶部、底部 |
   | bold | normal,100~900 | 设置弹幕css的font-weight(加粗)，normal则为400 |
   | size | normal,0.5~2.0 | 设置弹幕尺寸倍数 |

   例如设置在该div生成的弹幕颜色为蕾姆色: **$N.p('color','#91BEF0')**  

  * 创建一条弹幕：  
  ```javascript   
  $N.c('text');    
  ```  
   这将会在当前的div内生成一条写着**text**的弹幕（继上面的，是蕾姆色的弹幕）  

  * 暂停弹幕滚动：
  ```javascript   
   $N.theworld();   
  ```  
  **THE WORLD!** 这将会停止当前div内的弹幕.因此，建议和 **$N.x(div id)** 一同使用.   
  什么？要暂停所有div内的弹幕？  
  ```javascript   
   $N.theworld(true);   
  ```  
  * 让弹幕重新滚动：  
    **在已经暂停的前提下**  
    1. 当前div:
      ```javascript   
       $N.theworld();   
      ```  
    2. 所有div:
      ```javascript   
       $N.theworld(true);   
      ``` 
  * 清除弹幕：
    * 用法和theworld类似：
      ```javascript
      $N.clear();
      ```
      清除当前选择容器的弹幕.  
      ```javascript
      $N.clear(true);
      ```
      清除所有容器的弹幕.  
      
  * 弹幕列表功能：
    1. 创建列表：
      ```javascript
      $N.createlist(ListId);
      //listid可以是任何英文数字组合，不要出现奇怪的符号
      ```
    2. 删除列表:  
      ```javascript
      $N.dellist(ListId);
      ```
    3. 手动填装:   
      ```javascript
      $N.adtl(DanmakuData,MediaTime,Listid);
      ```
      其中DanmakuData: 
      ```javascript
       {
  	     x: 'm',
  	     color: '#5882FA',
  	     opacity: 100,
  	     time: 5,
  	     md: 'normal',
  	     bold: 200,
  	     size: 1,
  	     text: '灵能百分百赛高！'
       }
      ```
      
  * 示例  
  ```html
   <div class='p' id='p'><img src='pic.jpg' style='width:100%;'></img></div>
  ```
  
  ```javascript   
   $N.x('p');   
   $N.p('color','#F7FE2E');
   $N.p('bold',700); 
   $N.p('md','normal');
   $N.p('opacity',60);
   $N.p('time',10);
   $N.c('是谁住在深海的大菠萝里？！');
  ```   
  效果：  
  ![](https://ww2.sinaimg.cn/large/ed039e1fgy1fy7phwl73ij20a601adg8)  
  
  一条缓慢滚动着的浅黄色加粗弹幕。  




