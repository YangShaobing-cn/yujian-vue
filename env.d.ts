/// <reference types="vite/client" />

interface Window {
  __APP_RUNTIME_CONFIG__?: {
    beianUrl?: string
    beianText?: string
    /** axios baseURL，见 public/request.js */
    apiBaseUrl?: string
    /** 上传专用 baseURL，默认同 apiBaseUrl */
    apiUploadBaseUrl?: string
    apiTimeout?: number
    apiUploadTimeout?: number
    apiWithCredentials?: boolean
    /** WebSocket 根地址（不含路径），见 public/pictureEditWebSocket.js */
    wsPictureEditBaseUrl?: string
  }
}
