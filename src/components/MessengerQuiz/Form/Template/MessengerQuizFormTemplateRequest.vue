<template>
    <div
        class="survey-form-object-preview-offer"
        :class="{
            success: hasSuccessStatus || needEditing,
            danger: hasFailStatus,
            warning: needEditing
        }"
    >
        <div class="survey-form-object-preview-offer__wrapper">
            <RequestRowCard :request>
                <template #menu>
                    <UiDropdownActionsButton
                        @handle="$emit('create-task')"
                        label="Создать задачу"
                        icon="fa-solid fa-bolt"
                        disabled
                    />
                    <UiDropdownActionsButton
                        @handle="$emit('edit')"
                        label="Редактировать"
                        icon="fa-solid fa-pen"
                    />
                </template>
                <template #actions>
                    <div v-if="editable" class="survey-form-object-preview-offer__actions">
                        <UiButtonIcon
                            @click="selectAnswer(ANSWER.SUCCESS)"
                            :active="hasSuccessStatus"
                            icon="fa-solid fa-thumbs-up"
                            label="Без изменений"
                        />
                        <UiButtonIcon
                            @click="selectAnswer(ANSWER.FAIL)"
                            :active="hasFailStatus"
                            icon="fa-solid fa-thumbs-down"
                            label="Больше не актуально"
                            class="survey-form-object-preview-offer__action-negative"
                        />
                        <UiButtonIcon
                            @click="selectAnswer(ANSWER.EDIT)"
                            :active="needEditing"
                            icon="fa-solid fa-pen"
                            label="Внести изменения"
                            class="survey-form-object-preview-offer__action-warning"
                        />
                    </div>
                </template>
            </RequestRowCard>
            <AnimationTransition v-if="editable" :speed="0.5">
                <VueEditor
                    v-if="needEditing || hasFailStatus"
                    v-model="modelValue.description"
                    autofocus
                    :min-height="60"
                    :max-height="200"
                    :toolbar="false"
                    placeholder="Что необходимо изменить или добавить?"
                    class="survey-form-object-preview-offer__editor mt-2 font-weight-bold"
                >
                    <template #after>
                        <p
                            :class="hasFailStatus ? 'text-danger' : 'text-warning'"
                            class="survey-form-object-preview-offer__editor-helper"
                        >
                            {{ editorHelper }}
                        </p>
                    </template>
                </VueEditor>
            </AnimationTransition>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import RequestRowCard from '@/components/RequestRowCard/RequestRowCard.vue';
import { useAuth } from '@/composables/useAuth.js';
import { useStore } from 'vuex';

defineEmits(['edit']);

defineProps({
    request: {
        type: Object,
        required: true
    },
    disabled: Boolean,
    editable: Boolean
});

const form = defineModel({ type: Object });

// form

const ANSWER = {
    SUCCESS: 1,
    FAIL: 2,
    EDIT: 3
};

function selectAnswer(value) {
    if (Number(form.value.answer) === value) {
        form.value.answer = 0;
    } else {
        form.value.answer = value;
    }
}

const hasSuccessStatus = computed(() => Number(form.value.answer) === ANSWER.SUCCESS);
const hasFailStatus = computed(() => Number(form.value.answer) === ANSWER.FAIL);
const needEditing = computed(() => Number(form.value.answer) === ANSWER.EDIT);

const { currentUser } = useAuth();
const store = useStore();
const moderator = computed(() => store.getters.moderator);

const editorHelper = computed(() => {
    const postfix = `${currentUser.value.userProfile.short_name} > ${moderator.value?.short_name ?? 'Менеджер'}`;

    if (Number(form.value.answer) === ANSWER.EDIT) return `Редактирование: ${postfix}`;
    return `Не актуально: ${postfix}`;
});
</script>
