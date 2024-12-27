<template>
  <div class="cart-view">
    <h1 class="text-2xl font-bold mb-8">购物车</h1>

    <div v-if="cartStore.items.length > 0">
      <!-- 购物车商品列表 -->
      <el-table :data="cartStore.items" style="width: 100%">
        <el-table-column label="商品" width="500">
          <template #default="{ row }">
            <div class="flex items-center space-x-4">
              <el-image
                :src="row.image"
                fit="cover"
                class="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 class="text-lg font-medium">{{ row.name }}</h3>
                <p class="text-sm text-gray-500">{{ row.description }}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="单价" width="150">
          <template #default="{ row }">
            <span class="text-lg font-medium">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="数量" width="200">
          <template #default="{ row }">
            <el-input-number
              v-model="row.quantity"
              :min="1"
              :max="99"
              @change="(value) => handleQuantityChange(row.id, value)"
            />
          </template>
        </el-table-column>

        <el-table-column label="小计" width="150">
          <template #default="{ row }">
            <span class="text-lg font-medium text-primary">
              ¥{{ (row.price * row.quantity).toFixed(2) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              type="danger"
              text
              @click="handleRemoveItem(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 购物车底部 -->
      <div class="flex justify-between items-center mt-8">
        <div class="flex items-center space-x-4">
          <el-button @click="handleClearCart">清空购物车</el-button>
          <router-link to="/" class="btn-secondary">
            继续购物
          </router-link>
        </div>

        <div class="text-right">
          <div class="mb-4">
            <span class="text-lg">��品总计：</span>
            <span class="text-2xl font-bold text-primary">
              ¥{{ cartStore.totalPrice.toFixed(2) }}
            </span>
          </div>
          <router-link
            to="/checkout"
            class="btn-primary inline-block"
          >
            去结算 ({{ cartStore.totalItems }}件)
          </router-link>
        </div>
      </div>
    </div>

    <!-- 空购物车状态 -->
    <div
      v-else
      class="text-center py-16"
    >
      <el-empty description="购物车是空的">
        <router-link to="/" class="btn-primary">
          去购物
        </router-link>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'
import { ElMessageBox } from 'element-plus'

const cartStore = useCartStore()

// 更新商品数量
function handleQuantityChange(productId, quantity) {
  cartStore.updateQuantity(productId, quantity)
}

// 移除商品
function handleRemoveItem(productId) {
  ElMessageBox.confirm(
    '确定要从购物车中移除该商品吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    cartStore.removeItem(productId)
  }).catch(() => {})
}

// 清空购物车
function handleClearCart() {
  ElMessageBox.confirm(
    '确定要清空购物车吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    cartStore.clearCart()
  }).catch(() => {})
}
</script> 