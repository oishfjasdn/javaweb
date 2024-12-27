<template>
  <div class="checkout-view">
    <h1 class="text-2xl font-bold mb-8">订单结算</h1>

    <!-- 收货地址 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">收货地址</h2>
      <el-form
        ref="addressForm"
        :model="addressForm"
        :rules="addressRules"
        label-width="100px"
      >
        <el-form-item label="收货人" prop="name">
          <el-input v-model="addressForm.name" />
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>

        <el-form-item label="所在地区" prop="region">
          <el-cascader
            v-model="addressForm.region"
            :options="regions"
            placeholder="请选择所在地区"
          />
        </el-form-item>

        <el-form-item label="详细地址" prop="address">
          <el-input
            v-model="addressForm.address"
            type="textarea"
            rows="2"
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 订单商品 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">订单商品</h2>
      <el-table :data="cartStore.items" style="width: 100%">
        <el-table-column label="商品" width="500">
          <template #default="{ row }">
            <div class="flex items-center space-x-4">
              <el-image
                :src="row.image"
                fit="cover"
                class="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 class="text-base font-medium">{{ row.name }}</h3>
                <p class="text-sm text-gray-500">{{ row.description }}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="单价" width="150">
          <template #default="{ row }">
            <span class="text-base">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="数量" width="150">
          <template #default="{ row }">
            <span>× {{ row.quantity }}</span>
          </template>
        </el-table-column>

        <el-table-column label="小计">
          <template #default="{ row }">
            <span class="text-base text-primary">
              ¥{{ (row.price * row.quantity).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 支付方式 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">支付方式</h2>
      <el-radio-group v-model="paymentMethod">
        <el-radio label="alipay">支付宝</el-radio>
        <el-radio label="wechat">微信支付</el-radio>
        <el-radio label="card">银行卡</el-radio>
      </el-radio-group>
    </div>

    <!-- 订单备注 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">订单备注</h2>
      <el-input
        v-model="remark"
        type="textarea"
        rows="2"
        placeholder="请输入订单备注（选填）"
      />
    </div>

    <!-- 订单金额 -->
    <div class="bg-gray-50 p-6 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <span>商品总额</span>
        <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between items-center mb-4">
        <span>运费</span>
        <span>¥{{ shipping.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between items-center text-lg font-bold">
        <span>应付总额</span>
        <span class="text-primary">¥{{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 提交订单 -->
    <div class="flex justify-end mt-8">
      <el-button
        type="primary"
        size="large"
        :loading="isSubmitting"
        @click="handleSubmitOrder"
      >
        提交订单
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const isSubmitting = ref(false)

// 收货地址表单
const addressForm = ref({
  name: '',
  phone: '',
  region: [],
  address: ''
})

// 表单验证规则
const addressRules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请选择所在地区', trigger: 'change' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
  ]
}

// 地区数据（示例）
const regions = [
  {
    value: 'beijing',
    label: '北京市',
    children: [
      {
        value: 'beijing',
        label: '北京市',
        children: [
          { value: 'chaoyang', label: '朝阳区' },
          { value: 'haidian', label: '海淀区' }
        ]
      }
    ]
  },
  // ... 更多地区数据
]

// 支付方式
const paymentMethod = ref('alipay')

// 订单备注
const remark = ref('')

// 运费
const shipping = ref(10)

// 总金额
const totalAmount = computed(() => {
  return cartStore.totalPrice + shipping.value
})

// 提交订单
async function handleSubmitOrder() {
  if (cartStore.items.length === 0) {
    ElMessage.warning('购物车为空，无法提交订单')
    return
  }

  try {
    isSubmitting.value = true
    
    // 这里应该调用后端 API 创建订单
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟成功创建订单
    ElMessageBox.alert(
      '订单提交成功！',
      '提示',
      {
        confirmButtonText: '确定',
        callback: () => {
          cartStore.clearCart()
          router.push('/')
        }
      }
    )
  } catch (error) {
    ElMessage.error('订单提交失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script> 