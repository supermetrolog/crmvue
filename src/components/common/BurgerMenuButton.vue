<template>
    <div @click="onClick" class="BurgerMenuButton">
        <div
            class="bar1"
            :class="{ change_bar1: isActive }"
            :style="{
                width: this.burgerSize.width,
                height: this.burgerSize.height,
                margin: this.burgerSize.margin
            }"
        ></div>
        <div
            class="bar2"
            :class="{ change_bar2: isActive }"
            :style="{
                width: this.burgerSize.width,
                height: this.burgerSize.height,
                margin: this.burgerSize.margin
            }"
        ></div>
        <div
            class="bar3"
            :class="{ change_bar3: isActive }"
            :style="{
                width: this.burgerSize.width,
                height: this.burgerSize.height,
                margin: this.burgerSize.margin
            }"
        ></div>
    </div>
</template>

<script>
export default {
    name: 'BurgerMenuButton',
    props: {
        size: {
            type: String,
            default: 'medium'
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        burgerSize() {
            let result = {
                width: '',
                height: '',
                margin: ''
            };
            if (this.size === 'small') {
                result.width = '15px';
                result.height = '3px';
                result.margin = '2px 0';
            }
            if (this.size === 'medium') {
                result.width = '35px';
                result.height = '5px';
                result.margin = '6px 0';
            }
            if (this.size === 'big') {
                result.width = '45px';
                result.height = '7px';
                result.margin = '6px 0';
            }
            return result;
        }
    },
    methods: {
        onClick() {
            this.$emit('onClick');
        }
    }
};
</script>

<style lang="scss">
.BurgerMenuButton {
    padding: 5%;
    text-align: center;

    &:hover {
        cursor: pointer;
    }

    .bar1,
    .bar2,
    .bar3 {
        background-color: #11698e;
        transition: 0.4s;
    }

    .change_bar1 {
        -webkit-transform: rotate(-45deg) translate(-9px, 6px);
        transform: rotate(-45deg) translate(-9px, 6px);
        width: 46px;
    }

    .change_bar2 {
        opacity: 0;
    }

    .change_bar3 {
        -webkit-transform: rotate(45deg) translate(-9px, -7px);
        transform: rotate(45deg) translate(-9px, -7px);
        width: 46px;
    }
}
</style>