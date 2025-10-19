<template>
    <div class="account-section">
        <p class="font-weight-semi fs-4">Интеграции</p>
        <UiFormDivider />
        <div class="d-flex">
            <div class="w-50">
                <div data-tour-id="account-integrations:telegram" class="d-inline-block">
                    <p class="font-weight-semi fs-4 mb-1">
                        <i class="fa-brands fa-telegram mr-1 icon" />
                        <span>Telegram</span>
                    </p>
                    <AccountIntegrationTelegram />
                </div>
            </div>
            <div class="w-50">
                <div data-tour-id="account-integrations:whatsapp" class="d-inline-block">
                    <p class="font-weight-semi fs-4 mb-1">
                        <i class="fa-brands fa-whatsapp mr-1 icon" />
                        <span>Whatsapp</span>
                    </p>
                    <AccountIntegrationWhatsapp />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AccountIntegrationTelegram from '@/components/Account/AccountIntegrationTelegram.vue';
import AccountIntegrationWhatsapp from '@/components/Account/AccountIntegrationWhatsapp.vue';
import UiFormDivider from '@/components/common/Forms/UiFormDivider.vue';
import { useTour } from '@/composables/useTour/useTour';
import { createTourStepElementGenerator } from '@/composables/useTour/useTourStep';

const createTourStepElement = createTourStepElementGenerator('account-integrations');

useTour('account-integrations', {
    autorun: true,
    steps: [
        {
            key: 0,
            popover: {
                title: 'Интеграция мессенджеров',
                description: 'Теперь получать важные уведомления можно в мессенджерах.'
            }
        },
        {
            key: 1,
            element: createTourStepElement('telegram'),
            popover: {
                title: 'Telegram',
                description:
                    'Привязать Telegram аккаунт можно с помощью мобильного устройства или Web-версии.',
                side: 'right',
                align: 'center'
            }
        },
        {
            key: 2,
            element: createTourStepElement('whatsapp'),
            popover: {
                title: 'Whatsapp',
                description:
                    'Для привязки Whatsapp аккаунта необходимо просто указать актуальный номер телефона.',
                side: 'left',
                align: 'center'
            }
        }
    ]
});
</script>
