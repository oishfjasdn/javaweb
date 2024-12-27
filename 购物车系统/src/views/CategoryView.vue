<template>
  <div class="category-view">
    <!-- 广告展示区域 -->
    <div class="mb-8">
      <AdDisplay />
    </div>

    <!-- 分类标题和筛选器 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ categoryTitle }}</h1>
        <div class="flex items-center space-x-4">
          <!-- 排序选择器 -->
          <el-select v-model="sortBy" placeholder="排序方式" size="large">
            <el-option label="默认排序" value="default" />
            <el-option label="价格从低到高" value="price-asc" />
            <el-option label="价格从高到低" value="price-desc" />
            <el-option label="评分从高到低" value="rating-desc" />
          </el-select>

          <!-- 视图切换 -->
          <el-radio-group v-model="viewMode" size="large">
            <el-radio-button label="grid">
              <el-icon><Grid /></el-icon>
            </el-radio-button>
            <el-radio-button label="list">
              <el-icon><List /></el-icon>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>

    <!-- 筛选器和商品列表 -->
    <el-row :gutter="20">
      <!-- 筛选侧边栏 -->
      <el-col :span="6">
        <el-card class="filter-sidebar">
          <template #header>
            <div class="flex items-center justify-between">
              <span>筛选条件</span>
              <el-button text @click="resetFilters">重置</el-button>
            </div>
          </template>

          <!-- 分类筛选 -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-4">商品分类</h3>
            <!-- 主分类选择 -->
            <el-radio-group v-model="selectedMainCategory" class="flex flex-col space-y-2">
              <el-radio label="">全部商品</el-radio>
              <el-radio
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
              >
                {{ category.name }}
                <span class="text-gray-500 text-sm">
                  ({{ products.filter(p => p.category === category.name).length }})
                </span>
              </el-radio>
            </el-radio-group>

            <!-- 子分类选择 -->
            <template v-if="selectedMainCategory && availableSubCategories.length">
              <h4 class="text-base font-medium mt-4 mb-2">{{ selectedMainCategory }}分类</h4>
              <el-radio-group v-model="selectedSubCategory" class="flex flex-col space-y-2">
                <el-radio label="">全部{{ selectedMainCategory }}</el-radio>
                <el-radio
                  v-for="subCategory in availableSubCategories"
                  :key="subCategory.id"
                  :label="subCategory.name"
                >
                  {{ subCategory.name }}
                  <span class="text-gray-500 text-sm">
                    ({{ products.filter(p => p.category === selectedMainCategory && p.subCategory === subCategory.name).length }})
                  </span>
                </el-radio>
              </el-radio-group>
            </template>
          </div>

          <!-- 价格范围 -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-4">价格范围</h3>
            <el-slider
              v-model="priceRange"
              range
              :min="0"
              :max="15000"
              :step="100"
            />
            <div class="flex justify-between text-sm text-gray-500">
              <span>¥{{ priceRange[0] }}</span>
              <span>¥{{ priceRange[1] }}</span>
            </div>
          </div>

          <!-- 评分筛选 -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-4">最低评分</h3>
            <el-rate v-model="minRating" />
          </div>

          <!-- 品牌筛选 -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-4">品牌</h3>
            <el-checkbox-group v-model="selectedBrands" class="flex flex-col space-y-2">
              <el-checkbox
                v-for="brand in filteredBrands"
                :key="brand.id"
                :label="brand.id"
                class="!mr-0"
              >
                {{ brand.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
      </el-col>

      <!-- 商品列表 -->
      <el-col :span="18">
        <el-row :gutter="20">
          <el-col
            v-for="product in filteredProducts"
            :key="product.id"
            :xs="24"
            :sm="viewMode === 'grid' ? 12 : 24"
            :md="viewMode === 'grid' ? 8 : 24"
            :lg="viewMode === 'grid' ? 8 : 24"
            class="mb-4"
          >
            <ProductCard :product="product" />
          </el-col>
        </el-row>

        <!-- 分页器 -->
        <div class="flex justify-center mt-8">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="totalProducts"
            :page-sizes="[12, 24, 36, 48]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Grid, List } from '@element-plus/icons-vue'
import AdDisplay from '../components/ad/AdDisplay.vue'
import ProductCard from '../components/product/ProductCard.vue'

const route = useRoute()
const viewMode = ref('grid')
const sortBy = ref('default')
const currentPage = ref(1)
const pageSize = ref(12)
const priceRange = ref([0, 10000])
const minRating = ref(0)
const selectedBrands = ref([])

// 模拟数据
const brands = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Samsung' },
  { id: 3, name: 'Xiaomi' },
  { id: 4, name: 'Huawei' },
  { id: 5, name: 'Nike' },
  { id: 6, name: 'Adidas' },
  { id: 7, name: 'Uniqlo' },
  { id: 8, name: 'H&M' },
  { id: 9, name: '三只松鼠' },
  { id: 10, name: '良品铺子' },
  { id: 11, name: '百草味' },
  { id: 12, name: '德芙' },
  { id: 13, name: '人民文学出版社' },
  { id: 14, name: '商务印书馆' },
  { id: 15, name: '机械工业出版社' },
  { id: 16, name: '电子工业出版社' }
])

