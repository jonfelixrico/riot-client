import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: { name: 'device-list' } },
      {
        path: 'devices',
        name: 'device-list',
        component: () => import('src/pages/DeviceList.vue'),
      },
      {
        path: 'devices/:deviceId/versions/:version',
        name: 'device-details',
        component: () => import('src/pages/DeviceDetails.vue'),
      },
      {
        path: 'devices/unregistered',
        name: 'unregistered-devices',
        component: () => import('src/pages/UnregisteredDeviceList.vue'),
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
