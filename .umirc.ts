import { defineConfig } from 'umi';
import myPlugin from './webpackPlugins/myPlugin1';

export default defineConfig({
  locale: { antd: true },
  // devtool: false,
  devtool: 'eval-cheap-module-source-map',

  chainWebpack(memo, { env, webpack }) {
    // 添加额外插件
    memo.plugin('myPlugin').use(myPlugin, [11]);
    // console.log('memo', memo.devServer);
    // console.log(memo.devServer.port());
    // memo.devServer.after = (...rest) => {

    // }
    // // 删除 Umi 内置插件
    // memo.plugins.delete('hmr');
  },
  clickToComponent: {},
  routes: [
    {
      path: '/',
      component: '@/pages/index',
      // redirect: '/map'
    },
    { path: '/map', component: '@/pages/map' },
    { path: '/svgEx', component: '@/pages/svgEx' },
    {
      path: '/three-test',
      component: '@/pages/three-test',
    },
    { path: '/color-picker-page', component: '@/pages/color-picker-page' },
    { path: '/react-error-catch', component: '@/pages/react-error-catch' },
    { path: '/source-map-test', component: '@/pages/source-map-test' },
    { path: '/react-grid-layout', component: '@/pages/react-grid-layout' },
    { path: '/pro-table', component: '@/pages/pro-table' },
    { path: '/context-test', component: '@/pages/context-test' },
  ],
  externals: {
    // antd: 'antd',
    // react: 'React',
    // ['react-dom']: 'ReactDOM',
  },
});