const categories = ref([
  {
    id: 'electronics',
    name: '电子产品',
    children: [
      { id: 'phone', name: '手机' },
      { id: 'computer', name: '电脑/平板' },
      { id: 'wearable', name: '智能穿戴' },
      { id: 'audio', name: '音频设备' },
      { id: 'accessories', name: '配件' }
    ]
  },
  {
    id: 'clothing',
    name: '服装',
    children: [
      { id: 'sportswear', name: '运动服饰' },
      { id: 'casual', name: '休闲服装' },
      { id: 'shoes', name: '鞋类' },
      { id: 'outerwear', name: '外套' }
    ]
  },
  {
    id: 'food',
    name: '食品',
    children: [
      { id: 'snacks', name: '零食' },
      { id: 'nuts', name: '坚果' },
      { id: 'chocolate', name: '巧克力' },
      { id: 'dried-food', name: '肉脯干货' }
    ]
  },
  {
    id: 'books',
    name: '图书',
    children: [
      { id: 'literature', name: '文学艺术' },
      { id: 'education', name: '教育考试' },
      { id: 'technology', name: '科技计算机' },
      { id: 'social-science', name: '社会科学' }
    ]
  }
])

const products = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 8999,
    description: '最新款iPhone，搭载A17芯片',
    image: 'https://picsum.photos/400/300?random=1',
    rating: 4.5,
    brandId: 1,
    category: '电子产品',
    subCategory: '手机'
  },
  {
    id: 2,
    name: 'MacBook Pro 14',
    price: 14999,
    description: 'M3 Pro芯片，14���寸Liquid视网膜XDR显示屏',
    image: 'https://picsum.photos/400/300?random=2',
    rating: 4.8,
    brandId: 1,
    category: '电子产品',
    subCategory: '电脑/平板'
  },
  {
    id: 3,
    name: 'Samsung Galaxy S24 Ultra',
    price: 9999,
    description: '骁龙8 Gen 3，200MP主摄，AI智能体验',
    image: 'https://picsum.photos/400/300?random=3',
    rating: 4.6,
    brandId: 2,
    category: '电子产品',
    subCategory: '手机'
  },
  {
    id: 4,
    name: 'Samsung Galaxy Tab S9',
    price: 6999,
    description: '骁龙8 Gen 2，14.6英寸AMOLED屏幕',
    image: 'https://picsum.photos/400/300?random=4',
    rating: 4.4,
    brandId: 2,
    category: '电子产品',
    subCategory: '平板'
  },
  {
    id: 5,
    name: 'Xiaomi 14 Pro',
    price: 4999,
    description: '骁龙8 Gen 3，徕卡光学，超大光圈',
    image: 'https://picsum.photos/400/300?random=5',
    rating: 4.3,
    brandId: 3,
    category: '电子产品',
    subCategory: '手机'
  },
  {
    id: 6,
    name: 'Redmi K70 Pro',
    price: 3299,
    description: '旗舰性能，2K直屏，超快充电',
    image: 'https://picsum.photos/400/300?random=6',
    rating: 4.2,
    brandId: 3,
    category: '电子产品',
    subCategory: '手机'
  },
  {
    id: 7,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    description: '麒麟9000S，卫星通讯，可变光圈',
    image: 'https://picsum.photos/400/300?random=7',
    rating: 4.7,
    brandId: 4,
    category: '电子产品',
    subCategory: '手机'
  },
  {
    id: 8,
    name: 'HUAWEI MatePad Pro',
    price: 4999,
    description: '鸿蒙系统，多屏协同，磁吸键盘',
    image: 'https://picsum.photos/400/300?random=8',
    rating: 4.5,
    brandId: 4,
    category: '电子产品',
    subCategory: '平板'
  },
  {
    id: 9,
    name: 'AirPods Pro 2',
    price: 1999,
    description: '主动降噪，空间音频，USB-C充电',
    image: 'https://picsum.photos/400/300?random=9',
    rating: 4.6,
    brandId: 1,
    category: '电子产品',
    subCategory: '耳机'
  },
  {
    id: 10,
    name: 'Apple Watch Series 9',
    price: 3299,
    description: 'S9芯片，双击手势，全天候显示',
    image: 'https://picsum.photos/400/300?random=10',
    rating: 4.4,
    brandId: 1,
    category: '电子产品',
    subCategory: '手表'
  },
  {
    id: 11,
    name: 'Samsung Galaxy Watch 6',
    price: 2499,
    description: '宝石玻璃，运动监测，睡眠分析',
    image: 'https://picsum.photos/400/300?random=11',
    rating: 4.3,
    brandId: 2,
    category: '电子产品',
    subCategory: '手表'
  },
  {
    id: 12,
    name: 'Xiaomi Watch S3',
    price: 999,
    description: '双系统架构，多功能NFC，长续航',
    image: 'https://picsum.photos/400/300?random=12',
    rating: 4.1,
    brandId: 3,
    category: '电子产品',
    subCategory: '手表'
  },
  {
    id: 13,
    name: 'HUAWEI FreeBuds Pro 3',
    price: 1499,
    description: '三单元声学，智能降噪，高清音质',
    image: 'https://picsum.photos/400/300?random=13',
    rating: 4.5,
    brandId: 4,
    category: '电子产品',
    subCategory: '耳机'
  },
  {
    id: 14,
    name: 'iPad Air 5',
    price: 4799,
    description: 'M1芯片，10.9英寸屏幕，全面屏设计',
    image: 'https://picsum.photos/400/300?random=14',
    rating: 4.7,
    brandId: 1,
    category: '电子产品',
    subCategory: '平板'
  },
  {
    id: 15,
    name: 'Redmi Pad SE',
    price: 1099,
    description: '骁龙6Gen1，11英寸2K屏，四扬声器',
    image: 'https://picsum.photos/400/300?random=15',
    rating: 4.2,
    brandId: 3,
    category: '电子产品',
    subCategory: '平板'
  },
  {
    id: 16,
    name: 'HUAWEI Sound X',
    price: 2199,
    description: '帝瓦雷调音，双低音单元，华为音频引擎',
    image: 'https://picsum.photos/400/300?random=16',
    rating: 4.4,
    brandId: 4,
    category: '电子产品',
    subCategory: '音响'
  },
  {
    id: 17,
    name: 'Samsung Galaxy Buds 3',
    price: 1299,
    description: 'ANC降噪，360度空间音频，无线充电',
    image: 'https://picsum.photos/400/300?random=17',
    rating: 4.3,
    brandId: 2,
    category: '电子产品',
    subCategory: '耳机'
  },
  {
    id: 18,
    name: 'Xiaomi Buds 4 Pro',
    price: 999,
    description: '空音频，智能降噪，LHDC 5.0',
    image: 'https://picsum.photos/400/300?random=18',
    rating: 4.0,
    brandId: 3,
    category: '电子产品',
    subCategory: '耳机'
  },
  {
    id: 19,
    name: 'Magic Keyboard',
    price: 999,
    description: '触控ID，剪刀脚键盘，可充电',
    image: 'https://picsum.photos/400/300?random=19',
    rating: 4.5,
    brandId: 1,
    category: '电子产品',
    subCategory: '配件'
  },
  {
    id: 20,
    name: 'HUAWEI MateBook X Pro',
    price: 8999,
    description: '13代酷睿，3.1K原色全面屏，超级终端',
    image: 'https://picsum.photos/400/300?random=20',
    rating: 4.6,
    brandId: 4,
    category: '电子产品',
    subCategory: '电脑/平板'
  },
  {
    id: 21,
    name: 'Nike Air Max 2024',
    price: 1299,
    description: '新一代气垫科技，轻盈舒适，多色可选',
    image: 'https://picsum.photos/400/300?random=21',
    rating: 4.6,
    brandId: 5,
    category: '服装',
    subCategory: '运动服饰'
  },
  {
    id: 22,
    name: 'Adidas Ultraboost 24',
    price: 1399,
    description: 'Boost缓震科技，编织鞋面，运动舒适',
    image: 'https://picsum.photos/400/300?random=22',
    rating: 4.7,
    brandId: 6,
    category: '服装',
    subCategory: '运动服饰'
  },
  {
    id: 23,
    name: 'Uniqlo 设计师联名T恤',
    price: 199,
    description: '100%纯棉，艺术家限定设计，舒适面料',
    image: 'https://picsum.photos/400/300?random=23',
    rating: 4.5,
    brandId: 7,
    category: '服装',
    subCategory: '休闲服装'
  },
  {
    id: 24,
    name: 'H&M 春季连衣裙',
    price: 299,
    description: '2024春季新款，清新印花，显瘦版型',
    image: 'https://picsum.photos/400/300?random=24',
    rating: 4.3,
    brandId: 8,
    category: '服装',
    subCategory: '休闲服装'
  },
  {
    id: 25,
    name: 'Nike Tech Fleece套装',
    price: 1099,
    description: '科技面料，保暖透气，运动休闲两用',
    image: 'https://picsum.photos/400/300?random=25',
    rating: 4.8,
    brandId: 5,
    category: '服装',
    subCategory: '运动服饰'
  },
  {
    id: 26,
    name: 'Adidas三叶草卫衣',
    price: 699,
    description: '经典logo设计，优质棉料，情侣款',
    image: 'https://picsum.photos/400/300?random=26',
    rating: 4.6,
    brandId: 6,
    category: '服装',
    subCategory: '休闲服装'
  },
  {
    id: 27,
    name: 'Uniqlo羽绒服',
    price: 599,
    description: '轻薄保暖，防水面料，多色可选',
    image: 'https://picsum.photos/400/300?random=27',
    rating: 4.7,
    brandId: 7,
    category: '服装',
    subCategory: '外套'
  },
  {
    id: 28,
    name: '三只松鼠坚果大礼包',
    price: 149,
    description: '8种坚果，每日能量，送礼佳选',
    image: 'https://picsum.photos/400/300?random=28',
    rating: 4.8,
    brandId: 9,
    category: '食品',
    subCategory: '坚果'
  },
  {
    id: 29,
    name: '良品铺子零食礼盒',
    price: 99,
    description: '精选零食，多种口味，假日必备',
    image: 'https://picsum.photos/400/300?random=29',
    rating: 4.5,
    brandId: 10,
    category: '食品',
    subCategory: '零食'
  },
  {
    id: 30,
    name: '百草味肉脯系列',
    price: 59,
    description: '精选原料，传统工艺，香辣可口',
    image: 'https://picsum.photos/400/300?random=30',
    rating: 4.4,
    brandId: 11,
    category: '食品',
    subCategory: '肉脯干货'
  },
  {
    id: 31,
    name: '德芙巧克力礼盒',
    price: 89,
    description: '丝滑醇香，精美包装，送礼首选',
    image: 'https://picsum.photos/400/300?random=31',
    rating: 4.7,
    brandId: 12,
    category: '食品',
    subCategory: '巧克力'
  },
  {
    id: 32,
    name: '三只松鼠每日坚果',
    price: 169,
    description: '30包独立包装，营养均衡，方便携带',
    image: 'https://picsum.photos/400/300?random=32',
    rating: 4.6,
    brandId: 9,
    category: '食品',
    subCategory: '坚果'
  },
  {
    id: 33,
    name: '《红楼梦》（精装版）',
    price: 199,
    description: '全新注释，精美插图，收藏版',
    image: 'https://picsum.photos/400/300?random=33',
    rating: 4.9,
    brandId: 13,
    category: '图书',
    subCategory: '文学艺术'
  },
  {
    id: 34,
    name: '《新华字典》（第12版）',
    price: 29,
    description: '最新版本，收录新词，双色印刷',
    image: 'https://picsum.photos/400/300?random=34',
    rating: 4.8,
    brandId: 14,
    category: '图书',
    subCategory: '教育考试'
  },
  {
    id: 35,
    name: '《深入理解计算机系统》',
    price: 129,
    description: '计算机科学经典教材，原书第4版',
    image: 'https://picsum.photos/400/300?random=35',
    rating: 4.9,
    brandId: 15,
    category: '图书',
    subCategory: '科技计算机'
  },
  {
    id: 36,
    name: '《JavaScript高级程序设计》',
    price: 119,
    description: 'Web开发必读，第5版，全彩印刷',
    image: 'https://picsum.photos/400/300?random=36',
    rating: 4.8,
    brandId: 16,
    category: '图书',
    subCategory: '科技计算机'
  },
  {
    id: 37,
    name: '《人类简史》',
    price: 68,
    description: '全球畅销书，精装修订版',
    image: 'https://picsum.photos/400/300?random=37',
    rating: 4.7,
    brandId: 14,
    category: '图书',
    subCategory: '社会科学'
  },
  {
    id: 38,
    name: '《Vue.js设计与实现》',
    price: 89,
    description: 'Vue.js框架设计原理解析',
    image: 'https://picsum.photos/400/300?random=38',
    rating: 4.9,
    brandId: 16,
    category: '图书',
    subCategory: '科技计算机'
  }
])

