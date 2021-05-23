<template>
  <div class="app-container">
    <h1 class="el-icon-video-camera"> 选座情况 </h1>
    <el-divider />
    <el-container style="margin: 0 auto">
      <el-aside width="600px">
        <h3>{{ cinemaInfo.dbName }} {{ sessionInfo.cinemaHallName }} </h3>
        <h4>银幕</h4>
        <div class="seats-container">
          <div class="seats">
            <el-row v-for="(seatRow, x) in hallSeats" :key="x" class="seat-row">
              <el-col class="seat-col" :span="1"> {{ x + 1 }}</el-col>
              <el-col v-for="(seat, y) in seatRow" :key="y" class="seat-col" :span="1">
                <el-image class="seat-img" :src="seatImages[seat].url" @click="selectSeat(x, y)" />
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="seat-type-tips">
          <el-row :gutter="20">
            <el-col v-for="(seat, i) in seatImages" :key="i" style="display: flex; align-items: center;" :span="6">
              <el-image class="seat-img-tips" :src="seat.url" />
              {{ seat.name }}
            </el-col>
          </el-row>
        </div>
      </el-aside>

      <el-main>
        <div style="height: 115px">
          <div class="movie-info">
            <el-image class="movie-image" :src="base_img + movieInfo.picture" />
            <ul class="movie-ul">
              <li><strong>{{ movieInfo.dbName }}</strong></li>
              <li>语言：{{ movieInfo.lange }}</li>
              <li>时长：{{ movieInfo.endureTime }}分钟</li>
            </ul>
          </div>
          <div class="session-info">
            <ul class="session-ul">
              <li>
                <label>影院：</label><strong>{{ cinemaInfo.dbName }}</strong>
              </li>
              <li>
                <label>影厅：</label><strong>{{ sessionInfo.cinemaHallName }}</strong>
              </li>
              <li>
                <label>场次：</label><strong>{{ sessionInfo.showDate + ' ' + sessionInfo.startTime }}</strong>
              </li>
            </ul>
          </div>
        </div>
        <el-divider />
        <div style="height: 350px;">
          <h4 style="text-align: left">订单 <el-button :disabled="clearDisabled" size="mini" type="plain" @click="clearSelected">清除选择</el-button></h4>
          <el-table
            v-loading="tableLoading"
            :data="orders"
            :show-header="true"
            fit
            stripe
            highlight-current-row
            @row-click="handleClick"
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
                  <el-form-item label="状态">
                    <!-- 未支付 -->
                    <span v-if="scope.row.dbStats === 0" style="color: #e6a23c">
                      <!-- 未结束 -->
                      <span v-if="!isEnded(scope.row.showDate, scope.row.startTime, scope.row.endTime)">
                        未支付
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
            <el-table-column label="订单编号">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="买家">
              <template slot-scope="scope">
                <span>{{ scope.row.nickName +'（' + scope.row.email + '）' }}</span>
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
            @pagination="loadOrders"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import global from '@/utils/global'
