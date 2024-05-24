<template>
    <div class="dashboard-card-link" :class="{ active: active }">
        <DashboardRoundedIcon v-if="icon" :icon="icon.name" :class="icon.class" />
        <p class="dashboard-card-link__value">
            <slot></slot>
        </p>
        <span v-if="badge !== null" class="dashboard-card-link__badge">
            {{ badge }}
        </span>
    </div>
</template>

<script>
import DashboardRoundedIcon from '@/components/Dashboard/DashboardRoundedIcon.vue';

export default {
    name: 'DashboardCardNavLink',
    components: { DashboardRoundedIcon },
    props: {
        icon: {
            type: Object,
            default: null
        },
        badge: {
            type: [Number, String],
            default: null
        },
        active: {
            type: Boolean,
            default: false
        }
    }
};
</script>