// 添加子分类选择
const selectedMainCategory = ref('')
const selectedSubCategory = ref('')

// 计算可用的子分类
const availableSubCategories = computed(() => {
  const mainCategory = categories.value.find(c => c.name === selectedMainCategory.value)
  return mainCategory ? mainCategory.children : []
})

// 更新分类标题计算属性
const categoryTitle = computed(() => {
  if (selectedMainCategory.value) {
    if (selectedSubCategory.value) {
      return `${selectedMainCategory.value} - ${selectedSubCategory.value}`
    }
    return selectedMainCategory.value
  }
  const id = route.params.id
  if (id === 'search') {
    return `搜索结果: ${route.query.q || ''}`
  }
  return '全部商品'
})

// 更新筛选商品的计算属性
const filteredProducts = computed(() => {
  let result = [...products.value]

  // 应用主分类筛选
  if (selectedMainCategory.value) {
    result = result.filter(product => product.category === selectedMainCategory.value)

    // 应用子分类筛选
    if (selectedSubCategory.value) {
      result = result.filter(product => product.subCategory === selectedSubCategory.value)
    }
  }

  // 应用价格筛选
  result = result.filter(product => 
    product.price >= priceRange.value[0] && 
    product.price <= priceRange.value[1]
  )

  // 应用评分筛选
  if (minRating.value > 0) {
    result = result.filter(product => product.rating >= minRating.value)
  }

  // 应用品牌筛选
  if (selectedBrands.value.length > 0) {
    result = result.filter(product => 
      selectedBrands.value.includes(product.brandId)
    )
  }

  // 应用排序
  switch (sortBy.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating-desc':
      result.sort((a, b) => b.rating - a.rating)
      break
  }

  return result
})

