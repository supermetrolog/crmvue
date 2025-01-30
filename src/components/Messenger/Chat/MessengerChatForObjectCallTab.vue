<template>
    <tippy tag="div" class="messenger-chat__tab-quiz">
        <template #default>
            <div v-if="loading" class="messenger-tabs__loading">
                <Spinner class="absolute-center mini" />
            </div>
            <template v-else-if="company && !hasActiveContact">
                <i class="fa-solid fa-users-slash messenger-chat__icon-phone"></i>
                <span>НЕТ КОНТАКТОВ!</span>
            </template>
            <template v-else>
                <template v-if="dialog?.last_call">
                    <template v-if="isCompletedCall">
                        <i class="fa-solid fa-phone-volume messenger-chat__icon-phone" />
                        <span>Опрос {{ lastCallDate }}</span>
                    </template>
                    <template v-else>
                        <i class="fa-solid fa-phone-slash messenger-chat__icon-phone" />
                        <span>Звонок {{ lastCallDate }}</span>
                    </template>
                </template>
                <span v-else>ЗАПОЛНИТЕ ОПРОС!</span>
            </template>
        </template>
        <template #content>
            <div v-if="loading" class="d-flex align-items-center gap-2 p-2">
                <Spinner class="mini" />
                <p>Загрузка данных о последнем звонке..</p>
            </div>
            <template v-else-if="company && !hasActiveContact">
                <span>У компании нет активных контактов!</span>
            </template>
            <div v-else-if="dialog">
                <div v-if="shouldCall" class="mb-1">
                    <p class="messenger-warning">ИНФОРМАЦИЯ УСТАРЕЛА!</p>
                    <p class="messenger-warning">СОЗВОНИТЕСЬ И ЗАПОЛНИТЕ ОПРОСНИК!</p>
                </div>
                <div v-if="dialog?.last_call">
                    <p v-if="isCompletedCall">
                        Последний опрос был заполнен {{ lastCallDate }}, звонивший:
                        {{ dialog.last_call.user.userProfile.medium_name }}
                    </p>
                    <template v-else>
                        <p>
                            Попытка созвониться {{ lastCallDate }} с
                            {{ lastCallContact }}
                        </p>
                        <p class="messenger-warning">{{ lastCallStatus }}</p>
                    </template>
                </div>
                <p v-else>Звонок по объекту отсутствует или не заполнен.</p>
            </div>
        </template>
    </tippy>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.js';
import Spinner from '@/components/common/Spinner.vue';
import { Tippy } from 'vue-tippy';
import { isActiveContact, isPersonalContact } from '@/utils/helpers/models/contact.js';
import { CALL_STATUSES, CALL_STATUSES_TEXT } from '@/components/Messenger/Quiz/useMessengerQuiz.js';
import { getContactFullName } from '@/utils/formatters/models/contact.js';

const props = defineProps({
    loading: Boolean,
    company: Object,
    dialog: Object
});

const store = useStore();

const shouldCall = computed(() => {
    return (
        store.getters['Messenger/currentDaysCountAfterLastCall'] >=
        import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER
    );
});

const lastCallDate = computed(() => toDateFormat(props.dialog.last_call.created_at, 'D.MM.YY'));
const lastCallStatus = computed(() => CALL_STATUSES_TEXT[props.dialog.last_call.status]);
const lastCallContact = computed(() =>
    getContactFullName(
        props.company.contacts.find(contact => contact.id === props.dialog.last_call.contact_id)
    )
);

// contacts

const contacts = computed(() => {
    return props.company.contacts.filter(isPersonalContact);
});

const hasActiveContact = computed(() => {
    if (props.company) return contacts.value.some(isActiveContact);
    return false;
});

const isCompletedCall = computed(() => {
    if (props.dialog?.last_call) {
        return props.dialog.last_call.status === CALL_STATUSES.COMPLETED;
    }

    return false;
});
</script>
