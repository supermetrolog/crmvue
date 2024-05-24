<template>
    <div class="dashboard-card dashboard-status-card" :class="className">
        <div class="dashboard-card__content">
            <p class="dashboard-status-card__label">{{ label }}</p>
            <div class="dashboard-status-card__body">
                <span class="dashboard-status-card__value">
                    <slot></slot>
                </span>
                <div
                    v-if="icon"
                    class="dashboard-status-card__icon"
                    :class="`dashboard-status-card__icon--${color}`"
                >
                    <i :class="icon" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardStatusCard',
    props: {
        label: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            default: null
        },
        color: {
            type: String,
            default: null
        }
    },
    computed: {
        className() {
            return this.color ? 'dashboard-status-card--' + this.color : null;
        }
    }
};
</script>
