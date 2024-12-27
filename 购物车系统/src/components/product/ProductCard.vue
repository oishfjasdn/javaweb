<template>
  <div class="card group hover:shadow-lg transition-shadow duration-300">
    <div class="relative">
      <!-- 商品图片 -->
      <router-link :to="{ name: 'product', params: { id: product.id }}">
        <el-image
          :src="product.image"
          fit="cover"
          class="w-full h-48 object-cover rounded-t-lg"
        />
      </router-link>
      
      <!-- 快速添加购物车按钮 -->
      <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <el-button
          type="primary"
          circle
          @click="addToCart"
        >
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="p-4">
      <router-link
        :to="{ name: 'product', params: { id: product.id }}"
        class="block"
      >
        <h3 class="text-lg font-semibold text-gray-800 hover:text-primary truncate">
          {{ product.name }}
        </h3>
      </router-link>
      
      <div class="mt-2 flex items-center justify-between">
        <span class="text-xl font-bold text-primary">
          ¥{{ product.price.toFixed(2) }}
        </span>
        
        <div class="flex items-center text-sm text-gray-500">
          <el-rate
            v-model="product.rating"
            disabled
            text-color="#ff9900"
            show-score
          />
        </div>
      </div>

      <p class="mt-2 text-sm text-gray-500 line-clamp-2">
        {{ product.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { useCartStore } from '../../stores/cart'
import { ElMessage } from 'element-plus'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

function addToCart() {
  cartStore.addItem(props.product)
  ElMessage({
    message: '已添加到购物车',
    type: 'success'
  })
}
</script> 