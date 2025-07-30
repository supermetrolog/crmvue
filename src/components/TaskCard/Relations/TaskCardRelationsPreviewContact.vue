<template>
    <div class="task-card-relation-contact">
        <div class="task-card-relation-contact__content">
            <p class="font-weight-semi">
                <span>{{ contact.full_name ?? '- Без измени' }}</span>
                <i v-if="contact.isMain" class="fa-solid fa-crown ml-2" />
            </p>
            <p v-if="contact.position" class="text-grey fs-2">
                {{ position }}
            </p>
            <p class="fs-2">
                Компания: <span class="font-weight-semi">{{ companyName }}</span>
            </p>
            <p v-if="contact.phones?.length" class="fs-2">Телефон: {{ mainPhone.phone }}</p>
        </div>
        <div class="task-card-relation-contact__actions">
            <Tippy :delay="200">
                <UiButtonIcon icon="fa-solid fa-info" small />
                <template #content>
                    <ContactCard :contact />
                </template>
            </Tippy>
            <UiButtonIcon
                @click="$emit('unlink')"
                label="Удалить связь"
                icon="fa-solid fa-link-slash"
                small
            />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { ContactPositionLabels } from '@/types/contact/contact';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { Tippy } from 'vue-tippy';
import ContactCard from '@/components/Contact/Card/ContactCard.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';

defineEmits(['unlink']);

const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const position = computed(() => ContactPositionLabels[props.contact.position]);

const companyName = computed(() => getCompanyName(props.contact.company, props.contact.company_id));

const mainPhone = computed(() => {
    const main = props.contact.phones.find(phone => phone.isMain);

    return main ?? props.contact.phones[0];
});
</script>
