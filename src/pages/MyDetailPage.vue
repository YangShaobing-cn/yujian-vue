<template>
  <div id="myDetailPage">
    <h2 class="title">我的详情</h2>
    <a-form
      layout="vertical"
      :model="formData"
      name="myDetailForm"
      autocomplete="off"
      @finish="handleSubmit"
    >
      <a-form-item label="用户 id">
        <a-input :value="formData.id?.toString()" disabled />
      </a-form-item>
      <a-form-item label="账号">
        <a-input v-model:value="formData.userAccount" disabled />
      </a-form-item>
      <a-form-item
        label="用户名"
        name="userName"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input v-model:value="formData.userName" placeholder="请输入用户名" allow-clear />
      </a-form-item>
      <a-form-item label="头像">
        <div class="avatar-block">
          <a-avatar :size="96" :src="formData.userAvatar">
            <template v-if="!formData.userAvatar">
              <UserOutlined />
            </template>
          </a-avatar>
          <p v-if="formData.userAvatar" class="avatar-url-hint">上传成功后可点击下方「保存」写入资料</p>
          <a-tabs v-model:activeKey="uploadType" class="avatar-tabs">
            <a-tab-pane key="file" tab="文件上传">
              <a-upload
                list-type="picture-card"
                class="avatar-upload-card"
                :show-upload-list="false"
                :custom-request="handleFileUpload"
                :before-upload="beforeUpload"
              >
                <div v-if="fileUploadLoading" class="avatar-upload-inner">
                  <LoadingOutlined />
                  <div class="ant-upload-text">上传中</div>
                </div>
                <div v-else class="avatar-upload-inner">
                  <PlusOutlined />
                  <div class="ant-upload-text">点击或拖拽上传</div>
                </div>
              </a-upload>
            </a-tab-pane>
            <a-tab-pane key="url" tab="URL 上传" force-render>
              <a-input-group compact>
                <a-input
                  v-model:value="avatarUrlInput"
                  style="width: calc(100% - 120px)"
                  placeholder="请输入图片地址"
                  allow-clear
                />
                <a-button
                  type="primary"
                  style="width: 120px"
                  :loading="urlUploadLoading"
                  :disabled="!formData.id"
                  @click="handleUrlUpload"
                >
                  上传
                </a-button>
              </a-input-group>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-form-item>
      <a-form-item label="简介" name="userProfile">
        <a-textarea
          v-model:value="formData.userProfile"
          placeholder="请输入个人简介"
          :rows="4"
          show-count
          :maxlength="200"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="saving" block>保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import {
  updateUserUsingPost,
  uploadUserAvatarByUrlUsingPost,
  uploadUserAvatarFileUsingPost,
} from '@/api/userController.ts'

const loginUserStore = useLoginUserStore()
const saving = ref(false)
const fileUploadLoading = ref(false)
const urlUploadLoading = ref(false)
const uploadType = ref<'file' | 'url'>('file')
const avatarUrlInput = ref('')

const formData = reactive<API.UserUpdateRequest & { userAccount?: string }>({
  id: undefined,
  userAccount: '',
  userName: '',
  userAvatar: '',
  userProfile: '',
})

const applyAvatarUrl = (url?: string) => {
  if (url) {
    formData.userAvatar = url
    message.success('头像已更新，记得点击保存写入资料')
    return
  }
  message.warning('上传成功但未返回图片地址')
}

const handleFileUpload = async (options: { file: Blob }) => {
  const { file } = options
  if (!formData.id) {
    message.error('用户未登录，无法上传')
    return
  }
  fileUploadLoading.value = true
  try {
    const res = await uploadUserAvatarFileUsingPost(file)
    if (res.data.code === 0 && res.data.data !== undefined && res.data.data !== '') {
      applyAvatarUrl(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (e: unknown) {
    console.error('图片上传失败', e)
    message.error('图片上传失败，' + (e instanceof Error ? e.message : String(e)))
  } finally {
    fileUploadLoading.value = false
  }
}

const handleUrlUpload = async () => {
  if (!formData.id) {
    message.error('用户未登录，无法上传')
    return
  }
  const url = avatarUrlInput.value?.trim()
  if (!url) {
    message.warning('请输入图片地址')
    return
  }
  urlUploadLoading.value = true
  try {
    const res = await uploadUserAvatarByUrlUsingPost({ fileUrl: url })
    if (res.data.code === 0 && res.data.data !== undefined && res.data.data !== '') {
      applyAvatarUrl(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (e: unknown) {
    console.error('图片上传失败', e)
    message.error('图片上传失败，' + (e instanceof Error ? e.message : String(e)))
  } finally {
    urlUploadLoading.value = false
  }
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('不支持上传该格式的图片，推荐 jpg 或 png')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('不能上传超过 2M 的图片')
  }
  return isJpgOrPng && isLt2M
}

const syncFormFromLoginUser = () => {
  const loginUser = loginUserStore.loginUser
  formData.id = loginUser?.id
  formData.userAccount = loginUser?.userAccount ?? ''
  formData.userName = loginUser?.userName ?? ''
  formData.userAvatar = loginUser?.userAvatar ?? ''
  formData.userProfile = loginUser?.userProfile ?? ''
}

const handleSubmit = async () => {
  if (!formData.id) {
    message.error('用户未登录，无法保存')
    return
  }
  saving.value = true
  try {
    const res = await updateUserUsingPost({
      id: formData.id,
      userName: formData.userName,
      userAvatar: formData.userAvatar,
      userProfile: formData.userProfile,
    })
    if (res.data.code === 0) {
      message.success('保存成功')
      await loginUserStore.fetchLoginUser()
      syncFormFromLoginUser()
      return
    }
    message.error('保存失败，' + res.data.message)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (!loginUserStore.loginUser?.id) {
    await loginUserStore.fetchLoginUser()
  }
  syncFormFromLoginUser()
})
</script>

<style scoped>
#myDetailPage {
  max-width: 640px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.avatar-url-hint {
  margin: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.avatar-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 12px;
}

.avatar-upload-card :deep(.ant-upload) {
  width: 100% !important;
  min-width: 152px;
  min-height: 152px;
}

.avatar-upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.avatar-upload-inner .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
