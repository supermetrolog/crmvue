<template>
    <div class="messenger-dialog messenger-dialog-offer" :class="{ current: current }">
        <div class="messenger-dialog__body messenger-dialog-offer__body">
            <div class="messenger-dialog-offer__preview">
                <VLazyImage
                    :src="model.object.thumb"
                    class="messenger-dialog-offer__image"
                    alt="file image"
                />
                <span class="messenger-dialog-offer__id">ID{{ model.object.id }}</span>
            </div>
            <div class="messenger-dialog-offer__description">
                <p v-if="model.object.company" class="messenger-dialog-offer__company">
                    {{ companyName }}
                </p>
                <p class="messenger-dialog-offer__category">
                    <i class="fa-solid fa-up-long"></i>
                    <span>{{ dealType }}</span>
                </p>
                <p class="messenger-dialog-offer__address">
                    <Tooltip :text="model.object.address" icon="fa-solid fa-earth-americas" />
                    <span>{{ model.object.address }}</span>
                </p>
            </div>
        </div>
        <div class="messenger-dialog__footer">
            <MessengerDialogPhone
                @click.stop="$emit('update-call')"
                :last-call="lastCall"
                :updated-at="updatedAt"
                :disabled="isDisabled"
            />
            <MessengerDialogFunctions v-if="statistic" :counts="statistic" />
        </div>
    </div>
</template>
<script setup>
import MessengerDialogPhone from '@/components/Messenger/Dialog/MessengerDialogPhone.vue';
import MessengerDialogFunctions from '@/components/Messenger/Dialog/MessengerDialogFunctions.vue';
import VLazyImage from 'v-lazy-image';
import Tooltip from '@/components/common/Tooltip.vue';
import { computed } from 'vue';
import { objectOptions } from '@/const/options/object.options.js';
import { getCompanyName } from '@/utils/formatter.js';
import { useStore } from 'vuex';

defineEmits(['update-call']);
const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    current: {
        type: Boolean,
        default: false
    },
    lastCall: {
        type: Object,
        default: null
    },
    statistic: {
        type: Object,
        default: null
    }
});

const store = useStore();

const isDisabled = computed(
    () => props.model.object.agent_id !== store.getters.THIS_USER.user_id_old
);
const dealType = computed(() => objectOptions.dealTypeString[props.model.type]);
const updatedAt = computed(() => props.model.object.updated_at * 1000);
const companyName = computed(() =>
    getCompanyName(props.model.object.company, props.model.object.company.id)
);
</script>
