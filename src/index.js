'use strict';
// 引入主css
import "./style/main.css";
import Danmaku from "./danmaku.js";
import { output } from "./utils.js";

output('Hey there! Thank you for using N.js - SomeBottle');

// 暴露给全局(Export UMD Library)
export default Danmaku;