<template>
    <div class="user-picker-element" :class="{ disabled: !this.user.selected }">
        <Avatar :src="user.userProfile.avatar" size="50" />
        <div class="user-picker-element__description">
            <p class="user-picker-element__username">{{ user.userProfile.medium_name }}</p>
            <p class="user-picker-element__role">{{ role }}</p>
        </div>
    </div>
</template>
<script>
import { RoleList } from '@/const/const';
import Avatar from '@/components/common/Avatar.vue';

export default {
    name: 'UserPickerElement',
    components: { Avatar },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    computed: {
        role() {
            return RoleList[this.user.role] || 'Должность не установлена';
        }
    }
};
</script>
