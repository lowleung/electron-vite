const fs = require('fs')
const path = require('path')
const asar = require('asar')
const asarmor = require('asarmor')
const JavaScriptObfuscator = require('javascript-obfuscator') //使用javascript-obfuscator代码混淆

//获取指定文件夹下排除指定类型的文件
function getFiles(dirpath, exclude) {
  const arrs = []
  const dirs = fs.readdirSync(dirpath)
  dirs.forEach((value) => {
    let extname = path.extname(value)
    if (exclude.includes(extname)) {
      arrs.push(path.join(dirpath, value))
    }
  })
  return arrs
}

exports.default = async ({ appOutDir, packager }) => {
  try {
    const asarPath = path.join(packager.getResourcesDir(appOutDir), 'app.asar')
    let appPath = path.join(packager.getResourcesDir(appOutDir), 'app')

    if (fs.existsSync(asarPath)) {
      //如果存在asar压缩包
      asar.extractAll(asarPath, appPath)
    }

    //替换文件内容
    let fileArrs = getFiles(path.join(appPath, 'out', 'renderer', 'assets'), ['.js'])
    for (let i = 0; i < fileArrs.length; i++) {
      let con = fs.readFileSync(fileArrs[i], 'utf8')
      let obfuscationResult = JavaScriptObfuscator.obfuscate(con, {
        compact: true,
        debugProtection: true,
        disableConsoleOutput: true,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1
      })
      fs.writeFileSync(fileArrs[i], obfuscationResult.getObfuscatedCode())
      console.log(`${fileArrs[i]} has obfuscator completed.`)
    }

    console.log('All asar files had obfuscator and replacement.')
    if (fs.existsSync(asarPath)) {
      fs.unlinkSync(asarPath)
      console.log('delete the original asar.')
    }
    await asar.createPackage(appPath, asarPath)
    fs.rmSync(appPath, { recursive: true })
    console.log('create new asar completed.')

    // 防止被解压
    const archive = await asarmor.open(asarPath)
    archive.patch(asarmor.createBloatPatch(2048))
    console.log(`applying asarmor patches to ${asarPath}`)
    await archive.write(asarPath)
  } catch (err) {
    console.error(err)
  }
}
