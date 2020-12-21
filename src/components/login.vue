<template>
	<div class="login_container">
		<div class="login_box">
			<div class="avatar_box">
				<img src="../assets/logo.png" />
			</div>
			<el-form 
			class="login_form" 
			:model="loginForm" 
			:rules="loginFormRules"
			ref="loginFormRef">
			  <el-form-item prop="username">
			    <el-input 
				prefix-icon="iconfont icon-user" 
				v-model="loginForm.username">
				</el-input>
			  </el-form-item>
			  <el-form-item prop="password">
			    <el-input 
				prefix-icon="iconfont icon-3702mima" 
				v-model="loginForm.password"
				type="password"></el-input>
			  </el-form-item>
			  <el-form-item class="btns">
				  <el-button type="primary" round @click="login">登录</el-button>
				  <el-button type="info" round @click="resetForm">重置</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				loginForm:{
					username:'',
					password:''
				},
				// 表单验证规则
				loginFormRules:{
					username:[
						{required:true,message:'请输入用户名',trigger:'blur'},
						{min:3,max:10,message:'长度在3到10个字符',trigger:'blur'}
					],
					password:[
						{required:true,message:'请输入密码',trigger:'blur'},
						{min:6,max:10,message:'长度在6到10个字符',trigger:'blur'}
					]
				}
			}
		},
		methods:{
			resetForm(){
				this.$refs.loginFormRef.resetFields();
			},
			// 登录验证
			login(){
				this.$refs.loginFormRef.validate(async vaild=>{
					if(!vaild) return;
					const {data:res} = await this.$http.post('login',this.loginForm);
					if(res.meta.status !== 200) return this.$message.error('登录失败');
					this.$message.success('登陆成功');
					// 将登录成功之后的token保存到客户端的sessionStorage中
					window.sessionStorage.setItem('token',res.data.token);
					// 跳转
					this.$router.push('/home')
				})
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.login_container{
		background-color: #2b4b6b;
		height: 100vh;
		.login_box{
			width: 450px;
			height: 300px;
			background-color: #fff;
			border-radius: 3px;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
		}
		.avatar_box{
			height: 130px;
			width: 130px;
			border: 1px solid #eee;
			border-radius: 50%;
			padding: 10px;
			box-shadow: 0 0 10px #ddd;
			position: absolute;
			left: 50%;
			transform: translate(-50%,-50%);
			background-color: #fff;
			img{
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #eee;
			}
		}
	}
	.login_form{
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
	}
	
	.btns{
		display: flex;
		justify-content: flex-end;
	}
</style>
