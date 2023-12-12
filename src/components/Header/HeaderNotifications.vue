<template>
    <div class="comments-panel">
        <div class="comments-panel__content" :class="{ loading: loader }">
            <div class="row header no-gutters">
                <div class="col-6 title text-left align-self-center">
                    <p>Уведомления</p>
                </div>
                <div class="col-6 readAll text-right align-self-center">
                    <a href="#" @click.prevent="viewedAll"> прочитать все </a>
                </div>
            </div>
            <Loader class="center" v-if="loader" />
            <div class="row no-gutters" v-if="!loader">
                <div class="col-12">
                    <div class="comments-item">
                        <div class="new header">
                            <p class="text-left title">новые уведомления</p>
                        </div>
                        <div class="new header mt-4 mb-5" v-if="!newNotification.length">
                            <p class="text-center title no-data">нет новых</p>
                        </div>
                        <HeaderNotificationsItem
                            v-for="notification of newNotification"
                            :key="notification.id"
                            :notification="notification"
                            isNew
                        />
                        <div class="old header" v-if="oldNotification.length">
                            <p class="title text-left">просмотренные</p>
                        </div>
                        <HeaderNotificationsItem
                            v-for="notification of oldNotification"
                            :key="notification.id"
                            :notification="notification"
                        />
                        <div class="col-12 text-center">
                            <Pagination :pagination="NOTIFICATIONS_PAGINATION" @next="next" />
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
// import Pagination from "@/components/common/Pagination.vue";
import { mapActions, mapGetters } from "vuex";
import Loader from "@/components/common/Loader.vue";
import HeaderNotificationsItem from "@/components/Header/HeaderNotificationsItem.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
    name: "Notifications",
    components: {
        Pagination,
        HeaderNotificationsItem,
      Loader

    },
    data() {
        return {
            loader: false,
            query: null,
        };
    },
    computed: {
        ...mapGetters(["NOTIFICATIONS_PAGINATION", "THIS_USER", "NOTIFICATIONS"]),
        oldNotification() {
            return this.NOTIFICATIONS.filter(
                (item) => item.status != 0 && item.status != -1 && item.status != 3
            );
        },
        newNotification() {
            return this.NOTIFICATIONS.filter(
                (item) => item.status == 0 || item.status == -1 || item.status == 3
            );
        },
    },
    methods: {
        ...mapActions([
            "FETCH_NOTIFICATIONS",
            "RESET_NOTIFICATIONS",
            "SEARCH_NOTIFICATIONS",
            "VIEWED_NOT_COUNT_NOTIFICATIONS",
            "VIEWED_ALL_NOTIFICATIONS",
            "FETCH_NOTIF_COUNT_POOL",
        ]),
        init() {
            this.query = {
                page: 1,
                consultant_id: this.THIS_USER.id,
            };
        },
        async next(page) {
            this.query.page = page;
            await this.SEARCH_NOTIFICATIONS({ query: this.query, concat: true });
            this.FETCH_NOTIF_COUNT_POOL(this.THIS_USER.id);
        },
        async viewedAll() {
            this.loader = true;
            await this.VIEWED_ALL_NOTIFICATIONS(this.THIS_USER.id);
            this.RESET_NOTIFICATIONS();
            await this.next(1);
            this.loader = false;
        },
    },
    async mounted() {
        this.init();
        this.loader = true;
        await this.SEARCH_NOTIFICATIONS({ query: this.query, concat: true });
        this.FETCH_NOTIF_COUNT_POOL(this.THIS_USER.id);

        this.loader = false;
    },
    beforeUnmount() {
        this.RESET_NOTIFICATIONS();
        this.VIEWED_NOT_COUNT_NOTIFICATIONS(this.THIS_USER.id);
    },
};
</script>

<style>
</style>