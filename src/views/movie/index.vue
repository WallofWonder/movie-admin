<template>
  <div class="app-container">
    <h1 class="el-icon-film"> 影片管理</h1>
    <div class="filter-container">
      <el-input
        v-model="listQuery.searchByName"
        class="filter-item"
        placeholder="输入影片名称进行搜索"
        prefix-icon="el-icon-search"
        style="width: 200px;"
      />
      <el-button class="filter-item" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
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
          <el-image style="width: 100px; height: 140px" :src="picURL + row.picture" fit="contain" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="200px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.dbName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="导演" width="150px">
        <template slot-scope="{row}">
          {{ row.directedBy }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主演" width="500px">
        <template slot-scope="{row}">
          {{ row.actor }}
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="状态" width="100px">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <el-tag :type="row.isShow | statusFilter">-->
      <!--            {{ row.isShow === true ? '在映中' : '未在映' }}-->
      <!--          </el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="评分" width="100">
        <template slot-scope="scope">
          <em v-if="scope.row.rate !== null" style="color: #ff9900;font-size: 20px">
            {{ scope.row.rate.toFixed(1) }}
          </em>
          <em v-else style="color: #ff9900;">
            暂无评分
          </em>
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
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
      @current-change="pageChanged"
    />

    <el-dialog title="编辑电影信息" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules">
        <el-form-item label="片名" prop="dbname">
          <el-input v-model="form.dbName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="导演" prop="director">
          <el-input v-model="form.directedBy" autocomplete="off" />
        </el-form-item>
        <el-form-item label="主演" prop="actor">
          <el-input v-model="form.actor" autocomplete="off" />
        </el-form-item>
        <!--        <el-form-item label="是否上映" prop="isShow">-->
        <!--          <el-switch v-model="form.isShow" />-->
        <!--        </el-form-item>-->
        <el-form-item label="评分" prop="rate">
          <el-input-number v-model="form.rate" :precision="1" :step="0.1" :max="10" />
        </el-form-item>
        <el-form-item label="简介" prop="info">
          <el-input
            v-model="form.info"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            maxlength="230"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMovies, updateMovie } from '@/api/movie'
import { Message } from 'element-ui'
import moment from 'moment'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import global from '@/utils/global'

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
      picURL: global.BASE_IMG,
      list: null,
      listLoading: true,
      total: 0,
      provinceSelects: null,
      citySelects: null,
      // 对话框表单
      dialogFormVisible: false,
      form: {
        id: '',
        createTime: '',
        updateTime: '',
        actor: '',
        area: false,
        directedBy: '',
        info: '',
        language: '',
        dbName: '',
        picture: '',
        rate: '',
        type: '',
        isShow: true
      },
      rules: {
        dbname: [
          { required: true, message: '请输入片名', trigger: 'blur' },
          { min: 1, message: '长度至少为1个字符', trigger: 'blur' }
        ]
      },
      // 分页参数 + 搜索标题
      listQuery: {
        searchByName: null,
        pageSize: 10,
        pageNum: 1,
        orderBy: 'id ASC'
      }
    }
  },
  created() {
    this.getList()
  },
  activated() {
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
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    updateData(form) {
      form.updateTime = moment().format('YYYY-MM-DD HH:mm:ss')
      updateMovie(form).then(() => {
        Message({
          message: '更新成功!',
          type: 'success',
          duration: 3 * 1000
        })
        this.getList()
      })
      this.dialogFormVisible = false
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort // 'id asc'
      return sort === `${key} ASC` ? 'ascending' : 'descending'
    }
  }
}
</script>
