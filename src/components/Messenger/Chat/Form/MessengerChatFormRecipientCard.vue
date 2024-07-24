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
                @click="updateContactModalVisible = true"
                :disabled="contact.general"
                label="Редактировать"
            >
                <i class="fa-solid fa-pen"></i>
            </HoverActionsButton>
            <HoverActionsButton
                @click="reportContact({ contact })"
                label="Не актуален"
                :disabled="contact.not_actual"
            >
                <i class="fa-solid fa-user-slash"></i>
            </HoverActionsButton>
        </HoverActions>
        <FormCompanyContact
            v-if="updateContactModalVisible"
            @close="updateContactModalVisible = false"
            :formdata="contact"
        />
    </div>
</template>
<script>
import { entityOptions } from '@/const/options/options';
import HoverActions from '@/components/common/HoverActions/HoverActions.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { mapActions } from 'vuex';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';

export default {
    name: 'MessengerChatFormRecipientCard',
    components: { FormCompanyContact, HoverActionsButton, HoverActions },
    props: {
        contact: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            updateContactModalVisible: false
        };
    },
    computed: {
        position() {
            return entityOptions.contact.position[this.contact.position];
        }
    },
    methods: {
        ...mapActions({ reportContact: 'Messenger/reportContact' })
        // TODO: Сделать обновление контакта в интерфейсе: или запрашивать данные о компании еще раз или отправить данные из формы и АККУРАТНО заменить различия в текущем на данные из формы
    }
};
</script>
