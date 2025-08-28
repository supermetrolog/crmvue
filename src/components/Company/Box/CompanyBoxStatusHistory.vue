<template>
    <div class="p-2 br-2 dashboard-bg-light">
        <div class="d-flex align-items-center gap-1 mb-2">
            <div v-if="userIsVisible" class="d-flex gap-2 align-items-center">
                <Avatar
                    :src="history.changed_by.userProfile.avatar"
                    :size="24"
                    :label="history.changed_by.userProfile.medium_name"
                />
                <span>{{ history.changed_by.userProfile.medium_name }}</span>
            </div>
            <div>
                <span>{{ statusPreLabel }}</span>
                <span :class="statusColor" class="ml-1 font-weight-semi">"{{ statusLabel }}"</span>
            </div>
            <span class="text-grey">·</span>
            <span class="text-grey fs-2">{{ createdAt }}</span>
        </div>
        <p v-if="history.reason">
            <span class="text-grey fs-2">Причина:</span>
            <span class="fs-2 ml-1">{{ reasonLabel }}</span>
        </p>
        <template v-if="history.comment">
            <p class="text-grey fs-2">Комментарий:</p>
            <p>{{ history.comment }}</p>
        </template>
        <p v-else class="text-grey fs-2 op-5">Без комментария..</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
    CompanyStatusEnum,
    CompanyStatusHistory,
    CompanyStatusLabel,
    CompanyStatusReasonLabel,
    CompanyStatusSourceEnum
} from '@/types/company';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import Avatar from '@/components/common/Avatar.vue';
import { genderize } from '@/utils/genderize';
import { toBeautifulDateFormat } from '@/utils/formatters/date';

const props = defineProps<{ history: CompanyStatusHistory }>();

const userIsVisible = computed(() => {
    return (
        props.history.changed_by_source === CompanyStatusSourceEnum.USER &&
        isNotNullish(props.history.changed_by)
    );
});

const statusLabel = computed(() => CompanyStatusLabel[props.history.status]);

const statusPreLabel = computed(() => {
    if (userIsVisible.value) {
        return genderize(props.history.changed_by, 'изменил статус на', 'изменила статус на');
    }

    if (props.history.changed_by_source === CompanyStatusSourceEnum.SYSTEM) {
        return 'Статус изменен системой на';
    }

    return `Статус изменен на`;
});

const statusColor = computed(() => {
    if (props.history.status === CompanyStatusEnum.ACTIVE) {
        return 'color-success';
    }

    return 'color-danger';
});

const createdAt = computed(() => toBeautifulDateFormat(props.history.created_at));

const reasonLabel = computed(() => CompanyStatusReasonLabel[props.history.reason]);
</script>
