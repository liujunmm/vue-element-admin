/*
 * @Author: liujun 18316880540@163.com
 * @Date: 2022-07-27 23:28:06
 * @LastEditors: liujun 18316880540@163.com
 * @LastEditTime: 2022-07-27 23:28:16
 * @FilePath: \vue-element-admin\gulpfile.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable */
var gulp = require('gulp')
var sftp = require('gulp-sftp-up4')

gulp.task('upload:dev', function() {
  return gulp.src('dist/**/*').pipe(
    sftp({
      host: '192.168.0.241',
      remotePath: '/home/admin/html',
      user: 'admin',
      pass: 'admin'
    })
  )
})
