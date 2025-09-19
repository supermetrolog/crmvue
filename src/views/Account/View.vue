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
                                <AccountMenuItem
                                    v-for="link in menu"
                                    :key="link.name"
                                    :to="link.to"
                                    :label="link.label"
                                    :icon="link.icon"
                                />
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

<script setup lang="ts">
import AccountCard from '@/components/Account/AccountCard.vue';
import { useStore } from 'vuex';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Button from '@/components/common/Button.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AccountMenuItem from '@/components/Account/AccountMenuItem.vue';
import { TRoutesNames } from '@/router/router';

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

type ProfileMenuItem = {
    name: string;
    label: string;
    to: {
        name: TRoutesNames;
    };
    icon: string;
};

const menu = [
    {
        name: 'profile',
        label: 'Профиль',
        to: { name: 'profile' },
        icon: 'fa-solid fa-user-astronaut'
    },
    {
        name: 'integrations',
        label: 'Интеграции',
        to: { name: 'profile.integrations' },
        icon: 'fa-solid fa-fire text-danger'
    },
    {
        name: 'edit',
        label: 'Редактировать профиль',
        to: { name: 'profile.edit' },
        icon: 'fa-solid fa-edit'
    },
    {
        name: 'password',
        label: 'Сменить пароль',
        to: { name: 'profile.edit-password' },
        icon: 'fa-solid fa-key'
    },
    {
        name: 'sessions',
        label: 'Безопасность',
        to: { name: 'profile.sessions' },
        icon: 'fa-solid fa-shield-halved'
    }
] as const satisfies readonly ProfileMenuItem[];
</script>
