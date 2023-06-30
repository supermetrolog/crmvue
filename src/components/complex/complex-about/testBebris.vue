<template>
    <div class="animated-content" :style="{ height: height }">
        <Tabs @changed="onTabClick">
            <Tab name="Один">
                <div class="ObjectAbout-info">
                    <div class="content"></div>
                </div>
            </Tab>
            <Tab name="Два">
                <div class="ObjectAbout-info">
                    <div class="content"></div>
                </div>
            </Tab>
            <Tab name="Три">
                <div class="ObjectAbout-info">
                    <div class="content"></div>
                </div>
            </Tab>
        </Tabs>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            height: 'auto', // начальная высота контента
            transitionDuration: '0.3s' // время длительности анимации
        }
    },
    methods: {
        onTabClick() {
            this.$nextTick(() => {
                const contentEl = this.$el.querySelector('.content')
                if (contentEl) {
                    // Вычисляем высоту контента и устанавливаем новую высоту
                    this.height = `${contentEl.offsetHeight}px`
                }
            })
        }
    },
    mounted() {
        // Устанавливаем длительность анимации для элемента
        this.$el.style.transition = `height ${this.transitionDuration} ease-out`
    }
}
</script>
  
<style scoped>
.animated-content {
    overflow: hidden;
    /* скрываем контент, который выходит за пределы высоты */
}
</style>