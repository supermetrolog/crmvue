<template>
    <teleport to="body">
        <FormCompanyDeal v-if="isFormDealVisible" @close="isFormDealVisible = false" />
    </teleport>
    <ul class="nav-list horizontal">
        <li ref="calls" class="nav-item notification" :class="{ active: callsVisible }">
            <a @click.prevent="clickCalls" class="nav-link">
                <div class="nav-link__content" :class="{ 'current-call-exist': CURRENT_CALLS.length }">
                    <i class="header__icon fa-solid fa-phone"></i>
                    <span
                        v-if="CALLS_COUNT != 0"
                        class="badge badge-danger"
                        :class="{ 'badge-info': CURRENT_CALLS.length }"
                    >
                        {{ +CALLS_COUNT }}
                    </span>
                </div>
            </a>
            <AnimationTransition>
                <HeaderCalls v-if="callsVisible" />
            </AnimationTransition>
        </li>

        <li ref="notification" class="nav-item notification" :class="{ active: notificationsVisible }">
            <a @click.prevent="clickNotification" class="nav-link">
                <div class="nav-link__content">
                    <i class="header__icon fa-regular fa-bell"></i>
                    <span v-if="NOTIFICATIONS_COUNT != 0" class="badge badge-danger">
                        {{ NOTIFICATIONS_COUNT }}
                    </span>
                </div>
            </a>
            <AnimationTransition>
                <HeaderNotifications v-if="notificationsVisible" />
            </AnimationTransition>
        </li>
    </ul>
</template>
<script>
import FormCompanyDeal from '@/components/Forms/Company/FormCompanyDeal.vue';
import HeaderCalls from '@/components/Header/HeaderCalls.vue';
import HeaderNotifications from '@/components/Header/HeaderNotifications.vue';
import { mapActions, mapGetters } from 'vuex';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

export default {
    name: 'HeaderFunctions',
    components: {
        AnimationTransition,
        FormCompanyDeal,
        HeaderCalls,
        HeaderNotifications
    },
    data() {
        return {
            isFormDealVisible: false,
            callsVisible: false,
            notificationsVisible: false
        };
    },
    computed: {
        ...mapGetters(['NOTIFICATIONS_COUNT', 'CALLS_COUNT', 'CURRENT_CALLS'])
    },
    methods: {
        ...mapActions(['FETCH_NOTIFICATIONS_COUNT', 'FETCH_CALLS_COUNT']),
        clickNotification() {
            this.notificationsVisible = !this.notificationsVisible;
        },
        clickCalls() {
            this.callsVisible = !this.callsVisible;
        },
        close(e) {
            if (!this.$refs.notification.contains(e.target)) {
                this.notificationsVisible = false;
            }
            if (!this.$refs.calls.contains(e.target)) {
                this.callsVisible = false;
            }
        }
    },
    mounted() {
        this.FETCH_NOTIFICATIONS_COUNT();
        this.FETCH_CALLS_COUNT();
        document.addEventListener('click', this.close);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.close);
    }
};
</script>
