<template>
  <div class="app-container">
    <h1 class="el-icon-video-camera"> 排片场次 - {{ cinemaName }}</h1>
    <div class="session-filter">
      放映电影：
      <el-select v-model="sessionQuery.movieid" @change="loadSessions">
        <el-option v-for="item in movies" :key="item.id" :label="item.dbName" :value="item.id" />
      </el-select>
      排片日期：
      <el-select v-model="sessionQuery.showdate" @change="loadSessions">
        <el-option
          v-for="(date, index) in dates"
          :key="index"
          :label="date"
          :value="date"
        />
      </el-select>
      <el-button type="plain" class="el-icon-delete" @click="resetSelects"> 清空选择</el-button>
    </div>
    <session-table :session-halls="sessions" :table-loading="sessionLoading" />
    <pagination
      v-if="total > 0"
      :total="total"
      :page.sync="page.pageNum"
      :limit.sync="page.pageSize"
      @pagination="loadSessions"
    />
  </div>
</template>

<script>
import SessionTable from '@/components/session-table'
import { getSessions, getShowDatesAdmin } from '@/api/cinemaHallSession'
import Pagination from '@/components/Pagination'
import { listByCinema } from '@/api/movie'
import { getCinema } from '@/api/cinema'

export default {
  components: { Pagination, SessionTable },
  props: [
    'cinemaId'
  ],
  data() {
    return {
      cinemaName: null,
      movies: [],
      dates: ['11'],
      sessionQuery: {
        cinemaid: this.cinemaId,
        movieid: null,
        hallid: null,
        showdate: null
      },
      total: null,
      hasNextPage: false,
      page: {
        pageNum: 1,
        pageSize: 10,
        orderBy: 'startTime ASC'
      },
      sessions: [],
      sessionLoading: false
    }
  },
  created() {
    this.loadCinemaName()
    this.loadSessions()
    this.loadMovies()
    this.loadShowDates()
  },
  methods: {
    loadCinemaName() {
      getCinema(this.sessionQuery.cinemaid).then(res => {
        this.cinemaName = res.data.dbName
      })
    },
    loadMovies() {
      listByCinema(this.sessionQuery.cinemaid).then(res => {
        this.movies = res.data
      }).catch(err => {
        this.$message.error(err || '加载电影信息失败')
      })
    },
    loadShowDates() {
      getShowDatesAdmin(this.sessionQuery.cinemaid).then(res => {
        this.dates = res.data
      }).catch(err => {
        this.$message.error(err || '加载日期失败')
      })
    },
    loadSessions() {
      this.sessionLoading = true
      getSessions(this.sessionQuery, this.page).then(res => {
        this.sessions = res.data.list
        this.total = res.data.total
        this.sessionLoading = false
      }).catch(err => {
        this.$message.error(err || '加载失败')
        this.sessionLoading = false
      })
    },
    resetSelects() {
      this.sessionQuery = {
        cinemaid: this.cinemaId,
        movieid: null,
        hallid: null,
        showdate: null
      }
      this.loadSessions()
    }
  }
}
</script>

<style lang="scss" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
