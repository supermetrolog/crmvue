<template>
    <div class="request-preview">
        <RequestPreviewHeader class="mb-2" :request />
        <RequestPreviewParameters class="mb-2" :request />
        <div class="request-preview__content">
            <RequestPreviewRequirements :request />
            <RequestPreviewLocation :request />
            <RequestPreviewTabs :request />
        </div>
    </div>
</template>

<script setup>
import RequestPreviewHeader from '@/components/Request/RequestPreviewHeader.vue';
import RequestPreviewParameters from '@/components/Request/RequestPreviewParameters.vue';
import RequestPreviewRequirements from '@/components/Request/RequestPreviewRequirements.vue';
import RequestPreviewLocation from '@/components/Request/RequestPreviewLocation.vue';
import RequestPreviewTabs from '@/components/Request/RequestPreviewTabs.vue';

defineProps({
    request: Object,
    readOnly: Boolean,
    editOnly: Boolean
});
</script>
