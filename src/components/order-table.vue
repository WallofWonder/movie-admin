<template>
  <div>
    <el-table
      v-loading="tableLoading"
      :data="orders"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="订单编号">
              <span>{{ scope.row.id }}</span>
            </el-form-item>
            <el-form-item label="下单时间">
              <span>{{ scope.row.createTime | dateformat('YYYY-MM-DD HH:mm:ss') }}</span>
            </el-form-item>
            <el-form-item label="电影">
              <span>{{ scope.row.movieName }}</span>
            </el-form-item>
            <el-form-item label="影院">
              <span>{{ scope.row.cinemaName }}</span>
            </el-form-item>
            <el-form-item label="影厅">
              <span>{{ scope.row.cinemaHallName }}</span>
            </el-form-item>
            <el-form-item label="放映时间">
              <span>{{ scope.row.showDate + ' ' + scope.row.startTime }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <!-- 未支付 -->
              <span v-if="scope.row.dbStats === 0" style="color: #e6a23c">
                <!-- 未结束 -->
                <span v-if="!isEnded(scope.row.showDate, scope.row.startTime, scope.row.endTime)">
                  未支付
                  <el-button size="small" round type="plain" @click="toOrderDetail(scope.row.id)">去支付</el-button>
                </span>
                <!-- 已结束 -->
                <span v-else style="color: #999999">已超时</span>
              </span>
              <!-- 已支付 -->
              <span v-if="scope.row.dbStats === 1" style="color: #42b983">
                {{ isEnded(scope.row.showDate, scope.row.startTime, scope.row.endTime) ? '已完成' : '已支付' }}
              </span>
              <!-- 已取消 -->
              <span v-if="scope.row.dbStats === 2" style="color: #f56c6c">已取消</span>
            </el-form-item>
            <el-form-item label=" ">
              <!-- 未开始 -->
              <span v-if="!isStarted(scope.row.showDate, scope.row.startTime)">
                <!-- 未支付 -->
                <el-button
                  v-if="scope.row.dbStats === 0"
                  type="text"
                  @click="handleCancel(scope.row.id)"
                >取消订单
                </el-button>
                <!-- 已支付 -->
                <el-button
                  v-if="scope.row.dbStats === 1"
                  type="text"
                  @click="handleRefund(scope.row.id, scope.row.newMoney)"
                >退款
                </el-button>
              </span>
              <!-- （订单超时 || 已完成） || 已取消 -->
              <span
                v-if="isEnded(scope.row.showDate, scope.row.startTime, scope.row.endTime) || scope.row.dbStats === 2"
              >
                <el-button
                  type="text"
                  class="el-icon-delete"
                  style="color: #f56c6c"
                  @click="handleDelete(scope.row.id)"
                >删除订单记录
                </el-button>
              </span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卖家" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName +'（' + scope.row.email + '）' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="movieName" align="center" label="电影" />
      <el-table-column prop="cinemaName" align="center" label="影院" />
      <el-table-column prop="cinemaHallName" align="center" label="影厅" />
      <el-table-column align="center" label="放映时间">
        <template slot-scope="scope">
          <span>{{ scope.row.showDate + ' ' + scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.newMoney.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <!-- 未支付 -->
          <span v-if="scope.row.dbStats === 0">
            <!-- 已结束 -->
            <strong v-if="isEnded(scope.row.showDate, scope.row.startTime, scope.row.endTime)" style="color: #999999">已超时</strong>
            <!-- 未结束 -->
            <strong v-else style="color: #e6a23c">未支付</strong>
          </span>
          <!-- 已支付 -->
          <strong v-if="scope.row.dbStats === 1" style="color: #42b983">
            {{ isEnded(scope.row.showDate, scope.row.startTime, scope.row.endTime) ? '已完成' : '已支付' }}
          </strong>
          <!-- 已取消 -->
          <strong v-if="scope.row.dbStats === 2" style="color: #f56c6c">已取消</strong>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { cancel, deleteOrder, list, refund } from '@/api/order'
import Pagination from '@/components/Pagination'
import moment from 'moment'

export default {
  name: 'OrderTable',
  components: { Pagination },
  props: [
    'accountId'
  ],
  data() {
    return {
      orders: null,
      tableLoading: false,
      orderChanged: false,
      total: 0,
      // 分页参数
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        orderBy: 'id ASC',
        accountId: this.accountId
      }
    }
  },
  watch: {
    orderChanged(ov, nv) {
      if (nv === true) {
        this.fetchData()
      }
      this.orderChanged = false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.tableLoading = true
      this.listQuery.accountId = (this.accountId === undefined || this.accountId === null) ? -1 : this.accountId
      list(this.listQuery).then(response => {
        this.orders = response.data.list
        this.total = response.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    handleCancel(orderId) {
      this.$confirm('确定取消订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '放弃',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        cancel(orderId).then(res => {
          this.$message.success(res.data)
          this.orderChanged = true
        })
        this.tableLoading = false
      })
    },
    handleRefund(orderId, money) {
      this.$confirm('确定退款？', '提示', {
        confirmButtonText: '退款',
        cancelButtonText: '放弃',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        refund({
          orderId: orderId,
          money: money
        }).then(res => {
          this.$message.success(res.data)
          this.orderChanged = true
          this.tableLoading = false
        }).catch(err => {
          this.$message.error(err.response)
          this.tableLoading = false
        })
      })
    },
    handleDelete(orderId) {
      this.$confirm('确定删除此订单记录？', '提示', {
        confirmButtonText: '删除订单',
        cancelButtonText: '放弃',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        deleteOrder(orderId).then(res => {
          this.$message.success(res.data)
          this.orderChanged = true
          this.tableLoading = false
        }).catch(err => {
          this.$message.error(err)
          this.tableLoading = false
        })
      })
    },
    isStarted(showDate, startTime) {
      const startStr = showDate + startTime
      const startNums = startStr.match(/(\d{1,3})+(?:\.\d+)?/g)
      let startDT = moment().month(startNums[0] - 1).date(startNums[1]).hour(startNums[2]).minute(startNums[3])
      startDT = startDT.subtract(15, 'minutes')
      const nowDT = moment()
      return startDT < nowDT
    },
    isEnded(showDate, startTime, endTime) {
      const startHM = startTime.split(':')
      const startT = moment().hour(startHM[0]).minute(startHM[1])
      const endHM = endTime.split(':')
      const endT = moment().hour(endHM[0]).minute(endHM[1])

      const endStr = showDate + endTime
      const endNums = endStr.match(/(\d{1,3})+(?:\.\d+)?/g)
      let endDT = moment().month(endNums[0] - 1).date(endNums[1]).hour(endNums[2]).minute(endNums[3])
      const nowDT = moment()

      if (endT < startT) {
        // 跨夜场次
        endDT = endDT.add(1, 'days')
      }
      return endDT < nowDT
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
