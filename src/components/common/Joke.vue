<template>
    <div @click="clickArea" class="joke">
        <h3 v-if="text.length" :class="{ 'text-danger': clickCount > 2 && clickCount != 5 }">
            {{ text }}
        </h3>
        <img v-if="clickCount == lastCount" :src="src" />
    </div>
</template>

<script>
export default {
    name: 'Joke',
    data() {
        return {
            clickCount: 0,
            lastCount: 6,
            alreadyClicked: false,
            array: ['', 'Сюда нельзя нажимать!', 'Не нажимай!', 'Хватит!', 'Не делай этого!', 'Ты уверен?', '']
        };
    },
    computed: {
        text() {
            return this.array[this.clickCount];
        },
        src() {
            return this.$url.api.getImage('joke.gif');
        }
    },
    methods: {
        clickArea() {
            if (this.clickCount == this.lastCount) {
                this.clickCount = 0;
                this.alreadyClicked = true;
            } else {
                if (!this.alreadyClicked) {
                    this.clickCount++;
                }
            }
        }
    }
};
</script>

<style></style>