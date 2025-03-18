<template>
    <div class="messenger-chat-header-company">
        <CompanyLogo :size="60" :company-id="dialog.model.id" :src="dialog.model.logo" />
        <span class="messenger-chat-header__id messenger-chat-header-company__id">
            ID{{ dialog.model.id }}
        </span>
        <div class="messenger-chat-header__description">
            <p class="messenger-chat-header__title">
                <span v-if="hasUndefinedName" class="messenger-warning">
                    [Нет уникального названия]
                </span>
                <span v-else>от {{ companyName }}</span>
            </p>
            <p class="messenger-chat-header__address">
                {{ dialog.model.office_address ?? dialog.model.officeAdress }}
            </p>
            <div class="messenger-chat-header-company__categories mt-1">
                <UiField
                    v-for="category in categories"
                    :key="category.id"
                    color="light"
                    class="messenger-chat-header-company__category"
                >
                    {{ category.label }}
                </UiField>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import CompanyLogo from '@/components/Company/CompanyLogo.vue';
import { alg } from '@/utils/alg.js';
import { CompanyCategories } from '@/const/const.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import UiField from '@/components/common/UI/UiField.vue';

const props = defineProps({
    dialog: {
        type: Object,
        required: true
    }
});

const hasUndefinedName = computed(() => {
    return (
        (props.dialog.model.noName && !props.dialog.model.is_individual) ||
        ((!props.dialog.model.nameRu ||
            (alg.isNumeric(props.dialog.model.nameRu) &&
                Number(props.dialog.model.nameRu) === props.dialog.model.id)) &&
            !props.dialog.model.nameEng)
    );
});

const companyName = computed(() => getCompanyName(props.dialog.model));

const categories = computed(() => {
    return props.dialog.model.categories.map(element => {
        return {
            id: element.id,
            label: CompanyCategories[element.category]
        };
    });
});
</script>
