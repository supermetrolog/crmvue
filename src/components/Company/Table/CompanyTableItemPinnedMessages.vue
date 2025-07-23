<template>
    <div>
        <CompanyTableItemSummaryComment
            @expanded="isExpanded = true"
            @hidden="isExpanded = false"
            @cancel="commentIsEditing = false"
            @update="updateComment"
            @delete="deleteComment"
            :edit-mode="commentIsEditing && !readOnly"
            :message="company.pinned_messages[0].message"
            :company
        />
        <UiButton
            v-if="company.pinned_messages.length > 1"
            @click="modalIsVisible = true"
            small
            class="mt-2 fs-2"
            color="transparent"
        >
            {{ messagesCountLabel }}
        </UiButton>
        <UiModal
            v-model:visible="modalIsVisible"
            :title="`Комментарии (${company.pinned_messages.length}) | ${company.full_name}`"
            :width="600"
        >
            <div class="d-flex flex-column gap-2">
                <MessengerDialogLastMessage
                    v-for="message in company.pinned_messages"
                    :key="message.id"
                    @click="$emit('show-message', message.message)"
                    :last-message="message.message"
                    class="company-table-item__message w-100"
                    column
                />
            </div>
        </UiModal>
    </div>
</template>

<script setup>
import MessengerDialogLastMessage from '@/components/Messenger/Dialog/MessengerDialogLastMessage.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { computed, ref } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { plural } from '@/utils/plural.js';
import CompanyTableItemSummaryComment from '@/components/Company/Table/CompanyTableItemSummaryComment.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import api from '@/api/api.js';
import { useConfirm } from '@/composables/useConfirm.js';

const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    readOnly: Boolean
});

const modalIsVisible = ref(false);

const messagesCountLabel = computed(() =>
    plural(
        props.company.pinned_messages.length - 1,
        '+ еще %d комментарий',
        '+ еще %d комментария',
        '+ еще %d комментариев'
    )
);

// edit

const isExpanded = ref(false);

// edit comment

const commentIsEditing = ref(false);

function editComment() {
    commentIsEditing.value = true;
}

const isUpdating = ref(false);
const notify = useNotify();

async function updateComment(comment) {
    try {
        isUpdating.value = true;
        await api.survey.update(props.company.last_survey.id, {
            comment,
            contact_id: props.company.last_survey.contact_id
        });

        Object.assign(props.company.last_survey, { comment });
        commentIsEditing.value = false;

        notify.success('Комментарий успешно изменен');
    } finally {
        isUpdating.value = false;
    }
}

const { confirm } = useConfirm();

async function deleteComment() {
    const confirmed = await confirm(
        'Удалить комментарии',
        'Вы действительно хотите безвозвратно удалить комментарии?'
    );

    if (!confirmed) return;

    try {
        isUpdating.value = true;
        await api.survey.update(props.company.last_survey.id, { comment: null });

        Object.assign(props.company.last_survey, { comment: null });

        commentIsEditing.value = false;

        notify.success('Комментарий успешно удален');
    } finally {
        isUpdating.value = false;
    }
}
</script>
