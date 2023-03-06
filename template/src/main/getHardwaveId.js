const exec = require('child_process').execSync
const fs = require('fs')
const os = require('os')
const execOptsWin = {
  windowsHide: true,
  maxBuffer: 1024 * 2000,
  encoding: 'UTF-8'
}

function getHardwaveId() {
  function padding(str, length) {
    if (str.length > length) {
      return padding(str.substring(1), length)
    } else {
      if (str.length < length) {
        return padding('0' + str, length)
      } else {
        return str
      }
    }
  }
  function getWnic() {
    let wmic
    if (fs.existsSync(process.env.WINDIR + '\\system32\\wbem\\wmic.exe')) {
      wmic = process.env.WINDIR + '\\system32\\wbem\\wmic.exe'
    } else {
      wmic = 'wmic'
    }
    return wmic
  }
  switch (os.type()) {
    case 'Windows_NT': {
      let cpu = exec(getWnic() + ' CPU get ProcessorID', execOptsWin)
        .split('\r\n')[1]
        .replace(/\s*/g, '')
      cpu = padding(cpu, 16)
      const hard = []
      for (let i = 0; i < 20; i++) {
        hard.push(i + 1)
      }
      for (let i = 0; i < 16; i++) {
        hard[i] = i % 2 == 0 ? parseInt(cpu[i], 16) + hard[i] : parseInt(cpu[i], 16) * hard[i]
        while (hard[i] >= 16) {
          hard[i] = hard[i] - 16
        }
      }
      for (let i = 0; i < 4; i++) {
        hard[16 + i] = hard[i * 4] + hard[i * 4 + 1] + hard[i * 4 + 2] + hard[i * 4 + 3]
        while (hard[16 + i] >= 16) {
          hard[16 + i] = hard[16 + i] - 16
        }
      }
      let result = ''
      for (let i = 0; i < 20; i++) {
        if (i > 0 && i <= 20 && i % 4 == 0) {
          result = result + '-'
        }
        result = result + hard[i].toString(16).toUpperCase()
      }
      return result
    }
    default:
      return '0000-0000-0000-0000-0000'
  }
}
export default getHardwaveId
