import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    redirect: '/account',
    hidden: true
    // component: Layout,
    // redirect: '/dashboard',
    // hidden: true,
    // children: [{
    //   path: 'dashboard',
    //   name: 'Dashboard',
    //   component: () => import('@/views/dashboard/index'),
    //   meta: { title: '控制台', icon: 'dashboard' }
    // }]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/list',
    name: 'User',
    children: [{
      path: 'list',
      name: 'List',
      component: () => import('@/views/account/index'),
      meta: { title: '账户管理', icon: 'user' }
    }]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    name: 'Order',
    children: [{
      path: 'index',
      name: 'Index',
      props: route => ({
        accountId: route.query.accountId
      }),
      component: () => import('@/views/order/index'),
      meta: { title: '订单管理', icon: 'order' }
    }]
  },
  {
    path: '/area',
    component: Layout,
    hidden: true,
    redirect: '/area/list',
    name: 'Area',
    meta: { title: '地域管理', icon: 'area' },
    children: [{
      path: 'list',
      name: 'List',
      component: () => import('@/views/area/index'),
      meta: { title: '地域管理', icon: 'area' }
    }]
  },
  {
    path: '/movie',
    component: Layout,
    redirect: '/movie/list',
    name: 'Movie',
    meta: { title: '影片管理', icon: 'movie' },
    children: [{
      path: 'list',
      name: 'List',
      component: () => import('@/views/movie/index'),
      meta: { title: '影片管理', icon: 'movie' }
    }]
  },
  {
    path: '/cinema',
    component: Layout,
    redirect: '/cinema/index',
    name: 'Cinema',
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/cinema/index'),
      meta: { title: '影院管理', icon: 'cinema' }
    }]
  },
  {
    path: '/session',
    hidden: true,
    component: Layout,
    redirect: '/session/index',
    name: 'session',
    meta: { title: '排片管理', icon: 'cinema' },
    children: [{
      path: 'index/:cinemaId',
      name: 'SessionIndex',
      props: route => ({ cinemaId: route.params.cinemaId }),
      component: () => import('@/views/session/index'),
      meta: { title: '排片列表', icon: 'cinema' }
    },
    {
      path: 'detail/:sessionId',
      name: 'Detail',
      component: () => import('@/views/session/detail'),
      props: route => ({ sessionId: route.params.sessionId }),
      meta: { title: '选座详情', icon: 'cinema' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
