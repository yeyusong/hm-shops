<template>
	<div>
		<el-breadcrumb 
		separator-class="el-icon-arrow-right" 
		class="el-breadcrumb">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
		  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<el-card shadow="never">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
					    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					  </el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>

			<el-table :data="userList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="电话" prop="mobile"></el-table-column>
				<el-table-column label="角色" prop="role_name"></el-table-column>
				<el-table-column label="状态">
					<template v-slot="scope">
						<el-switch
						  v-model="scope.row.mg_state"
						  @change="userStateChanged(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="370px">
					<template v-slot="scope">
						<el-tooltip class="item" effect="dark" content="修改" placement="top" :enterbale="false">
						      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="删除" placement="top" :enterbale="false">
						      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterbale="false">
						      <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryInfo.pagenum"
			      :page-sizes="[1, 2, 5, 10]"
			      :page-size="queryInfo.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
		</el-card>
		
		<!-- 添加用户 -->
		<el-dialog
		  title="添加用户"
		  :visible.sync="addDialogVisible"
		  width="50%"
		  @close="addDialogClosed"
		  :close-on-click-modal="false">
		  <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
		    <el-form-item label="用户名" prop="username">
		      <el-input v-model="addForm.username"></el-input>
		    </el-form-item>
			<el-form-item label="密码" prop="password">
			  <el-input v-model="addForm.password"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
			  <el-input v-model="addForm.email"></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobile">
			  <el-input v-model="addForm.mobile"></el-input>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addDialogVisible = false">取消</el-button>
		    <el-button type="primary" @click="adduser">确定</el-button>
		  </span>
		</el-dialog>
		<!-- 修改用户 -->
		<el-dialog
		  title="修改用户"
		  :visible.sync="editDialogVisible"
		  width="50%"
		  @close="editDialogClosed"
		  :close-on-click-modal="false">
		  <el-form ref="editFormRef" :model="editForm" label-width="70px" :rules="editFormRules">
		    <el-form-item label="用户名">
		      <el-input v-model="editForm.username" disabled></el-input>
		    </el-form-item>
			<el-form-item label="邮箱" prop="email">
			  <el-input v-model="editForm.email"></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobile">
			  <el-input v-model="editForm.mobile"></el-input>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取消</el-button>
		    <el-button type="primary" @click="editUserInfo">确定</el-button>
		  </span>
		</el-dialog>
		<!-- 分配角色 -->
		<el-dialog
		  title="分配角色"
		  :visible.sync="setRoleDialog"
		  width="50%"
		  :close-on-click-modal="false">
		  <div>
			  <p>当前的用户：{{userinfo.username}}</p>
			  <p>当前的角色：{{userinfo.role_name}}</p>
			  <p>分配新角色：
				<el-select v-model="selectedRoleId" placeholder="请选择">
				  <el-option
				    v-for="item in rolesList"
				    :key="item.id"
				    :label="item.roleName"
				    :value="item.id">
				  </el-option>
				</el-select>
			  </p>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setRoleDialog = false">取 消</el-button>
		    <el-button type="primary" @click="setRoleDialog = false">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			// 验证邮箱的规则
			var checkEmail = (rule,value,cb) =>{
				const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
				if(regEmail.test(value)){
					return cb()
				}
				cb(new Error('请输入合法的邮箱'))
			}
			// 验证手机号的规则
			var checkMobile = (rule,value,cb) =>{
				const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
				if(regMobile.test(value)){
					return cb()
				}
				cb(new Error('请输入合法的手机号'))
			}
			return {
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:2
				},
				userList:[],
				total:0,
				addDialogVisible:false,
				addForm:{
					username:'',
					password:'',
					email:'',
					mobile:''
				},
				addFormRules:{
					username:[
						{required:true,message:'请输入用户名',trigger:'blur'},
						{min:3,max:10,message:'用户名长度为3~10个字符',trigger:'blur'}
					],
					password:[
						{required:true,message:'请输入密码',trigger:'blur'},
						{min:6,max:15,message:'密码长度为3~10个字符',trigger:'blur'}
					],
					email:[
						{required:true,message:'请输入邮箱',trigger:'blur'},
						{validator:checkEmail,trigger:'blur'}
					],
					mobile:[
						{required:true,message:'请输入手机号',trigger:'blur'},
						{validator:checkMobile,trigger:'blur'}
					]
				},
				editDialogVisible:false,
				setRoleDialog:false,
				editForm:{},
				editFormRules:{
					email:[
						{required:true,message:'请输入邮箱',trigger:'blur'},
						{validator:checkEmail,trigger:'blur'}
					],
					mobile:[
						{required:true,message:'请输入手机号',trigger:'blur'},
						{validator:checkMobile,trigger:'blur'}
					]
				},
				userinfo:{},
				rolesList:[],
				selectedRoleId:''
			}
		},
		created(){
			this.getUserList()
		},
		methods:{
			async getUserList(){
				const {data:res} = await this.$http.get('users',{params:this.queryInfo})
				if(res.meta.status !== 200){
					return this.$message.error('获取用户列表失败')
				}
				this.userList = res.data.users
				this.total = res.data.total
			},
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize
				this.getUserList()
			},
			handleCurrentChange(newPage){
				this.queryInfo.pagenum = newPage
				this.getUserList()
			},
			async userStateChanged(userinfo){
				const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
				if(res.meta.status !== 200){
					userinfo.mg_state = !userinfo.mg_state
					return this.$message.error('修改用户状态失败')
				}
				this.$message.success('修改用户状态成功')
			},
			addDialogClosed(){
				this.$refs.addFormRef.resetFields()
			},
			adduser(){
				this.$refs.addFormRef.validate(async valid=>{
					if(!valid) return
					// 发起添加用户的请求
					const {data:res} = await this.$http.post('users',this.addForm)
					if(res.meta.status !== 201){
						return this.$message.error('添加用户失败')
					}
					this.$message.success('添加用户成功')
					this.addDialogVisible = false
					this.getUserList()
				})
			},
			async showEditDialog(id){
				const {data:res} = await this.$http.get('users/' + id)
				if(res.meta.status !== 200){
					return this.$message.error('查询用户信息失败')
				}
				this.editForm = res.data
				this.editDialogVisible = true
			},
			editDialogClosed(){
				this.$refs.editFormRef.resetFields()
			},
			editUserInfo(){
				this.$refs.editFormRef.validate(async vaild=>{
					if(!vaild) return
					// 修改用户的网络请求
					const {data:res} = await this.$http.put('users/' + this.editForm.id,{
						email:this.editForm.email,
						mobile:this.editForm.mobile
					})
					if(res.meta.status !== 200){
						return this.$message.error('修改用户信息失败')
					}else{
						this.editDialogVisible = false
						this.getUserList()
						this.$message.success('修改用户信息成功')
					}
				})
			},
			async removeUser(id){
				const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).catch(err=>{
					return err
				})
				if(confirmRes !== 'confirm'){
					return this.$message.info('取消删除')
				}else{
					const {data:res} = await this.$http.delete('users/' + id)
					if(res.meta.status !== 200){
						return this.$message.error('删除失败')
					}else{
						this.getUserList()
						return this.$message.success('删除成功')
					}
				}
			},
			async setRole(userinfo){
				this.userinfo = userinfo
				const {data:res} = await this.$http.get('roles')
				if(res.meta.status !== 200){
					return this.$message.error('获取权限列表失败')
				}else{
					this.rolesList = res.data
					this.setRoleDialog = true
				}
				
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	
</style>
