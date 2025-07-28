<template>
    <div>
        <CompanyTableItemSummaryComment
            v-if="company.comment"
            @show-all="$emit('show-comments')"
            :message="company.comment.message"
            :total="company.comments_count"
        />
        <CompanyTableItemSummaryNote
            v-if="!readOnly"
            @show-all="$emit('show-notes')"
            @create="$emit('create-note', $event)"
            @update="$emit('update-note', $event)"
            @delete="$emit('delete-note')"
            :note="company.note"
            :total="company.notes_count"
            class="mt-2"
        />
        <CompanyTableItemSummaryPinnedMessage
            v-if="company.pinned_message"
            @unpin="$emit('unpin-message')"
            :message="company.pinned_message.message"
            class="mt-2"
        />
    </div>
</template>

<script setup>
import CompanyTableItemSummaryComment from '@/components/Company/Table/Summary/CompanyTableItemSummaryComment.vue';
import CompanyTableItemSummaryNote from '@/components/Company/Table/Summary/CompanyTableItemSummaryNote.vue';
import CompanyTableItemSummaryPinnedMessage from '@/components/Company/Table/Summary/CompanyTableItemSummaryPinnedMessage.vue';

defineEmits([
    'show-comments',
    'show-notes',
    'create-note',
    'update-note',
    'delete-note',
    'unpin-message'
]);

defineProps({
    company: {
        type: Object,
        required: true
    },
    readOnly: Boolean
});
</script>
