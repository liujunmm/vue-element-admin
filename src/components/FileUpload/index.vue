<template>
  <div class="upload-file" :style="{ width: width }">
    <!-- 文件上传 -->
    <el-upload
      ref="upload"
      v-loading="uploading"
      :element-loading-text="
        '文件已上传' + uploadProgress + '%' + (uploadProgress === 100 ? '，上传完成！' : '')
      "
      element-loading-spinner="el-icon-loading"
      element-loading-background="hsla(0,0%,100%,.9)"
      action="#"
      class="upload-file-uploader"
      :list-type="listType"
      :multiple="multiple"
      :before-upload="handleBeforeUpload"
      :http-request="handleUploadFile"
      :file-list="fileList"
      :limit="limit"
      :drag="drag"
      :on-exceed="handleExceed"
      :show-file-list="showFileList"
      :headers="headers"
      :disabled="isDisabled || forbidUpload"
      :class="{
        'hide': fileList.length >= limit,
        'avatar-uploader': uploadType === 1 && !multiple
      }"
    >
      <!-- 自定义图片操作 list-type="picture-card" 生效 -->
      <div slot="file" slot-scope="{ file }" class="pi-w-100P pi-h-100P">
        <div class="el-upload-list__item">
          <img
            class="el-upload-list__item-thumbnail"
            :src="
              getFileType(file.url) === 'image' ? file.url : getFileTypeImg(file.url) | imageResize
            "
            alt=""
          />
        </div>
        <div class="el-upload-list__item-actions">
          <div class="pi-abso pi-w-100P pi-h-100P pi-flex-column-center">
            <div>
              <span class="el-upload-list__item-preview">
                <div v-if="getFileType(file.url) === 'image'" class="pi-rela">
                  <i class="el-icon-zoom-in pi-fz-22 pi-white" style="z-index:1"></i>
                </div>
                <el-link v-else :href="file.url" :underline="false" target="_blank">
                  <i class="el-icon-view pi-fz-22 pi-white"></i>
                </el-link>
              </span>
              <span
                v-if="actionBtn"
                class="el-upload-list__item-remove"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </div>
            <div v-if="actionBtn">
              <span class="el-upload-list__item-back" @click="handleMovelr(file, 'up')">
                <i class="el-icon-back"></i>
              </span>
              <span class="el-upload-list__item-right" @click="handleMovelr(file, 'down')">
                <i class="el-icon-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 拖拽上传 -->
      <template v-if="drag">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </template>
      <!-- 横向多文件 模式 -->
      <template v-else-if="showFileList && multiple">
        <i slot="default" class="el-icon-upload2"></i>
      </template>
      <!-- 横向单文件 -->
      <template v-else-if="!showFileList && uploadType === 1 && !multiple">
        <div v-if="fileList.length > 0">
          <el-image
            ref="avatar"
            class="avatar"
            fit="contain"
            :src="fileList[0].url | imageResize"
            :preview-src-list="[fileList[0].url]"
            @el-image-preview-hide="handlePreviewHide"
          />
          <div class="action pi-abso pi-w-100P pi-h-100P">
            <el-button
              size="mini"
              round
              class="preview-btn"
              type="primary"
              @click.stop="handlePreview"
            >
              预览
            </el-button>
            <el-button v-if="actionBtn" size="mini" round class="restart-btn" type="primary">
              重新上传
            </el-button>
          </div>
        </div>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </template>
      <!-- 纵向单文件 -->
      <el-button
        v-else-if="!showFileList && uploadType === 2 && !multiple"
        size="mini"
        type="primary"
        :disabled="isDisabled"
      >
        选取文件
      </el-button>
      <!-- 纵向多文件 -->
      <el-button v-else size="mini" icon="el-icon-plus" type="primary" :disabled="isDisabled">
        选取文件
      </el-button>

      <!-- 上传提示 -->
      <div v-if="showTip && fileList.length < limit" slot="tip" class="el-upload__tip">
        请上传
        <template v-if="fileSize">
          大小不超过
          <b class="pi-red">{{ fileSize }}MB</b>
        </template>
        <template v-if="fileTypeList">
          格式为
          <b class="pi-red">{{ fileTypeList.join('/') }}</b>
        </template>
        的文件
      </div>
    </el-upload>

    <!-- 已上传的文件列表 -->
    <transition-group
      v-if="!showFileList && uploadType === 2"
      class="upload-file-list el-upload-list el-upload-list--text"
      name="el-fade-in-linear"
      tag="ul"
    >
      <li
        v-for="(file, index) in fileList"
        :key="file.url || file.uid"
        class="el-upload-list__item ele-upload-list__item-content pi-pd-10 pi-flex"
      >
        <div class="pi-align-center pi-flex-sub">
          <template v-if="file.status && file.status === 'uploading'">
            <div class="file-thumbnail">
              <span class="pi-flex pi-w-100P pi-h-100P pi-bg-light"></span>
              <div v-if="file.progress && file.progress > 0" class="progress">
                <el-progress
                  class="pi-flex-row-center"
                  :width="40"
                  :stroke-width="4"
                  type="circle"
                  :percentage="file.progress"
                />
              </div>
            </div>
            <span class="pi-mg-left-10">{{ file.name }}</span>
          </template>
          <!-- 图片展示 -->
          <template v-else-if="getFileType(file.url) === 'image'">
            <div class="file-thumbnail">
              <el-image
                class="pi-w-100P pi-h-100P"
                :src="file.url | imageResize"
                fit="contain"
                :preview-src-list="getPrivewImages(index)"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div v-if="file.progress && file.progress > 0" class="progress">
                <el-progress
                  class="pi-flex-row-center"
                  :width="40"
                  :stroke-width="4"
                  type="circle"
                  :percentage="file.progress"
                />
              </div>
            </div>
            <div v-if="showFileName" class="pi-flex-sub pi-mg-lr-10 pi-text-ellipsis">
              <el-tooltip
                class="item"
                effect="dark"
                :content="file.name || getFileName(file.url)"
                placement="top"
              >
                <span>{{ file.name || getFileName(file.url) }}</span>
              </el-tooltip>
            </div>
          </template>
          <!-- 文档类 支持预览 -->
          <template v-else-if="isExcel(file.url)">
            <div class="file-thumbnail">
              <el-link class="pi-mg-left-10" :href="file.url" :underline="false" target="_blank">
                <el-image class="pi-w-100P pi-h-100P" :src="getFileTypeImg(file.url)" fit="contain">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-link>
              <div v-if="file.progress && file.progress > 0" class="progress">
                <el-progress
                  class="pi-flex-row-center"
                  :width="40"
                  :stroke-width="4"
                  type="circle"
                  :percentage="file.progress"
                />
              </div>
            </div>
            <div v-if="showFileName" class="pi-flex-sub pi-mg-lr-10 pi-text-ellipsis">
              <el-tooltip
                class="item"
                effect="dark"
                :content="file.name || getFileName(file.url)"
                placement="top"
              >
                <el-link class="pi-mg-left-10" :href="file.url" :underline="false" target="_blank">
                  <span>{{ file.name || getFileName(file.url) }}</span>
                </el-link>
              </el-tooltip>
            </div>
          </template>
          <!-- 视频类 支持预览 -->
          <template v-else-if="isVideo(file.url)">
            <div class="file-thumbnail">
              <el-link
                :underline="false"
                class="pi-flex-row-center pi-bg-black pi-white pi-w-100P pi-h-100P"
                @click="
                  dialogVisible = true
                  dialogVideoUrl = file.url
                "
              >
                <i class="el-icon-video-play pi-fz-30"></i>
              </el-link>
              <div v-if="file.progress && file.progress > 0" class="progress">
                <el-progress
                  class="pi-flex-row-center"
                  :width="40"
                  :stroke-width="4"
                  type="circle"
                  :percentage="file.progress"
                />
              </div>
            </div>
            <div v-if="showFileName" class="pi-flex-sub pi-mg-lr-10 pi-text-ellipsis">
              <el-tooltip
                class="item"
                effect="dark"
                :content="file.name || getFileName(file.url)"
                placement="top"
              >
                <span>{{ file.name || getFileName(file.url) }}</span>
              </el-tooltip>
            </div>
          </template>
        </div>
        <!-- 上传后的文件操作 -->
        <div v-if="actionBtn" class="ele-upload-list__item-content-action">
          <el-link
            :underline="false"
            icon="el-icon-top"
            :disabled="index === 0"
            @click="handleMove(index, 'up')"
          >
            上移
          </el-link>
          <el-link
            :underline="false"
            icon="el-icon-bottom"
            :disabled="index === fileList.length - 1"
            @click="handleMove(index, 'down')"
          >
            下移
          </el-link>
          <el-link
            :underline="false"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(index)"
          >
            删除
          </el-link>
        </div>
      </li>
      <!-- 上传列表 -->
    </transition-group>
    <!-- 视频预览 -->
    <el-dialog :visible.sync="dialogVisible" title="预览视频" width="800" append-to-body>
      <video width="100%" :src="dialogVideoUrl" controls="controls">您的浏览器不支持视频播放</video>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog :title="dialogImageTitle" :visible.sync="imgDialogVisible" append-to-body>
      <img class="dialog-img" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<script>
