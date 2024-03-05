<template>
    <div class="accordion-simple">
        <div @click="isOpen = !isOpen" class="accordion-simple__header" :class="{ active: isOpen }">
            <slot name="title">
                <span v-if="title">{{ title }}</span>
            </slot>
            <i v-if="isOpen" class="fas fa-angle-up"></i>
            <i
                v-else
                v-tippy="`Нажмите, чтобы посмотреть содержимое`"
                class="fas fa-angle-down"
            ></i>
        </div>

        <div class="accordion-simple__body" :class="{ active: isOpen }">
            <div class="accordion-simple__wrapper">
                <slot name="body"></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AccordionSimple',
    props: {
        title: String,
        default: null
    },
    data() {
        return {
            isOpen: false
        };
    }
};
</script>
