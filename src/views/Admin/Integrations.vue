<template>
    <section class="calls-page">
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <Tabs>
                        <Tab name="TelegramLink">
                            <AdminIntegrationsTelegramLinks />
                        </Tab>
                        <Tab name="TelegramLinkTicket">
                            <AdminIntegrationsTelegramLinkTickets />
                        </Tab>
                    </Tabs>
                </UiCol>
            </div>
        </div>
    </section>
</template>

<script setup>
import UiCol from '@/components/common/UI/UiCol.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import AdminIntegrationsTelegramLinks from '@/components/Admin/Integrations/AdminIntegrationsTelegramLinks.vue';
import AdminIntegrationsTelegramLinkTickets from '@/components/Admin/Integrations/AdminIntegrationsTelegramLinkTickets.vue';
</script>
