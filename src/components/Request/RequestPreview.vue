<template>
    <div class="request-preview">
        <RequestPreviewHeader class="mb-2" :request />
        <RequestPreviewParameters class="mb-2" :request />
        <div class="request-preview__content">
            <div class="row">
                <div class="col-2">
                    <RequestPreviewRequirements :request />
                </div>
                <div class="col-3">
                    <RequestPreviewLocation :request />
                </div>
                <div class="col-7">
                    <RequestPreviewTabs :request />
                </div>
            </div>
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
    request: {
        type: Object
    },
    readOnly: {
        type: Boolean,
        default: false
    },
    editOnly: {
        type: Boolean,
        default: false
    },
    withDeal: {
        type: Boolean,
        default: true
    }
});
</script>
