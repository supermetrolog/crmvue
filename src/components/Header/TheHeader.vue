<template>
    <header class="header">
        <div class="header__wrapper">
            <div class="row no-gutters">
                <div class="col-8 col-md-6 align-self-center">
                    <HeaderSummary />
                </div>
                <div class="col-8 col-md-6 align-self-center">
                    <div class="header__right">
                        <HeaderFunctions />
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import HeaderFunctions from '@/components/Header/HeaderFunctions.vue';
import HeaderSummary from '@/components/Header/Summary/HeaderSummary.vue';
</script>
