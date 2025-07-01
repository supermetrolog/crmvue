<template>
    <div>
        <UiFormGroup>
            <SwitchSlider
                v-model="filters.status"
                class="col-5"
                label="Статус"
                unknown-title="Любой"
                true-title="Только актив"
                false-title="Только пассив"
                vertical
            />
        </UiFormGroup>
        <UiFormDivider />
        <UiFormGroup>
            <UiDateInput
                v-model="filters.dateStart"
                placeholder="Дата внесения"
                label="Внесено после"
                :max-date="new Date()"
                class="col-6"
            />
            <UiDateInput
                v-model="filters.dateEnd"
                placeholder="Дата внесения"
                label="Внесено до"
                class="col-6"
                :min-date="filters.dateStart"
            />
        </UiFormGroup>
    </div>
</template>
<script setup lang="ts">
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import SwitchSlider from '@/components/common/Forms/SwitchSlider.vue';

interface CompanyTableFiltersStatus {
    dateStart: string | null;
    dateEnd: string | null;
    status: number | null | undefined;
}

const filters = defineModel<CompanyTableFiltersStatus>({ default: () => ({}) });
</script>
