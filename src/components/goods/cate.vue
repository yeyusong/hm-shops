<template>
	<div>
		<el-breadcrumb
		separator-class="el-icon-arrow-right" 
		class="el-breadcrumb">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		
		<el-card shadow="never">
			<el-row>
				<el-col>
					<el-button type="primary" @click="showAddcateDialog">添加分类</el-button>
				</el-col>
			</el-row>
			
			<tree-table 
			class="tree-table"
			:data="catelist" 
			:columns="columns" 
			:selection-type="false"
			:expand-type="false"
			show-index
			index-text="#"
			border
			:show-row-hover="false">
				<template v-slot:isok="scope">
					<i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
					<i class="el-icon-error" v-else style="color: red;"></i>
				</template>
				<template v-slot:order="scope">
					<el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
					<el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
					<el-tag type="warning" size="mini" v-else>三级</el-tag>
				</template>
				<template v-slot:option="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="delCate">删除</el-button>
				</template>
			</tree-table>
			
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryinfo.pagenum"
			      :page-sizes="[3, 5, 10, 20]"
			      :page-size="queryinfo.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
		</el-card>
		
		<el-dialog
		  title="添加分类"
		  :visible.sync="addcateDialogVisible"
		  width="50%"
		  :close-on-click-modal="false"
		  @close="addCartDialogClosed">
		  <el-form :model="addCartForm" :rules="addCartFormRules" ref="addCartFormRef" label-width="100px">
		    <el-form-item label="分类名称:" prop="cat_name">
		      <el-input v-model="addCartForm.cat_name"></el-input>
		    </el-form-item>
			<el-form-item label="父级分类:">
				<el-cascader
				    class="el-cascader"
				    v-model="selectedKeys"
				    :options="parentCateList"
					:props="cascaderProps"
				    @change="parentCateChange"
					:clearable="true"
					change-on-select></el-cascader>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addcateDialogVisible = false">取消</el-button>
		    <el-button type="primary" @click="addcate">确定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				catelist:[],
				queryinfo:{
					type:3,
					pagenum:1,
					pagesize:5
				},
				total:0,
				columns:[{
					label:'分类名称',
					prop:'cat_name'
				},{
					label:'是否有效',
					type:'template',
					template:'isok'
				},{
					label:'排序',
					type:'template',
					template:'order'
				},{
					label:'操作',
					type:'template',
					template:'option'
				}],
				addcateDialogVisible:false,
				addCartForm:{
					cat_name:'',
					cat_pid:0,
					cat_level:0
				},
				addCartFormRules:{
					cat_name:[{
						required:true,message:'请输入分类名称',trigger:'blur'
					}]
				},
				parentCateList:[],
				selectedKeys:[],
				cascaderProps:{
					expandTrigger: 'hover',
					value:'cat_id',
					label:'cat_name',
					children:'children'
				}
			}
		},
		methods:{
			async getcatelist(){
				const {data:res} = await this.$http.get('categories',{params:this.queryinfo})
				if(res.meta.status !== 200){
					return this.$message.error('获取商品分类失败')
				}else{
					this.catelist = res.data.result
					this.total = res.data.total
				}
			},
			handleSizeChange(newSize){
				this.queryinfo.pagesize = newSize
				this.getcatelist()
			},
			handleCurrentChange(newPage){
				this.queryinfo.pagenum = newPage
				this.getcatelist()
			},
			showAddcateDialog(){
				this.getParentCateList()
				this.addcateDialogVisible = true
			},
			async getParentCateList(){
				const {data:res} = await this.$http.get('categories',{params:{
					type:2
				}})
				if(res.meta.status !== 200){
					return this.$message.error('获取分类数据失败')
				}else{
					this.parentCateList = res.data
				}
			},
			parentCateChange(){
				if(this.selectedKeys.length > 0){
					this.addCartForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
					this.addCartForm.cat_level = this.selectedKeys.length
				}else{
					this.addCartForm.cat_pid = 0
					this.addCartForm.cat_level = 0
				}
			},
			addcate(){
				this.$refs.addCartFormRef.validate(async valid=>{
					if(!valid) return
					const {data:res} = await this.$http.post('categories',this.addCartForm)
					if(res.meta.status !== 201){
						this.$message.error('添加分类失败')
					}else{
						this.$message.success('添加分类成功')
						this.getcatelist()
						this.addcateDialogVisible = false
					}
				})
			},
			addCartDialogClosed(){
				this.$refs.addCartFormRef.resetFields()
				this.selectedKeys = []
				this.addCartForm.cat_level = 0
				this.addCartForm.cat_pid = 0
			},
			editCate(){
				this.$message.info('这个功能做过了，我懒就不做了')
			},
			delCate(){
				this.$message.info('这个功能做过了，我懒就不做了')
			}
		},
		created() {
			this.getcatelist()
		}
	}
</script>

<style lang="less" scoped="scoped">
	.tree-table{
		margin-top: 20px;
	}
	.el-cascader{
		width: 100%;
	}
</style>
