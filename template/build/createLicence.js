const prompts = require('prompts')
const crypto = require('crypto')
const fs = require('fs')
const privateKey = fs.readFileSync('build/private.key').toString()
async function Init() {
  let result = await prompts([
    {
      name: 'hardwaveEnable',
      type: 'toggle',
      message: '是否限制硬件ID？',
      initial: true,
      active: '是',
      inactive: '否'
    },
    {
      name: 'hardwaveID',
      type: (hardwaveEnable) => (hardwaveEnable ? 'text' : null),
      message: '请输入硬件ID',
      validate: (value) =>
        /^[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}$/.test(
          value.toString()
        )
          ? true
          : `硬件ID格式错误`
    },
    {
      name: 'evaluationEnable',
      type: 'toggle',
      message: '是否启用试用时间？',
      initial: true,
      active: '是',
      inactive: '否'
    },
    {
      name: 'evaluationTime',
      type: (evaluationEnable) => (evaluationEnable ? 'number' : null),
      message: '请输入试用时间(天)',
      validate: (value) => (parseInt(value) > 0 ? true : `试用时间应为正数`)
    },
    {
      name: 'expirationEnable',
      type: 'toggle',
      message: '是否启用截至时间？',
      initial: true,
      active: '是',
      inactive: '否'
    },
    {
      name: 'expirationDate',
      type: (expirationEnable) => (expirationEnable ? 'date' : null),
      message: `请输入截止日期`,
      validate: (date) => (date < Date.now() ? `截止日期应大于当时日期` : true)
    }
  ])
  return result
}
Init().then((result) => {
  const license = {}
  if (result.hardwaveEnable) {
    license.hardwave = result.hardwaveID
  }
  if (result.evaluationEnable) {
    license.evaluation = result.evaluationTime
  }
  if (result.expirationEnable) {
    license.expiration = Date.parse(result.expirationDate)
  }
  if (Object.keys(license).length == 0) {
    console.log('\x1B[31m%s\x1B[0m', '请注意，您未设置任何限制，此次操作不会生成授权文件！！！')
  } else {
    license.lastData = Date.parse(new Date())
    const encrypted = crypto.privateEncrypt(privateKey, Buffer.from(JSON.stringify(license)))
    fs.writeFileSync('Data/lic.license', encrypted)
    console.log('已生成授权文件，操作结束。')
  }
})
