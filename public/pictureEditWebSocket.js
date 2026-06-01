/**
 * 图片协作编辑 WebSocket 运行时配置（打包后可直接改 dist/pictureEditWebSocket.js）
 * 在 index.html 中需先于应用入口加载。
 */
;(function () {
  window.__APP_RUNTIME_CONFIG__ = window.__APP_RUNTIME_CONFIG__ || {}
  var c = window.__APP_RUNTIME_CONFIG__
  // if (c.wsPictureEditBaseUrl == null) c.wsPictureEditBaseUrl = 'ws://127.0.0.1:8123'
  if (c.wsPictureEditBaseUrl == null) c.wsPictureEditBaseUrl = 'ws://localhost:8123'
})()
