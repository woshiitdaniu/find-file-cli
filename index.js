/*
 * @Description: 
 * @Autor: Bingo
 * @Date: 2022-05-30 14:02:35
 * @LastEditors: Bingo
 * @LastEditTime: 2022-05-31 16:46:19
 */
const fs = require('fs');
const path = require('path');

// chalk库 让输出提示更友好
const chalk = require('chalk');
chalk.level = 1;
chalk.enabled = true;
const log = console.log;

// 获取终端输入的参数
const userArguments = process.argv.splice(2);

// 启动入口函数
const start = (config = {}) => {
    // 临时存放所有文件
    // key:文件名  value:path,文件体积
    let glabResult = {};

    // 存放被引用的文件容器
    let usedFiles = [];

    // 存放未被使用的文件容器
    let unUsedFiles = [];

    let defaultConfig = {
        // 要确认的文件路径 尽量一次性只确认一个目录来做基数
        dir: '',
        // 要搜索的目录 如果没输入 默认就是src目录下所有的文件
        targetDirectory: [path.resolve(__dirname, './src/components')],
        // 是否查看依赖的使用情况  TODO 增加每个文件的体积大小
        isPackage: false,
        // 需要过滤掉的依赖或文件 TODO
        needFilterFiles: [],
        // 是否需要打印出文件使用情况
        needInputUseCondition: true,
        // 是否需要打印出未使用文件情况
        needInputUnuseFiles: true,
        // 延迟 如果没有出结果 请将延迟时间加长再次尝试
        timeOut: 300
    };


    // 判断是文件还是目录
    const isFile = p => p.indexOf('.') > -1;

    // 判断文件存不存在
    const isExit = reaPath => fs.existsSync(reaPath);

    // 获取文件大小
    const getFileSize = (filePath) => {
        // eslint-disable-next-line promise/param-names
        return new Promise((res) => {
            fs.stat(filePath, (error, stats) => {
                if (!error) {
                    res(stats.size);
                }
            });

        });
    };

    // 将文件收集到指定容器
    const joinFilePath2Arr = async (currPath, preFilePath) => {
        const filePath = preFilePath + '/' + currPath;
        const size = await getFileSize(filePath);
        !defaultConfig.needFilterFiles.includes(currPath) && (glabResult[currPath] = `${filePath} ${size}`);
    };

    // 读取文件内容
    const readFileContent = path => {
        return new Promise((resolve) => {
            fs.readFile(path, (err, buffer) => {
                // 这里只针对文件内容io了一次
                const resultStr = buffer.toString();
                if (!err) {
                    resolve(resultStr);
                }
            });
        });
    };

    // 处理普通文件主要逻辑
    const handleFileByPath = (preFilePath, callback) => {
        if (!preFilePath) {
            console.warn('dir是必须参数,请指定相对路径');
        }
        try {
            const files = fs.readdirSync(preFilePath);
            files.forEach(currentPath => {
                // 直接就是文件了
                if (isFile(currentPath)) {
                    typeof callback === 'function' && callback(currentPath, preFilePath);
                } else {
                    // 递归处理目录
                    const newdir = `${preFilePath}/${currentPath}`;
                    isExit(newdir) && handleFileByPath(newdir, callback);
                }
            });

        } catch (err) {
            log(err);
        }
    };

    // 处理pakeage.json查找依赖的主要逻辑
    const handlePakeageJson = async (callback) => {
        const content = await readFileContent(path.resolve(__dirname, './package.json'));
        //  pakeage依赖处理
        // eslint-disable-next-line no-use-before-define
        handlePakeageList(JSON.parse(content || '{}'));
    };

    // 处理pakeage依赖
    const handlePakeageList = (pakeageJson) => {
        const dependObj = { ...pakeageJson?.dependencies, ...pakeageJson?.devDependencies };
        glabResult = { ...dependObj };
    };

    // 普通文件输出
    const outPublicFile = (filePath, item) => {
        if (defaultConfig.needInputUseCondition) {
            // log(`在文件   ${filePath}   中存在 ${item} 文件`)
            log(`${chalk.yellow(filePath)}  中使用了 ${chalk.green(item)} 文件`);
        }
        usedFiles.push(item);
    };

    // package 依赖文件输出
    const outDependFile = (resultStr, filePath, item) => {
        let matchR = resultStr.substring(resultStr.indexOf('<script>') + 8, resultStr.indexOf('export'));
        // 这里兼容了import 和 require两种模式导入的依赖
        if (matchR.indexOf(`"${item}"`) > -1 || matchR.indexOf(`'${item}'`) > -1) {
            log(`${chalk.yellow(filePath)}  中使用了 ${chalk.green(item)} 文件`);
            usedFiles.push(item);
        }
    };
    // 过滤出没被使用的文件
    const filterUnuseFiles = () => {
        unUsedFiles = Object.keys(glabResult).filter(item => !usedFiles.includes(item));
    };

    // 未使用文件输出
    const outUnuseFile = () => {
        if (defaultConfig.needInputUnuseFiles) {
            filterUnuseFiles();
            // TODO 后期增加删除操作
            log('   ');
            log(`<--------------  ↓↓↓ 以下文件在  ${chalk.yellow(defaultConfig.targetDirectory)}  路径下未使用,请确认是否需要删除  -------------->`);
            log('   ');
            unUsedFiles.forEach(unUsedFile => {
                if (defaultConfig.isPackage) {
                    log(`                    ${chalk.green(unUsedFile)}`);
                } else {
                    const size = glabResult[unUsedFile].split(' ')[1];
                    log(`                    ${chalk.green(unUsedFile)}  ${chalk.white('size-->')}  ${chalk.red(size)}b`);
                }
            });
            log('   ');
        }
    };

    // 处理输出匹配结果
    const handleResult = (filePath, resultStr) => {
        Object.keys(glabResult).forEach(item => {
            // 由于这里只考虑该文件是否被使用过 不需要统计使用次数 针对普通文件
            if (!defaultConfig.isPackage && resultStr.indexOf(item) > -1) {
                outPublicFile(filePath, item);
                // 针对依赖  我们需要将检索范围缩小到import xxx from ('xxx') 或 require('xxx') 
            } else if (defaultConfig.isPackage) {
                outDependFile(resultStr, filePath, item);
            }
        });
    };

    // 对比指定文件是否存在指定内容中
    const judgeContent = async (currentPath, preFilePath) => {
        const newdir = `${preFilePath}/${currentPath}`;
        const res = await readFileContent(newdir);
        handleResult(newdir, res);
    };

    /**
     * @description 注意 这里顺序不能更换 否则会出错
     * @param mkdirs type Arrary :要找的目录数组
     * @param callback type Function :查找处理函数 
     */
    const getMkdirContent = async (mkdirs, callback) => {
        mkdirs.forEach(dir => {
            handleFileByPath(dir, callback);
        });
    };

    // 处理命令行参数
    const handleTemplteParams = () => {
        // 1.将 ["dir=src/assets","isPackage=true"] 转成 对象 同时多个参数用,隔开
        let paramsObj = {};
        userArguments.forEach(item => {
            if (item.indexOf('=') == -1) return;
            let arr = item.split('=');
            paramsObj[arr[0]] = arr[1].indexOf(',') > -1 ? arr[1].split(',') : arr[1];
        });
        defaultConfig = { ...defaultConfig, ...paramsObj };
        // 2.借助replace 将' " 空格替换成'' 然后加上自己的""
        defaultConfig.dir = defaultConfig.dir ? path.resolve(__dirname, defaultConfig.dir.replace(' ', '')) : '';

    };

    // 参数合并
    const mergeConfig = (conf) => {

        if (typeof conf === 'object' && conf !== null) {
            defaultConfig = { ...defaultConfig, ...conf };
        }
        // 如果命令行有参数则优先级最高 可以覆盖上面的配置
        Array.isArray(userArguments) && userArguments.length && handleTemplteParams();
    };

    // 合并配置
    mergeConfig(config);
    // 找出要查找的文件对象
    defaultConfig.isPackage ? handlePakeageJson() : handleFileByPath(defaultConfig.dir, joinFilePath2Arr);
    // 比对是否被使用
    getMkdirContent(defaultConfig.targetDirectory, judgeContent);
    // 输出比对结果
    setTimeout(() => {
        outUnuseFile();
    }, defaultConfig.timeOut);
};


module.exports = start;