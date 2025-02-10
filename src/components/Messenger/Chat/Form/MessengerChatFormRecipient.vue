<template>
    <div class="messenger-chat-form-recipient">
        <VDropdown :customContainerClass="dropdownClass">
            <template #trigger>
                <MessengerChatFormRecipientContact
                    v-if="current"
                    :contact="current"
                    class="active static"
                />
                <div v-else class="messenger-chat-form-contact static">
                    <div class="messenger-chat-form-contact__icon rounded-icon">
                        <i class="fa-solid fa-phone-slash"></i>
                    </div>
                    <div class="messenger-chat-form-contact__description">
                        <p class="messenger-chat-form-contact__username">Без звонка</p>
                    </div>
                    <i class="fa-solid fa-chevron-right messenger-chat-form-contact__chevron"></i>
                </div>
            </template>
            <div class="messenger-chat-form-recipient__body">
                <div class="messenger-chat-form-recipient__list">
                    <MessengerChatFormRecipientContact
                        v-if="mainContact"
                        @click="$emit('change', mainContact)"
                        :contact="mainContact"
                        :class="{ active: current && mainContact.id === current.id }"
                    />
                    <MessengerChatFormRecipientContact
                        v-for="contact in contacts"
                        :key="contact.id"
                        @click="$emit('change', contact)"
                        :contact="contact"
                        :class="{
                            active: current && contact.id === current.id
                        }"
                    />
                    <div
                        @click="$emit('change', null)"
                        class="messenger-chat-form-contact"
                        :class="{ active: !current }"
                    >
                        <div class="messenger-chat-form-contact__icon rounded-icon">
                            <i class="fa-solid fa-phone-slash"></i>
                        </div>
                        <div class="messenger-chat-form-contact__description">
                            <p class="messenger-chat-form-contact__username">Без звонка</p>
                        </div>
                    </div>
                </div>
                <MessengerChatFormRecipientCard
                    v-if="current"
                    class="messenger-chat-form-recipient__card"
                    :contact="current"
                />
            </div>
        </VDropdown>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerChatFormRecipientContact from '@/components/Messenger/Chat/Form/MessengerChatFormRecipientContact.vue';
import { entityOptions } from '@/const/options/options';
import MessengerChatFormRecipientCard from '@/components/Messenger/Chat/Form/MessengerChatFormRecipientCard.vue';
import VDropdown from '@/components/common/Dropdown/VDropdown.vue';
import { computed } from 'vue';
import { tryOnBeforeMount } from '@vueuse/core';

const emit = defineEmits(['change']);
const props = defineProps({
    current: {
        type: Object,
        default: () => null
    },
    withoutAutoToggle: {
        type: Boolean,
        default: false
    },
    dropdownClass: {
        type: String,
        default: null
    }
});

const store = useStore();

const company = computed(() => store.state.Messenger.currentPanel);
const mainContact = computed(() => {
    const mainContact = company.value.generalContact;

    if (mainContact)
        return {
            ...mainContact,
            full_name: 'Общий контакт',
            general: true
        };

    return null;
});
const contacts = computed(() => {
    return company.value.contacts.filter(
        contact => contact.type !== entityOptions.contact.typeStatement.GENERAL
    );
});

tryOnBeforeMount(() => {
    if (!props.current && !props.withoutAutoToggle) {
        emit(
            'change',
            contacts.value.find(contact => contact.isMain)
        );
    }
});
</script>
