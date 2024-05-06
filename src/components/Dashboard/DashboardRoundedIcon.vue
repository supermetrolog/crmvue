<template>
    <span
        class="dashboard-rounded-icon"
        :class="color ? 'dashboard-rounded-icon--' + color : null"
        :style="{ '--icon-size': size + 'px' }"
    >
        <i :class="icon" />
    </span>
</template>

<script>
export default {
    name: 'DashboardRoundedIcon',
    props: {
        size: {
            type: [Number, String],
            default: 35
        },
        color: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            required: true
        }
    }
};
</script>
