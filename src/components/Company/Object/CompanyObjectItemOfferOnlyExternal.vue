<template>
    <div class="col-12 text-center object-offer__external">
        <div v-if="offer.comments?.length" class="object-offer__comments mb-2">
            <DashboardChip class="dashboard-bg-light mx-auto mb-1">Комментарии:</DashboardChip>
            <p
                v-for="comment in offer.comments"
                :key="comment.id"
                class="object-offer__comment"
                :class="{ current: comment.timeline_step_id === currentStepID }"
            >
                {{ comment.comment }}
            </p>
            <hr />
        </div>
        <div class="object-offer__params">
            <CompanyObjectItemProperty title="Площадь объекта">
                <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                    {{ $formatter.number(offer.area_building) }}
                </with-unit-type>
            </CompanyObjectItemProperty>
            <CompanyObjectItemProperty title="Этажи">
                {{ offer.calc_floors }}
            </CompanyObjectItemProperty>
            <CompanyObjectItemProperty title="Потолки">
                <with-unit-type :unit-type="unitTypes.METERS">
                    {{ offer.calc_ceilingHeight }}
                </with-unit-type>
            </CompanyObjectItemProperty>
            <CompanyObjectItemProperty title="Электричество">
                <with-unit-type :unit-type="unitTypes.KILOWATT">
                    {{ $formatter.number(offer.power_value) }}
                </with-unit-type>
            </CompanyObjectItemProperty>
            <CompanyObjectItemProperty title="Тип ворот">
                {{ offer.gate_type || '-' }}
            </CompanyObjectItemProperty>
            <CompanyObjectItemProperty title="Отапливаемый">
                {{ offer.heated ? 'Да' : 'Нет' }}
            </CompanyObjectItemProperty>
            <CompanyObjectItemProperty title="Антипыль">
                {{ offer.self_leveling ? 'Да' : 'Нет' }}
            </CompanyObjectItemProperty>
            <CompanyObjectItemProperty title="Краны">
                {{ offer.has_cranes ? 'Да' : 'Нет' }}
            </CompanyObjectItemProperty>
            <CompanyObjectItemProperty title="От МКАД">
                {{ offer.from_mkad }} <small>км</small>
            </CompanyObjectItemProperty>
        </div>
        <div class="object-offer__block">
            <p class="object-offer__block-title">Адрес</p>
            <p>{{ offer.address }}</p>
        </div>
        <div class="object-offer__block">
            <p class="object-offer__block-title">Ручное описание</p>
            <p>
                {{ offer.object.description || '—' }}
            </p>
        </div>
        <div class="object-offer__block">
            <p class="object-offer__block-title">Авто описание</p>
            <p>
                {{ offer.object.description_auto || '—' }}
            </p>
        </div>
    </div>
</template>

<script>
import CompanyObjectItemProperty from '@/components/Company/Object/CompanyObjectItemProperty.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

export default {
    name: 'CompanyObjectItemOfferOnlyExternal',
    components: {
        DashboardChip,
        WithUnitType,
        CompanyObjectItemProperty
    },
    props: {
        offer: {
            type: Object
        },
        currentStepID: {
            type: Number,
            required: true
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        }
    }
};
</script>
