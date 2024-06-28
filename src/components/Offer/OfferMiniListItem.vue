<template>
    <Tr :class="{ archived: offer.status === 2 }">
        <Td>{{ offer.visual_id }}</Td>
        <Td>{{ offer.calc_floors }} эт.</Td>
        <Td>
            <with-unit-type class="font-weight-bold" :unit-type="unitTypes.SQUARE_METERS">
                {{ offer.calc_area_general }}
            </with-unit-type>
        </Td>
        <Td>
            <with-unit-type :unit-type="unitTypes.METERS">
                {{
                    $formatter.numberOrRangeNew(offer.ceiling_height_min, offer.ceiling_height_max)
                }}
            </with-unit-type>
        </Td>
        <Td>{{ $formatter.text().ucFirst(offer.floor_type) }}</Td>
        <Td>
            <p>{{ offer.gate_num }} шт./{{ offer.gate_type }}</p>
        </Td>
        <Td>
            <p>{{ offer.heated ? 'Теплый' : 'Холодный' }}</p>
            <with-unit-type
                v-if="offer.temperature_min && offer.temperature_max"
                :unit-type="unitTypes.CELCIUS"
            >
                {{ $formatter.numberOrRangeNew(offer.temperature_min, offer.temperature_max) }}
            </with-unit-type>
            <p v-else>—</p>
        </Td>
        <Td>
            <with-unit-type
                class="font-weight-bold"
                :unit-type="
                    offer.deal_type === 2 ? unitTypes.RUB : unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR
                "
            >
                {{ offer.calc_price_general }}
            </with-unit-type>
        </Td>
        <Td>
            <div v-if="offer.status !== 2" class="offer-mini__advertisement">
                <i
                    v-if="offer.ad_cian"
                    v-tippy="'Циан'"
                    class="fa-solid fa-rocket icon"
                    style="color: blue"
                />
                <i
                    v-if="offer.ad_yandex"
                    v-tippy="'Яндекс'"
                    class="fa-solid fa-rocket icon"
                    style="color: orange"
                />
                <i
                    v-if="offer.ad_realtor"
                    v-tippy="'Realtor.ru'"
                    class="fa-solid fa-rocket icon"
                    style="color: red"
                />
                <i
                    v-if="offer.ad_free"
                    v-tippy="'Бесплатная'"
                    class="fa-solid fa-rocket icon"
                    style="color: green"
                />
                <Switch
                    @change="toggleAvito"
                    :checked="offer.ad_avito"
                    label="Авито"
                    :disabled="avitoIsLoading"
                />
            </div>
            <p v-else>—</p>
        </Td>
    </Tr>
</template>

<script>
import Tr from '@/components/common/Table/Tr.vue';
import Td from '@/components/common/Table/Td.vue';
import { mapActions } from 'vuex';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import Switch from '@/components/common/Forms/Switch.vue';

export default {
    name: 'OfferMiniListItem',
    components: {
        Switch,
        WithUnitType,
        Td,
        Tr
    },
    emits: ['toggle-avito'],
    props: {
        offer: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            avitoIsLoading: false
        };
    },
    computed: {
        unitTypes() {
            return unitTypes;
        }
    },
    methods: {
        ...mapActions(['TOGGLE_AVITO_AD']),
        async toggleAvito() {
            this.avitoIsLoading = true;

            const status = await this.TOGGLE_AVITO_AD(this.offer.original_id);
            if (status) this.$emit('toggle-avito');

            this.avitoIsLoading = false;
        }
    }
};
</script>