/**
 * @description 文件上传通用组件，支持单图/多图/视频/文件/压缩包/文档等
 * @param {String}  width 上传容器宽度 默认 100%
 * @param {Object|Array|String} value  初始化的值，url字符串，object，数组list
 * @param {Boolean} disabled 是否禁用上传组件 默认 false
 * @param {Number}  limit 数量限制
 * @param {Number}  fileSize 文件大小限制 默认5MB
 * @param {Array}   fileType 上传文件类型限制，例如['png', 'jpg', 'jpeg']
 * @param {Boolean} notLimitFileType 是否限制文件上传类型 true : 不限制文件类型，所有文件都可以上传  false(默认):限制文件上传类型，和fileType配合用
 * @param {Boolean} isShowTip 是否显示提示，如请 上传 大小不超过 50MB 格式为 doc/docx/xls/xlsx/ppt/pptx/xix/txt/pdf/png/jpg/jpeg/mp4 的文件
 * @param {Number}  uploadType 上传类型  1、单图上传 2、不限 (默认)
 * @param {Boolean} showFileList 是否显示已上传文件列表 默认 false
 * @param {Boolean} multiple  是否支持多选文件 默认 true
 * @param {String}  listType 文件列表的类型 text/picture/picture-card
 * @param {Boolean} drag 是否支持拖拽上传 默认 false
 * @param {Boolean} showProgress  是否显示上传进度条 默认 true
 * @param {Boolean} actionBtn  是否显示操作按钮 默认 true
 * @param {Boolean} showFileName 是否显示文件名称（showFileList = false 生效），默认true
 * @param {String}  formatType 结果格式化 string（url逗号隔开） array（url数组） arrayFileInfo（含name,extension,url的数组） default(默认，看notify方法示例)
 * @param {Number}  currentIndex 当前上传组件序号 默认 0
 * @param {String}  resizeSuffix 预览的图片resize，就是在原文件的路径后面拼接一个缩略图标识 见 const/index.js [ALI_THUMBNAIL] 默认 空
 * 举例：
 * 1、纵向多文件，不限制文件类型
 * <file-upload v-model="fileList" list-type="picture" not-limit-file-type />
 *
 * 2、横向多文件，默认限制文件类型 ['png', 'jpg', 'jpeg']
 * <file-upload v-model="fileList" show-file-list list-type="picture-card"  />
 *
 * 3、单图片上传（横向）
 * <file-upload v-model="file.url" :upload-type="1" :multiple="false" />
 *
 * 4、单文件上传（纵向），不限文件类型 :not-limit-file-type="true"，自定义限制文件大小 :file-size="5"
 * <file-upload v-model="file.url" :multiple="false" not-limit-file-type :file-size="5" />
 *
 * 5、单文件上传（纵向），限制文件类型，动态禁用 :disabled="fromType !== 'create'"
 * <file-upload v-model="file.url" :multiple="false" :file-type="['doc','docx','xls','xlsx']" :disabled="fromType !== 'create'" />
 *
 * 6、单文件上传（纵向），隐藏操作按钮 :action-btn="false"
 * <file-upload v-model="file.url" :multiple="false" :file-type="['doc','docx','xls','xlsx']" :action-btn="false" />
 *
 * 7、多文件上传，自定义返回格式 format-type="array"，自定义回调
 * <file-upload v-model="form.files" format-type="array" @change="handleFileUpload" />
 * @return notify()
 */
