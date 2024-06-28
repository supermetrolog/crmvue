<template>
    <div class="company-box-layout">
        <div class="company-box-layout__inner">
            <div class="company-box-layout__header">
                <slot name="header" />
            </div>
            <div class="company-box-layout__content">
                <slot name="content" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CompanyBoxLayout'
};
</script>
