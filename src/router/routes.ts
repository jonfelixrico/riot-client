import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'devices',
        name: 'device-list',
        component: () => import('src/pages/DeviceList.vue'),
      },
      {
        path: 'devices/:deviceId',
        name: 'device-details',
        component: () => import('src/pages/DeviceDetails.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