// 自定义请求头，带 token（备用）
import { getToken } from '@/utils/auth'
// 上传方法封装的包
import { uploader } from '@/utils/upload-oss'
// 自定义文件格式判断js
import { matchFileType, isExcel, isVideo, isRadio } from './matchFileType'

export default {
  name: 'FileUpload',
  model: {
    prop: 'value',
    event: 'changeValue'
  },
  props: {
    // 值
    value: [String, Object, Array],
    // 上传容器宽度
    width: {
      type: String,
      default: '100%'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 数量限制
    limit: {
      type: Number,
      default: 50
    },
    // 大小限制，默认为5 (MB)
    fileSize: {
      type: Number,
      default: 50
    },
    // 文件类型 例如['png', 'jpg', 'jpeg', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'xix', 'txt', 'pdf', 'mp4']
    fileType: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg']
    },
    // 是否限制文件上传类型
    notLimitFileType: {
      type: Boolean,
      default: false
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    // 上传类型
    uploadType: {
      type: Number,
      default: 2
    },
    // 是否显示已上传文件列表(因为使用了自定义的列表显示，所以这里无需使用el-upload 自带的)
    showFileList: {
      type: Boolean,
      default: false
    },
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: true
    },
    // 文件列表的类型 text/picture/picture-card
    listType: {
      type: String,
      default: 'text'
    },
    // 是否支持拖拽上传
    drag: {
      type: Boolean,
      default: false
    },
    // 是否显示上传进度条
    showProgress: {
      type: Boolean,
      default: true
    },
    // 是否显示操作按钮（上移、下移、删除）
    actionBtn: {
      type: Boolean,
      default: true
    },
    // 是否在showFileList = true显示上传的文件名称
    showFileName: {
      type: Boolean,
      default: true
    },
    // 返回结果格式（多文件生效）
    formatType: {
      type: String,
      default: 'default'
    },
    // 当前上传组件序号
    currentIndex: {
      type: Number,
      default: 0
    },
    // resizeSuffix，图片加载优化 详见const/index.js [ALI_THUMBNAIL]
    resizeSuffix: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      number: 0, //  上传的文件数
      uploading: false, // 是否显示容器上传上传中
      uploadProgress: 0,
      fileTypeList: [], // 文件类型列表
      uploadList: [], // 文件选择列表
      fileList: [], // 文件已上传列表
      imgUrl: 'https://m.yichengme.com/static/img/file_', // 文件图标前缀
      // 视频预览弹窗dialog
      dialogVideoUrl: '',
      dialogVisible: false,
      // 图片预览弹窗dialog
      imgDialogVisible: false, // 图片预览弹窗
      dialogImageUrl: '', // 预览图片地址
      dialogImageTitle: '', // 预览图片标题
      // 设置上传的请求头部
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      forbidUpload: false // 阻止上传事件
    }
  },
  computed: {
    // 是否禁用上传组件
    isDisabled() {
      return this.disabled || this.uploading || this.fileList.length >= this.limit
    },
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileTypeList || this.fileSize)
    },
    // 文件图标
    fileImg() {
      return [
        { type: 'pdf', img: 'pdf.png' }, // pdf
        { type: 'word', img: 'word.png' }, // word 文档
        { type: 'excel', img: 'xlx.png' }, // excel 表格
        { type: 'ppt', img: 'ppt.png' }, // ppt
        { type: 'video', img: 'video.png' } // video
      ]
    },
    // 其他（没有图标，暂时用合同的）
    otherImg() {
      return this.imgUrl + 'hetong.png'
    },
    // 是否显示容器上传进度条
    showUploadProgress() {
      return this.showProgress
    },
    // 图片预览数组
    previewSrcList() {
      return this.fileList.map(item => {
        return item.url
      })
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          let temp = 1
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(',')
          // 然后将数组转为对象数组
          this.fileList = list.map(item => {
            // 字符串url
            if (typeof item === 'string') {
              item = {
                name: this.getFileName(item),
                url: item
              }
            }
            item.uid = item.uid || new Date().getTime() + temp++
            return item
          })
          console.log('初始化；', this.fileList)
        } else {
          this.fileList = []
          return []
        }
      },
      // deep: true,
      immediate: true
    }
  },
  created() {
    this.fileTypeList = this.fileType
    // 是否不限制上传类型，如果设置为true，则忽略用户自定义的
    if (this.notLimitFileType) {
      this.fileTypeList = [
        'png',
        'jpg',
        'jpeg',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'xix',
        'txt',
        'pdf',
        'mp4'
      ]
    }
  },
  methods: {
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileTypeList) {
        let fileExtension = this.getFileExtension(file.name)
        const isTypeOk = this.fileTypeList.some(type => {
          if (file.type.indexOf(type) > -1) return true
          if (fileExtension && fileExtension.indexOf(type) > -1) return true
          return false
        })
        if (!isTypeOk) {
          this.$notify.error({
            title: '提示',
            message: `文件格式不正确, 请上传${this.fileTypeList.join('/')}格式文件!`
          })
          return false
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize
        if (!isLt) {
          this.$notify.error({
            title: '提示',
            message: `上传文件大小不能超过 ${this.fileSize} MB!`
          })
          return false
        }
      }

      // 显示容器上传进度条
      if (this.showUploadProgress) {
        this.uploadProgress = 0
        this.uploading = true
      }

      // 文件数累计
      this.number++

      return true
    },
    // 文件个数超出
    handleExceed() {
      this.$notify.error({
        title: '提示',
        message: `上传文件数量不能超过 ${this.limit} 个!`
      })
    },

    /**
     * 通用上传，支持单文件和多文件 返回 {index：上传文件的下标；ret：状态，0-成功，1-失败；url：上传成功的路径 或 上传失败的文件名}
     * @param params 上传对象
     */
    async handleUploadFile(upload) {
      // 上传进度条
      if (this.showUploadProgress) {
        const interval = setInterval(() => {
          if (this.uploadProgress >= 97) {
            clearInterval(interval)
            return
          }
          this.uploadProgress += 1
        }, 20)
      }
      // 执行上传接口
      const [{ index, url, ret }] = await uploader.upload(upload.file)
      if (ret === 1) {
        // 上传失败
        this.$notify.error({
          title: '提示',
          message: `第${index + 1}个文件，上传失败`
        })
        this.uploading = false
      } else {
        // 最新上传的文件
        const newFile = {
          uid: upload.file.uid,
          name: this.getFileName(url), // 上传后的文件名称
          url: url, // 上传后的文件地址
          progress: 0, // 上传后的进度百分比
          clientName: upload.file.name.substring(0, upload.file.name.lastIndexOf('.')), // 上传前的文件名称（无后缀）
          originalName: upload.file.name, // 上传前的文件名称
          extension: this.getFileExtension(upload.file.name) // 文件后缀 / 格式
        }
        // 上传成功，进度条赋值100%
        if (this.showUploadProgress) {
          this.uploadProgress = 100
        }
        this.uploadList.push(newFile)
        // 已经上传完了
        if (this.uploadList.length === this.number) {
          if (!this.multiple) {
            // 单文件上传
            this.fileList = [newFile]
          } else {
            this.fileList = this.fileList.concat(this.uploadList)
          }
          this.uploadList = []
          this.number = 0
          // 关闭上传进度显示
          this.uploading = false
          this.notify()
          console.log('上传完毕！')
        }
      }
    },
    // 删除文件（自定义文件形式的删除）
    handleDelete(findex) {
      this.$confirm('是否要删除该文件吗？', '温馨提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消'
      }).then(async () => {
        this.fileList.splice(findex, 1)
        this.notify()
      })
    },
    // 获取文件类型
    getFileType(filePath) {
      return matchFileType(filePath)
    },
    // 获取文件名称
    getFileName(url) {
      if (url.lastIndexOf('/') > -1) {
        return url.slice(url.lastIndexOf('/') + 1)
      } else {
        return ''
      }
    },
    // 获取文件路径（非缩略图）
    getFilePath(url) {
      if (url.lastIndexOf('?') > -1) {
        return url.slice(0, url.lastIndexOf('?') - url.length)
      } else {
        return url
      }
    },
    // 获取文件后缀
    getFileExtension(flieName) {
      let fileExtension = ''
      if (flieName.lastIndexOf('.') > -1) {
        fileExtension = flieName.slice(flieName.lastIndexOf('.') + 1)
      }
      return fileExtension
    },
    // 是否为文档类
    isExcel(filePath) {
      return isExcel(filePath)
    },
    // 是否为视频类
    isVideo(filePath) {
      return isVideo(filePath)
    },
    // 是否为音频类
    isRadio(filePath) {
      return isRadio(filePath)
    },
    // 文件类型图片
    getFileTypeImg(filePath) {
      const fileType = this.fileImg.find(item => item.type === matchFileType(filePath))
      if (!fileType) return ''
      return this.imgUrl + fileType.img
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = ''
      separator = separator || ','
      for (let i in list) {
        if (list[i].url) {
          strs += list[i].url + separator
        }
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : ''
    },
    // 对象转成指定的数组
    listToArray(list) {
      let arr = []
      for (let i in list) {
        if (list[i].url) {
          arr.push(list[i].url)
        }
      }
      return arr
    },
    // 对象转成带有制定字段的数组
    listToArrayFileInfo(list) {
      let arr = []
      for (let i in list) {
        if (list[i].url) {
          // 只要有url，name/extension都是存在的,clientName在新文件才有，旧文件取name
          arr.push({
            name: list[i].clientName || list[i].name,
            extension: list[i].extension,
            url: list[i].url
          })
        }
      }
      return arr
    },
    // 左右移动
    handleMovelr(file, moveType) {
      const index = this.fileList.findIndex(item => item.uid === file.uid)
      this.handleMove(index, moveType)
    },
    // 上下移动
    handleMove(index, moveType) {
      // 上移
      if (moveType === 'up') {
        if (index === 0) return
        const isUp = this.fileList[index - 1]
        this.fileList.splice(index - 1, 1)
        this.fileList.splice(index, 0, isUp)
      } else {
        // 下移
        if (index === this.fileList.length - 1) return
        const isDown = this.fileList[index + 1]
        this.fileList.splice(index + 1, 1)
        this.fileList.splice(index, 0, isDown)
      }
      this.notify()
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = this.getFilePath(file.url)
      this.dialogImageTitle = file.name || ''
      this.imgDialogVisible = true
    },
    // 预览对应当前图片列表
    getPrivewImages(value) {
      // 找到当前图片的下标
      const index =
        typeof value === 'object' ? this.fileList.findIndex(item => item.uid === value.uid) : value
      let previewSrcList = [...this.previewSrcList] // 所有图片地址
      if (index == 0) return previewSrcList
      // 调整图片顺序，把当前图片放在第一位
      let start = previewSrcList.splice(index)
      let remain = previewSrcList.splice(0, index)
      // 将当前图片调整成点击缩略图的那张图片
      return start.concat(remain)
    },
    // 删除图片
    handleRemove(file) {
      const index = this.fileList.findIndex(item => item.uid === file.uid)
      this.handleDelete(index)
    },
    // 单图预览
    handlePreview() {
      this.forbidUpload = true
      const click = document.createEvent('MouseEvents')
      click.initEvent('click', false, true)
      this.$refs.avatar.$el.getElementsByTagName('img')[0].dispatchEvent(click)
    },
    // 单图预览隐藏
    handlePreviewHide() {
      setTimeout(() => {
        this.forbidUpload = false
      }, 500)
    },
    // 回调父组件
    notify() {
      /** 单文件举例：
      {
        "name": "98afbcb8-6c23-48ae-840a-085635c6079d.jpg",
        "url": "https://file.yichengme.com/app/images/2022-05-05/98afbcb8-6c23-48ae-840a-085635c6079d.jpg",
        "percentage": 0,
        "originalName": "陈奕迅-侧脸.jpg",
        clientName:"陈奕迅-侧脸"
        "extension": "jpg",
        "uid": 1651714904012,
        "status": "success"
      }
      多文件举例，
      formatType = string
      https://file.yichengme.com/app/images/2022-05-05/98afbcb8-6c23-48ae-840a-085635c6079d.jpg,https://file.yichengme.com/app/images/2022-05-05/98afbcb8-6c23-48ae-840a-085635c6079d.jpg,
      ...
      formatType = array
      ['https://file.yichengme.com/app/images/2022-05-05/98afbcb8-6c23-48ae-840a-085635c6079d.jpg','https://file.yichengme.com/app/images/2022-05-05/98afbcb8-6c23-48ae-840a-085635c6079d.jpg']

      formatType = arrayFileInfo
      [
        {
          extension: "jpg"
          name: "陈奕迅-侧脸"
          url: "https://file.yichengme.com/app/images/2022-05-06/82d92d22-fe41-42d2-a8a7-303519ccb8c0.jpg"
        }
        ...
      ]
      formatType = default(默认)
      [
        {
          extension: "jpg"
          name: "82d92d22-fe41-42d2-a8a7-303519ccb8c0.jpg"
          originalName: "陈奕迅-侧脸.jpg"
          clientName:"陈奕迅-侧脸"
          progress: 0
          status: "success"
          uid: 1651800194681
          url: "https://file.yichengme.com/app/images/2022-05-06/82d92d22-fe41-42d2-a8a7-303519ccb8c0.jpg"
        }
        ...
      ]

     */
      let fileList = this.fileList
      // if (!isEmpty(this.resizeSuffix)) {
      //   fileList = this.fileList.map(item => {
      //     // 字符串url
      //     if (typeof item === 'string') {
      //       item = {
      //         name: this.getFileName(item),
      //         url: this.getFilePath(item)
      //       }
      //     } else {
      //       item.url = this.getFilePath(item.url)
      //     }
      //     return item
      //   })
      // }
      // 多文件上传
      switch (this.formatType) {
        case 'string':
          fileList = this.listToString(fileList)
          break
        case 'array':
          fileList = this.listToArray(fileList)
          break
        case 'arrayFileInfo':
          fileList = this.listToArrayFileInfo(fileList)
          break
        default:
          break
      }
      this.$emit('change', fileList, this.currentIndex)
      this.$emit('changeValue', fileList)
    }
  }
}
</script>

