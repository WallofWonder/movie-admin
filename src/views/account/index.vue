<template>
  <div class="app-container">
    <h1 class=" el-icon-user"> 用户管理</h1>
    <p>共 {{ list.length }} 条数据</p>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      stripe
      highlight-current-row
    >
      <el-table-column align="center" label="头像" width="95">
        <template slot-scope="{row}">
          <el-avatar shape="square" size="medium" :src="baseImg + row.headPic" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="200">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="center">
        <template slot-scope="{row}">
          {{ row.sex | sexFilter }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.stats | statusTypeFilter">{{ row.stats | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="200">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.createTime | dateformat }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="更新时间" width="200">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.updateTime | dateformat }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="{row}">
          <el-button v-if="row.stats === 0" type="danger" @click="freezeAccount(row)">冻结</el-button>
          <el-button v-else type="success" @click="unfreezeAccount(row)">解冻</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="fetchData"
    />
    <el-dialog title="编辑用户信息" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="头像">
          <el-image class="avatar" :src="baseImg + form.headPic" />
          <el-button type="primary" size="mini" @click="setDefaultImg">删除头像</el-button>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" prop="nickname">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1"><span class="el-icon-male" />男</el-radio>
            <el-radio :label="0"><span class="el-icon-female" />女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import global from '@/utils/global'
import { listAccount, updateAccount } from '@/api/account'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    sexFilter(sex) {
      const sexMap = [
        '男',
        '女'
      ]
      return sexMap[sex]
    },
    statusTypeFilter(status) {
      const statusMap = [
        'success',
        'danger'
      ]
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = [
        '正常',
        '已冻结'
      ]
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      baseImg: global.BASE_IMG,
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 10,
        orderBy: 'id ASC'
      },
      dialogFormVisible: false,
      form: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      listAccount(this.query).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleUpdate(row) {
      console.log(row)
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    freezeAccount(row) {
      this.$confirm('确认冻结账户' + row.email + '?', '警告', {
        confirmButtonText: '冻结',
        cancelButtonText: '放弃',
        type: 'warning'
      }).then(() => {
        this.form = Object.assign({}, row)
        this.form.stats = 1
        this.updateData()
      })
    },
    unfreezeAccount(row) {
      this.$confirm('确认解冻账户' + row.email + '?', '警告', {
        confirmButtonText: '解冻',
        cancelButtonText: '放弃',
        type: 'warning'
      }).then(() => {
        this.form = Object.assign({}, row)
        this.form.stats = 0
        this.updateData()
      })
    },
    setDefaultImg() {
      this.form.headPic = global.DEFAULT_AVATAR
    },
    updateData() {
      updateAccount(this.form).then(() => {
        this.$message.success('更新成功')
        this.fetchData()
        this.dialogFormVisible = false
      }).catch(() => {
        this.dialogFormVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  border: 1px dashed #d9d9d9;
  width: 75px;
  height: 75px;
}
</style>
