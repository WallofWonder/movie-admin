<template>
  <el-table
    v-loading="tableLoading"
    class="hall-table"
    :data="sessionHalls"
    element-loading-text="加载中..."
    fit
    highlight-current-row
  >
    <el-table-column align="center" label="排片日期">
      <template slot-scope="{row}">
        <em class="bold">{{ row.showDate }}</em>
      </template>
    </el-table-column>
    <el-table-column align="center" label="放映时间">
      <template slot-scope="{row}">
        <em class="bold">{{ row.startTime }}</em>
        预计{{ row.endTime }} 散场
      </template>
    </el-table-column>
    <el-table-column align="center" label="放映电影">
      <template slot-scope="{row}">
        {{ row.movieName }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="语言">
      <template slot-scope="{row}">
        {{ row.lange }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="放映厅">
      <template slot-scope="{row}">
        {{ row.cinemaHallName }}
      </template>
    </el-table-column>
    <el-table-column align="center" label="现价/影院价（元）">
      <template slot-scope="{row}">
        <em class="now">{{ parseFloat(row.newPrice).toFixed(2) }}</em>
        <del class="old">{{ parseFloat(row.oldPrice).toFixed(2) }}</del>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作">
      <template slot-scope="{row}">
        <el-button type="primary" @click="toDetail(row.id)">
          选座情况
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'SessionTable',
  props: [
    'sessionHalls',
    'tableLoading'
  ],
  methods: {
    toDetail(sessionId) {
      this.$router.push({
        name: 'Detail',
        params: {
          sessionId: 1
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hall-table {
  .bold {
    font-style: normal;
    display: inline-block;
    width: 100%;
    font-size: 18px;
    font-weight: 700;
    clear: both;
  }

  .now {
    font-style: normal;
    font-size: 18px;
    font-weight: 700;
  }

  .old {

  }

}
</style>