<style scoped lang="scss">
.pi-bg-light {
  background: #f5f5f5;
}
.pi-red {
  color: #ff4949;
}

// 上传文件类型样式控制
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
::v-deep {
  .el-upload-list__item-thumbnail {
    object-fit: contain;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 104px;
    height: 104px;
  }
  // 右上角关闭背景颜色，改为主题色
  .el-upload-list--picture-card .el-upload-list__item-status-label {
    background: #009dff;
  }

  // .el-upload--picture-card 控制加号部分
  &.hide .el-upload--picture-card {
    display: none;
  }
  // 去掉动画效果
  .el-list-enter-active,
  .el-list-leave-active {
    transition: all 0s;
  }
  .el-list-enter,
  .el-list-leave-active {
    opacity: 0;
    transform: translateY(0);
  }
  // 单图模式的样式
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .action {
      opacity: 0;
      top: 0;
      transition: ease-in 0.15s;
      background: rgba($color: #000000, $alpha: 0.5);
      .preview-btn,
      .restart-btn {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .preview-btn {
        top: 30%;
      }
      .restart-btn {
        top: 70%;
        margin-left: 0;
      }
    }
    &:hover .action {
      z-index: 1;
      opacity: 1;
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #009dff;
  }
  .avatar-uploader-icon,
  .el-upload--picture-card {
    font-size: 28px;
    color: #8c939d;
    width: 104px;
    height: 104px;
    line-height: 104px;
    text-align: center;
  }
  .avatar {
    width: 104px;
    height: 104px;
    display: block;
    object-fit: contain;
  }
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 30px;
  }
  .preview-img {
    vertical-align: middle;
  }
}
// 预览弹窗图片样式
.dialog-img {
  display: block;
  max-width: 100%;
  margin: 0 auto;
}
.file-thumbnail {
  position: relative;
  width: 90px;
  height: 90px;
  background: #f2f2f2;
  .el-progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    display: flex !important;
    background-color: hsla(0, 0%, 100%, 0.9);
  }
}
.pi-text-ellipsis {
  width: 0;
}
</style>
