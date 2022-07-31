/*
 * @Author: liujun 18316880540@163.com
 * @Date: 2022-07-31 14:47:34
 * @LastEditors: liujun 18316880540@163.com
 * @LastEditTime: 2022-07-31 14:50:01
 * @FilePath: \vue-element-admin\src\filters\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import dayjs from 'dayjs'

/**
 * 使用dayjs format
 * @param {*} value value
 * @param {*} format format
 */
export function dayjsFormat(value, format = 'YYYY.MM.DD HH:mm:ss') {
  if (!value) {
    return ''
  }
  return dayjs(value).format(format)
}
/**
 * 加密手机号码
 */
export function encryptPhone(value) {
  return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
