<template>
    <div class="contact-card">
        <ContactCardStatus v-if="!isGeneral" :contact="contact" class="mb-1" />
        <p class="contact-card__name">
            <template v-if="!isGeneral">
                <ContactCardAddition
                    v-if="contact.isMain"
                    class="mr-1"
                    icon="fa-solid fa-crown"
                    label="Главный контакт компании"
                />
                <ContactCardAddition
                    v-if="contact.good"
                    class="mr-1"
                    icon="fa-regular fa-face-smile"
                    label="Налажены хорошие взаимоотношения"
                />
            </template>
            <span>{{ contact.full_name ?? 'Основной контакт' }}</span>
        </p>
        <a :href="companyUrl" target="_blank" class="contact-card__button">
            <HoverActionsButton label="Открыть компанию" small>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </HoverActionsButton>
        </a>
        <p v-if="!isGeneral" class="contact-card__position">
            <ContactPositionField :contact />
        </p>
        <ContactCardWarning
            v-if="contact.warning"
            class="mt-1"
            :comment="contact.warning_why_comment"
        />
        <div class="contact-card__contacts mt-2">
            <div class="contact-card__column">
                <p class="contact-card__label mb-1">Телефоны ({{ contact.phones.length }}):</p>
                <div class="contact-card__scroller">
                    <p
                        v-for="phone in contact.phones"
                        :key="phone.id"
                        class="contact-card__element"
                    >
                        <i v-if="phone.isMain" class="fa-solid fa-crown mr-1" />
                        <span>{{ phone.phone }}</span>
                    </p>
                </div>
                <p v-if="!contact.phones.length" class="messenger-warning">Не заполнено..</p>
            </div>
            <div class="contact-card__column">
                <p class="contact-card__label mb-1">
                    Почтовые адреса ({{ contact.emails.length }}):
                </p>
                <div class="contact-card__scroller">
                    <p
                        v-for="email in contact.emails"
                        :key="email.id"
                        class="contact-card__element"
                    >
                        <i v-if="email.isMain" class="fa-solid fa-crown mr-1" />
                        <span>{{ email.email }}</span>
                    </p>
                </div>
                <p v-if="!contact.emails.length" class="messenger-warning">Не заполнено..</p>
            </div>
            <div v-if="!isGeneral" class="w-100">
                <p class="contact-card__label mb-1">
                    Способы связи ({{ contact.wayOfInformings.length }}):
                </p>
                <div class="contact-card__ways">
                    <div v-for="(way, key) in wayOfInformings" :key="key" class="contact-card__way">
                        <i :class="way.icon" />
                        <span>{{ way.label }}</span>
                    </div>
                </div>
                <p v-if="!contact.wayOfInformings.length" class="messenger-warning">
                    Не заполнено..
                </p>
            </div>
        </div>
        <div v-if="!isGeneral" class="contact-card__additional">
            <hr />
            <div v-if="contact.consultant" class="contact-card__row">
                <span class="contact-card__label mr-1">Консультант:</span>
                <span class="contact-card__value">
                    {{ contact.consultant.userProfile.medium_name }}
                </span>
            </div>
            <p class="contact-card__row">
                <span class="contact-card__label mr-1">Очная встреча:</span>
                <span class="contact-card__value">
                    {{ contact.faceToFaceMeeting ? 'Была' : 'Не было' }}
                </span>
            </p>
        </div>
        <hr />
        <div class="contact-card__footer">
            <p class="contact-card__row">
                <span class="contact-card__label">
                    ID компании: #{{ contact.company_id }}, ID контакта: #{{ contact.id }}
                </span>
            </p>
            <p class="contact-card__row">
                <span class="contact-card__label">Создан: {{ createdAt }}</span
                >, <span class="contact-card__label">обновлен: {{ updatedAt }}</span>
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';
import ContactCardAddition from '@/components/Contact/Card/ContactCardAddition.vue';
import ContactCardStatus from '@/components/Contact/Card/ContactCardStatus.vue';
import { dayjsFromServer, toDateFormat } from '@/utils/formatters/date.ts';
import ContactCardWarning from '@/components/Contact/Card/ContactCardWarning.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { getLinkCompany } from '@/utils/url.js';
import ContactPositionField from '@/components/Contact/ContactPositionField.vue';
import { Contact } from '@/types/contact/contact';

const props = defineProps<{ contact: Contact }>();

const createdAt = computed(() => toDateFormat(props.contact.created_at));

const updatedAt = computed(() => {
    if (props.contact.updated_at) {
        const date = dayjsFromServer(props.contact.updated_at);
        if (date.isValid()) return date.format('D.MM.YY, HH:mm');
        return createdAt.value;
    }

    return createdAt.value;
});
const isGeneral = computed(() => props.contact.type === contactOptions.typeStatement.GENERAL);

const companyUrl = computed(() => getLinkCompany(props.contact.company_id));

const wayOfInformings = computed(() =>
    props.contact.wayOfInformings.map(way => contactOptions.wayOfCommunicate[way.way])
);
</script>
