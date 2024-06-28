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
                    {{ $formatter.companyName(model.object.company, model.object.company.id) }}
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
                :updated-at="model.object.updated_at"
            />
            <MessengerDialogFunctions />
        </div>
    </div>
</template>
<script>
import MessengerDialogPhone from '@/components/Messenger/Dialog/MessengerDialogPhone.vue';
import MessengerDialogFunctions from '@/components/Messenger/Dialog/MessengerDialogFunctions.vue';
import VLazyImage from 'v-lazy-image';
import Tooltip from '@/components/common/Tooltip.vue';
import { entityOptions } from '@/const/options/options.js';

export default {
    name: 'MessengerDialogObject',
    components: { Tooltip, MessengerDialogFunctions, MessengerDialogPhone, VLazyImage },
    emits: ['update-call'],
    props: {
        model: {
            type: Object,
            required: true
        },
        current: {
            type: Boolean,
            default: false
        },
        lastCall: {
            type: String,
            default: null
        }
    },
    computed: {
        dealType() {
            return entityOptions.object.dealTypeString[this.model.type];
        }
    }
};
</script>
