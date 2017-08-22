const path = require('path')
const chalk = require('chalk')
const child_process = require('child_process')
// const inquirer = require('inquirer')
const fs = require('fs')
const utils = require('./utils')

/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            let entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
                console.log("delete file : " + entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

/**
 *
 * */
function exec(command,quiet){
    return new Promise((resolve, reject)=> {
            try {
                let child = child_process.exec(command, {encoding: 'utf8'}, function () {
                    resolve();
                })
                if(!quiet){
        child.stdout.pipe(process.stdout);
    }
    child.stderr.pipe(process.stderr);
}catch(e){
        console.error('execute command failed :',command);
        reject(e);
    }
})
}

/**
 * build
 * @param {Object} options
 */

function build(src,target) {
    //先清空原目录...
    rimraf(target)
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }
    //同步文件...
    let command = 'rsync -r -v --delete-after '+ src +' '+target
    exec(command)
}

module.exports = build
// var __dirname ='platforms/android/app';



if (!fs.existsSync("platforms/android/app/src/main/assets")) {
    fs.mkdirSync("platforms/android/app/src/main/assets");
    console.log('mkdir assets')
}
if (!fs.existsSync("platforms/android/app/src/main/assets/weex")) {
    fs.mkdirSync("platforms/android/app/src/main/assets/weex");
    console.log('mkdir weex')
}
if (!fs.existsSync("platforms/android/app/src/main/assets/weex/res")) {
    fs.mkdirSync("platforms/android/app/src/main/assets/weex/res");
    console.log('mkdir res')
}
if (!fs.existsSync("platforms/android/app/src/main/assets/weex/jsbundle")) {
    fs.mkdirSync("platforms/android/app/src/main/assets/weex/jsbundle");
    console.log('mkdir jsbundle')
}

//图片资源文件
const imgSrc ='src/assets/*'
const imgTarget = 'platforms/android/app/src/main/assets/weex/res'
// const imgTarget = path.join(__dirname, 'src', 'main','assets','weex','res')



build(imgSrc,imgTarget)

//JS文件
const jsSrc ='dist/native/*'
const jsTarget = 'platforms/android/app/src/main/assets/weex/jsbundle'
// const jsTarget = path.join(__dirname, 'src', 'main','assets','weex','jsbundle')
build(jsSrc,jsTarget)


