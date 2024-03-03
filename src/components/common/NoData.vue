<template>
    <div class="no-data">
        <div class="no-data-container">
            <h1 class="text-center"><span>нет данных</span></h1>
            <img @mousedown.prevent :src="src" alt="нет данных" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'NoData',
    computed: {
        randomNumber() {
            return Math.floor(Math.random() * (52 - 1 + 1)) + 1;
        },
        src() {
            return this.$url.api.getImage(this.randomNumber + '.jpg');
        }
    }
};
</script>

<style></style>
