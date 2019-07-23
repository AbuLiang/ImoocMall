<template>
    <div>
        <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':modalShow}">
            <div class="md-modal-inner">
                <div class="md-top">
                    <button class="md-close" @click="closeModal">Close</button>
                </div>
                <div class="md-content">
                    <div class="confirm-tips">
                        <slot name="message"></slot>
                    </div>
                    <div class="btn-wrap">
                        <slot name="btnGroup"></slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-if="modalShow" @click="closeModal"></div>  <!--遮罩层, 这里可以改变父组件传来的modalShow，但无法传递到父组件-->
    </div>
</template>
<script>
export default {
    props: { // 类型检查模式
        modalShow: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    data () {
        return {
            msg: ''
        }
    },
    methods: {
        closeModal () {
            this.$emit('close')
        }
    }
}
</script>
