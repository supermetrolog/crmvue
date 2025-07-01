<template>
    <div>
        <UiFormGroup>
            <Spinner v-if="consultantsIsLoading" small />
            <ConsultantPicker
                v-else
                v-model="filters.consultant_id"
                :options="getConsultantsOptions"
                class="col-12"
                :append-to-body="false"
                data-field-id="company-table-filters:consultant"
            >
                <template #after>
                    <UiButton
                        @click="assignToCurrentUser"
                        :disabled="assignedToCurrentUser"
                        small
                        color="light"
                        icon="fa-solid fa-user"
                    >
                        Указать себя
                    </UiButton>
                </template>
            </ConsultantPicker>
        </UiFormGroup>
    </div>
</template>
<script setup lang="ts">
import UiFormGroup from '@/components/common/Forms/UiFormGroup.vue';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import Spinner from '@/components/common/Spinner.vue';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAuth } from '@/composables/useAuth';
import { computed } from 'vue';

interface CompanyTableFiltersConsultant {
    consultant_id: number | null;
}

const filters = defineModel<CompanyTableFiltersConsultant>({ default: () => ({}) });

const { getConsultantsOptions, isFetching: consultantsIsLoading } = useConsultantsOptions();

const { currentUserId } = useAuth();

function assignToCurrentUser() {
    filters.value.consultant_id = currentUserId.value;
}

const assignedToCurrentUser = computed(() => filters.value.consultant_id == currentUserId.value);
</script>
