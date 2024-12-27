<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <router-link to="/" class="text-2xl font-bold text-primary">
            Vue Shop
          </router-link>

          <!-- 搜索框 -->
          <div class="flex-1 max-w-xl mx-8">
            <input
              type="text"
              placeholder="搜索商品..."
              class="w-full input"
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>

          <!-- 导航链接 -->
          <div class="flex items-center space-x-6">
            <router-link
              v-for="category in categories"
              :key="category.id"
              :to="{ name: 'category', params: { id: category.id }}"
              class="text-gray-600 hover:text-primary transition-colors"
            >
              {{ category.name }}
            </router-link>
            
            <!-- 购物车 -->
            <router-link to="/cart" class="relative">
              <el-badge :value="cartCount" class="item">
                <el-icon size="24"><ShoppingCart /></el-icon>
              </el-badge>
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- 主要内容区 -->
    <main class="container mx-auto px-4 pt-24 pb-16">
      <router-view />
    </main>

    <!-- 底部导航栏（移动端） -->
    <footer class="fixed bottom-0 w-full bg-white shadow-t-sm md:hidden">
      <div class="flex justify-around py-3">
        <router-link to="/" class="text-center">
          <el-icon><House /></el-icon>
          <span class="text-xs block">首页</span>
        </router-link>
        <router-link to="/category/all" class="text-center">
          <el-icon><Menu /></el-icon>
          <span class="text-xs block">分类</span>
        </router-link>
        <router-link to="/cart" class="text-center">
          <el-icon><ShoppingCart /></el-icon>
          <span class="text-xs block">购物车</span>
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { House, Menu, ShoppingCart } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()
const searchQuery = ref('')
const categories = ref([
  { id: 1, name: '电子产品' },
  { id: 2, name: '服装' },
  { id: 3, name: '食品' },
  { id: 4, name: '图书' }
])

const cartCount = computed(() => cartStore.totalItems)

const handleSearch = () => {
  // 实现搜索逻辑
  if (searchQuery.value.trim()) {
    router.push({
      name: 'category',
      params: { id: 'search' },
      query: { q: searchQuery.value }
    })
  }
}
</script> 