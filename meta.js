'use strict'
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
