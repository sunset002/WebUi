<!-- <template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'area',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: 'Industries' },
              { value: 240, name: 'Technology' },
              { value: 149, name: 'Forex' },
              { value: 100, name: 'Gold' },
              { value: 59, name: 'Forecasts' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script> -->
<template> 
  <div :class="className" :style="{height: height, width: width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // ECharts主题
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',  // 鼠标悬浮时显示提示框
          axisPointer: { type: 'cross' }
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Weekly Write Articles']  // 图例
        },
        xAxis: {
          type: 'category',  // 类目轴，适用于分类数据
          boundaryGap: false,  // 不留空隙
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']  // X轴分类数据
        },
        yAxis: {
          type: 'value',  // 数值轴
        },
        series: [
          {
            name: 'Weekly Write Articles',
            type: 'line',  // 改为线性图
            areaStyle: {},  // 填充区域
            data: [320, 240, 149, 100, 59, 120, 180],  // 数据数组
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
