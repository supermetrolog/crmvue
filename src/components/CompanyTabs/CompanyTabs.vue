<template>
    <div class="company-tabs">
        <Tabs nav-item-link-class="company-preview-tab">
            <Tab name="Описание">
                <UiClamped v-if="company.description" class="company-preview-tab__description">
                    {{ company.description }}
                </UiClamped>
                <p v-else class="text-grey">Описание не заполнено</p>
            </Tab>
            <Tab name="Адрес">
                <p v-if="company.officeAdress">
                    {{ company.officeAdress }}
                </p>
                <p v-else class="text-grey">Адрес не указан</p>
            </Tab>
            <Tab name="Реквизиты">
                <CompanyPreviewRequisites :company />
            </Tab>
            <Tab :name="`Документы (${company.files?.length ?? 0})`">
                <CompanyPreviewDocuments :files="company.files" />
            </Tab>
            <slot name="additional" />
        </Tabs>
    </div>
</template>
<script setup>
import Tabs from '@/components/common/Tabs/Tabs.vue';
import CompanyPreviewRequisites from '@/components/Company/Preview/CompanyPreviewRequisites.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import CompanyPreviewDocuments from '@/components/Company/Preview/CompanyPreviewDocuments.vue';
import UiClamped from '@/components/common/UiClamped.vue';

defineProps({
    company: {
        type: Object,
        required: true
    }
});
</script>
