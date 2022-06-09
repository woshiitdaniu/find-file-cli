# 欢迎使用 find-file-cli 项目文件使用情况插件

------

同为开发人我能理解您需要更便捷更高效的工具来查找项目中文件的使用情况，并合理的对其进行整合和过滤，将未使用到的文件进行删除，对体积大的文件进行压缩等，以前我们是在编辑器里一个个全局的查找，这样做确实可以找出所有文件的使用情况，但这样做的效率非常低，**find-file-cli** 是我业余时间开发的一款专门批量查找文件使用情况的插件， —— 我们应该为解放双手和追求渲染极致提供更专业的工具。 您可以使用 find-file-cli：

> * 一键下载，简单配置
> * 灵活选择范围，个性化输出结果
> * 不用担心性能，因为使用了map做缓存结构，重复io的事咱不做^ ^
> * 不侵入业务代码，尽可放心使用



![bingo](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d72a78c8e0a64d2a8d58de61099ce59e~tplv-k3u1fbpfcp-watermark.image?)

除了 npm **find-file-cli** ，您还可以前往以下网址下载源码：

### [github](https://github.com/woshiitdaniu/find-file-cli.git)
### [gitee](https://gitee.com/Bingo996/find-file-cli.git)

> 如果您觉得该插件项目对您开发工作有帮助请为 find-file-cli 打 **Start** 或者给朋友推荐哟。

------

## 什么是 find-file-cli

find-file-cli 是一种方便查找项目未使用文件，减少项目体积、使用纯js书写的提效插件工具，您可以使用最少的配置来生成极简约的结果；尽管该插件还只是第一版，但它依然可以做到以下功能为您愉快编码助力。

- [x] 支持查找对象和查找范围批量处理
- [x] 支持灵活配置
- [x] 支持输出已使用文件的情况
- [x] 支持输出未使用文件的情况
- [x] 支持输出未使用文件大小
- [x] 支持区分依赖和普通文件的查找
- [x] 支持手动过滤不需要查找的文件
- [ ] TODO 删除未使用的指定文件
## 使用步骤
#### 一、在项目终端下载 find-file-cli
```javascript
npm install --save-d find-file-cli
```
#### 二、在项目根路径新增配置文件 f.config
```javascript
f.config.js or f.config.ts
```
#### 三、在项目 package.json script对象中新增如下内容
```javascript
"find":"node ./f.config.js"
```
#### 四、在项目终端输入
```javascript
npm run find
```

### 参数设置

| 主要配置参数 | 类型   |  描述  |  是否必须  |
| ---- |  --- | --  |---|
| dir | String |   要拿去匹配的文件路径 |是|
| targetDirectory | Arrary[String] | 要搜索的目录 如果没输入 默认就是src目录下所有的文件   |是|
| isPackage | Boolean |  是否查看 package.json 依赖的使用情况  |否|
| needFilterFiles | Arrary[String]  |   需要过滤掉的依赖或文件 这里需要将文件名列出  注意如果不是依赖需要加文件后缀 比如 xx.js  xx.png |否|
| needInputUseCondition | Boolean  |   是否需要打印出文件使用情况 |否|
| needInputUnuseFiles | Boolean  |   是否需要打印出未使用文件情况 |否|
| timeOut | Number  |   延迟 如果没有出结果 请将延迟时间加长再次尝试 |否|

### 部分使用场景


![demo1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b36be1665d3b411c80287bd82e9c9df3~tplv-k3u1fbpfcp-watermark.image?)
```javascript
就可以在终端输入 npm run find dir=./src/assets targetDirectory=./src/components
```

输出结果如下：
![result1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc519c07e6294625860a1dc7238d950d~tplv-k3u1fbpfcp-watermark.image?)

怎么样？是不是很酷，当产品让我们找出未使用的静态资源时我们再也不需要一个个文件去找啦，这样就解放了我们的双手，愉快摸鱼啦 当然find-file-cli还可以查找package.json里的依赖在指定目录的使用情况哟，赶快下载体验吧
------

再一次感谢您花费时间阅读，**npm install --save-d find-file-cli** 开始下载使用吧！祝您在使用的过程中能助力开发！

作者 [@Bingo]   
2022 年 05月 31日    


