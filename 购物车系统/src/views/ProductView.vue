<template>
  <div class="product-view">
    <!-- 广告展示区域 -->
    <div class="mb-8">
      <AdDisplay />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 商品图片展示 -->
      <div class="product-gallery">
        <el-carousel
          :interval="4000"
          type="card"
          height="400px"
        >
          <el-carousel-item
            v-for="(image, index) in product.images"
            :key="index"
          >
            <el-image
              :src="image"
              fit="cover"
              class="w-full h-full object-cover rounded-lg"
            />
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 商品信息 -->
      <div class="product-info">
        <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>
        
        <!-- 价格和评分 -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-primary">
            <span class="text-sm">价格</span>
            <div class="text-3xl font-bold">¥{{ product.price.toFixed(2) }}</div>
          </div>
          <div class="flex items-center">
            <el-rate
              v-model="product.rating"
              disabled
              show-score
              text-color="#ff9900"
            />
            <span class="ml-2 text-gray-500">({{ product.reviewCount }}条评价)</span>
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">商品描述</h2>
          <p class="text-gray-600">{{ product.description }}</p>
        </div>

        <!-- 商品规格 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">商品规格</h2>
          <el-descriptions :column="1" border>
            <el-descriptions-item
              v-for="(spec, key) in product.specifications"
              :key="key"
              :label="key"
            >
              {{ spec }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 购买数量 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">购买数量</h2>
          <el-input-number
            v-model="quantity"
            :min="1"
            :max="99"
            size="large"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="flex space-x-4">
          <el-button
            type="primary"
            size="large"
            @click="handleAddToCart"
          >
            加入购物车
          </el-button>
          <el-button
            type="danger"
            size="large"
            @click="handleBuyNow"
          >
            立即购买
          </el-button>
        </div>
      </div>
    </div>

    <!-- 商品详情和评价 -->
    <div class="mt-12">
      <el-tabs v-model="activeTab">
        <!-- 商品详情 -->
        <el-tab-pane label="商品详情" name="detail">
          <div class="product-detail">
            <div v-html="product.detail"></div>
          </div>
        </el-tab-pane>

        <!-- 商品评价 -->
        <el-tab-pane label="商品评价" name="reviews">
          <div class="product-reviews">
            <!-- 评价统计 -->
            <div class="mb-8">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-3xl font-bold">{{ product.rating }}</div>
                  <div class="text-gray-500">综合评分</div>
                </div>
                <div class="flex-1 ml-8">
                  <div
                    v-for="(rate, index) in reviewStats"
                    :key="index"
                    class="flex items-center mb-2"
                  >
                    <span class="w-16">{{ 5 - index }}星</span>
                    <el-progress
                      :percentage="rate"
                      :show-text="false"
                      class="flex-1"
                    />
                    <span class="ml-2 text-gray-500">{{ rate }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 评价列表 -->
            <div class="space-y-6">
              <div
                v-for="review in product.reviews"
                :key="review.id"
                class="border-b pb-6"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center">
                    <el-avatar :src="review.userAvatar" />
                    <div class="ml-4">
                      <div class="font-medium">{{ review.userName }}</div>
                      <div class="text-gray-500 text-sm">
                        {{ review.date }}
                      </div>
                    </div>
                  </div>
                  <el-rate
                    v-model="review.rating"
                    disabled
                    size="small"
                  />
                </div>
                <p class="text-gray-700">{{ review.content }}</p>
                <div class="mt-4 space-x-2">
                  <el-image
                    v-for="(image, index) in review.images"
                    :key="index"
                    :src="image"
                    fit="cover"
                    class="w-20 h-20 object-cover rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { ElMessage } from 'element-plus'
import AdDisplay from '../components/ad/AdDisplay.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const quantity = ref(1)
const activeTab = ref('detail')

// 模拟商品数据
const product = ref({
  id: 1,
  name: 'iPhone 15 Pro',
  price: 8999,
  description: '最新款iPhone，搭载A17芯片，超强性能',
  rating: 4.8,
  reviewCount: 2563,
  images: [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3'
  ],
  specifications: {
    '品牌': 'Apple',
    '型号': 'iPhone 15 Pro',
    '颜色': '自然钛金属色',
    '存储容量': '256GB',
    '屏幕尺寸': '6.1英寸',
    '处理器': 'A17 Pro',
    '摄像头': '4800万像素主摄'
  },
  detail: `
    <div class="space-y-4">
      <img src="https://picsum.photos/1200/600?random=4" class="w-full rounded-lg">
      <h3 class="text-xl font-bold">产品特点</h3>
      <ul class="list-disc pl-6">
        <li>A17 Pro芯片，性能提升显著</li>
        <li>专业级相机系统，支持4K视频录制</li>
        <li>超瓷晶面板，更强抗摔能力</li>
        <li>全天候显示屏，信息一目了然</li>
      </ul>
      <img src="https://picsum.photos/1200/600?random=5" class="w-full rounded-lg">
    </div>
  `,
  reviews: [
    {
      id: 1,
      userName: '张三',
      userAvatar: 'https://picsum.photos/100/100?random=1',
      rating: 5,
      date: '2024-03-15',
      content: '手机非常好用，外观设计很漂亮，性能也很强大，拍照效果很满意。',
      images: [
        'https://picsum.photos/200/200?random=6',
        'https://picsum.photos/200/200?random=7'
      ]
    },
    {
      id: 2,
      userName: '李四',
      userAvatar: 'https://picsum.photos/100/100?random=2',
      rating: 4,
      date: '2024-03-14',
      content: '整体还不错，就是价格有点贵，希望后续能有优惠活动。',
      images: [
        'https://picsum.photos/200/200?random=8'
      ]
    }
  ]
})

// 评价统计
const reviewStats = ref([90, 5, 3, 1, 1])

// 添加到购物车
function handleAddToCart() {
  const item = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.images[0],
    quantity: quantity.value
  }
  
  cartStore.addItem(item)
  ElMessage.success('已添加到购物车')
}

// 立即购买
function handleBuyNow() {
  handleAddToCart()
  router.push('/checkout')
}

onMounted(() => {
  // 这里应该根据路由参数获取商品详情
  console.log('Product ID:', route.params.id)
})
</script>

<style scoped>
.product-detail :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
</style> 