export default function myPlugin(options) {
  return {
    apply: (compiler) => {
      // apply方法
      // console.log('This is My Plugin!');
      compiler.hooks.done.tap('My Plugin', (stats) => {
        // 监听hooks
        // console.log('My author is ' + stats); // 处理逻辑
      });

      // 指定一个挂载到 webpack 自身的事件钩子。
      // compiler.hooks.emit.tapAsync(
      //   'MyExampleWebpackPlugin',
      //   (compilation, callback) => {
      //     console.log('这是一个示例插件！');
      //     console.log(
      //       '这里表示了资源的单次构建的 `compilation` 对象：',
      //       compilation
      //     );

      //     // 用 webpack 提供的插件 API 处理构建过程
      //     compilation.addModule(/* ... */);

      //     callback();
      //   })
    },
  };
}
