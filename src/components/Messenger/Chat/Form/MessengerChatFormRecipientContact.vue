<template>
    <div class="messenger-chat-form-contact">
        <div class="messenger-chat-form-contact__icon rounded-icon">
            <i v-if="contact.isMain" class="fa-solid fa-crown"></i>
            <i v-else class="fa-solid fa-phone"></i>
        </div>
        <div class="messenger-chat-form-contact__description">
            <p class="messenger-chat-form-contact__username">
                {{ fullName }}
            </p>
            <p class="messenger-chat-form-contact__staff">
                <ContactPositionField
                    :contact
                    show-warning
                    warning-class="messenger-chat-form-contact__warning"
                />
            </p>
        </div>
        <i class="fa-solid fa-chevron-right messenger-chat-form-contact__chevron"></i>
    </div>
</template>
<script setup lang="ts">
import { Contact } from '@/types/contact/contact';
import { computed } from 'vue';
import { getContactFullName } from '@/utils/formatters/models/contact';
import ContactPositionField from '@/components/Contact/ContactPositionField.vue';

const props = defineProps<{ contact: Contact }>();

const fullName = computed(() => getContactFullName(props.contact));
</script>
