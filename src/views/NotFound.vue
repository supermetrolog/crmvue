<template>
    <div class="not-found-page">
        <div class="row">
            <div class="col-12 text-center">
                <ErrorCard>
                    <template #actions>
                        <UiButton @click="toHome" icon="fa-solid fa-house" big bolder>
                            Перейти на главную
                        </UiButton>
                    </template>
                </ErrorCard>
            </div>
        </div>
    </div>
</template>

<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import ErrorCard from '@/components/common/ErrorCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function toHome() {
    router.push({ name: 'root' });
}
</script>

<style lang="scss" scoped>
.not-found-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #02305b;
}
</style>
