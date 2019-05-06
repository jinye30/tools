<template>
	<section>
		<el-row  class="toolbar" >
			<el-col  :xs="18" :sm="18" :md="18" :lg="18" :xl="28" >
				<el-form>
					<el-form-item>
						<!-- <el-button type="primary" >导入Excel</el-button> -->
						<el-button type="primary"  id="upload" @click="postBut">导入Excel<i class="el-icon-upload el-icon--right"></i></el-button>
						<el-button type="primary"   @click="decide" >计算</el-button>
						
					</el-form-item>
				</el-form>
			</el-col>
			<!--工具条-->
			<el-col  :xs="6" :sm="6" :md="6" :lg="6" :xl="6" class ="toolright">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="filters.name" placeholder="搜索"></el-input>
					</el-form-item>
					<!-- <el-form-item>
						<el-input v-model="filters.account" placeholder="对方账户"></el-input>
					</el-form-item> -->
					<!-- <el-form-item>
						<el-button type="primary"  >查询</el-button> -->
						<!-- @click="searchData" -->
					<!-- </el-form-item> -->
					
				</el-form>		
			</el-col>
		</el-row>
		<!-- <div ref='tip' style="visibility: hidden;"></div> -->
		 <input type="file" style="visibility: hidden;" multiple="multiple" ref="inputName" @change="handleOk()"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
		<!-- 列表 -->
		<el-table :data="list" highlight-current-row   @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="date" label="交易时间" width="120" >
				<template slot-scope="scope">
				 <div v-html="insertStr(insertStr(scope.row.date,4,'/'),7,'/')"></div>
				 </template>
			</el-table-column>
			<el-table-column prop="income" label="收入金额" width="100"  >
			</el-table-column>
			<el-table-column prop="pay" label="支出金额" width="100" >
			</el-table-column>
			<el-table-column prop="balance" label="账户余额" width="120" >
			</el-table-column>
			<el-table-column prop="bank" label="交易行名" min-width="180" >
				<template slot-scope="scope">
				 <span v-html="brightenKeyword(scope.row.bank, filters.name)" ></span>
				 </template>
			</el-table-column>
			<el-table-column prop="city" label="对方省市" min-width="100" >
				<template slot-scope="scope">
				 <span v-html="brightenKeyword(scope.row.city, filters.name)" ></span>
				 </template>
			</el-table-column>
			<el-table-column prop="name" label="对方账号" min-width="180" >
				<template slot-scope="scope">
				 <span v-html="brightenKeyword(scope.row.name, filters.name)" ></span>
				 </template>
			</el-table-column>
			<!-- <el-table-column prop="account" label="对方户名" min-width="100" >
			</el-table-column> -->
			<el-table-column  label="对方户名" min-width="100" >
				<!-- <template slot-scope="scope">
					<span  v-html="showData(list.account)"></span>
				</template> -->
				<template slot-scope="scope">
				 <span v-html="brightenKeyword(scope.row.account, filters.name)" ></span>
				 </template>
			</el-table-column>
			<el-table-column prop="remarks" label="交易用途" min-width="100" >
				<template slot-scope="scope">
				 <span v-html="brightenKeyword(scope.row.remarks, filters.name)" ></span>
				 </template>
			</el-table-column>
			
		</el-table>
		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar">
			
			<el-pagination layout="prev, pager, next"   @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col> -->
		
		<!-- 计算 -->
		<el-dialog title="计算" :visible.sync="dialogFormVisible"  width="30%">
		  <el-form >
			 <el-form-item label="总金额" :label-width="formLabelWidth">
			    <el-input placeholder="总金额" v-model="sumresult" :disabled="true" class ="resultstyle"></el-input>
			  </el-form-item>
			<el-form-item label="平均金额" :label-width="formLabelWidth">
			 <!-- <el-input placeholder="平均金额" v-model="average"  class ="resultstyle"></el-input> -->
			  <el-input-number v-model="num" :step="100" :min="1"></el-input-number>
			</el-form-item>
			<el-form-item label="结果" :label-width="formLabelWidth">
			  <el-input placeholder="计算结果" v-model="result" :disabled="true" class ="resultstyle"></el-input>
			</el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="returncount">确 定</el-button>
			<el-button @click="dialogFormVisible = false" type="warning">退出</el-button>
		  </div>
		</el-dialog>
		
	</section>
	
