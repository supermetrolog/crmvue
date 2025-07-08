<template>
    <div class="center">
        <div class="error">
            <div class="number">{{ code.toString().at(0) }}</div>
            <div class="illustration">
                <div class="circle"></div>
                <div class="clip">
                    <div class="paper">
                        <div class="face">
                            <div class="eyes">
                                <div class="eye eye-left"></div>
                                <div class="eye eye-right"></div>
                            </div>
                            <div class="cheeks cheeks-left"></div>
                            <div class="cheeks cheeks-right"></div>
                            <div class="mouth"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="number">{{ code.toString().at(-1) }}</div>
        </div>
        <div class="text">
            <slot name="label">
                <p>{{ label }}</p>
            </slot>
        </div>
        <div v-if="$slots.actions" class="d-flex gap-2 mt-2">
            <slot name="actions" />
        </div>
    </div>
</template>
<script setup lang="ts">
const { code = 404, label = 'Страница не найдена' } = defineProps<{
    label?: string;
    code?: number;
}>();
</script>
<style lang="scss">
.center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.error {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
}

.number {
    font-weight: 900;
    font-size: 15rem;
    line-height: 1;
}

.illustration {
    position: relative;
    width: 12.2rem;
    margin: 0 2.1rem;
}

.circle {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 12.2rem;
    height: 11.4rem;
    border-radius: 50%;
    background-color: #02305b;
}

.clip {
    position: absolute;
    bottom: 0.3rem;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    width: 12.5rem;
    height: 13rem;
    border-radius: 0 0 50% 50%;
}

.paper {
    position: absolute;
    bottom: -0.3rem;
    left: 50%;
    transform: translateX(-50%);
    width: 9.2rem;
    height: 12.4rem;
    border: 0.3rem solid #02305b;
    background-color: #fff;
    border-radius: 0.8rem;

    &::before {
        content: '';
        position: absolute;
        top: -0.7rem;
        right: -0.7rem;
        width: 1.4rem;
        height: 1rem;
        background-color: #fff;
        border-bottom: 0.3rem solid #02305b;
        transform: rotate(45deg);
    }
}

.face {
    position: relative;
    margin-top: 2.3rem;
}

.eyes {
    position: absolute;
    top: 0;
    left: 2.4rem;
    width: 4.6rem;
    height: 0.8rem;
}

.eye {
    position: absolute;
    bottom: 0;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background-color: #02305b;
    animation-name: eye;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;

    &-left {
        left: 0;
    }

    &-right {
        right: 0;
    }
}

@keyframes eye {
    0% {
        height: 0.8rem;
    }
    50% {
        height: 0.8rem;
    }
    52% {
        height: 0.1rem;
    }
    54% {
        height: 0.8rem;
    }
    100% {
        height: 0.8rem;
    }
}

.cheeks {
    position: absolute;
    top: 1.6rem;
    width: 1rem;
    height: 0.2rem;
    border-radius: 50%;
    background-color: #990806;

    &-left {
        left: 1.4rem;
    }

    &-right {
        right: 1.4rem;
    }
}

.mouth {
    position: absolute;
    top: 3.1rem;
    left: 50%;
    width: 1.6rem;
    height: 0.2rem;
    border-radius: 0.1rem;
    transform: translateX(-50%);
    background-color: #02305b;
}

.text {
    margin-top: 2rem;
    font-weight: 500;
    color: #02305b;
    font-size: 2rem;
}
</style>
