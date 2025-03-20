<template>
    <div class="messenger-quiz-contact" :class="{ active: active, disabled: disabled }">
        <div class="messenger-quiz-contact__info">
            <p class="messenger-quiz-contact__username">
                <UiTooltipIcon
                    v-if="contact.faceToFaceMeeting"
                    tooltip="Была личная (очная) встреча"
                    icon="fa-solid fa-street-view"
                    class="mr-1"
                />
                <UiTooltipIcon
                    v-if="contact.good"
                    tooltip="Хорошие взаимоотношения"
                    icon="fa-regular fa-face-smile-beam"
                    class="mr-1"
                />
                <UiTooltipIcon
                    v-if="contact.isMain"
                    tooltip="Основной контакт"
                    icon="fa-solid fa-crown"
                    class="mr-1"
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
            <p class="messenger-quiz-contact__email">
                <template v-if="mainEmail">
                    <UiTooltipIcon tooltip="Основной Email" icon="fa-solid fa-crown" class="mr-1" />
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
                    <UiTooltipIcon tooltip="Основной Email" icon="fa-solid fa-crown" class="mr-1" />
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
                                    <UiTooltipIcon
                                        v-if="phone.isMain"
                                        tooltip="Основной телефон"
                                        icon="fa-solid fa-crown"
                                        class="mr-1"
                                    />
                                    <PhoneNumber :phone="phone" clickable :hidden="!active" />
                                </p>
                            </div>
                        </template>
                    </Tippy>
                </template>
            </div>
            <UiTooltip
                v-if="contact.warning"
                :tooltip="contact.warning_why_comment"
                as="div"
                class="messenger-quiz-contact__warning"
            >
                <span>Внимание! {{ contact.warning_why_comment }}</span>
            </UiTooltip>
        </div>
        <div v-if="!isCompanyContact" class="messenger-quiz-contact__actions">
            <UiButtonIcon
                @click="$emit('show-comments')"
                small
                label="Посмотреть комментарии"
                class="messenger-quiz-contact__button position-relative"
                color="light"
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
            </UiButtonIcon>
            <UiButtonIcon
                @click="$emit('edit')"
                small
                label="Редактировать контакт"
                class="messenger-quiz-contact__button"
                color="light"
            >
                <i class="fa-solid fa-pen" />
            </UiButtonIcon>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { Tippy } from 'vue-tippy';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import UiTooltip from '@/components/common/UI/UiTooltip.vue';

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
</script>
