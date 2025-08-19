<template>
    <div class="survey-form-contact-form-letter">
        <p class="font-weight-semi">Тема: {{ letter.letter!.subject }}</p>
        <hr />
        <div class="d-flex gap-2 align-items-center">
            <Avatar :src="letter.letter!.user!.userProfile.avatar" :size="30" />
            <div class="d-flex flex-column">
                <p class="fs-2">
                    <span>
                        {{ letter.letter!.user!.userProfile.medium_name }}
                    </span>
                    <span class="mx-1 text-grey">-</span>
                    <span class="text-grey">{{ letter.letter!.sender_email }}</span>
                    <span class="mx-1 text-grey">-</span>
                    <span class="text-grey">{{ createdAt }}</span>
                    <span class="mx-1 text-grey">-</span>
                    <span v-if="letter.answers.length" class="text-success">
                        <i class="fa-solid fa-check mr-1" />
                        <span>Ответ получен</span>
                    </span>
                    <span v-else class="text-danger">
                        <i class="fa-solid fa-xmark mr-1" />
                        <span>Ответ не получен</span>
                    </span>
                </p>
                <p class="fs-2 text-grey">
                    <span>кому: </span>
                    <span>{{ letter.email }}</span>
                </p>
            </div>
            <UiButton
                v-if="letter.answers.length"
                @click="answersModalIsVisible = true"
                mini
                class="survey-form-contact-form-letter__button"
                color="light"
                icon="fa-solid fa-reply"
            >
                Просмотр
                {{ letter.answers.length > 1 ? `ответов ${letter.answers.length}` : 'ответа' }}
            </UiButton>
        </div>
        <hr />
        <div class="fs-2" v-html="letter.letter?.body"></div>
        <teleport to="body">
            <UiModal
                v-model:visible="answersModalIsVisible"
                :title="`Ответы на письмо (${letter.answers.length})`"
                :width="1000"
            >
                <div class="d-flex flex-column gap-2">
                    <SurveyFormContactFormSendingLetterAnswer
                        v-for="answer in letter.answers"
                        :key="answer.id"
                        :answer="answer"
                    />
                </div>
            </UiModal>
        </teleport>
    </div>
</template>
<script setup lang="ts">
import { LetterContact } from '@/types/contact/contact';
import Avatar from '@/components/common/Avatar.vue';
import { toBeautifulDateFormat } from '@/utils/formatters/date';
import { computed, ref } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import SurveyFormContactFormSendingLetterAnswer from '@/components/SurveyForm/SurveyFormContactFormSendingLetterAnswer.vue';

const props = defineProps<{
    letter: LetterContact;
}>();

const createdAt = computed(() => toBeautifulDateFormat(props.letter.letter!.created_at));

const answersModalIsVisible = ref(false);
</script>
