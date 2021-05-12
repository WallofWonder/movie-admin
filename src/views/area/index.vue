<template>
  <div class="app-container">
    <h1 class="el-icon-location"> 地域管理</h1>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      stripe
      highlight-current-row
    >
      <el-table-column align="center" label="编号" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属省份" width="110">
        <template slot-scope="scope">
          {{ scope.row.provinceName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属城市" width="110">
        <template slot-scope="scope">
          {{ scope.row.cityName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="110">
        <template slot-scope="scope">
          {{ scope.row.dbName }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="修改时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updateTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" @current-change="pageChanged" />

  </div>
</template>

<script>
import { fetchList } from '@/api/area'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      provinceSelects: null,
      citySelects: null,
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        orderBy: 'id ASC'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    pageChanged() {
      console.log(this.listQuery.pageNum)
    },
    // 执行过滤，重置为第一页
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 更改排序
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'id ASC'
      } else {
        this.listQuery.sort = 'id DESC'
      }
      this.handleFilter()
    },
    createData() {
    },
    handleUpdate(row) {
    },
    updateData() {
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort // 'id asc'
      return sort === `${key} ASC` ? 'ascending' : 'descending'
    }
  }
}
</script>
