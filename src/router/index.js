import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Table from '@/components/Table'
import Category from '@/views/Category'
import Brand from '@/views/Brand'
import Form from '@/components/Form'
// import user from '@/components/user'


Vue.use(Router)

 const router = new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Hello',
    //   component: Hello
    // },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: Home,
      name: '商品管理',
      meta: { requiresAuth: true },
      iconCls: 'el-icon-menu',//图标样式class
      children: [
          { path: '/categories', meta: { requiresAuth: true }, component: Category, name: '商品类别' },
          { path: '/brands', meta: { requiresAuth: true }, component: Brand, name: '商品品牌' },
      ]
    },
  ]
})

export default router

router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})