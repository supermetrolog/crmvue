<template>
    <div class="d-flex gap-2 align-items-center">
        <UiField class="company-page__chip" :color="statusColor">
            <span>Статус: {{ statusLabel }}</span>
            <UiTooltipIcon
                v-if="!isActive && hasPassiveReason"
                :tooltip="comment"
                icon="fa-regular fa-question-circle"
            />
        </UiField>
        <AnimationTransition :speed="0.5">
            <UiButton
                v-if="company.status_history_count"
                @click="showHistory"
                small
                color="light"
                icon="fa-solid fa-clock-rotate-left"
                :tooltip="`Нажмите, чтобы просмотреть историю изменений статуса компании (${statusHistoryLabel})`"
                :badge="company.status_history_count"
                badge-class="dashboard-bg-gray"
            >
                История изменений
            </UiButton>
        </AnimationTransition>
        <teleport to="body">
            <CompanyBoxStatusHistoryModal
                v-if="historyModalIsVisible"
                @close="historyModalIsVisible = false"
                :company
            />
        </teleport>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import UiField from '@/components/common/UI/UiField.vue';
import { CompanyStatusEnum, CompanyStatusLabel } from '@/types/company';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import { PassiveWhy } from '@/const/const.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import { plural } from '@/utils/plural.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import CompanyBoxStatusHistoryModal from '@/components/Company/Box/CompanyBoxStatusHistoryModal.vue';

const props = defineProps({
    company: {
        type: Object,
        required: true
    }
});

const isPassive = computed(() => props.company.status === CompanyStatusEnum.PASSIVE);

const isActive = computed(() => props.company.status === CompanyStatusEnum.ACTIVE);

const statusColor = computed(() => {
    if (isActive.value) {
        return 'light';
    }

    if (isPassive.value) {
        return 'danger-light';
    }

    return 'danger';
});

const hasPassiveReason = computed(() => isNotNullish(props.company.passive_why));

const statusLabel = computed(() => CompanyStatusLabel[props.company.status]);

const comment = computed(() => {
    let text = PassiveWhy[props.company.passive_why]?.label;
    if (props.company.passive_why_comment) text += ': ' + props.company.passive_why_comment;
    return text;
});

const statusHistoryLabel = computed(() =>
    plural(props.company.status_history_count, '%d изменение', '%d изменения', '%d изменений')
);

const historyModalIsVisible = ref(false);

function showHistory() {
    historyModalIsVisible.value = true;
}
</script>
