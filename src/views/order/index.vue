<template>
  <div class="app-container">
    <h1 class="el-icon-s-order"> 订单管理</h1>
    <order-table
      :id="id"
    />
  </div>
</template>

<script>
import global from '@/utils/global'
import OrderTable from '@/components/order-table'

export default {
  components: { OrderTable },
  props: [
    'id'
  ],
  data() {
    return {
      picURL: global.BASE_IMG,
      list: null,
      listLoading: false,
      total: 0,
      // 分页参数 + 搜索标题
      listQuery: {
        searchByName: null,
        pageSize: 10,
        pageNum: 1,
        orderBy: 'id ASC'
      }
    }
  }
}
</script>

<style scoped>

</style>
