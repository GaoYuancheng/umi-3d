import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/map', component: '@/pages/map' },
    { path: '/three-test', component: '@/pages/three-test' },
  ],
  fastRefresh: {},
});
