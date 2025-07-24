<template>
    <div class="contact-comment">
        <Avatar
            :src="comment.author.userProfile.avatar"
            class="contact-comment__avatar"
            :size="30"
        />
        <div class="contact-comment__content">
            <div class="contact-comment__header">
                <span class="contact-comment__username">
                    {{ comment.author.userProfile.medium_name }}
                </span>
                <span class="contact-comment__dot mx-1">·</span>
                <span class="contact-comment__date">{{ createdAt }}</span>
                <template v-if="editable && (canBeEdit || canBeDeleted)">
                    <span class="contact-comment__dot mx-1">·</span>
                    <UiDropdownActions>
                        <template #trigger>
                            <UiButton mini color="light" icon="fa-solid fa-gear">Действия</UiButton>
                        </template>
                        <template #menu>
                            <UiDropdownActionsButton
                                v-if="canBeEdit"
                                @handle="$emit('edit')"
                                label="Редактировать"
                                icon="fa-solid fa-pen"
                            />
                            <UiDropdownActionsButton
                                v-if="canBeDeleted"
                                @handle="$emit('delete')"
                                label="Удалить"
                                icon="fa-solid fa-trash"
                            />
                        </template>
                    </UiDropdownActions>
                </template>
            </div>
            <div ref="messageElement" class="contact-comment__message"></div>
        </div>
    </div>
</template>
<script setup>
import { computed, toRef, useTemplateRef } from 'vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date.ts';
import Avatar from '@/components/common/Avatar.vue';
import { useLinkify } from '@/composables/useLinkify.js';
import { useAuth } from '@/composables/useAuth.js';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['delete', 'edit']);
const props = defineProps({
    comment: {
        type: Object,
        required: true
    },
    editable: Boolean
});

const createdAt = computed(() => toBeautifulDateFormat(props.comment.created_at));

const { currentUserId, currentUserIsModeratorOrHigher } = useAuth();

const canBeDeleted = computed(
    () => currentUserIsModeratorOrHigher.value || props.comment.author_id === currentUserId.value
);

const canBeEdit = computed(
    () => currentUserIsModeratorOrHigher.value || props.comment.author_id === currentUserId.value
);

const messageElement = useTemplateRef('messageElement');

useLinkify(toRef(props.comment, 'comment'), messageElement);
</script>
