<template>
	<div>
		<el-breadcrumb
		separator-class="el-icon-arrow-right" 
		class="el-breadcrumb">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>数据统计</el-breadcrumb-item>
		  <el-breadcrumb-item>数据报表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card shadow="never">
			<div id="main" style="height: 500px;"></div>
		</el-card>
	</div>
</template>

<script>
	import * as echarts from 'echarts'
	import _ from 'lodash'
	
	export default{
		data(){
			return{
				options: {
				  title: {
					text: '用户来源'
				  },
				  tooltip: {
					trigger: 'axis',
					axisPointer: {
					  type: 'cross',
					  label: {
						backgroundColor: '#E9EEF3'
					  }
					}
				  },
				  grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				  },
				  xAxis: [
					{
					  boundaryGap: false
					}
				  ],
				  yAxis: [
					{
					  type: 'value'
					}
				  ]
				}
			}
		},
		created() {
			
		},
		methods:{
			
		},
		async mounted() {
			var myChart = echarts.init(document.getElementById('main'));
			const {data:res} = await this.$http.get('reports/type/1')
			if(res.meta.status !== 200){
				return this.$message.error('获取图表数据失败')
			}else{
				const result = _.merge(res.data,this.options)
				myChart.setOption(result);
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
</style>
