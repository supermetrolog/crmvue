<template>
    <div class="user-picker-element" :class="{ disabled: !this.user.selected }">
        <div class="user-picker-element__avatar">
            <VLazyImage :src="avatar" :alt="user.userProfile.full_name" />
        </div>
        <div class="user-picker-element__description">
            <p class="user-picker-element__username">{{ user.userProfile.medium_name }}</p>
            <p class="user-picker-element__role">{{ role }}</p>
        </div>
    </div>
</template>
<script>
import VLazyImage from 'v-lazy-image';
import { RoleList } from '@/const/const';

export default {
    name: 'UserPickerElement',
    components: { VLazyImage },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    computed: {
        avatar() {
            return this.$url.api.getUserAvatar(this.user.userProfile.avatar);
        },
        role() {
            return RoleList[this.user.role] || 'Должность не установлена';
        }
    }
};
</script>
