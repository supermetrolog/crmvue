<template>
    <div class="account-section">
        <p class="font-weight-semi fs-4">Интеграции</p>
        <UiFormDivider />
        <div>
            <div class="mb-3">
                <p class="font-weight-semi fs-4 mb-1">Telegram</p>
                <AccountIntegrationTelegram />
            </div>
        </div>
    </div>
</template>

<script setup>
import AccountIntegrationTelegram from '@/components/Account/AccountIntegrationTelegram.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
</script>
