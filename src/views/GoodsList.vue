<template>
    <div>
        <nav-header></nav-header>
        <nav-bread> <!-- 面包屑组件 -->
            <span>Goods</span>
            <!-- <span slot="goods">Goods</span> 根据名字改变插槽值，可以在不同的页面中很好的复用 该组件, 该span会插在 Bread.vue的对应 slot中 -->
            <!-- <span slot="list">List</span> -->
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default cur">Default</a>
                    <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd>
                                <a href="javascript:void(0)" @click="priceChecked='all'" v-bind:class="{'cur':priceChecked=='all'}">All</a>
                            </dd>
                            <dd v-for="(price, index) in priceFilter" :key="index"> <!-- 用迭代 index 作 :key -->
                                <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="(item,index) in goodslist" :key="index"> <!-- v-for需要设置 :key 最好设置为string/int -->
                                    <div class="pic">
                                        <a href="#"><img v-lazy="'/image/'+item.productImage" alt="" :key="'/image/'+item.productImage"></a> <!-- dom加载速度快，图片可能显示不出来，图片需要动态绑定，获取到数据时再渲染, 此时要填 /img/ 不能填 ./../../public/image/-->
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="view-more-normal"
                             v-infinite-scroll="loadMore"
                             infinite-scroll-disabled="busy"
                             infinite-scroll-distance="20"> <!--鼠标滚动时 触发loadMore函数，busy为true禁用滚动-->
                            <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div> -->
        <Modal v-bind:modalShow="modalLogin" v-on:close="closeModal"> <!--全局通用模态框 登录框 这里的modalLogin属性和下面的modalCart都会绑定到子组件的props：modalShow属性上，来控制模态框显示-->
            <p slot="message">
                请先登录
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="modalLogin = false">关闭</a>
            </div>
        </Modal> 
        <Modal v-bind:modalShow="modalCart" v-on:close="closeModal"> <!--全局通用模态框 加入购物车框-->
            <p slot="message">
                <svg class="icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>
                    已加入购物车
                </span>
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="modalCart = false">返回</a>
                <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
            </div>
        </Modal> 
        <nav-footer></nav-footer>
    </div>
</template>
<script>
import NavHeader from '@/components/Header.vue'
import NavFooter from '@/components/Footer.vue'
import NavBread from '@/components/Bread.vue'
import Modal from '@/components/Modal'
import axios from 'axios'
export default {
    data () { // 组件中的data必须是一个函数，内部返回一个obj，不允许组件之间状态共享，保证组件被其他引用时 不会改变数据状态
        return {
            goodslist: [],
            sortFlag: true,
            page: 1,
            pageSize: 8,
            busy: true,
            loading: false, // 转圈圈的动画   axios.get请求前开启，之后关闭
            modalLogin: false, // 控制登录模态框显示，子组件里用props：modalShow接受该值
            modalCart: false, // 控制加入购物车模态框显示，子组件里用props：modalShow接受该值
            priceFilter: [
                {
                    startPrice: '0.00',
                    endPrice: '500.00'
                },
                {
                    startPrice: '500.00',
                    endPrice: '1000.00'
                },
                {
                    startPrice: '1000.00',
                    endPrice: '1500.00'
                },
                {
                    startPrice: '1500.00',
                    endPrice: '2000.00'
                },
                {
                    startPrice: '2000.00',
                    endPrice: '4000.00'
                },
                {
                    startPrice: '4000.00',
                    endPrice: '6000.00'
                },
                {
                    startPrice: '6000.00',
                    endPrice: '8000.00'
                },
                {
                    startPrice: '10000.00',
                    endPrice: '20000.00'
                }
            ],
            priceChecked: 'all',
            filterBy: false,
            overLayFlag: false
        }
    },
    components: {
        NavHeader: NavHeader,
        NavFooter: NavFooter,
        NavBread: NavBread,
        Modal: Modal
    },
    mounted () { // vue生命周期初始化函数，组件加载完就会调mounted() ,里面可以调用其他初始化方法 
        this.getGoodsList()
    },
    methods: {
        getGoodsList (flag) { // 加载商品列表, flag判断数据是累加还是重新加载
            var param = {
                page: this.page,
                pageSize: this.pageSize,
                sort: this.sortFlag ? 1 : -1,
                priceLevel: this.priceChecked // 查询的价格区间
            }
            this.loading = true
            axios.get('/goods/list', {
                params: param
            }).then((result) => { // 现在是本地模拟数据，需要在 vue.config.js 中配置，然后用 配置的 url 请求数据
            // vue.config.js 中 获取存在本地的数据（通过 vue 内置的 基于Node.js 的 express框架），然后 设置好 url ，前端页面就可以通过该 url 请求数据 
            // 实际项目中不需要在 vue.config.js 中模拟，直接请求 后台提供的 api 就行了
                let res = result.data
                this.loading = false
                if (res.status === '0') {
                    if (flag) {
                        this.goodslist = this.goodslist.concat(res.result.list)
                        if (res.result.count === 0) {
                            this.busy = true
                        } else {
                            this.busy = false
                        }
                    } else {
                        this.goodslist = res.result.list
                        this.busy = false
                    }
                } else {
                    this.goodslist = []
                }
            })
        },
        sortGoods () {
            this.sortFlag = !this.sortFlag
            this.page = 1
            this.getGoodsList()
        },
        loadMore () {
            this.busy = true
            setTimeout(() => { // 防止滚动请求无止境加载
                this.page++
                this.getGoodsList(true) // 这里加载商品列表时需要累加数据
            }, 500)
        },
        addCart (productId) {
            axios.post('/goods/addCart', { // get请求要加params，post不用
                productId: productId
            }).then((result) => {
                let res = result.data
                if (res.status === '0') {
                    this.modalCart = true
                    this.$store.commit('updateCartCount', 1)
                } else {
                    this.modalLogin = true
                }
            })
        },
        closeModal () {
            this.modalLogin = false // 子组件通过this.$emit('click')重置该值，为模态框下次弹出准备
        },
        showFilterPop () {
            this.filterBy = true
            this.overLayFlag = true
        },
        closePop () {
            this.filterBy = false
            this.overLayFlag = false
        },
        setPriceFilter (index) {
            this.priceChecked = index
            this.page = 1
            this.getGoodsList()
        }
    }
}
</script>
