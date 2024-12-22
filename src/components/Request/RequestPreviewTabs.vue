<template>
    <div class="request-preview__tabs">
        <Tabs nav-item-link-class="request-preview-tab dashboard-chip">
            <Tab name="Описание">
                <p v-if="request.description">{{ request.description }}</p>
                <p v-else>Описание не заполнено</p>
            </Tab>
            <Tab name="Техническое задание">
                <p>В разработке..</p>
            </Tab>
        </Tabs>
    </div>
</template>
<script setup>
import Tabs from '@/components/common/Tabs/Tabs.vue';
import Tab from '@/components/common/Tabs/Tab.vue';

defineProps({
    request: {
        type: Object,
        required: true
    }
});
</script>
