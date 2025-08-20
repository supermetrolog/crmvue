<template>
    <div class="messenger-quiz-contact" :class="{ active, disabled, completed }">
        <div class="messenger-quiz-contact__info">
            <p class="messenger-quiz-contact__username">{{ contact.full_name }}</p>
            <template v-if="full">
                <p v-if="!isCompanyContact" class="messenger-quiz-contact__staff">
                    <ContactPositionField
                        v-if="contact.position_id || contact.position_unknown"
                        :contact
                        show-warning
                        warning-class="color-error"
                    />
                </p>
                <div class="messenger-quiz-contact__badges mt-2">
                    <div
                        v-if="scheduled"
                        class="messenger-quiz-contact__badge messenger-quiz-contact__badge--danger"
                    >
                        <i class="fa-solid fa-phone mr-1" />
                        <span>{{ scheduledDate }}</span>
                    </div>
                    <div
                        v-if="mostCallable"
                        class="messenger-quiz-contact__badge messenger-quiz-contact__badge--success"
                    >
                        Больше всего звонков
                    </div>
                    <div
                        v-if="contact.isMain"
                        class="messenger-quiz-contact__badge messenger-quiz-contact__badge--warning"
                    >
                        Главный контакт
                    </div>
                    <div v-if="contact.good" class="messenger-quiz-contact__badge">
                        Хорошие взаимоотношения
                    </div>
                    <div v-if="contact.faceToFaceMeeting" class="messenger-quiz-contact__badge">
                        Личная встреча
                    </div>
                    <div
                        v-if="contact.warning"
                        class="messenger-quiz-contact__warning messenger-quiz-contact__badge messenger-quiz-contact__badge--danger"
                    >
                        <span>Внимание!</span>
                        <span v-if="contact.warning_why_comment?.length" class="ml-1">
                            {{ contact.warning_why_comment }}
                        </span>
                    </div>
                </div>
            </template>
        </div>
        <div
            v-if="!isCompanyContact && editable"
            class="messenger-quiz-contact__actions align-items-center"
        >
            <UiDropdownActions
                label="Действия над контактом"
                small
                button-class="messenger-quiz-contact__button"
                icon="fa-solid fa-ellipsis-vertical"
                color="light"
                :title="contact.full_name"
                :badge="contact.comments?.length"
                badge-color="warning"
            >
                <template #menu>
                    <UiDropdownActionsGroup>
                        <UiDropdownActionsButton
                            @handle="$emit('edit')"
                            icon="fa-solid fa-pen"
                            label="Редактировать"
                        />
                        <UiDropdownActionsButton
                            @handle="$emit('schedule-call')"
                            :icon="scheduled ? 'fa-solid fa-check' : 'fa-solid fa-phone'"
                            :label="scheduled ? 'Звонок запланирован' : 'Запланировать звонок'"
                            :disabled="!!scheduled"
                        />
                    </UiDropdownActionsGroup>
                    <UiDropdownActionsGroup>
                        <UiDropdownActionsButton
                            @handle="$emit('show-comments')"
                            icon="fa-solid fa-comments"
                            :label="`Открыть комментарии (${contact.comments?.length ?? 0})`"
                        />
                    </UiDropdownActionsGroup>
                </template>
            </UiDropdownActions>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import dayjs from 'dayjs';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import ContactPositionField from '@/components/Contact/ContactPositionField.vue';

defineEmits(['edit', 'show-comments', 'schedule-call']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    active: Boolean,
    disabled: Boolean,
    completed: Boolean,
    editable: Boolean,
    full: Boolean,
    mostCallable: Boolean,
    scheduled: Object
});

// form

const isCompanyContact = computed(
    () => props.contact?.type === contactOptions.typeStatement.GENERAL
);

const scheduledDate = computed(() => dayjs(props.scheduled).format('DD.MM.YYYY'));
</script>
