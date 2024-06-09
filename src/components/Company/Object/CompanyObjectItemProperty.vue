<template>
    <div class="object-offer-param">
        <p class="object-offer-param__title">{{ title }}:</p>
        <p class="object-offer-param__value">
            <slot />
        </p>
    </div>
</template>

<script>
export default {
    name: 'CompanyObjectItemProperty',
    props: {
        title: {
            type: String,
            required: true
        }
    }
};
</script>
