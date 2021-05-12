<template>
  <div class="app-container">
    <h1 class="el-icon-film"> 影院管理</h1>
    <div class="filter-container">
      选择区域：
      <el-select v-model="query.areaId" class="filter-item" @change="reload">
        <el-option
          v-for="area in areas"
          :key="area.id"
          :label="area.dbName"
          :value="area.id"
        />
      </el-select>
      <el-input v-model="query.dbName" class="name-selector" style="width: 250px" placeholder="请输入影院名" @change="reload">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="reload">搜索</el-button>
      </el-input>
    </div>
    <el-table
      v-loading="listLoading"
      :data="cinemaList"
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
      <el-table-column align="center" label="名称">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.dbName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="地址">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="服务">
        <template slot-scope="{row}">
          <el-tag
            v-for="tag in row.cinemaService"
            :key="tag"
            class="cinema-service"
            effect="plain"
            size="small"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="{row}">
          <i class="el-icon-time"/>
          <span>{{ row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="修改时间" width="200">
        <template slot-scope="{row}">
          <i class="el-icon-time"/>
          <span>{{ row.updateTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" @current-change="pageChanged"/>

    <el-dialog title="编辑影院信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="名称" prop="dbname">
          <el-input v-model="form.dbName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="地址" prop="dbname">
          <el-input v-model="form.address" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="服务" prop="dbname">
          <el-tag
            v-for="(tag, i) in form.cinemaService"
            :key="i"
            closable
            :disable-transitions="false"
            effect="plain"
            @close="handleClose(form.cinemaService,tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm(form.cinemaService)"
            @blur="handleInputConfirm(form.cinemaService)"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增服务</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData(form)">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import moment from 'moment'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import global from '@/utils/global'
import { list, updateCinema } from '@/api/cinema'
import { getArea } from '@/api/area'

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
      // 过滤器
      areas: [{
        id: 350100,
        dbName: '全部区域'
      }],
      nativeArea: 350100,
      cinemaList: null,
      listLoading: true,
      total: 0,
      provinceSelects: null,
      citySelects: null,
      // 对话框表单
      dialogFormVisible: false,
      form: {},
      rules: {},
      // 分页参数 + 搜索标题
      query: {
        pageSize: 10,
        pageNum: 1,
        orderBy: 'id ASC',
        areaId: 350100,
        dbName: null
      },
      // 服务标签编辑
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.loadAreas()
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.query).then(response => {
        const newList = response.data.list
        newList.forEach(cinema => {
          if (cinema.cinemaService !== null) {
            cinema.cinemaService = cinema.cinemaService.split(' ')
          }
        })
        this.cinemaList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    loadAreas() {
      getArea(this.nativeArea).then(res => {
        this.areas.push(...res.data)
      })
    },
    pageChanged() {
    },
    // 执行过滤，重置为第一页
    handleFilter() {
      this.query.page = 1
      this.getList()
    },
    handleStatus(row) {
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      if (this.form.cinemaService === null) {
        this.form.cinemaService = []
      }
      console.log(row)
      this.dialogFormVisible = true
    },
    updateData(form) {
      if (form.cinemaService.length !== 0) {
        form.cinemaService = form.cinemaService.join(' ')
      }
      updateCinema(form).then(() => {
        Message({
          message: '更新成功!',
          type: 'success',
          duration: 3 * 1000
        })
        this.reload()
      }).catch(() => {
        this.$message.error('更新失败')
      })
      this.dialogFormVisible = false
    },
    reload() {
      this.query.pageNum = 1
      this.query.pageSize = 10
      this.listLoading = true
      list(this.query).then(res => {
        const newList = res.data.list
        newList.forEach(cinema => {
          if (cinema.cinemaService !== null) {
            cinema.cinemaService = cinema.cinemaService.split(' ')
          }
        })
        this.cinemaList = newList
        this.listLoading = false
      })
    },
    getSortClass: function(key) {
      const sort = this.query.sort // 'id asc'
      return sort === `${key} ASC` ? 'ascending' : 'descending'
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(cinemaService) {
      const inputValue = this.inputValue
      if (inputValue) {
        cinemaService.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleClose(cinemaService, tag) {
      cinemaService.splice(cinemaService.indexOf(tag), 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.selector {
  margin-bottom: 20px;
  height: 30px;

  .area-selector {
    float: left;
    margin-right: 20px;
  }
}

.name-selector {
  vertical-align: middle;
  margin-bottom: 10px;
}

.cinema-service {
  margin-right: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
