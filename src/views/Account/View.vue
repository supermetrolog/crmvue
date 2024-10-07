<template>
    <div v-if="THIS_USER" class="account-main">
        <div class="container-fluid">
            <div class="row">
                <div class="offset-xl-1 col-lg-3 col-xl-2">
                    <div class="account-view__panel">
                        <Button @click="logout" class="w-100 mb-2" danger>Выйти из аккаунта</Button>
                        <div class="account-section">
                            <AccountCard class="account-view__card" :user="THIS_USER" />
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

<script>
import AccountCard from '@/components/Account/AccountCard.vue';
import { mapGetters } from 'vuex';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import Button from '@/components/common/Button.vue';
import { useConfirm } from '@/composables/useConfirm.js';

export default {
    name: 'AccountMain',
    components: { Button, AnimationTransition, AccountCard },
    setup() {
        const { confirm } = useConfirm();
        return { confirm };
    },
    computed: {
        ...mapGetters(['THIS_USER'])
    },
    methods: {
        async logout() {
            const confirmed = await this.confirm('Вы уверены, что хотите выйти из аккаунта?');
            if (confirmed) {
                await this.$store.dispatch('LOGOUT');
                return this.$router.push('/login');
            }
        }
    }
};
</script>
