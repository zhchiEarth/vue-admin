import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Table from '@/components/Table'
import Category from '@/components/Category'
import Brand from '@/views/Brand'
import Form from '@/components/Form'
// import user from '@/components/user'


Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Hello',
    //   component: Hello
    // },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      name: '商品管理',
      iconCls: 'el-icon-menu',//图标样式class
      children: [
          { path: '/categories', component: Category, name: '商品类别' },
          // { path: '/table', component: Table, name: '商品类别' },
          // { path: '/table', component: Table, name: '商品类别' },
          { path: '/brands', component: Brand, name: '商品品牌' },
          // { path: '/user', component: user, name: '列表' },
      ]
    },
  ]
})
