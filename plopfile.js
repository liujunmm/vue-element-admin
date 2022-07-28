/*
 * @Author: liujun 18316880540@163.com
 * @Date: 2022-07-27 23:31:23
 * @LastEditors: liujun 18316880540@163.com
 * @LastEditTime: 2022-07-27 23:31:31
 * @FilePath: \vue-element-admin\plopfile.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const viewGenerator = require('./plop-templates/view/prompt')
const componentGenerator = require('./plop-templates/component/prompt')
const storeGenerator = require('./plop-templates/store/prompt.js')

module.exports = function(plop) {
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('component', componentGenerator)
  plop.setGenerator('store', storeGenerator)
}
