<template>
    <UiModal
        v-model:visible="isVisible"
        @close="cancel"
        custom-close
        :width="600"
        title="Обновление даты последнего звонка"
    >
        <Spinner v-if="isLoading" small />
        <UiForm v-else>
            <div class="row mb-1">
                <p class="mx-auto">Выберите контакт</p>
            </div>
            <div class="row mb-3">
                <div class="messenger-chat-form-recipient mx-auto">
                    <VDropdown customContainerClass="messenger-chat-form-recipient-dropdown">
                        <template #trigger>
                            <MessengerChatFormRecipientContact
                                v-if="current"
                                :contact="current"
                                class="active static"
                            />
                        </template>
                        <div class="messenger-chat-form-recipient__body">
                            <div class="messenger-chat-form-recipient__list">
                                <MessengerChatFormRecipientContact
                                    v-if="mainContact"
                                    @click="current = mainContact"
                                    :contact="mainContact"
                                    :class="{ active: mainContact.id === current?.id }"
                                />
                                <MessengerChatFormRecipientContact
                                    v-for="contact in preparedContacts"
                                    :key="contact.id"
                                    @click="current = contact"
                                    :contact="contact"
                                    :class="{
                                        active: contact.id === current?.id
                                    }"
                                />
                            </div>
                            <MessengerChatFormRecipientCard
                                v-if="current"
                                class="messenger-chat-form-recipient__card"
                                :contact="current"
                            />
                        </div>
                    </VDropdown>
                </div>
            </div>
        </UiForm>
        <template #actions="{ close }">
            <UiButton
                @click="updateLastCall"
                :disabled="!current"
                color="success-light"
                small
                icon="fa-solid fa-check"
            >
                Сохранить
            </UiButton>
            <UiButton @click="close" color="light" small icon="fa-solid fa-ban"> Отмена </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { computed, onUnmounted, ref, shallowRef } from 'vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import Spinner from '@/components/common/Spinner.vue';
import api from '@/api/api.js';
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import MessengerChatFormRecipientContact from '@/components/Messenger/Chat/Form/MessengerChatFormRecipientContact.vue';
import MessengerChatFormRecipientCard from '@/components/Messenger/Chat/Form/MessengerChatFormRecipientCard.vue';
import { entityOptions } from '@/const/options/options.js';
import { useStore } from 'vuex';
import { notify } from '@kyvg/vue3-notification';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';

const contacts = shallowRef([]);
const current = ref(null);
const { isLoading } = useDelayedLoader();
const store = useStore();

const {
    isVisible,
    onPopupShowed,
    destroy: destroyPopup,
    submit,
    cancel,
    props
} = useAsyncPopup('chatMemberLastCall');

async function fetchContacts() {
    isLoading.value = true;

    const response = await api.contacts.list({ company_id: props.value.companyID });
    contacts.value = response.data;

    isLoading.value = false;
}

onPopupShowed(async () => {
    current.value = null;

    await fetchContacts();

    const mainContact = contacts.value.find(contact => contact.isMain);

    if (mainContact) current.value = mainContact;
    else current.value = contacts.value[0];
});

const mainContact = computed(() => {
    const mainContact = contacts.value.find(
        contact => contact.type === entityOptions.contact.typeStatement.GENERAL
    );

    if (mainContact)
        return {
            ...mainContact,
            full_name: 'Общий контакт',
            general: true
        };

    return null;
});

const preparedContacts = computed(() => {
    return contacts.value.filter(
        contact => contact.type !== entityOptions.contact.typeStatement.GENERAL
    );
});

async function updateLastCall() {
    try {
        const callObject = await api.call.createForChatMember(props.value.chatMemberID, {
            user_id: store.getters.THIS_USER.id,
            contact_id: current.value.id
        });

        if (callObject) {
            notify('Дата последнего звонка успешно обновлена');
            submit({ lastCall: callObject });
        }
    } catch (error) {
        notify('Произошла ошибка. Попробуйте еще раз.');
    }
}

onUnmounted(() => {
    destroyPopup();
});
</script>
