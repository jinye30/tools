import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import ToolExcel from './views/ToolExcel.vue'
import Table from './views/Table.vue'
Vue.use(Router)

export default new Router({
  routes: [
	// {
 //      path: '/',
 //      name: 'home',
 //      component: Home,
	// 		 iconCls: 'el-icon-upload',
	// 		leaf: true,//只有一个节点
	// 		children: [
 //            { path: '/table', component: Table, name: 'Table工具' }
 //            
 //        ]
 //    },
    {
      path: '/',
      name: 'home',
      component: Home,
			 iconCls: 'el-icon-upload',
			leaf: true,//只有一个节点
			children: [
            { path: '/tool', component: ToolExcel, name: 'Excel工具' }
            
        ]
    },
		{
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
		{
        path: '*',
        hidden: true,
        component: NotFound
    }
  ]
})
