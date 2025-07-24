<template>
    <div class="timeline-page-header-info">
        <h2 class="timeline-page-header-info__title">{{ title }}</h2>
        <div class="timeline-page-header-info__properties">
            <template v-if="company.companyGroup">
                <span v-tippy="'Группа компаний'" class="timeline-page-header-info__group">
                    {{ company.companyGroup.full_name }}
                </span>
                <span class="timeline-page-header-info__dot mx-2">·</span>
            </template>
            <template v-if="request.consultant">
                <span v-tippy="'Консультант по запросу'">
                    <i class="fa-solid fa-door-open mr-1" />
                    <span>{{ request.consultant.userProfile.medium_name }}</span>
                </span>
                <span class="timeline-page-header-info__dot mx-2">·</span>
            </template>
            <span v-tippy="'Дата создания запроса'">
                <i class="fa-solid fa-clock mr-1" />
                <span>{{ createdAt }}</span>
            </span>
            <span class="timeline-page-header-info__dot mx-2">·</span>
            <span v-tippy="'Дата последнего обновления'">
                <i class="fa-solid fa-rotate mr-1" />
                <span>{{ updatedAt }}</span>
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.ts';
import { getCompanyName } from '@/utils/formatters/models/company.js';

const props = defineProps({
    company: Object,
    request: Object
});

const title = computed(() => getCompanyName(props.company));

const createdAt = computed(() => toDateFormat(props.request.created_at));

const updatedAt = computed(() => {
    return toDateFormat(props.request.updated_at ?? props.request.created_at);
});
</script>
