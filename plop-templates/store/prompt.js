/*
 * @Author: liujun 18316880540@163.com
 * @Date: 2022-07-27 23:35:16
 * @LastEditors: liujun 18316880540@163.com
 * @LastEditTime: 2022-07-27 23:35:45
 * @FilePath: \vue-element-admin\plop-templates\store\prompt.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate store',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'store name please',
    validate: notEmpty('name')
  },
  {
    type: 'checkbox',
    name: 'blocks',
    message: 'Blocks:',
    choices: [{
      name: 'state',
      value: 'state',
      checked: true
    },
    {
      name: 'mutations',
      value: 'mutations',
      checked: true
    },
    {
      name: 'actions',
      value: 'actions',
      checked: true
    }
    ],
    validate(value) {
      if (!value.includes('state') || !value.includes('mutations')) {
        return 'store require at least state and mutations'
      }
      return true
    }
  }
  ],
  actions(data) {
    const name = '{{name}}'
    const { blocks } = data
    const options = ['state', 'mutations']
    const joinFlag = `,
  `
    if (blocks.length === 3) {
      options.push('actions')
    }

    const actions = [{
      type: 'add',
      path: `src/store/modules/${name}.js`,
      templateFile: 'plop-templates/store/index.hbs',
      data: {
        options: options.join(joinFlag),
        state: blocks.includes('state'),
        mutations: blocks.includes('mutations'),
        actions: blocks.includes('actions')
      }
    }]
    return actions
  }
}
