<template>
    <div class="company-table-item-summary-survey">
        <Loader v-if="company.last_survey?.isLoading || isUpdating" small />
        <div v-if="company.last_survey" class="company-table-item-summary-survey__header">
            <div class="company-table-item-summary-survey__title">
                <span class="ml-1">#{{ company.last_survey.id }}.</span>
                <span v-if="company.last_survey.contact" class="ml-1">
                    <span>Общение с контактом</span>
                    <Tippy interactive :interactive-border="40">
                        <template #default>
                            <span class="company-table-item-summary-survey__contact mx-1">
                                {{ contactName }}
                            </span>
                        </template>
                        <template #content>
                            <ContactCard :contact="company.last_survey.contact" />
                        </template>
                    </Tippy>
                    <span>({{ contactPosition }})</span>
                </span>
                <Tippy
                    v-if="callsLabelShouldBeVisible"
                    :delay="300"
                    interactive
                    :interactive-border="30"
                    placement="left-start"
                    :max-width="1000"
                    class="ml-1"
                >
                    <span class="company-table-item-summary-survey__calls">
                        {{ callsPluralLabel }}
                    </span>
                    <template #content>
                        <div class="company-table-item-summary-survey__calls-list">
                            <CallInlineCard
                                v-for="call in company.last_survey.calls"
                                :key="call.id"
                                :call="call"
                                read-only
                                class="company-table-item-summary-survey__call"
                            />
                        </div>
                    </template>
                </Tippy>
            </div>
            <UiDropdownActions
                v-if="!readOnly"
                label="Действия"
                :title="`Опрос #${company.last_survey.id}`"
                small
            >
                <template #menu>
                    <UiDropdownActionsGroup>
                        <UiDropdownActionsButton
                            @handle="$emit('open-preview')"
                            label="Посмотреть опрос"
                            icon="fa-solid fa-eye"
                        />
                    </UiDropdownActionsGroup>
                    <UiDropdownActionsGroup v-if="surveyCommentCanBeEdit">
                        <UiDropdownActionsButton
                            v-if="company.last_survey.comment"
                            @handle="editComment"
                            label="Изменить комментарий"
                            icon="fa-solid fa-pen"
                        />
                        <UiDropdownActionsButton
                            v-else
                            @handle="editComment"
                            label="Добавить комментарий"
                            icon="fa-solid fa-thumbtack"
                        />
                    </UiDropdownActionsGroup>
                </template>
            </UiDropdownActions>
        </div>
        <div class="company-table-item-summary-survey__body">
            <CompanyTableItemSummarySurveyComment
                v-if="company.last_survey?.comment || commentIsEditing"
                @expanded="isExpanded = true"
                @hidden="isExpanded = false"
                @cancel="commentIsEditing = false"
                @update="updateComment"
                @delete="deleteComment"
                :edit-mode="commentIsEditing && !readOnly"
                :survey="company.last_survey"
            />
            <div
                v-if="!company.last_survey?.comment && !commentIsEditing && !readOnly"
                class="d-flex gap-2 align-items-center mt-2"
            >
                <UiButton
                    @click="$emit('create-pinned-message')"
                    icon="fa-solid fa-plus"
                    color="transparent"
                    small
                    class="company-table-item-summary-survey__button"
                >
                    Добавить комментарий
                </UiButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import { contactOptions } from '@/const/options/contact.options.js';
import CompanyTableItemSummarySurveyComment from '@/components/Company/Table/CompanyTableItemSummarySurveyComment.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAuth } from '@/composables/useAuth.js';
import Loader from '@/components/common/Loader.vue';
import api from '@/api/api.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import CallInlineCard from '@/components/Call/InlineCard/CallInlineCard.vue';
import { plural } from '@/utils/plural.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

const emit = defineEmits(['open-preview', 'edit-comment', 'create-pinned-message']);

const props = defineProps({
    company: {
        type: Object,
        required: true
    },
    readOnly: Boolean
});

const contactName = computed(() => {
    return getContactFullName(props.company.last_survey.contact);
});

const contactPosition = computed(() => {
    if (props.company.last_survey.contact.position_unknown) return 'Должность неизвестна';
    return contactOptions.position[props.company.last_survey.contact.position];
});

const { currentUserId } = useAuth();

const surveyCommentCanBeEdit = computed(
    () => props.company.last_survey.user_id === currentUserId.value
);

// expand

const isExpanded = ref(false);

// edit comment

const commentIsEditing = ref(false);

function editComment() {
    if (props.company.last_survey?.comment) {
        commentIsEditing.value = true;
    } else {
        emit('create-pinned-message');
    }
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

// calls

const hasMainContact = computed(() => isNotNullish(props.company.last_survey.contact_id));

const callsLabelShouldBeVisible = computed(
    () => props.company.last_survey.calls.length > 1 || !hasMainContact.value
);

const callsPluralLabel = computed(() =>
    plural(
        props.company.last_survey.calls.length - (hasMainContact.value ? 1 : 0),
        '+ еще %d звонок',
        '+ еще %d звонка',
        '+ еще %d звонков'
    )
);
</script>
