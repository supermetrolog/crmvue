<template>
    <div v-if="isPassive" class="contact-card__status">
        <Tippy interactive :arrow="false" theme="bordered">
            <template #default>
                <DashboardChip class="contact-card__passive dashboard-bg-danger-l" with-icon>
                    <span>Пассив</span>
                    <i class="fa-regular fa-question-circle"></i>
                </DashboardChip>
            </template>
            <template #content>
                <p class="contact-card__row">
                    <span class="contact-card__label mr-1">Причина:</span>
                    <span class="contact-card__value">{{ passiveReason }}</span>
                </p>
                <p class="contact-card__row">
                    <span class="contact-card__label mr-1">Комментарий:</span>
                    <span class="contact-card__value">
                        {{ contact.passive_why_comment ?? '-' }}
                    </span>
                </p>
            </template>
        </Tippy>
    </div>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { computed } from 'vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { Tippy } from 'vue-tippy';

const props = defineProps({
    contact: {
        type: Object,
        required: true
    }
});

const isPassive = computed(() => props.contact.status === contactOptions.statusStatement.PASSIVE);
const passiveReason = computed(() => contactOptions.passiveWhy[props.contact.passive_why]);
</script>
