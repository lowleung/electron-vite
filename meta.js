'use strict'

const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const { get } = require('https')

function getCurrentSHA (author) {
  return new Promise((resolve, reject) => {
    let isBranch = process.argv[2].indexOf('#') > -1

    get({
      host: 'api.github.com',
      path: `/repos/simulatedgreg/electron-vue/commits${isBranch ? '?sha=' + process.argv[2].split('#')[1] : ''}`,
      headers: {
        'User-Agent': author
      }
    }, res => {
      res.setEncoding('utf8')
      let rawData = ''

      res.on('data', chunk => {
        rawData += chunk
      })
      res.on('end', () => {
        try {
          let parsed = JSON.parse(rawData)
          resolve(parsed[0].sha)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', e => {
      reject(e)
    })
  })
}

function appendSHALink (sha, destDirName) {
  let readmePath = join(destDirName, '/README.md')
  let md = readFileSync(readmePath, 'utf8')
  md = md.replace(
    ' using',
    `@[${sha.substring(0, 7)}](https://github.com/SimulatedGREG/electron-vue/tree/${sha}) using`
  )
  writeFileSync(readmePath, md, 'utf8')
}

module.exports = {
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Application Name',
      default: 'your-app'
    },
    appid: {
        type: 'string',
        required: true,
        message: 'Application Id',
        default: 'cn.zzdmt.'+name
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
      default: ''
    }
  }
}
