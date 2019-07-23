<template>
    <section class="bread">
        <div class="bread-wrap">
            <nav class="">
                <a href="/">
                    Home
                </a>
                <slot></slot>
                <!-- <slot name="goods"></slot> 插槽  根据名字插值，GoodsList中Bread组件内使用slot="goods"的标签会插该处 -->
                <!-- <slot name="list"></slot> -->
            </nav>
        </div>
    </section>
</template>
<style>
  .bread{
      height: 45px;
      line-height: 45px;
      background-color: #f0f0f0;
  }
  .bread-wrap{
      padding: 0 10px;
      font-size: 14px;
      color: #a1a1a1;
  }
  .bread-wrap a{
    position: relative;
      margin-right: 20px;
  }
  .bread-wrap a:after{
      position: absolute;
      top: 0px;
      content:'/';
      height:20px;
      line-height: 20px;
  }
  .bread-wrap span{
      color:#d1434a;
  }
</style>
<script>
export default {
    data () {
            return {
                msg: 'hello vue'
            }
        }
}
</script>
