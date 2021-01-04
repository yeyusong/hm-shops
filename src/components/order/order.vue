<template>
	<div>
		<el-breadcrumb
		separator-class="el-icon-arrow-right" 
		class="el-breadcrumb">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
		  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<el-card shadow="never">
			<el-row>
				<el-col :span="8">
					<el-input placeholder="请输入内容">
					    <el-button slot="append" icon="el-icon-search"></el-button>
					  </el-input>
				</el-col>
			</el-row>
			
			<el-table :data="orderlist" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="订单编号" prop="order_number" width="600"></el-table-column>
				<el-table-column label="订单价格" prop="order_price" width="100"></el-table-column>
				<el-table-column label="是否付款" prop="pay_status" width="100">
					<template v-slot="scope">
						<el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
						<el-tag type="danger" v-else>未付款</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="是否发货" prop="is_send" width="100"></el-table-column>
				<el-table-column label="下单时间" prop="create_time">
					<template v-slot="scope">
						{{scope.row.create_time | dateFormat}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template v-slot="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
						<el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
					</template>
				</el-table-column>
			</el-table>
			
			 <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryInfo.pagenum"
			      :page-sizes="[5, 10, 20]"
			      :page-size="queryInfo.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
		</el-card>
		
		<el-dialog
		  title="修改地址"
		  :visible.sync="addressVisible"
		  width="50%"
		  @close="addressDialogClosed">
		  <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef">
		    <el-form-item label="省市区/县" prop="address1">
		      <el-cascader :options="cityData" v-model="addressForm.address1" class="el-cascader"></el-cascader>
		    </el-form-item>
			<el-form-item label="详细地址" prop="address2">
			  <el-input v-model="addressForm.address2"></el-input>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addressVisible = false">取消</el-button>
		    <el-button type="primary" @click="addressVisible = false">确定</el-button>
		  </span>
		</el-dialog>
		
		<el-dialog
		  title="物流进度"
		  :visible.sync="progressVisible"
		  width="50%">
		  <span>这是一段信息</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="progressVisible = false">取消</el-button>
		    <el-button type="primary" @click="progressVisible = false">确定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import cityData from '../../../needs/citydata.js'
	
	export default{
		data(){
			return {
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:10
				},
				total:0,
				orderlist:[],
				addressVisible:false,
				addressForm:{
					address1:[],
					address2:''
				},
				addressFormRules:{
					address1:[{required:true,message:'请选择省市区县',trigger:'blur'}],
					address2:[{required:true,message:'请填写详细地址',trigger:'blur'}]
				},
				cityData:cityData,
				progressVisible:false,
				progressInfo:[]
			}
		},
		created() {
			this.getOrderList()
		},
		methods:{
			async getOrderList(){
				const {data:res} = await this.$http.get('orders',{
					params:this.queryInfo
				})
				if(res.meta.status !== 200){
					return this.$message.error('获取失败')
				}else{
					this.orderlist = res.data.goods
					this.total = res.data.total
				}
			},
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize
				this.getOrderList()
			},
			handleCurrentChange(newPage){
				this.queryInfo.pagenum = newPage
				this.getOrderList()
			},
			showBox(){
				this.addressVisible = true
			},
			addressDialogClosed(){
				this.$refs.addressFormRef.resetFields()
			},
			async showProgressBox(){
				const {data:res} = await this.$http.get('/yuantong/1106975712662')
				if(res.meta.status !== 200){
					return this.$message.error('该接口暂停服务')
				}else{
					this.progressInfo = res.data
					this.progressVisible = true
				}
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.el-cascader{
		width: 100%;
	}
</style>