</template>

<script>
	export default {
		data(){
			return {
				filters: {
					name: '',
					account:''
				},
				// sum:'',
				num:100,
				result:'',
				parmas:[],
				sels: [],//列表选中列
				// total: 0,
				dialogFormVisible: false,
				// sumresult:'',
				formLabelWidth: '120px'
			}
		},
		methods: {
			insertStr(soure, start, newStr){   
               //为字符串插入字符 其中soure为原字符串,start为将要插入字符的位置，newStr为要插入的字符
			 
			   // return soure.slice(0, start) + newStr + soure.slice(start);
			   let resultdate =soure.slice(0, start) + newStr + soure.slice(start);
			    // console.log(resultdate);
			   return resultdate;
			},
			brightenKeyword(val, keyword) {
			   val = val + '';
			   if (val.indexOf(keyword) !== -1 && keyword !== '') {
					return val.replace(keyword, '<font color="#FF0000">' + keyword + '</font>')
			   } else {
				  return val
				}
			},
			returncount(){
				this.result = this.sumresult / this.num ;
			},
			decide(){
				
				// console.log(this.sels.length);
				if(this.sels.length ==0){
					 this.open();
				}else{
					this.result = '';
					this.dialogFormVisible = true;
				}
			},
			open() {
				const h = this.$createElement;

				this.$notify({
				  title: '温馨提示',
				  message: h('i', { style: 'color: teal'}, '请先选择内容，再进行计算')
				});
			},
	
			selsChange: function (sels) {
				this.sels = sels;
				
			},
			// handleCurrentChange(val) {
			// 	this.page = val;
			// 	
			// },
// 			creatP () {
// 			  // 添加显示文件名，以及删除功能
// 			  let _this = this
// 			  let oP = document.createElement('p')
// 			  oP.style.marginBottom = 10 + 'px'
// 			  oP.style.height = 60 + 'px'
// 			  oP.style.lineHeight = 60 + 'px'
// 			  oP.innerHTML = `
// 				${sessionStorage.getItem('name')}<span style='display:none;float:right;margin-right:15px;cursor:pointer'>x</span>
// 			  `
// 			  oP.addEventListener('mouseenter', function () {
// 				this.childNodes[1].style.display = 'block'
// 				this.style.background = '#9e9e9e'
// 				this.style.color = '#fff'
// 			  })
// 			  oP.addEventListener('click', function (e) {
// 				if (e.target.tagName === 'SPAN') {
// 				  _this.$refs.tip.removeChild(this)
// 				}
// 			  })
// 			  oP.addEventListener('mouseleave', function () {
// 				this.childNodes[1].style.display = 'none'
// 				this.style.background = ''
// 				this.style.color = '#000'
// 			  })
// 			  _this.$refs.tip.appendChild(oP)
// 			},
			postBut () {
			  // 模拟上传功能
			  let post = this.$refs.inputName
			  post.click()
			},
			handleOk () {
			  // 上传文件并解析数据
			  let _this = this
			  let XLSX = require('xlsx')
			  let X = XLSX
			  let rABS = false // 是否转为二进制字符串
			  let files = this.$refs.inputName.files
			
			  for (var i = 0; i < files.length; i++) {
				var f = files[i]
				var reader = new FileReader()
				var name = f.name
				sessionStorage.setItem('name', name)
				reader.onload = function (e) {
				  var data = e.target.result
				  var wb // 读取完成的数据
				  if (rABS) {
					wb = X.read(data, { type: 'binary' })
					
				  } else {
					var arr = fixdata(data) // 手动转化
					wb = X.read(btoa(arr), { type: 'base64' })
				  }
				  processWb(wb, 'json')
				}
				if (rABS) reader.readAsBinaryString(f)
				else reader.readAsArrayBuffer(f)
				// _this.$refs.tip.innerHTML = ''
				// _this.creatP()
			  }
			  // 将读取到的数据转为字符串
			  function processWb (wb, type) {
				var output = ''
				if (type === 'json') {
				  output = JSON.stringify(toJson(wb), 2, 2)
				  return output
				}
			  }
			  function fixdata (data) { // 文件流转BinaryString
				let o = ''
				let l = 0
				let w = 10240
				for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
				o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
				return o
			  }
			  function toJson (workbook) {
				  // console.log(workbook);
// 					const wsname = workbook.SheetNames[0];//取第一张表
// 					const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
// 					console.log(ws);
// 				var result = {}
// 				// SheetNames是获取Sheets中Sheet的名字
// 				// Sheets[Sheet名]获取第一个Sheet的数据
				workbook.SheetNames.forEach(function (sheetName) {
					
				  var roa = workbook.Sheets[sheetName]
				   // console.log(roa);
				   getDate(roa)
// 				  if (roa.length > 0) {
// 					result[sheetName] = roa
// 				  }
				})
				
				
// 				// console.log(result);
// 				let str = result.Sheet1
// 				_this.parmas.push(str)
// 				console.log(_this.parmas)
// 				_this.$emit('postdata', _this.parmas)
// 				return result
// 				const wsname = workbook.SheetNames[0];//取第一张表
// 				const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
// 				console.log(ws);
// 				getDate(ws)
// 				for(var i= 0;i<ws.length;i++){
// 						var sheetData = {
// 							date: ws[i].date,
// 							income: ws[i].income
// 						}
// 						_this.parmas.push(sheetData);
// 						}
// 						// this.$refs.upload.value = '';
// 						console.log(_this.parmas);
// 			 
// 					}
			}
			
				
			
			function getDate(roa){
			let colArr=[], //存放A~Z
	  		    date="",  
	  		    income="",
	  		    pay="",
	  		    balance="",
	  		    bank="",
	  		    city="",
				name="",
				account="",
				remarks="";
				//将A~Z存放至数组中
				for (let col = 65; col <= 90; col++) {
					let c = String.fromCharCode(col);
					colArr.push(c);
				}
				 //从A1遍历至Z1 当有一个 为空时 遍历停止
				for(var i=0;;i++){
					if(roa[colArr[i]+2]==null){
						// console.log(i);
						break;
					}
					// console.log(roa[colArr[i]+2].v);
					switch (roa[colArr[i]+2].v){
						case "交易时间":
							date=colArr[i];//从excel获取到date字段所在的列 如 date 在excel表内 A列
							// console.log(date);
							break;
						case "收入金额":
							income=colArr[i];//从excel获取到income字段所在的列 如 income 在excel表内 B列
							// console.log(income);
							break;
						case "支出金额":
							pay=colArr[i];//从excel获取到pay字段所在的列 如 pay 在excel表内 C列
							break;
						case "账户余额":
							balance=colArr[i];//从excel获取到balance字段所在的列 如 balance 在excel表内 D列
							break;	
						case "交易行名":
							bank=colArr[i];//从excel获取到bank字段所在的列 如 bank 在excel表内 E列
							break;
						case "对方省市":
							city=colArr[i];//从excel获取到city字段所在的列 如 city 在excel表内 F列
							break;
						case "对方账号":
							name=colArr[i];//从excel获取到name字段所在的列 如 name 在excel表内 F列
							break;
						case "对方户名":
							account=colArr[i];//从excel获取到account字段所在的列 如 account 在excel表内 F列
							break;
						case "交易用途":
							remarks=colArr[i];//从excel获取到remarks字段所在的列 如 remarks 在excel表内 F列
							break;
						default:
							break;
					}
				}
					 //开始遍历每一行
				for (var row=3;;row++) {
					let obj={};
					// console.log(row);
					//当某一行全部为空时 遍历停止
					if(roa[date+row]==null){
						break;
					}
					//获取到该行date字段的值 
					obj.date=roa[date+row].v;
					
					//获取到该行income字段的值
					obj.income=roa[income+row].v;
					//获取到该行pay字段的值
					obj.pay=roa[pay+row].v;
					//获取到该行balance字段的值
					obj.balance=roa[balance+row].v;
					//获取到该行bank字段的值
					obj.bank=roa[bank+row].v;
					//获取到该行city字段的值
					obj.city=roa[city+row].v;
					//获取到该行name字段的值
					obj.name=roa[name+row].v;
					//获取到该行account字段的值
					obj.account=roa[account+row].v;
					//获取到该行remarks字段的值
					obj.remarks=roa[remarks+row].v;
					//将赋值后的对象 加入到表格数组里
					_this.parmas.push(obj);
					// console.log(obj);
				}
			}
			
			}
		},
		 //通过计算属性过滤数据

        computed:{

          list: function(){

            var _this = this;
			// console.log(_this.parmas);
            //逻辑-->根据input的value值筛选goodsList中的数据

            // var arrByZM = [];//声明一个空数组来存放数据

//             for (var i=0;i<this.parmas.length;i++){
// 
//               //for循环数据中的每一项（根据name值）
// 
//               // if(this.parmas[i].account.search(this.filters.name) != -1){
// 				   if(this.parmas[i].account.search(this.filters.name) != -1){
// 
//                 //判断输入框中的值是否可以匹配到数据，如果匹配成功
// 
//                 arrByZM.push(this.parmas[i]);
// 
//                 //向空数组中添加数据
// 
//               }
					if (_this.filters.name) {
					return this.parmas.filter(function(parmas) {
					return Object.keys(parmas).some(function(key) {
						
					return String(parmas[key]).toLowerCase().indexOf(_this.filters.name) > -1
					// let resultsreach = String(parmas[key]).toLowerCase().indexOf(_this.filters.name) > -1
					// console.log(resultsreach);
					// if(resultsreach){
					// 	 // 匹配关键字正则
					// 	// let replaceReg = new RegExp(_this.filters.name, 'g');
					// 	// // 高亮替换v-html值
					// 	// let replaceString = '<span class="search-text">' + _this.filters.name + '</span>';
					// 	// 开始替换
					// 	 // = .replace(replaceReg, replaceString);
					// 	return resultsreach.replace(_this.filters.name, '<font color="#409EFF">' + _this.filters.name + '</font>');
					// }
					// return resultsreach;
					})
					})
					}
					return this.parmas;
			
            // }

           

            //一定要记得返回筛选后的数据

            // return arrByZM;

          },
		
		sumresult:function(){
			//
			 var _this = this;
			console.log(_this.sels);
			var sum=0;
			_this.sels.forEach(function(data){
			  sum += parseInt(data.income);
			});
			return sum
		}
		
        }
	
	}
</script>

<style scoped>
	.toolbar{
		border-radius: 4px;
		padding-bottom: 0px;
	}
	.toolright{
		text-align: right;
		/* padding-right: 15px; */
		float: right;
	}
	.resultstyle{
		width: 180px;
	}
	 /* #upload{
	  position: relative;
	  margin:15px 0;
	  width:300px;
	  height:150px;
	  background:rgba(134, 132, 132, 0.5);
	  border-radius:5px;
	  color:#fff;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  cursor: pointer;
	} */
	/* .el-icon-upload{
	  display: block;
	  width: 50px;
	  height: 50px;
	  font-size:50px;
	  margin:10px 50px;
	} */
	/* .upload-text{
	  width:200px;
	  position: absolute;
	  bottom:5px;
	  left:50%;
	  margin-left: -75px;
	} */
</style>