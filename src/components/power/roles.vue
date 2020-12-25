<template>
	<div>
		<el-breadcrumb
		separator-class="el-icon-arrow-right" 
		class="el-breadcrumb">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card shadow="never">
			<el-row>
				<el-col>
					<el-button type="primary" @click="addRight">添加角色</el-button>
				</el-col>
			</el-row>
			<el-table :data="rolelist" border stripe>
				<el-table-column type="expand">
					<template v-slot="scope">
						<el-row 
						v-for="(item1,i1) in scope.row.children" 
						:key="item1.id" 
						:class="['bdbottom',i1 == 0 ? 'bdtop':'']"
						class="hcenter">
							<el-col :span="5">
								<el-tag
								closable
								@close="removethree(scope.row,item1.id)">
									{{item1.authName}}
								</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<el-col :span="19">
								<el-row 
								v-for="(item2,i2) in item1.children" 
								:key="item2.id"
								:class="[ i2 == 0 ? '' : 'bdtop']"
								class="hcenter">
									<el-col :span="6">
										<el-tag type="success"
											closable
											@close="removethree(scope.row,item2.id)">
											{{item2.authName}}
										</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										<el-tag type="warning" 
										v-for="(item3,i3) in item2.children" 
										:key="item3.id"
										closable
										@close="removethree(scope.row,item3.id)">
											{{item3.authName}}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作" width="600px">
					<template v-slot="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editRight">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="delRight">删除</el-button>
						<el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRighr(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		
		<el-dialog
		  title="权限分配"
		  :visible.sync="setRightDialogVisible"
		  width="50%" @close="clearSetRight">
		  <el-tree 
		  :data="rightsList" 
		  :props="treeProps" 
		  show-checkbox
		  node-key="id"
		  ref="treeRef"
		  default-expand-all
		  :default-checked-keys="defkeys"></el-tree>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setRightDialogVisible = false">取消</el-button>
		    <el-button type="primary" @click="allotRights">确定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				rolelist:[],
				setRightDialogVisible:false,
				rightsList:[],
				treeProps:{
					label:'authName',
					children:'children'
				},
				defkeys:[],
				roleId:''
			}
		},
		created() {
			this.getRolesList()
		},
		methods:{
			async getRolesList(){
				const {data:res} = await this.$http.get('roles')
				if(res.meta.status !== 200){
					return this.$message.error('获取角色列表失败')
				}else{
					this.rolelist = res.data
				}
			},
			async removethree(role,rightId){
				const confirmRes = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).catch(err=>err)
				if(confirmRes !== 'confirm'){
					return this.$message.info('取消删除该权限')
				}else{
					const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
					if(res.meta.status !== 200){
						return this.$message.error('删除该权限失败')
					}else{
						role.children = res.data
						return this.$message.success('删除该权限成功')
					}
				}
			},
			async showSetRighr(role){
				this.roleId = role.id
				const {data:res} = await this.$http.get('rights/tree')
				if(res.meta.status !== 200){
					return this.$message.error('获取权限列表失败')
				}else{
					this.rightsList = res.data
					this.getLeafKeys(role,this.defkeys)
					this.setRightDialogVisible = true
				}
			},
			addRight(){
				this.$message.info('这个功能实现过啦，我懒就不做了')
			},
			editRight(){
				this.$message.info('这个功能实现过啦，我懒就不做了')
			},
			delRight(){
				this.$message.info('这个功能实现过啦，我懒就不做了')
			},
			getLeafKeys(node,arr){
				if(!node.children){
					return arr.push(node.id)
				}else{
					node.children.forEach(item => {
						this.getLeafKeys(item,arr)
					})
				}
			},
			clearSetRight(){
				this.defkeys = []
			},
			async allotRights(){
				const keys = [
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedNodes()
				]
				const idStr = keys.join(',')
				const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
				if(res.meta.status !== 200){
					return this.$message.error('分配权限失败')
				}else{
					this.$message.success('分配权限成功')
					this.getRolesList()
					this.setRightDialogVisible = false
				}
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.el-tag{
		margin: 7px;
	}
	.bdtop{
		border-top: 1px solid #eee;
	}
	.bdbottom{
		border-bottom: 1px solid #eee;
	}
	.hcenter{
		display: flex;
		align-items: center;
	}
</style>
