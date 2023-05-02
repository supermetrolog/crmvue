<template>
    <div class="BasicArrow">
        <div class="arrow arrow-top"></div>
        <div class="BasicArrow-content">
            <slot></slot>
        </div>
        <div class="arrow arrow-bottom"></div>
    </div>
</template>

<script>
export default {
    name: 'BasicArrow',
    props: {
        height: {
            type: String || Number,
            default: '50px'
        },
        width: {
            type: String || Number,
            default: '100px'
        },
        color: {
            type: String,
            default: 'black'
        }
    }
}
</script>

<style lang="scss" scoped>
$step_height: 34px;
$basic_step_color: black;

.BasicArrow {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    height: $step_height;
    width: 100px;
    background-color: transparent;

    &-content {
        position: absolute;
    }

    &::before {
        content: '';
        height: $step_height;
        width: calc($step_height / 2);
        background-color: $basic_step_color;
        position: absolute;
        z-index: 2;
        left: 0;
    }
}

.arrow {
    width: 100%;
    height: 50%;
    background-color: black;

    &-top {
        transform: skew(45deg, 0deg);
    }

    &-bottom {
        transform: skew(-45deg, 0deg);
    }
}
</style>