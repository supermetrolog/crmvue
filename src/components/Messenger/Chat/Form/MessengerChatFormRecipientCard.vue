<template>
    <div class="messenger-chat-form-recipient-card hover-actions-trigger">
        <div class="messenger-chat-form-recipient-card__header">
            <div class="messenger-chat-form-recipient-card__description">
                <p class="messenger-chat-form-recipient-card__username">{{ contact.full_name }}</p>
                <p v-if="contact.position">
                    {{ position }}
                </p>
                <p v-else-if="contact.positionUnknown">Должность неизвестна</p>
                <p v-else class="messenger-warning messenger-warning--simple">
                    Должность не заполнена!
                </p>
            </div>
            <div
                v-if="contact.good"
                class="messenger-chat-form-recipient-card__icon messenger-chat-form-recipient-card__friendly"
            >
                <i class="fa-solid fa-face-smile"></i>
            </div>
            <div
                v-if="contact.warning"
                v-tippy="contact.warning_why_comment"
                class="messenger-chat-form-recipient-card__icon messenger-chat-form-recipient-card__warning"
            >
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
        </div>
        <div class="messenger-chat-form-recipient-card__body">
            <p class="messenger-chat-form-recipient-card__subtitle">Телефоны:</p>
            <ul v-if="contact.phones?.length" class="messenger-chat-form-recipient-card__list">
                <li
                    v-for="phone in contact.phones"
                    :key="phone.id"
                    class="messenger-chat-form-recipient-card__item"
                    :class="{ active: phone.isMain }"
                >
                    <a :href="'tel:' + phone.phone">
                        {{ phone.phone }}
                    </a>
                </li>
            </ul>
            <p v-else class="messenger-warning">Не заполнено</p>
            <p class="messenger-chat-form-recipient-card__subtitle">Emails:</p>
            <ul v-if="contact.emails?.length" class="messenger-chat-form-recipient-card__list">
                <li
                    v-for="email in contact.emails"
                    :key="email.id"
                    class="messenger-chat-form-recipient-card__item"
                    :class="{ active: email.isMain }"
                >
                    <a :href="'mailto:' + email.email">
                        {{ email.email }}
                    </a>
                </li>
            </ul>
            <p v-else class="messenger-warning">Не заполнено</p>
            <p class="messenger-chat-form-recipient-card__subtitle">Сайты:</p>
            <ul v-if="contact.websites?.length" class="messenger-chat-form-recipient-card__list">
                <li
                    v-for="website in contact.websites"
                    :key="website.id"
                    class="messenger-chat-form-recipient-card__item"
                    :class="{ active: website.isMain }"
                >
                    <a :href="$formatter.toCorrectUrl(website.website)" target="_blank">
                        {{ website.website }}
                    </a>
                </li>
            </ul>
            <p v-else class="messenger-warning">Не заполнено</p>
        </div>
        <HoverActions>
            <HoverActionsButton
                @click="updateContactModalIsVisible = true"
                :disabled="contact.general"
                label="Редактировать"
            >
                <i class="fa-solid fa-pen"></i>
            </HoverActionsButton>
        </HoverActions>
        <teleport to="body">
            <FormCompanyContact
                v-if="updateContactModalIsVisible"
                @close="updateContactModalIsVisible = false"
                :formdata="contact"
            />
        </teleport>
    </div>
</template>
<script setup>
import HoverActions from '@/components/common/HoverActions/HoverActions.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import { computed, ref } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';

const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const updateContactModalIsVisible = ref(false);

const position = computed(() => contactOptions.position[props.contact.position]);
</script>
