<template>
    <div class="col-12 company-detail-info__row">
        <div class="row">
            <div class="col-5">
                <p class="company-detail-info__category">{{ label }}:</p>
            </div>
            <div class="col-7">
                <strong>
                    <slot>
                        <p>&#8212;</p>
                    </slot>
                </strong>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CompanyDetailRow',
    props: {
        label: {
            type: String,
            required: true
        }
    }
};
</script>
