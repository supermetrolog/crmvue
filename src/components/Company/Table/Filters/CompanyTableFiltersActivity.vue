<template>
    <div>
        <UiFormGroup>
            <CheckboxOptions
                v-model="filters.statuses"
                class="col-12"
                label="Статус"
                :options="statusOptions"
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
        <UiFormDivider />
        <UiFormGroup>
            <UiCol :cols="12">
                <p class="font-weight-semi fs-2">
                    <UiTooltipIcon
                        icon="fa-solid fa-link"
                        class="text-success"
                        tooltip="Новый фильтр"
                    />
                    Связь с опросами
                </p>
            </UiCol>
            <UiCol :cols="12">
                <UiCheckbox v-model="filters.without_surveys" :true-value="1" :false-value="null">
                    Компании без завершенных опросов
                </UiCheckbox>
            </UiCol>
        </UiFormGroup>
        <UiFormDivider />
        <UiFormGroup>
            <UiCol :cols="12">
                <p class="font-weight-semi fs-2">
                    <UiTooltipIcon
                        icon="fa-solid fa-link"
                        class="text-success"
                        tooltip="Новый фильтр"
                    />
                    Связь с задачами
                </p>
            </UiCol>
            <UiCol :cols="12">
                <UiCheckbox
                    v-model="filters.with_current_user_tasks"
                    :true-value="1"
                    :false-value="null"
                >
                    Компании с активными задачами для меня
                </UiCheckbox>
            </UiCol>
        </UiFormGroup>
        <UiFormDivider />
        <UiFormGroup>
            <UiCol :cols="12">
                <p class="font-weight-semi fs-2">
                    <UiTooltipIcon
                        icon="fa-solid fa-link"
                        class="text-success"
                        tooltip="Новый фильтр"
                    />
                    Связь с контактами
                </p>
            </UiCol>
            <UiCol :cols="12">
                <UiCheckbox
                    v-model="filters.with_active_contacts"
                    :true-value="1"
                    :false-value="null"
                >
                    Компании с активными контактами
                </UiCheckbox>
            </UiCol>
        </UiFormGroup>
        <UiFormDivider />
        <UiFormGroup>
            <UiCol :cols="12">
                <p class="font-weight-semi fs-2">
                    <UiTooltipIcon
                        icon="fa-solid fa-link"
                        class="text-success"
                        tooltip="Новый фильтр"
                    />
                    Связь с запросами
                </p>
            </UiCol>
            <UiCol :cols="12">
                <div class="d-flex gap-1 flex-wrap">
                    <RadioChip
                        v-model="filters.requests_filter"
                        value="active"
                        unselect
                        icon="fa-solid fa-up-long text-primary"
                        :rounded="false"
                        label="С активными запросами"
                    />
                    <RadioChip
                        v-model="filters.requests_filter"
                        value="not-active"
                        unselect
                        icon="fa-solid fa-up-long text-grey"
                        :rounded="false"
                        label="Без активных запросов"
                    />
                    <RadioChip
                        v-model="filters.requests_filter"
                        value="passive"
                        unselect
                        :rounded="false"
                        icon="fa-solid fa-ban text-danger"
                        label="С архивными запросами"
                    />
                    <RadioChip
                        v-model="filters.requests_filter"
                        value="none"
                        unselect
                        icon="fa-solid fa-xmark"
                        :rounded="false"
                        label="Без запросов когда-либо"
                    />
                </div>
            </UiCol>
        </UiFormGroup>
    </div>
</template>
<script setup lang="ts">
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import UiCol from '@/components/common/UI/UiCol.vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import UiCheckbox from '@/components/common/Forms/UiCheckbox.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import RadioChip from '@/components/common/Forms/RadioChip.vue';
import UiDateInput from '@/components/common/Forms/UiDateInput.vue';
import CheckboxOptions from '@/components/common/Forms/CheckboxOptions.vue';
import { CompanyStatusEnum } from '@/types/company';

interface CompanyTableFiltersActivity {
    with_current_user_tasks: number | null;
    requests_filter: string | null;
    without_surveys: number | null;
    with_active_contacts: number | null;
    dateStart: string | null;
    dateEnd: string | null;
    status: number | null | undefined;
    show_deleted: number | null;
    statuses: number[];
}

const statusOptions = {
    [CompanyStatusEnum.ACTIVE]: 'Активные',
    [CompanyStatusEnum.PASSIVE]: 'Приостановленные',
    [CompanyStatusEnum.DELETED]: 'Удаленные'
};

const filters = defineModel<CompanyTableFiltersActivity>({ default: () => ({}) });
</script>
