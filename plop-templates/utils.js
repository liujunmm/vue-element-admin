/*
 * @Author: liujun 18316880540@163.com
 * @Date: 2022-07-27 23:36:47
 * @LastEditors: liujun 18316880540@163.com
 * @LastEditTime: 2022-07-27 23:36:50
 * @FilePath: \vue-element-admin\plop-templates\utils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
exports.notEmpty = name => {
  return v => {
    if (!v || v.trim === '') {
      return `${name} is required`
    } else {
      return true
    }
  }
}