const totalProducts = computed(() => filteredProducts.value.length)

// 更新品牌筛选的��算属性
const filteredBrands = computed(() => {
  if (!selectedMainCategory.value) {
    return brands.value
  }

  const categoryProducts = products.value.filter(product => {
    if (selectedSubCategory.value) {
      return product.category === selectedMainCategory.value && 
             product.subCategory === selectedSubCategory.value
    }
    return product.category === selectedMainCategory.value
  })

  const brandIds = new Set(categoryProducts.map(product => product.brandId))
  return brands.value.filter(brand => brandIds.has(brand.id))
})

// 更新重置筛选器方法
function resetFilters() {
  selectedMainCategory.value = ''
  selectedSubCategory.value = ''
  priceRange.value = [0, 15000]
  minRating.value = 0
  selectedBrands.value = []
  sortBy.value = 'default'
}

// 监听主分类变化
watch(selectedMainCategory, () => {
  selectedSubCategory.value = ''
  selectedBrands.value = []
})

function handleSizeChange(val) {
  pageSize.value = val
  currentPage.value = 1
}

function handleCurrentChange(val) {
  currentPage.value = val
}

// 监听路由变化
watch(
  () => route.params.id,
  () => {
    currentPage.value = 1
    resetFilters()
  }
)

onMounted(() => {
  // 这里可以根据路由参数加载对应分类的商品
})
</script> 