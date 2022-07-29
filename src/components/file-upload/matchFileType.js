/*
 * @Author: liujun 18316880540@163.com
 * @Date: 2022-06-22 13:23:19
 * @LastEditors: liujun 18316880540@163.com
 * @LastEditTime: 2022-07-16 15:02:55
 * @FilePath: \fileUpload\src\components\FileUpload\matchFileType.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 根据文件名后缀区分 文件类型
 *
 * @param: fileName - 文件名称
 * @param: 数据返回 1) 无后缀匹配 - false
 * @param: 数据返回 2) 匹配图片 - image
 * @param: 数据返回 3) 匹配 txt - txt
 * @param: 数据返回 4) 匹配 excel - excel
 * @param: 数据返回 5) 匹配 word - word
 * @param: 数据返回 6) 匹配 pdf - pdf
 * @param: 数据返回 7) 匹配 ppt - ppt
 * @param: 数据返回 8) 匹配 视频 - video
 * @param: 数据返回 9) 匹配 音频 - radio
 * @param: 数据返回 10) 其他匹配项 - other
 */
export function matchFileType(fileName) {
  // 后缀获取
  let suffix = ''
  // 获取类型结果
  let result = ''
  if (!fileName) return false
  const computedFileName = fileName.split('?')[0]
  try {
    // 截取文件后缀
    suffix = computedFileName.substr(computedFileName.lastIndexOf('.') + 1, computedFileName.length)
    // 文件后缀转小写，方便匹配
    suffix = suffix.toLowerCase()
  } catch (err) {
    suffix = ''
  }
  // fileName无后缀返回 false
  if (!suffix) {
    result = false
    return result
  }

  const fileTypeList = [
    // 图片类型
    { typeName: 'image', types: ['png', 'jpg', 'jpeg', 'bmp', 'gif'] },
    // 文本类型
    { typeName: 'txt', types: ['txt'] },
    // excel类型
    { typeName: 'excel', types: ['xls', 'xlsx'] },
    { typeName: 'word', types: ['doc', 'docx'] },
    { typeName: 'pdf', types: ['pdf'] },
    { typeName: 'ppt', types: ['ppt', 'pptx'] },
    // 视频类型
    { typeName: 'video', types: ['mp4', 'm2v', 'mkv', 'rmvb'] },
    // 音频
    { typeName: 'radio', types: ['mp3', 'wav', 'wmv'] }
  ]

  for (let i = 0; i < fileTypeList.length; i++) {
    const fileTypeItem = fileTypeList[i]
    const typeName = fileTypeItem.typeName
    const types = fileTypeItem.types
    result = types.some(function(item) {
      return item === suffix
    })
    if (result) {
      return typeName
    }
  }
  return 'other'
}

/**
 * 是否为文档类（excel、word、pdf、ppt）
 */
export function isExcel(filePath) {
  if (!filePath) return false
  const fileType = matchFileType(filePath)
  return ['excel', 'word', 'pdf', 'ppt', 'txt'].indexOf(fileType) > -1
}

/**
 * 是否为视频类（mp4、m2v、mkv、rmvb）
 */
export function isVideo(filePath) {
  if (!filePath) return false
  return matchFileType(filePath) === 'video'
}

/**
 * 是否为音频类（mp3、wav、wmv）
 */
export function isRadio(filePath) {
  if (!filePath) return false
  return matchFileType(filePath) === 'radio'
}
