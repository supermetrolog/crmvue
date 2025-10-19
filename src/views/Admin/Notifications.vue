<template>
    <section class="calls-page">
        <div class="container-fluid">
            <div class="row">
                <UiCol :cols="12">
                    <Tabs>
                        <Tab name="Notifications">
                            <AdminNotifications />
                        </Tab>
                        <Tab name="ActionLog">
                            <AdminNotificationsLogs />
                        </Tab>
                        <Tab name="Templates">
                            <AdminNotificationsTemplates />
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
import AdminNotifications from '@/components/Admin/Notifications/AdminNotifications.vue';
import AdminNotificationsLogs from '@/components/Admin/Notifications/AdminNotificationsLogs.vue';
import AdminNotificationsTemplates from '@/components/Admin/Notifications/AdminNotificationsTemplates.vue';
</script>
