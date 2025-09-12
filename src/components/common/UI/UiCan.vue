<template>
    <slot v-if="hasAccess" />
</template>
<script setup>
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';

const props = defineProps({
    moderator: Boolean,
    admin: Boolean,
    owner: Boolean,
    moderatorOrHigher: Boolean,
    ownerOrHigher: Boolean
});

const {
    currentUserIsModeratorOrHigher,
    currentUserIsAdmin,
    currentUserIsModerator,
    currentUserIsDirector
} = useAuth();

const hasAccess = computed(() => {
    if (props.moderatorOrHigher) return currentUserIsModeratorOrHigher.value;
    if (props.ownerOrHigher) return currentUserIsDirector.value || currentUserIsAdmin.value;

    return (
        (props.admin && currentUserIsAdmin.value) ||
        (props.moderator && currentUserIsModerator.value) ||
        (props.owner && currentUserIsDirector.value)
    );
});
</script>
