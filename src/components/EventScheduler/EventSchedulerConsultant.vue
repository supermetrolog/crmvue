<template>
    <ConsultantPicker
        v-if="consultantPickerShouldBeShown"
        v-model="userId"
        :v
        label="Исполнитель"
        :options="getConsultantsOptions"
        required
    >
        <template #after>
            <div class="d-flex gap-2">
                <UiButton
                    @click.prevent="assignToSelf"
                    :disabled="assignedToSelf"
                    small
                    color="light"
                    icon="fa-solid fa-user-astronaut"
                >
                    Указать себя
                </UiButton>
                <UiButton
                    @click.prevent="assignToCompanyConsultant"
                    :disabled="assignedToCompanyConsultant"
                    small
                    color="light"
                    icon="fa-solid fa-user-tag"
                >
                    <span>{{ companyConsultantName }}</span>
                    <span class="text-grey ml-1 fs-2">(конс. компании)</span>
                </UiButton>
            </div>
        </template>
    </ConsultantPicker>
</template>
<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useAuth } from '@/composables/useAuth.js';
import ConsultantPicker from '@/components/common/Forms/ConsultantPicker/ConsultantPicker.vue';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { useConsultantsOptions } from '@/composables/options/useConsultantsOptions';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import UiButton from '@/components/common/UI/UiButton.vue';

const userId = defineModel<number>();

const props = defineProps<{
    company?: object;
    v?: object;
}>();

const { currentUserId } = useAuth();

const consultantPickerShouldBeShown = computed(() => {
    if (isNullish(props.company)) return false;

    return props.company.consultant_id !== currentUserId.value;
});

const { getConsultantsOptions, consultantsOptions } = useConsultantsOptions();

function assignToSelf() {
    userId.value = currentUserId.value;
}

const assignedToSelf = computed(() => userId.value === currentUserId.value);

const companyConsultantName = computed(() => {
    if (isNotNullish(props.company?.consultant)) {
        return props.company.consultant.userProfile.medium_name;
    }

    return consultantsOptions.value.find(element => element.value === props.company.consultant_id)
        ?.label;
});

function assignToCompanyConsultant() {
    userId.value = props.company.consultant_id;
}

const assignedToCompanyConsultant = computed(() => userId.value === props.company.consultant_id);

onBeforeMount(() => {
    if (isNotNullish(props.company)) {
        userId.value = props.company.consultant_id;
    }
});
</script>
