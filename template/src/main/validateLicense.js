const fs = require('fs')
const crypto = require('crypto')
const Store = require('electron-store')
import getHardwaveId from './getHardwaveId'
const licensePath = process.cwd().split('\\').join('/') + '/Data/lic.license'
const publicKey = `-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----`
const store = new Store({ encryptionKey: 'aes-256-cbc' })
if (!store.get('installDate')) {
  store.set('installDate', Date.parse(new Date()))
}
if (!store.get('lastDate')) {
  store.set('lastDate', Date.parse(new Date()))
}
function validateLicense() {
  function validateHardwave(hardwave) {
    if (hardwave == getHardwaveId()) {
      return true
    } else {
      return false
    }
  }
  function validateEvaluation(day) {
    const installDate = store.get('installDate')
    const lastDate = store.get('lastDate')
    const now = Date.parse(new Date())
    if ((now - installDate) / 86400000 > parseInt(day)) {
      return false
    } else {
      if (now < lastDate) {
        return false
      } else {
        return true
      }
    }
  }
  function validateExpiration(expiration) {
    const lastDate = store.get('lastDate')
    const now = Date.parse(new Date())
    if (expiration > now) {
      if (now < lastDate) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }
  if (fs.existsSync(licensePath)) {
    try {
      const licenseData = fs.readFileSync(licensePath)
      const decrypted = crypto.publicDecrypt(publicKey, licenseData)
      const license = JSON.parse(decrypted.toString('utf8'))
      if (license.lastDate) {
        if (store.get('lastDate') < license.lastDate) {
          store.set('lastDate', license.lastDate)
        }
      }
      let result = true
      if (license.hardwave) {
        result = result && validateHardwave(license.hardwave)
      }
      if (license.evaluation) {
        result = result && validateEvaluation(license.evaluation)
      }
      if (license.expiration) {
        result = result && validateExpiration(license.expiration)
      }
      store.set('lastDate', Date.parse(new Date()))
      return result
    } catch (ex) {
      return false
    }
  } else {
    return false
  }
}
export default validateLicense
