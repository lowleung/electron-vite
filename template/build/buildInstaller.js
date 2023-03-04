const prompts = require('prompts')
var innosetupCompiler = require('innosetup-compiler')
var path = require('path')
var fs = require('fs')
var iconv = require('iconv-lite')

var rootPath = path.resolve(__dirname, '../')

function resolve() {
    return path.resolve.apply(path, [__dirname, '..'].concat(...arguments))
}

var tmpJson = require(path.resolve(rootPath, './package.json'))

function buildWinSetup(setupOptions, verbose) {
    const res = []

    const options = Object.assign({}, setupOptions, {
        files: setupOptions.files
    })

    res.push(makeExeSetup(options, verbose))
    return Promise.all(res)
}

function makeExeSetup(opt, verbose) {
    const {
        issPath,
        files,
        iconPath,
        outputPath,
        outputFileName,
        resourcesPath,
        appPublisher,
        appURL,
        setupID
    } = opt
    const { name, description, version } = tmpJson
    const tmpIssPath = resolve('./dist', '_tmp_' + '.iss')

    return new Promise(function(resolve, reject) {
        // rewrite name, version to iss
        fs.readFile(issPath, null, function(err, text) {
            if (err) return reject(err)

            let str = iconv
                .decode(text, 'gbk')
                .replace(/_name_/g, name)
                .replace(/_appName_/g, description)
                .replace(/_version_/g, version)
                .replace(/_outputPath_/g, outputPath)
                .replace(/_icon_/g, iconPath)
                .replace(/_outputFileName_/g, outputFileName)
                .replace(/_filesPath_/g, files)
                .replace(/_resourcesPath_/g, resourcesPath)
                .replace(/_appPublisher_/g, appPublisher)
                .replace(/_appURL_/g, appURL)
                .replace(/_appId_/g, setupID)

            fs.writeFile(tmpIssPath, iconv.encode(str, 'gbk'), null, function(err) {
                if (err) return reject(err)

                // inno setup start
                innosetupCompiler(
                    tmpIssPath, {
                        gui: false,
                        verbose: verbose
                    },
                    function(err) {
                        fs.unlinkSync(tmpIssPath)
                        if (err) return reject(err)
                        resolve(opt)
                    }
                )
            })
        })
    })
}

async function Init() {
    let result = await prompts([{
            name: 'arch',
            type: 'select',
            message: '请选择运行arch平台',
            choices: [
                { title: 'x64', description: '64位安装包', value: 'x64' },
                { title: 'x86', description: '32位安装包', value: 'ia32' }
            ],
            initial: 0
                //   onState: (state) => state.value.trim() || 'x64'
        },
        {
            name: 'verbose',
            type: 'toggle',
            message: '是否显示进度？',
            initial: false,
            active: 'Yes',
            inactive: 'No'
        }
    ])
    return result
}
Init().then((result) => {
    console.log('您选择的是：' + result.arch)
    console.log('现在为您制作安装包，请稍后...')
    var _options = {
        issPath: resolve('./build/inno_resources/setup.iss'),
        files: result.arch == 'x86' ? [resolve('./dist/win-ia32-unpacked/')] : [resolve('./dist/win-unpacked/')],
        resourcesPath: resolve('./build/inno_resources'),
        iconPath: resolve('./build/icon.ico'),
        appPublisher: '梁乐',
        appURL: 'https://zzdmt.cn',
        setupID: '{{9BF57F04-B512-4C50-A692-025C9CE20A54}}',
        outputPath: resolve('./dist'),
        outputFileName: function() {
            return tmpJson.description + '-' + result.arch + '-Setup_' + tmpJson.version
        }
    }
    buildWinSetup(_options, result.verbose).then(() => {
        console.log('安装包制作完成')
    })
})