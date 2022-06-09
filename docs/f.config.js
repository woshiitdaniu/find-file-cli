/*
 * @Description: 
 * @Autor: Bingo
 * @Date: 2022-05-31 10:54:30
 * @LastEditors: Bingo
 * @LastEditTime: 2022-05-31 17:37:21
 */
/* 
    1.亮点
      1）可以同时对指定目录范围的文件批量处理
      2）支持灵活配置
      3）支持输出已使用文件的情况
      4）支持输出未使用文件的情况
      5）支持输出未使用文件大小
      6）支持区分依赖和普通文件的查找
      7）支持手段过滤不需要查找的文件
*/
/**
 * Tips ↓
 * 除了使用配置文件的方式配置参数外 还可以使用终端命令的方式
 * 如：在pakeage.json 的scrpit增加如下命令
 * "find":"node ./f.config.js dir=./src/xxx isPackage=true"
 * 终端运行 npm run find 则最终配置将会以终端的为主
    
 * 也可以直接在终端运行node ./f.config.js dir=./src/xxx isPackage=true
 *
 
 * 注意: targetDirectory和needFilterFiles这种以数组形式存在的参数，如果需要传入多个则使用逗号隔开
 * 如："find":"node ./f.config.js dir=./src/xxx targetDirectory=./src/components,'./src/view'"
 * 
 * 当然该插件也许使用的频次并不高,建议使用之后进行ignore处理 以免增加非业务代码
 * */ 

const start = require('find-file-cli');
const path = require('path');
const config = {
    // 要确认文件路径 尽量一次性只使用一个目录来做基数 注意这里需要使用当前项目的绝对地址 **必选项
    dir: path.resolve(__dirname, './src/assets'),
    // 要搜索的目录 如果没输入 默认就是src目录下所有的文件 **必选项
    targetDirectory: [path.resolve(__dirname, './src/components')],
    // 是否查看 package.json 依赖的使用情况  
    isPackage: false,
    // 需要过滤掉的依赖或文件 这里需要将文件名列出  注意如果不是依赖需要加文件后缀 比如 xx.js  xx.png
    needFilterFiles: [],
    // 是否需要打印出文件使用情况
    needInputUseCondition: true,
    // 是否需要打印出未使用文件情况
    needInputUnuseFiles: true,
    // 延迟 如果没有出结果 请将延迟时间加长再次尝试 **必选项
    timeOut: 500 
};

start(config);


 