/**
 * HTTP 请求运行时配置（打包后可直接改 dist/request.js，无需重新构建）
 * 在 index.html 中需先于应用入口加载。
 */
;(function () {
  window.__APP_RUNTIME_CONFIG__ = window.__APP_RUNTIME_CONFIG__ || {}
  var c = window.__APP_RUNTIME_CONFIG__
  if (c.apiBaseUrl == null) c.apiBaseUrl = 'http://localhost:8123'
  // 若上传走独立网关，可改为例如 'http://localhost:8123'
  if (c.apiUploadBaseUrl == null) c.apiUploadBaseUrl = c.apiBaseUrl
  if (c.apiTimeout == null) c.apiTimeout = 10000
  if (c.apiUploadTimeout == null) c.apiUploadTimeout = 150000
  if (c.apiWithCredentials == null) c.apiWithCredentials = true
})()
