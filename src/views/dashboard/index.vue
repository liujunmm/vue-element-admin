<!--
 * @Author: liujun 18316880540@163.com
 * @Date: 2022-07-16 18:16:27
 * @LastEditors: liujun 18316880540@163.com
 * @LastEditTime: 2022-07-17 10:54:47
 * @FilePath: \fileUploade:\WWW\vue-admin-template\src\views\dashboard\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
