<template>
  <div class="home">
    <!-- 广告展示区域 -->
    <div class="mb-8">
      <AdDisplay />
    </div>

    <!-- 推荐商品区域 -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">推荐商品</h2>
      <el-row :gutter="20">
        <el-col
          v-for="product in featuredProducts"
          :key="product.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="mb-4"
        >
          <ProductCard :product="product" />
        </el-col>
      </el-row>
    </div>

    <!-- 分类展示区域 -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">商品分类</h2>
      <el-row :gutter="20">
        <el-col
          v-for="category in categories"
          :key="category.id"
          :span="6"
          class="mb-4"
        >
          <router-link
            :to="{ name: 'category', params: { id: category.id }}"
            class="block"
          >
            <el-card
              class="category-card hover:shadow-lg transition-shadow"
              :body-style="{ padding: '0px' }"
            >
              <el-image
                :src="category.image"
                fit="cover"
                class="w-full h-32 object-cover"
              />
              <div class="p-4 text-center">
                <h3 class="text-lg font-semibold">{{ category.name }}</h3>
                <p class="text-sm text-gray-500">{{ category.description }}</p>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>

    <!-- 最新商品区域 -->
    <div>
      <h2 class="text-2xl font-bold mb-4">最新上架</h2>
      <el-row :gutter="20">
        <el-col
          v-for="product in newProducts"
          :key="product.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="mb-4"
        >
          <ProductCard :product="product" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdDisplay from '../components/ad/AdDisplay.vue'
import ProductCard from '../components/product/ProductCard.vue'

// 模拟数据
const categories = ref([
  {
    id: 1,
    name: '电子产品',
    description: '最新科技产品',
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 2,
    name: '服装',
    description: '时尚服饰',
    image: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 3,
    name: '食品',
    description: '美食佳饮',
    image: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 4,
    name: '图书',
    description: '知识殿堂',
    image: 'https://picsum.photos/400/300?random=4'
  }
])

const featuredProducts = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 8999,
    description: '最新款iPhone，搭载A17芯片',
    image: 'https://picsum.photos/400/300?random=5',
    rating: 4.5
  },
  {
    id: 2,
    name: '机械键盘',
    price: 299,
    description: '机械轴体，RGB背光',
    image: 'https://picsum.photos/400/300?random=6',
    rating: 4.0
  },
  {
    id: 3,
    name: '无线耳机',
    price: 999,
    description: '主动降噪，持久续航',
    image: 'https://picsum.photos/400/300?random=7',
    rating: 4.8
  },
  {
    id: 4,
    name: '智能手表',
    price: 1599,
    description: '健康监测，运动追踪',
    image: 'https://picsum.photos/400/300?random=8',
    rating: 4.2
  }
])

const newProducts = ref([
  {
    id: 5,
    name: '平板电脑',
    price: 3999,
    description: '轻薄便携，性能强劲',
    image: 'https://picsum.photos/400/300?random=9',
    rating: 4.6
  },
  {
    id: 6,
    name: '游戏手柄',
    price: 299,
    description: '人体工学设计，支持多平台',
    image: 'https://picsum.photos/400/300?random=10',
    rating: 4.3
  },
  {
    id: 7,
    name: '蓝牙音箱',
    price: 499,
    description: '环绕立体声，防水设计',
    image: 'https://picsum.photos/400/300?random=11',
    rating: 4.4
  },
  {
    id: 8,
    name: '智能台灯',
    price: 199,
    description: '护眼设计，智能调光',
    image: 'https://picsum.photos/400/300?random=12',
    rating: 4.1
  }
])
</script> 