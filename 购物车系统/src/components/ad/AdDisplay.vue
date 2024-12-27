<template>
  <div class="ad-container">
    <!-- Banner 广告 -->
    <div class="banner-ad mb-6">
      <el-card
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="handleAdClick"
      >
        <el-image
          :src="bannerAd?.imageUrl"
          fit="cover"
          class="w-full h-40 object-cover rounded-lg"
        >
          <template #placeholder>
            <div class="w-full h-40 flex items-center justify-center bg-gray-100">
              <el-icon class="text-gray-400"><Picture /></el-icon>
            </div>
          </template>
        </el-image>
        <div class="p-4">
          <h3 class="text-lg font-bold">{{ bannerAd?.title }}</h3>
          <p class="text-gray-600">{{ bannerAd?.detailPage }}</p>
        </div>
      </el-card>
    </div>

    <!-- 浮动广告 -->
    <div
      v-if="floatAd"
      class="float-ad"
      :class="{ 'float-ad-visible': showFloatAd }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="relative bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <el-image
          v-if="floatAd.imageUrl"
          :src="floatAd.imageUrl"
          fit="cover"
          class="w-full h-32 object-cover rounded-lg mb-2 cursor-pointer"
          @click="handleFloatAdClick"
        />
        <h4 class="font-bold mb-1">{{ floatAd.title }}</h4>
        <p class="text-sm text-gray-600">{{ floatAd.detailPage }}</p>
        <el-button
          v-if="isHovered"
          class="absolute -top-2 -right-2"
          circle
          size="small"
          @click="closeFloatAd"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Picture, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const isHovered = ref(false)
const showFloatAd = ref(true)
const bannerAd = ref(null)
const floatAd = ref(null)
let adInterval = null

// 获取新广告
async function fetchNewAds() {
  try {
    // 获取 Banner 广告
    const bannerResponse = await fetch('http://ads.wztj.net:8000/Servletclass-1.0-SNAPSHOT/randomAd')
    const bannerData = await bannerResponse.json()
    bannerAd.value = bannerData

    // 获取浮动广告
    const floatResponse = await fetch('http://ads.wztj.net:8000/Servletclass-1.0-SNAPSHOT/randomAd')
    const floatData = await floatResponse.json()
    floatAd.value = floatData
    showFloatAd.value = true
  } catch (error) {
    console.error('获取广告失败:', error)
    ElMessage.error('获取广告失败')
  }
}

// 处理 Banner 广告点击
function handleAdClick() {
  if (bannerAd.value) {
    ElMessage.success('广告点击：' + bannerAd.value.title)
    // 这里可以添加广告点击统计或跳转逻辑
  }
}

// 处理浮动广告点击
function handleFloatAdClick() {
  if (floatAd.value) {
    ElMessage.success('广告点击：' + floatAd.value.title)
    // 这里可以添加广告点击统计或跳转逻辑
  }
}

// 关闭浮动广告
function closeFloatAd() {
  showFloatAd.value = false
}

onMounted(() => {
  // 初始获取广告
  fetchNewAds()

  // 设置定时器，每30秒更新一次广告
  adInterval = setInterval(fetchNewAds, 30000)
})

onUnmounted(() => {
  // 清理定时器
  if (adInterval) clearInterval(adInterval)
})
</script>

<style scoped>
.float-ad {
  position: fixed;
  right: -300px;
  bottom: 20px;
  transition: all 0.5s ease;
  z-index: 1000;
}

.float-ad-visible {
  right: 20px;
}

.float-ad:hover {
  transform: scale(1.05);
}
</style> 