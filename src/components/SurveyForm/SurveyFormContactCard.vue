<template>
    <div
        class="messenger-quiz-contact"
        :class="{ active, disabled, completed, main: contact.isMain }"
    >
        <div class="messenger-quiz-contact__info">
            <p class="messenger-quiz-contact__username">
                <UiTooltipIcon
                    v-if="contact.isMain"
                    tooltip="Основной контакт"
                    icon="fa-solid fa-crown"
                    class="mr-1 text-warning"
                />
                <UiTooltipIcon
                    v-if="contact.faceToFaceMeeting"
                    tooltip="Была личная (очная) встреча"
                    icon="fa-solid fa-street-view"
                    class="mr-1 text-success_alt messenger-quiz-contact__icon"
                />
                <UiTooltipIcon
                    v-if="contact.good"
                    tooltip="Хорошие взаимоотношения"
                    icon="fa-regular fa-face-smile-beam"
                    class="mr-1 text-success_alt messenger-quiz-contact__icon"
                />
                <UiTooltip :tooltip="contact.full_name">{{ contact.full_name }}</UiTooltip>
            </p>
            <p v-if="!isCompanyContact" class="messenger-quiz-contact__staff">
                <span v-if="contact.position_unknown">Должность неизвестна..</span>
                <span v-else-if="contact.position">
                    {{ position }}
                </span>
                <span v-else class="color-error">Должность не заполнена!</span>
            </p>
            <p
                class="messenger-quiz-contact__calls"
                :class="contact.calls?.length > 0 ? 'text-primary' : 'color-danger'"
            >
                <span class="font-weight-semi">{{ callsPluralLabel }}</span>
                <span v-if="contact.calls?.length">, последний {{ lastCallDate }}</span>
            </p>
        </div>
        <div
            v-if="!isCompanyContact && editable"
            class="messenger-quiz-contact__actions align-items-center"
        >
            <UiButtonIcon
                @click.stop="$emit('show-comments')"
                small
                label="Посмотреть комментарии"
                class="messenger-quiz-contact__button"
                color="light"
                :badge="contact.comments?.length"
                badge-color="danger"
                icon="fa-solid fa-comments"
            />
            <UiDropdownActions
                label="Действия над контактом"
                small
                button-class="messenger-quiz-contact__button"
                icon="fa-solid fa-ellipsis-vertical"
                color="light"
            >
                <template #menu>
                    <UiDropdownActionsButton
                        @handle="$emit('edit')"
                        icon="fa-solid fa-pen"
                        label="Редактировать"
                    />
                    <UiDropdownActionsButton
                        @handle="$emit('create-task')"
                        icon="fa-solid fa-bolt"
                        label="Создать задачу"
                    />
                    <UiDropdownActionsButton
                        @handle="$emit('show-comments')"
                        icon="fa-solid fa-comments"
                        :label="`Открыть комментарии (${contact.comments?.length ?? 0})`"
                    />
                </template>
            </UiDropdownActions>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import UiTooltip from '@/components/common/UI/UiTooltip.vue';
import { plural } from '@/utils/plural.js';
import { toBeautifulDateFormat } from '@/utils/formatters/date.js';
import UiDropdownActions from '@/components/common/UI/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/UiDropdownActionsButton.vue';

defineEmits(['edit', 'show-comments', 'create-task']);
const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    active: Boolean,
    disabled: Boolean,
    completed: Boolean,
    editable: Boolean
});

// form

const position = computed(() => contactOptions.position[props.contact.position]);

const isCompanyContact = computed(
    () => props.contact.type === contactOptions.typeStatement.GENERAL
);

const callsPluralLabel = computed(() => {
    const count = props.contact.calls?.length ?? 0;

    if (count > 0) {
        return plural(count, '%d звонок', '%d звонка', '%d звонков');
    }

    return 'Нет звонков';
});

const lastCallDate = computed(() => {
    const lastCall = props.contact.calls[0];

    return toBeautifulDateFormat(lastCall.created_at);
});
</script>
