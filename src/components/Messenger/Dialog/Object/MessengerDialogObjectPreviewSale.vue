<template>
    <div class="messenger-dialog-preview__grid">
        <MessengerDialogPreviewRow v-if="offerMix.area_floor_full" label="цена пола">
            <MessengerDialogPreviewTippy v-if="offerMix.price_sale_min || offerMix.price_sale_max">
                <template #trigger>
                    <WithUnitType :unit-type="unitTypes.RUB_PER_SQUARE_METERS">
                        {{
                            toNumberOrRangeFormat(offerMix.price_sale_min, offerMix.price_sale_max)
                        }}
                    </WithUnitType>
                </template>
                <template #content>
                    <p class="messenger-dialog-preview-tippy__title mb-1">Цена за всю площадь:</p>
                    <WithUnitType :unit-type="unitTypes.RUB">
                        {{
                            toNumberOrRangeFormat(
                                offerMix.price_sale_min_all,
                                offerMix.price_sale_max_all
                            )
                        }}
                    </WithUnitType>
                </template>
            </MessengerDialogPreviewTippy>
            <template #warning>???</template>
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
        <MessengerDialogPreviewRow label="контракт">
            <span v-if="offerMix.offer.contract_is_signed === 1">
                {{ contractType }}
            </span>
            <template #warning>не подписан</template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="налогообложение">
            <span v-if="offerMix.offer.tax_form">{{ taxForm }}</span>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="продажа юр.лица">
            <span v-if="offerMix.offer.sale_company">
                {{ offerMix.offer.sale_company === 1 ? 'да' : 'нет' }}
            </span>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="Built to Suit">
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
        <MessengerDialogPreviewRow label="арендный бизнес">
            <template v-if="offerMix.offer.rent_business" #default>
                <MessengerDialogPreviewTippy v-if="offerMix.offer.rent_business === 1">
                    <template #trigger>да</template>
                    <template #content>
                        <MessengerDialogObjectPreviewBusiness :offer="offerMix.offer" />
                    </template>
                </MessengerDialogPreviewTippy>
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
import MessengerDialogObjectPreviewBusiness from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewBusiness.vue';
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
</script>
