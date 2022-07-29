/*
 * @Author: liujun 18316880540@163.com
 * @Date: 2022-07-27 23:37:39
 * @LastEditors: liujun 18316880540@163.com
 * @LastEditTime: 2022-07-29 20:19:51
 * @FilePath: \vue-element-admin\src\consts\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  TOKEN_KEY: 'jwttoken',
  TOKEN_EXPIRED: 2,
  TOKEN_UNDEFINED: 3,
  INT_MAX_VALUE: 2147483647, // pageSize的最大默认值

  // 登录相关
  API_LOGIN: '',

  // 代理配置 禁止代理 只需将PROXY_PREFIX  置为空字符串即可
  PROXY_PREFIX: '',
  PROXY_HOST: 'http://www.jskqsh.com',
  PROXY_EXCLUDE: ['transaction/list'], // string or array or regexp; 如果array的话 元素类型可以为string/regexp
  RET_CODE: { SUCCESS: 0, FAIL: 1, TOKEN_UNDEFINED: 19, TOKEN_EXPIRED: 2 }, // 返回RET状态码解析,
  DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DATE_TIME_SHORT_FORMAT: 'YY-MM-DD HH:mm',
  DATE_FORMAT: 'YYYY-MM-DD'
}
