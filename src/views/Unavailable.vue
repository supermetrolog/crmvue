<template>
    <div class="unavailable-page">
        <div class="row">
            <div class="col-12 text-center">
                <ErrorCard label="Сервис временно недоступен" :code="503">
                    <template #actions>
                        <UiButton
                            @click="reload"
                            icon="fa-solid fa-rotate"
                            big
                            bolder
                            :loading="isReloading"
                        >
                            Перезагрузить
                        </UiButton>
                    </template>
                </ErrorCard>
            </div>
        </div>
    </div>
</template>

<script setup>
import ErrorCard from '@/components/common/ErrorCard.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { captureException } from '@sentry/vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const isReloading = ref(false);

const store = useStore();
const router = useRouter();

async function reload() {
    isReloading.value = true;

    try {
        const initialized = await store.dispatch('initialize');

        if (initialized) {
            await router.push({ name: 'root' });
        } else {
            void store.dispatch('destroy');
            await router.push({ name: 'login' });
        }
    } catch (error) {
        captureException(error);
    } finally {
        isReloading.value = false;
    }
}
</script>
<style lang="scss" scoped>
.unavailable-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #02305b;
}
</style>
