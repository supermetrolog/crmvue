<template>
    <MultiSelect
        v-if="!contact"
        v-model="consultantId"
        :options="contacts"
        :loading="contactsIsLoading"
        :label="`Контакт (${contactsIsLoading ? 'загрузка..' : contacts.length})`"
        :v
        :placeholder
        :class="`col-${cols}`"
        can-deselect
        data-tour-id="scheduler:contact"
    >
        <template #option="{ option, isSelected }">
            <div class="d-flex flex-column">
                <p class="font-weight-semi">
                    <span>{{ option.label ?? '- Без измени' }}</span>
                    <i v-if="option.isMain" class="fa-solid fa-crown ml-2" />
                </p>
                <p v-if="option.position" class="fs-2" :class="{ 'text-grey': !isSelected }">
                    {{ option.position }}
                </p>
                <p class="fs-2">
                    Компания:
                    <span class="font-weight-semi">{{ option.company }}</span>
                </p>
                <p v-if="option.phone" class="fs-2">Телефон: {{ option.phone }}</p>
                <UiField color="light" small class="fs-2 mt-1">
                    <i class="fa-solid fa-phone" />
                    <span>{{ option.calls_count }} звонков</span>
                </UiField>
            </div>
        </template>
    </MultiSelect>
</template>
<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { useSearchContacts } from '@/composables/useSearchContacts';
import UiField from '@/components/common/UI/UiField.vue';

const consultantId = defineModel<number>();

const props = withDefaults(
    defineProps<{
        company?: object | null | undefined;
        contact?: object | null | undefined;
        placeholder?: string;
        v?: object;
        cols?: number;
        label?: string;
    }>(),
    { placeholder: 'Выберите контакта..', cols: 12, label: 'Контакт' }
);

const currentCompanyId = computed(() => props.company?.id ?? props.contact?.company_id);

const {
    searchContacts,
    activeFilteredContacts: contacts,
    isLoading: contactsIsLoading
} = useSearchContacts(currentCompanyId);

onBeforeMount(() => {
    searchContacts();
});
</script>
