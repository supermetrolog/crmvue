<template>
    <div class="company-contact-item__comments position-relative">
        <Loader v-if="isDeleting" small label="Удаление комментария" />
        <div class="col-12">
            <div v-if="comments.length">
                <div ref="commentsList" class="company-contact-item__comments-list">
                    <ContactComment
                        v-for="comment in comments"
                        :key="comment.id"
                        @edit="editComment(comment)"
                        @delete="deleteComment(comment.id)"
                        :comment="comment"
                        editable
                    />
                </div>
                <hr />
            </div>
            <EmptyLabel v-else>Комментарии отсутствуют</EmptyLabel>
        </div>
        <div class="col-12 mt-2">
            <UiTextarea
                v-model="comment"
                auto-height
                :min-height="50"
                :max-height="150"
                class="company-contact-item__textarea"
            />
            <div class="d-flex gap-1 flex-wrap mt-1">
                <UiButton
                    @click="createComment"
                    color="success-light"
                    icon="fa-solid fa-paper-plane"
                    small
                    class="mt-1"
                    :disabled="!comment?.length"
                >
                    Отправить
                </UiButton>
                <UiButton
                    @click="comment = null"
                    color="light"
                    icon="fa-solid fa-trash"
                    small
                    class="mt-1"
                    :disabled="!comment?.length"
                >
                    Очистить
                </UiButton>
            </div>
        </div>
        <UiModal
            v-model:visible="modalIsVisible"
            :width="500"
            :title="`Редактирование комментария #${editingComment?.id}`"
        >
            <UiTextarea
                v-model="editingComment.comment"
                :v="v$.comment"
                required
                auto-height
                :min-height="50"
                :max-height="150"
                label="Комментарий"
            />
            <template #actions>
                <UiButton
                    @click="updateComment"
                    :loading="isUpdating"
                    :disabled="!editingComment.comment?.length"
                    color="success-light"
                    icon="fa-solid fa-check"
                >
                    Сохранить
                </UiButton>
                <UiButton @click="cancelUpdate" color="light" icon="fa-solid fa-ban">
                    Отмена
                </UiButton>
            </template>
        </UiModal>
    </div>
</template>

<script setup>
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import EmptyLabel from '@/components/common/EmptyLabel.vue';
import { nextTick, onMounted, ref, toRef, useTemplateRef } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import ContactComment from '@/components/ContactComment/ContactComment.vue';
import { useAsync } from '@/composables/useAsync';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import Loader from '@/components/common/Loader.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useValidation } from '@/composables/useValidation.js';
import { helpers, minLength, required } from '@vuelidate/validators';

const emit = defineEmits(['create', 'deleted', 'updated']);
const props = defineProps({
    comments: {
        type: Array,
        required: true
    }
});

// actions

const comment = ref(null);

async function createComment() {
    emit('create', comment.value);
    comment.value = '';
}

const notify = useNotify();

const { isLoading: isDeleting, execute: deleteComment } = useAsync(api.contactComment.delete, {
    onFetchResponse: ({ args }) => {
        notify.success('Комментарий успешно удален.');
        emit('deleted', args[0]);
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить комментарий',
        message:
            'Вы уверены, что хотите удалить комментарий? Удаленный комментарий нельзя восстановить.',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const modalIsVisible = ref(false);
const editingComment = ref(null);

function editComment(comment) {
    editingComment.value = { ...comment };
    modalIsVisible.value = true;
}

const isUpdating = ref(false);

const { validate, v$, resetValidation } = useValidation(
    {
        comment: {
            required: helpers.withMessage('Заполните комментарий', required),
            minLength: helpers.withMessage(
                'Комментарий должен быть не менее 3 символов',
                minLength(3)
            )
        }
    },
    { comment: toRef(() => editingComment.value?.comment) }
);

async function updateComment() {
    const isValid = await validate();
    if (!isValid) return;

    isUpdating.value = true;

    try {
        const updatedComment = await api.contactComment.update(editingComment.value.id, {
            comment: editingComment.value.comment
        });

        emit('updated', updatedComment);

        notify.success('Комментарий успешно обновлен.');
    } finally {
        isUpdating.value = false;
    }
}

function cancelUpdate() {
    resetValidation();
    modalIsVisible.value = false;
    editingComment.value = null;
}

// list

const commentsList = useTemplateRef('commentsList');

function scrollToEnd() {
    nextTick(() => {
        commentsList.value.scrollTop = commentsList.value.scrollHeight;
    });
}

onMounted(() => {
    if (props.comments.length) scrollToEnd();
});
</script>
