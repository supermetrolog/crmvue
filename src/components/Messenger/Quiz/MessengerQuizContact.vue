<template>
    <div class="messenger-quiz-contact" :class="{ active: active, disabled: disabled }">
        <div class="messenger-quiz-contact__info">
            <p class="messenger-quiz-contact__username">
                <i
                    v-if="contact.faceToFaceMeeting"
                    v-tippy="'Была личная (очная) встреча'"
                    class="fa-solid fa-street-view mr-1"
                />
                <i
                    v-if="contact.good"
                    v-tippy="'Хорошие взаимоотношения'"
                    class="fa-regular fa-face-smile-beam mr-1"
                />
                <i
                    v-if="contact.isMain"
                    v-tippy="'Основной контакт'"
                    class="fa-solid fa-crown mr-1"
                />
                <span v-tippy="contact.full_name">{{ contact.full_name }}</span>
            </p>
            <p
                v-if="hasFullnameWarning && !isCompanyContact"
                class="messenger-quiz-contact__error color-error"
            >
                [ФИО заполнено не полностью]
            </p>
            <p v-if="!isCompanyContact" class="messenger-quiz-contact__staff">
                <span v-if="contact.position_unknown">Должность неизвестна..</span>
                <span v-else-if="contact.position">
                    {{ position }}
                </span>
                <span v-else class="color-error">Должность не заполнена!</span>
            </p>
            <p class="messenger-quiz-contact__email">
                <template v-if="mainEmail">
                    <i v-tippy="'Основной Email'" class="fa-solid fa-crown mr-1"></i>
                    <span>{{ mainEmail.email }}</span>
                </template>
                <span v-else-if="contact.emails?.length">
                    {{ contact.emails[0].email }}
                </span>
                <span v-else class="messenger-quiz-contact__error color-error">
                    Email не заполнен!
                </span>
            </p>
            <div class="messenger-quiz-contact__contacts">
                <span v-if="mainPhone">
                    <i v-tippy="'Основной телефон'" class="fa-solid fa-crown mr-1"></i>
                    <PhoneNumber
                        :phone="mainPhone"
                        :contact="contact"
                        clickable
                        :hidden="!active"
                        class="messenger-quiz-contact__phone"
                    />
                </span>
                <PhoneNumber
                    v-else-if="contact.phones?.length"
                    :phone="contact.phones[0]"
                    :contact="contact"
                    clickable
                    :hidden="!active"
                    class="messenger-quiz-contact__phone"
                />
                <span v-else class="messenger-quiz-contact__error color-error">
                    Телефон не заполнен!
                </span>
                <template v-if="contact.phones?.length > 1">
                    <Tippy interactive>
                        <template #default>
                            <span class="messenger-quiz-contact__helper">
                                +{{ contact.phones?.length - 1 }}
                                <i class="fa-regular fa-circle-question"></i>
                            </span>
                        </template>
                        <template #content>
                            <div class="messenger-quiz-contact__column">
                                <p class="mb-1">Все телефоны контакта:</p>
                                <p v-for="phone in contact.phones" :key="phone.id">
                                    <i
                                        v-if="phone.isMain"
                                        v-tippy="'Основной телефон'"
                                        class="fa-solid fa-crown mr-1"
                                    ></i>
                                    <PhoneNumber :phone="phone" clickable :hidden="!active" />
                                </p>
                            </div>
                        </template>
                    </Tippy>
                </template>
            </div>
            <div
                v-if="contact.warning"
                v-tippy="contact.warning_why_comment"
                class="messenger-quiz-contact__warning"
            >
                <span>Внимание! {{ contact.warning_why_comment }}</span>
            </div>
        </div>
        <div v-if="!isCompanyContact" class="messenger-quiz-contact__actions">
            <HoverActionsButton
                @click="$emit('show-comments')"
                small
                label="Посмотреть комментарии"
                class="messenger-quiz-contact__button position-relative"
            >
                <span
                    class="messenger-quiz-contact__comments"
                    :class="{
                        'dashboard-bg-gray': contact.comments?.length === 0,
                        'dashboard-bg-danger': contact.comments?.length > 0
                    }"
                >
                    {{ contact.comments?.length }}
                </span>
                <i class="fa-solid fa-comments"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="$emit('edit')"
                small
                label="Редактировать контакт"
                class="messenger-quiz-contact__button"
            >
                <i class="fa-solid fa-pen" />
            </HoverActionsButton>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { Tippy } from 'vue-tippy';

defineEmits(['edit', 'delete', 'move', 'show-comments', 'schedule-call']);
const props = defineProps({
    contact: Object,
    loading: Boolean,
    active: Boolean,
    disabled: Boolean
});

const position = computed(() => contactOptions.position[props.contact.position]);

const mainPhone = computed(() => props.contact.phones.find(phone => phone.isMain));
const mainEmail = computed(() => props.contact.emails.find(email => email.isMain));

const isCompanyContact = computed(
    () => props.contact.type === contactOptions.typeStatement.GENERAL
);

const hasFullnameWarning = computed(() => {
    return !props.contact.last_name || !props.contact.first_name || !props.contact.middle_name;
});
</script>
