<template>
    <div
        v-tippy="`Нажмите, чтобы ${$accordionIsOpened ? 'скрыть' : 'посмотреть'} содержимое`"
        class="accordion-simple__icon"
    >
        <i v-if="$accordionIsOpened" class="fas fa-angle-up"></i>
        <i v-else class="fas fa-angle-down"></i>
    </div>
</template>
<script>
export default {
    name: 'AccordionSimpleTriggerIcon',
    inject: ['$accordionIsOpened']
};
</script>
