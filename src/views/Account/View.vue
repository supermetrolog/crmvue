<template>
    <div v-if="currentUser" class="account-main">
        <div class="container-fluid">
            <div class="row">
                <div class="offset-xl-1 col-lg-3 col-xl-2">
                    <div class="account-view__panel">
                        <Button @click="logout" class="w-100 mb-2" danger>Выйти из аккаунта</Button>
                        <div class="account-section">
                            <AccountCard class="account-view__card" :user="currentUser" />
                            <div class="account-view__nav">
                                <router-link class="account-view__link" :to="{ name: 'profile' }">
                                    Профиль
                                </router-link>
                                <router-link
                                    class="account-view__link"
                                    :to="{ name: 'profile-edit' }"
                                >
                                    Редактировать профиль
                                </router-link>
                                <router-link
                                    class="account-view__link"
                                    :to="{ name: 'profile-edit-password' }"
                                >
                                    Сменить пароль
                                </router-link>
                                <router-link
                                    class="account-view__link"
                                    :to="{ name: 'profile-sessions' }"
                                >
                                    Безопасность
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="account-view__content">
                        <router-view v-slot="{ Component }">
                            <AnimationTransition :speed="0.2">
                                <component :is="Component"></component>
                            </AnimationTransition>
                        </router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import AccountCard from '@/components/Account/AccountCard.vue';
import { useStore } from 'vuex';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Button from '@/components/common/Button.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const { confirm } = useConfirm();
const store = useStore();
const router = useRouter();

const currentUser = computed(() => store.getters.THIS_USER);

async function logout() {
    const confirmed = await confirm(
        'Выйти из аккаунта',
        'Вы уверены, что хотите выйти из аккаунта?'
    );

    if (confirmed) {
        await store.dispatch('logout');
        await router.push({ name: 'login' });
    }
}
</script>
