<template>
    <div class="messenger-quiz-inline-dependent">
        <div class="messenger-quiz-inline-dependent__relation">
            <p class="messenger-quiz-inline-dependent__label mb-1">Опрос по чату:</p>
            <MessengerDialogObject
                v-if="survey.chatMember.model_type === messenger.dialogTypes.OBJECT"
                @click="$emit('to-chat')"
                class="messenger-quiz-inline-dependent__chat"
                :model="survey.chatMember.model"
                short
                motion-slider
                show-company
            />
            <MessengerDialogCompany
                v-else
                @click="$emit('to-chat')"
                class="messenger-quiz-inline-dependent__chat"
                :model="survey.chatMember.model"
                short
            />
        </div>
        <div class="messenger-quiz-inline-dependent__description">
            <p class="messenger-quiz-inline-dependent__label mb-1">Информация об опросе:</p>
            <div v-if="survey.user" class="messenger-quiz-inline-dependent__row">
                <span class="messenger-quiz-inline-dependent__name">Звонивший:</span>
                <Avatar :size="25" :src="survey.user.userProfile.avatar" />
                <span>{{ survey.user.userProfile.medium_name }}</span>
            </div>
            <div class="messenger-quiz-inline-dependent__row">
                <span class="messenger-quiz-inline-dependent__name">Контакт:</span>
                <span>{{ contactName }}</span>
            </div>
            <div class="messenger-quiz-inline-dependent__row">
                <span class="messenger-quiz-inline-dependent__name">Дата звонка:</span>
                <span>{{ createdAt }}</span>
            </div>
            <div class="messenger-quiz-inline-dependent__actions mt-2">
                <MessengerButton @click="$emit('show')" class="small" color="light">
                    <i class="fa-solid fa-file-lines" />
                    <span>Подробнее</span>
                </MessengerButton>
                <MessengerButton
                    v-if="canBeEdit"
                    @click="$emit('edit')"
                    class="small"
                    color="light"
                >
                    <i class="fa-solid fa-pen" />
                    <span>{{ editButtonLabel }}</span>
                </MessengerButton>
            </div>
        </div>
    </div>
</template>
<script setup>
import Avatar from '@/components/common/Avatar.vue';
import { computed, toRef } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.js';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import MessengerDialogObject from '@/components/Messenger/Dialog/Object/MessengerDialogObject.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
import { messenger } from '@/const/messenger.js';
import MessengerDialogCompany from '@/components/Messenger/Dialog/Company/MessengerDialogCompany.vue';

defineEmits(['show', 'to-chat', 'edit']);
const props = defineProps({
    survey: {
        type: Object,
        required: true
    }
});

const createdAt = computed(() => toDateFormat(props.survey.created_at, 'DD.MM.YY'));
const contactName = computed(() => getContactFullName(props.survey.contact));

const { canBeEdit, remainingTimeLabel } = useSurveyEditing(toRef(() => props.survey));

const editButtonLabel = computed(() => {
    if (remainingTimeLabel.value) return `Редактировать (осталось ${remainingTimeLabel.value})`;
    return 'Редактировать';
});
</script>
