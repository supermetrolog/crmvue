<template>
    <div class="progress">
        <div class="progress-bar" :style="{ height: height + 'px' }">
            <div class="percent" :style="{ width: percent + '%' }" :class="percentClass"></div>
        </div>
        <div class="progress-label">
            <p>{{ percent }}% {{ title }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Progress',
    props: {
        percent: {
            type: Number
        },
        title: {
            type: String,
            default: 'Заполнения'
        },
        height: {
            type: Number,
            default: 4
        }
    },
    computed: {
        percentClass() {
            if (this.percent < 30) {
                return 'bg-danger';
            } else if (this.percent < 60) {
                return 'bg-warning';
            } else if (this.percent < 90) {
                return 'bg-primary';
            } else {
                return 'bg-success';
            }
        }
    }
};
</script>

<style></style>
