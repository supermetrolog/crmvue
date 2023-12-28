<template>
    <div class="row item no-gutters">
        <div class="col-2 avatar text-center">
            <i v-if="isSystemNotification" :class="notificationTypeList[notification.type]"></i>
            <div v-else class="image-circle">
                <img
                    src="@/assets/image/5.jpg"
                    alt="Аватарка"
                    title="Винидиктов Алексей Владимирович"
                    class="img-center"
                />
            </div>
        </div>
        <div class="col-10 message text-left">
            <p class="title">
                {{ notification.title }}
                <small class="time">{{ notification.created_at }}</small>
            </p>
            <p class="text" v-html="notification.body"></p>
            <HeaderNotificationsActions :type="notification.type" :status="notification.status" />
        </div>
        <span v-if="isNew" class="badge"> new </span>
    </div>
</template>

<script>
import { NotificationTypeList } from '@/const/const.js';
import HeaderNotificationsActions from '@/components/Header/HeaderNotificationsActions.vue';

export default {
    name: 'HeaderNotificationsItem',
    components: {
        HeaderNotificationsActions
    },
    props: {
        notification: {
            type: Object,
            default: null
        },
        isNew: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        notificationTypeList: () => NotificationTypeList,
        isSystemNotification() {
            return this.notification.type < Object.values(this.notificationTypeList).length
                ? true
                : false;
        }
    },
    methods: {}
};
</script>

<style></style>
