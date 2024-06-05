<template>
    <div class="comments-panel">
        <div class="comments-panel__content" :class="{ loading: isLoading }">
            <div class="row heading no-gutters">
                <div class="col-6 title text-left align-self-center">
                    <p>Уведомления</p>
                </div>
                <div class="col-6 readAll text-right align-self-center">
                    <a @click.prevent="viewedAll" href="#"> прочитать все </a>
                </div>
            </div>
            <Spinner v-if="isLoading" class="absolute-center" />
            <!--            <Loader v-if="isLoading" class="center" />-->
            <div v-else class="row no-gutters">
                <div class="col-12">
                    <div class="comments-item">
                        <div class="new heading">
                            <p class="text-left title">Новые уведомления</p>
                        </div>
                        <div v-if="!newNotification.length" class="new heading mt-4 mb-5">
                            <p class="text-center title no-data">нет новых</p>
                        </div>
                        <HeaderNotificationsItem
                            v-for="notification of newNotification"
                            :key="notification.id"
                            :notification="notification"
                            is-new
                        />
                        <div v-if="oldNotification.length" class="old heading">
                            <p class="title text-left">Просмотренные</p>
                        </div>
                        <HeaderNotificationsItem
                            v-for="notification of oldNotification"
                            :key="notification.id"
                            :notification="notification"
                        />
                        <div class="col-12 text-center mb-2">
                            <Pagination @next="next" :pagination="NOTIFICATIONS_PAGINATION" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//Передать (модератор) Передать админу только с комментарием - передавать с комментарием всем - Там же переать админу
//Для брокеров только кнопка ОТКАЗ и причина отказа - комментарий (галочки - далбаеб, пидорас, не берет трубку)
//Статистика отказов и причина
import { mapActions, mapGetters } from 'vuex';
import HeaderNotificationsItem from '@/components/Header/HeaderNotificationsItem.vue';
import Pagination from '@/components/common/Pagination/Pagination.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Spinner from '@/components/common/Spinner.vue';

export default {
    name: 'Notifications',
    components: {
        Spinner,
        Pagination,
        HeaderNotificationsItem
    },
    setup() {
        const { isLoading } = useDelayedLoader();
        return { isLoading };
    },
    data() {
        return {
            page: 1
        };
    },
    computed: {
        ...mapGetters(['NOTIFICATIONS_PAGINATION', 'THIS_USER', 'NOTIFICATIONS']),
        oldNotification() {
            return this.NOTIFICATIONS.filter(
                item => item.status !== 0 && item.status !== -1 && item.status !== 3
            );
        },
        newNotification() {
            return this.NOTIFICATIONS.filter(
                item => item.status === 0 || item.status === -1 || item.status === 3
            );
        }
    },
    methods: {
        ...mapActions([
            'RESET_NOTIFICATIONS',
            'SEARCH_NOTIFICATIONS',
            'VIEWED_NOT_COUNT_NOTIFICATIONS',
            'VIEWED_ALL_NOTIFICATIONS',
            'FETCH_NOTIF_COUNT_POOL'
        ]),
        async next(page) {
            this.page = page;
            await this.fetchNotifications();
        },
        async fetchNotifications(withLoader = false) {
            if (withLoader) this.isLoading = true;

            await this.SEARCH_NOTIFICATIONS({
                query: { consultant_id: this.THIS_USER.id, page: this.page },
                concat: true
            });
            this.FETCH_NOTIF_COUNT_POOL();

            if (withLoader) this.isLoading = false;
        },
        async viewedAll() {
            this.isLoading = true;

            await this.VIEWED_ALL_NOTIFICATIONS();
            this.RESET_NOTIFICATIONS();
            await this.next(1);

            this.isLoading = false;
        }
    },
    created() {
        this.fetchNotifications(true);
    },
    beforeUnmount() {
        this.RESET_NOTIFICATIONS();
        this.VIEWED_NOT_COUNT_NOTIFICATIONS();
    }
};
</script>

<style></style>
