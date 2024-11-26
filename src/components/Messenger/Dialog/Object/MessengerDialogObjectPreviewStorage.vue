<template>
    <div class="messenger-dialog-preview__grid">
        <MessengerDialogPreviewRow label="цена паллет">
            <WithUnitType
                v-if="offerMix.price_safe_pallet_min || offerMix.price_safe_pallet_max"
                :unit-type="unitTypes.RUB_PER_PALLET_PLACE_PER_DAY"
            >
                {{ offerMix.calc_price_safe_pallet }}
            </WithUnitType>
            <template #warning>???</template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow>
            <template #label>цена за м<sup>3</sup></template>
            <template
                v-if="offerMix.price_safe_volume_min || offerMix.price_safe_volume_max"
                #default
            >
                <WithUnitType :unit-type="unitTypes.RUB">
                    {{
                        toNumberOrRangeFormat(
                            offerMix.price_safe_volume_min,
                            offerMix.price_safe_volume_max
                        )
                    }}
                </WithUnitType>
            </template>
            <template #warning>???</template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow editable label="услуги">
            <MessengerDialogPreviewTippy v-if="servicesCount > 0">
                <template #trigger>{{ pluralServicesCount }}</template>
                <template #content>
                    <MessengerDialogObjectPreviewStorageServices :offer="offerMix.offer" />
                </template>
            </MessengerDialogPreviewTippy>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="складская техника">
            <template v-if="offerMix.warehouse_equipment" #default>
                {{ offerMix.warehouse_equipment === 1 ? 'да' : 'нет' }}
            </template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="договоренность %">
            <MessengerDialogPreviewTippy
                v-if="
                    offerMix.offer.commission_owner ||
                    offerMix.offer.commission_client ||
                    offerMix.offer.commission_agent
                "
            >
                <template #trigger>
                    <template v-if="offerMix.offer.commission_owner">
                        <template v-if="offerMix.offer.commission_owner === 1">
                            <span v-if="offerMix.offer.commission_owner_value">
                                {{ Number(offerMix.offer.commission_owner_value) }}%
                            </span>
                            <span v-else>да</span>
                        </template>
                        <span v-else>нет</span>
                    </template>
                    <span v-else class="messenger-warning">?? </span>
                    <span>/ </span>
                    <template v-if="offerMix.offer.commission_client">
                        <template v-if="offerMix.offer.commission_client === 1">
                            <span v-if="offerMix.offer.commission_client_value">
                                {{ Number(offerMix.offer.commission_client_value) }}%
                            </span>
                            <span v-else>да</span>
                        </template>
                        <span v-else>нет</span>
                    </template>
                    <span v-else class="messenger-warning">?? </span>
                    <span>/ </span>
                    <template v-if="offerMix.offer.commission_agent">
                        <template v-if="offerMix.offer.commission_agent === 1">
                            <span v-if="offerMix.offer.commission_agent_value">
                                {{ Number(offerMix.offer.commission_agent_value) }}%
                            </span>
                            <span v-else>да</span>
                        </template>
                        <span v-else>нет</span>
                    </template>
                    <span v-else class="messenger-warning">?? </span>
                </template>
                <template #content>
                    <MessengerDialogObjectPreviewCommission :offer="offerMix.offer" />
                </template>
            </MessengerDialogPreviewTippy>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="налогообложение">
            <span v-if="offerMix.offer.tax_form">{{ taxForm }}</span>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="контракт">
            <span v-if="offerMix.offer.contract_is_signed === 1">
                {{ contractType }}
            </span>
            <template #warning>не подписан</template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="Built to Rent">
            <template v-if="offerMix.offer.built_to_suit" #default>
                <p v-if="offerMix.offer.built_to_suit === 1">
                    <span v-if="offerMix.offer.built_to_suit_time">
                        {{ offerMix.offer.built_to_suit_time }} мес.
                    </span>
                    <span v-else>да, без срока</span>
                    <span>/ </span>
                    <span v-if="offerMix.offer.built_to_suit_plan">
                        {{ offerMix.offer.built_to_suit_plan === 1 ? 'с планом' : 'без плана' }}
                    </span>
                    <span v-else class="messenger-warning">??</span>
                </p>
                <span v-else>нет</span>
            </template>
        </MessengerDialogPreviewRow>
    </div>
</template>
<script setup>
import MessengerDialogPreviewRow from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewRow.vue';
import { computed } from 'vue';
import MessengerDialogObjectPreviewCommission from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewCommission.vue';
import { dealOptions } from '@/const/options/deal.options.js';
import { dealProperties } from '@/const/properties/deal.properties.js';
import plural from 'plural-ru';
import MessengerDialogObjectPreviewStorageServices from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewStorageServices.vue';
import MessengerDialogPreviewTippy from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewTippy.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';

const props = defineProps({
    offerMix: {
        type: Object,
        required: true
    }
});

const taxForm = computed(() => dealOptions.tax[props.offerMix.offer.tax_form]);

const contractType = computed(() => {
    if (props.offerMix.offer.contract_is_signed_type === 1) return 'обычный';
    return 'эксклюзив';
});

const servicesCount = computed(() => {
    let count = 0;

    dealProperties.servicesWithCategories.map(category => {
        for (const property in category.properties) {
            if (props.offerMix.offer[property] === 1) count++;
        }
    });

    return count;
});

const pluralServicesCount = computed(() =>
    plural(servicesCount.value, '%d услуга', '%d услуги', '%d услуг')
);
</script>
