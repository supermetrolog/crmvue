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
                <p class="messenger-dialog-offer__company">{{ companyName }}</p>
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
        <div v-if="false" class="messenger-dialog__footer">
            <MessengerDialogPhone :info="{ lastCall: '2024-01-10T08:39:18.760Z' }" />
            <MessengerDialogFunctions />
        </div>
    </div>
</template>
<script>
import MessengerDialogPhone from '@/components/Messenger/Dialog/MessengerDialogPhone.vue';
import MessengerDialogFunctions from '@/components/Messenger/Dialog/MessengerDialogFunctions.vue';
import VLazyImage from 'v-lazy-image';
import Tooltip from '@/components/common/Tooltip.vue';
import { alg } from '@/utils/alg.js';
import { entityOptions } from '@/const/options/options.js';

export default {
    name: 'MessengerDialogObject',
    components: { Tooltip, MessengerDialogFunctions, MessengerDialogPhone, VLazyImage },
    props: {
        model: {
            type: Object,
            required: true
        },
        current: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        dealType() {
            return entityOptions.object.dealTypeString[this.model.type];
        },
        companyName() {
            if (alg.isNumeric(this.model.object.company.nameRu))
                return 'Компания #' + this.model.object.company.nameRu;
            return this.model.object.company.nameRu;
        }
    }
};
</script>
