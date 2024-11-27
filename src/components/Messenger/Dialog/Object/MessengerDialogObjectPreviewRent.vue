<template>
    <div class="messenger-dialog-preview__grid">
        <MessengerDialogPreviewRow v-if="offerMix.area_floor_full" label="цена пола">
            <template v-if="offerMix.calc_price_floor !== '0'" #default>
                <WithUnitType :unit-type="unitTypes.RUB_PER_SQUARE_METERS">
                    {{ offerMix.calc_price_floor }}
                </WithUnitType>
            </template>
            <template #warning>???</template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow v-if="offerMix.area_mezzanine_full" label="цена мезонина">
            <template v-if="offerMix.calc_price_mezzanine !== '0'" #default>
                <WithUnitType :unit-type="unitTypes.RUB_PER_SQUARE_METERS">
                    {{ offerMix.calc_price_mezzanine }}
                </WithUnitType>
            </template>
            <template #warning>???</template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow v-if="offerMix.area_office_full" label="цена офиса">
            <template v-if="offerMix.calc_price_office !== '0'" #default>
                <WithUnitType :unit-type="unitTypes.RUB_PER_SQUARE_METERS">
                    {{ offerMix.calc_price_office }}
                </WithUnitType>
            </template>
            <template #warning>???</template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="цена OPEX">
            <template v-if="offerMix.offer.price_opex">
                <span v-if="offerMix.offer.price_opex === 1">включен</span>
                <MessengerDialogPreviewTippy v-else-if="offerMix.offer.price_opex === 2">
                    <template #trigger>частично</template>
                    <template #content>
                        <MessengerDialogObjectPreviewOpex :options="offerMix.inc_opex" />
                    </template>
                </MessengerDialogPreviewTippy>
                <WithUnitType
                    v-else-if="offerMix.offer.price_opex === 3"
                    :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
                >
                    {{ toNumberFormat(offerMix.offer.price_opex_value) }}
                </WithUnitType>
                <span v-else class="messenger-warning">???</span>
            </template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="цена КУ">
            <template v-if="offerMix.offer.public_services">
                <span v-if="offerMix.offer.public_services === 1">включен</span>
                <MessengerDialogPreviewTippy v-else-if="offerMix.offer.public_services === 2">
                    <template #trigger>частично</template>
                    <template #content>
                        <MessengerDialogObjectPreviewServices :options="offerMix.inc_services" />
                    </template>
                </MessengerDialogPreviewTippy>
                <WithUnitType
                    v-else-if="offerMix.offer.public_services === 3"
                    :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
                >
                    {{ toNumberFormat(offerMix.offer.price_public_services) }}
                </WithUnitType>
                <span v-else class="messenger-warning">???</span>
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
        <MessengerDialogPreviewRow label="каникулы">
            <template v-if="offerMix.offer.holidays === 1" #default>
                <span v-if="offerMix.offer.holidays_value_min || offerMix.offer.holidays_value_max">
                    {{
                        toNumberOrRangeFormat(
                            offerMix.offer.holidays_value_min,
                            offerMix.offer.holidays_value_max
                        )
                    }}
                    мес.
                </span>
                <p v-else>да, <span class="messenger-warning">сроки не указаны</span></p>
            </template>
            <template v-else-if="offerMix.offer.holidays === 2" #default>нет</template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="депозит">
            <template v-if="offerMix.offer.deposit === 1" #default>
                <span v-if="offerMix.offer.deposit_value">
                    {{ offerMix.offer.deposit_value }}
                    мес.
                </span>
                <p v-else>да, <span class="messenger-warning">срок не указан</span></p>
            </template>
            <template v-else-if="offerMix.offer.deposit === 2" #default>нет</template>
        </MessengerDialogPreviewRow>
        <MessengerDialogPreviewRow label="готовность к въезду">
            <span class="color-light">[в разработке]</span>
        </MessengerDialogPreviewRow>
    </div>
</template>
<script setup>
import MessengerDialogPreviewRow from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewRow.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed } from 'vue';
import MessengerDialogObjectPreviewCommission from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewCommission.vue';
import MessengerDialogObjectPreviewOpex from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewOpex.vue';
import { toNumberFormat, toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import MessengerDialogObjectPreviewServices from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewServices.vue';
import { dealOptions } from '@/const/options/deal.options.js';
import MessengerDialogPreviewTippy from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewTippy.vue';

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
