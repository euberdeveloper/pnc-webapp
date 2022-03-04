import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { UserRole } from '@prebenorwegian/sdk';

import rootRedirect from './utils/rootRedirect';
import beforeEach from './utils/beforeEach';

/* PUBLIC */
const NotFound = () => import(/* webpackChunkName: "public" */ '@/views/not-found/NotFoundView.vue');
const Login = () => import(/* webpackChunkName: "public" */ '@/views/login/LoginView.vue');

/* DASHBOARD */
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/DashboardView.vue');
const DashboardBar = () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/DashboardBarView.vue');
const DashboardMenu = () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/DashboardMenuView.vue');
const DashboardUsers = () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/users/DashboardUsersView.vue');
const DashboardCourses = () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/courses/DashboardCoursesView.vue');
const DashboardCoursesId = () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/courses/id/DashboardCoursesIdView.vue');
const DashboardNotFound = () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/not-found/DashboardNotFoundView.vue');

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'root',
    redirect: rootRedirect(true)
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/dashboard',
    components: {
      default: Dashboard,
      bar: DashboardBar,
      menu: DashboardMenu
    },
    meta: { authentication: true },
    children: [
      {
        path: '',
        redirect: rootRedirect(false)
      },
      {
        path: 'users',
        name: 'dashboard-users',
        meta: { authorizedRoles: [UserRole.ADMIN] },
        component: DashboardUsers
      },
      {
        path: 'courses',
        name: 'dashboard-courses',
        component: DashboardCourses
      },
      {
        path: 'courses/:courseId',
        name: 'dashboard-courses-id',
        props: true,
        component: DashboardCoursesId
      },
      {
        path: '*',
        name: 'dashboard-not-found',
        meta: { noElevation: true },
        component: DashboardNotFound
      }
    ]
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    else if (savedPosition) {
      return savedPosition;
    }
    else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach(beforeEach);

export default router;
