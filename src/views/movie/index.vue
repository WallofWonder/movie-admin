<template>
  <div class="app-container">
    <h1 class="el-icon-film"> 影片管理</h1>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      stripe
      highlight-current-row
    >
      <el-table-column prop="id" align="center" label="编号" width="95">
        <template slot-scope="{row}">
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="海报" width="150">
        <template slot-scope="{row}">
          <el-image style="width: 100px; height: 140px" :src="row.picture" fit="contain" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.dbName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="导演" width="150px">
        <template slot-scope="{row}">
          {{ row.directedBy }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主演">
        <template slot-scope="{row}">
          {{ row.actor }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100px">
        <template slot-scope="{row}">
          <el-tag :type="row.isShow | statusFilter">
            {{ row.isShow === true ? '在映中' : '未在映' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="修改时间" width="200">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.updateTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.isShow === false" size="mini" type="success" @click="handleStatus(row)">
            上映
          </el-button>
          <el-button v-else size="mini" type="danger" @click="handleStatus(row)">
            下架
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" @current-change="pageChanged" />

  </div>
</template>

<script>
import { getMovies } from '@/api/movie'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(isShow) {
      if (isShow === true) return 'success'
      return 'danger'
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
      getMovies(this.listQuery).then(response => {
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
    handleStatus(row) {
    },
    handleUpdate(row) {
      // todo 弹出框显示电影信息
      console.log(row)
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