import { getHallSessionAsync } from '@/api/cinemaHallSession'
import { getDetailAsync } from '@/api/movie'
import { getCinemaAsync } from '@/api/cinema'
import { listSeatsAsync, listSeatsByOrder } from '@/api/sessionSeat'
import { cancel, deleteOrder, listOrderBySes, refund } from '@/api/order'
import moment from 'moment'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  props: [
    'sessionId'
  ],
  data() {
    return {
      base_img: global.BASE_IMG,
      active: 1,
      pageLoading: false,

      // 电影场次信息 ------------------------------------
      sessionInfo: {
        id: null,
        createTime: null,
        updateTime: null,
        showDate: null,
        showTime: null,
        cinemaId: null,
        cinemaHallId: null,
        movieId: null,
        cinemaSessionType: null,
        endTime: null,
        newPrice: 0.00,
        oldPrice: 0.00,
        startTime: null,
        cinemaHallName: null,
        lange: null,
        maxX: null,
        maxY: null
      },
      movieInfo: {
        // dbName: '名侦探柯南：绯色的子弹',
        // lange: '日语',
        // endureTime: 110,
      },
      cinemaInfo: {
        dbName: ''
      },

      // 座位信息 ------------------------------------
      seatStatus: {
        selectable: 0,
        unselectable: 1,
        selected: 2
      },
      seatDBLocked: 0,
      hallSeats: [[]],
      selectedSeats: [],
      seatImages: [
        {
          name: '空座位',
          url: require('../../assets/seat_images/seat0.png')
        },
        {
          name: '已选座位',
          url: require('../../assets/seat_images/seat1.png')
        },
        {
          name: '订单座位',
          url: require('../../assets/seat_images/seat2.png')
        }
      ],

      // 订单信息 ------------------------------------
      tableLoading: false,
      clearDisabled: true,
      total: 0,
      orders: [],
      orderChanged: false,
      // 分页参数
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        orderBy: 'id ASC',
        sessionId: this.sessionId
      }
    }
  },
  watch: {
    orderChanged(ov, nv) {
      if (nv === true) {
        console.log('load')
        this.loadOrders()
      }
      this.orderChanged = false
    }
  },
  async created() {
    // 获取场次信息
    this.sessionInfo = await this.getHallSession()
    // 获取电影信息
    this.movieInfo = await this.getMovieInfo()
    // 获取影院信息
    this.cinemaInfo = await this.getCinemaInfo()
    // 初始化座位信息
    this.initHallSeats()
    const seats = await this.getSelectedSeats()
    seats.forEach(seat => {
      this.updateSeat(seat.x, seat.y, this.seatStatus.unselectable)
    })
    // 获取订单信息
    this.loadOrders()
  },
  methods: {
    // 数据初始化 ---------------------------------------
    getHallSession() {
      return getHallSessionAsync(this.sessionId)
    },
    getMovieInfo() {
      return getDetailAsync(this.sessionInfo.movieId)
    },
    getCinemaInfo() {
      return getCinemaAsync(this.sessionInfo.cinemaId)
    },
    initHallSeats() {
      this.hallSeats = new Array(this.sessionInfo.maxX)
      for (let i = 0; i < this.hallSeats.length; i++) {
        this.hallSeats[i] = new Array(this.sessionInfo.maxY)
        for (let j = 0; j < this.hallSeats[i].length; j++) {
          this.hallSeats[i][j] = this.seatStatus.selectable
        }
      }
    },
    getSelectedSeats() {
      return listSeatsAsync(this.sessionId)
    },
    loadOrders() {
      this.tableLoading = true
      listOrderBySes(this.listQuery).then(res => {
        this.orders = res.data.list
        this.total = res.data.total
        this.tableLoading = false
      }).catch(() => {
        this.$message.error('加载订单信息失败！')
        this.tableLoading = false
      })
    },

    // 对座位的操作  0-可选 1-不可选 2-已选择 --------------
    updateSeat(i, j, val) {
      const newSeat = JSON.parse(JSON.stringify(this.hallSeats))
      newSeat[i][j] = val
      this.hallSeats = newSeat
    },
    addSelected(x, y) {
      this.selectedSeats.push({ x: x, y: y })
    },
    clearSelected() {
      this.selectedSeats.forEach(seat => {
        const { x, y } = seat
        this.updateSeat(x, y, this.seatStatus.unselectable)
      })
      this.selectedSeats = []
      this.clearDisabled = true
    },

    // 用户表格的操作 ----------------------------------
    handleCancel(orderId) {
      this.$confirm('确定取消订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '放弃',
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        cancel(orderId).then(res => {
          this.$message.success(res.data)
          this.tableLoading = false
          this.orderChanged = true
          this.refreshSeats()
        })
      }).catch(err => {
        this.$message(err.response || '未知错误！')
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
          this.tableLoading = false
          this.orderChanged = true
          this.refreshSeats()
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
          this.tableLoading = false
          this.orderChanged = true
          this.refreshSeats()
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
    },
    handleClick(row) {
      this.clearSelected()
      listSeatsByOrder(row.id).then(res => {
        res.forEach(seat => {
          const { x, y } = seat
          this.updateSeat(x, y, this.seatStatus.selected)
          this.addSelected(x, y)
        })
        this.clearDisabled = false
      }).catch(err => {
        this.$message(err || '未知错误！')
        this.clearDisabled = true
      })
    },
    async refreshSeats() {
      // 初始化座位信息
      this.clearSelected()
      this.initHallSeats()
      const seats = await this.getSelectedSeats()
      seats.forEach(seat => {
        this.updateSeat(seat.x, seat.y, this.seatStatus.unselectable)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-aside {
  //background-color: #D3DCE6;
  color: #333;
  text-align: center;
  //line-height: 200px;
  width: 680px;

  .seats-container {

    .seats {
      display: inline-block;
      //background-color: #e5e9f2;
      margin: 20px;

      .seat-row {
        .seat-col {
          margin-top: 10px;
          margin-bottom: 10px;
          height: 25px;
          width: 25px;
          margin-right: 10px;

          .seat-img {
            width: inherit;
            height: inherit;
          }
        }
      }
    }
  }

  .seat-type-tips {
    margin: 0 10px 0 100px;
    height: 58px;

    .seat-img-tips {
      height: 25px;
      width: 25px;
    }
  }
}

.el-main {
  //background-color: #E9EEF3;
  color: #333;
  text-align: center;

  .movie-info {
    float: left;
    height: 115px;
    margin-bottom: 20px;

    .movie-image {
      float: left;
      width: 80px;
      height: inherit;
    }

    .movie-ul {
      list-style: none;
      text-align: left;
      padding-left: 100px;

      li {
        padding-bottom: 10px;
      }
    }
  }
}

.session-info {
  float: left;
  margin-left: 50px;
  .session-ul {
    list-style: none;
    text-align: left;

    li {
      height: 35px;

      label {
        margin-left: -40px;
      }

      .selected-seats {
        display: inline-block;

        .selected-seat {
          margin-left: 10px;
        }
      }
    }
  }
}

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
