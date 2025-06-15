<template>
    <tr v-if="visible" class="table-object-row">
        <td colspan="6">
            <Spinner v-if="objectsIsLoading" class="my-4" />
            <div v-else class="px-3 py-4">
                <p class="font-weight-semi mb-2">Объекты</p>
                <ObjectTable :sortable="false" :objects="currentObjects" />
            </div>
        </td>
    </tr>
</template>

<script setup>
import { ref, shallowRef, watch } from 'vue';
import ObjectTable from '@/components/ObjectTable/ObjectTable.vue';
import Spinner from '@/components/common/Spinner.vue';
import api from '@/api/api.js';

defineEmits([]);

const visible = defineModel('visible', { type: Boolean });

const props = defineProps({
    company: { type: Object, required: true }
});

const currentObjects = shallowRef([]);
const objectsIsLoading = ref(false);

async function fetchObjects() {
    objectsIsLoading.value = true;

    try {
        const response = await api.object.search({
            company_id: props.company.id,
            expand: 'offers,company.mainContact.phones,company.mainContact.emails,company.objects_count,company.active_requests_count,company.active_contacts_count'
        });

        currentObjects.value = response.data;
    } finally {
        objectsIsLoading.value = false;
    }
}

watch(visible, value => {
    if (value && !objectsIsLoading.value && !currentObjects.value.length) {
        fetchObjects();
    }
});
</script>
