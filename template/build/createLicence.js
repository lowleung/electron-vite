const arg = require('arg')
const crypto = require('crypto')
const fs = require('fs')
Date.prototype.format = function (format) {
  var o = {
    'M+': this.getMonth() + 1, //month
    'd+': this.getDate(), //day
    'h+': this.getHours(), //hour
    'm+': this.getMinutes(), //minute
    's+': this.getSeconds(), //second
    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp('(' + k + ')').test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return format
}
const privateKey = fs.readFileSync('private.key').toString()
const args = arg(
  {
    '--permanent': Boolean,
    '-p': '--permanent',
    '--expireDate': String,
    '-e': '--expireDate'
  },
  {
    permissive: false,
    argv: process.argv.slice(2),
    stopAtPositional: false
  }
)
let license = {
  permanent: args['--permanent'] || false,
  expireDate: args['--expireDate'] || '1970-01-01',
  lastDate: new Date().format('yyyy-MM-dd')
}
const encrypted = crypto.privateEncrypt(privateKey, Buffer.from(JSON.stringify(license)))
fs.writeFileSync('Data/license.data', encrypted)
