<template>
    <div
        class="company-box-objects-renter"
        :class="{
            'company-box-objects-renter--success': deal.is_our,
            'company-box-objects-renter--danger': isExpired
        }"
    >
        <i
            v-if="isExpired"
            v-tippy="'Скоро истечет!'"
            class="fa-bolt fa-solid icon company-box-objects-renter__expired"
        ></i>
        <div class="company-box-objects-renter__info">
            <p class="company-box-objects-renter__title">
                {{ $formatter.companyName(deal.company) }}
            </p>
            <ul class="company-box-objects-renter__list">
                <CompanyBoxObjectsRenterParameter label="Чья сделка">
                    <template v-if="deal.is_our === 1">PENNY LANE REALTY</template>
                    <template v-else-if="deal.is_competitor">
                        {{ deal.competitor.full_name || 'Неизвестно' }}
                    </template>
                </CompanyBoxObjectsRenterParameter>
                <CompanyBoxObjectsRenterParameter label="Площадь">
                    <WithUnitType v-if="deal.area" :unit-type="unitTypes.SQUARE_METERS">
                        {{ $formatter.number(deal.area) }}
                    </WithUnitType>
                </CompanyBoxObjectsRenterParameter>
                <CompanyBoxObjectsRenterParameter label="Цена пола">
                    <WithUnitType
                        v-if="deal.floorPrice"
                        :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
                    >
                        {{ $formatter.number(deal.floorPrice) }}
                    </WithUnitType>
                </CompanyBoxObjectsRenterParameter>
                <template v-if="extraIsOpen">
                    <CompanyBoxObjectsRenterParameter label="Дата сделки">
                        <template v-if="deal.dealDate">{{ createdAt }}</template>
                    </CompanyBoxObjectsRenterParameter>
                    <CompanyBoxObjectsRenterParameter label="Консультант">
                        <template v-if="deal.consultant?.userProfile">
                            {{ deal.consultant.userProfile.short_name }}
                        </template>
                    </CompanyBoxObjectsRenterParameter>
                    <CompanyBoxObjectsRenterParameter label="Срок">
                        <template v-if="deal.contractTerm">
                            {{ deal.contractTerm }} месяцев
                        </template>
                    </CompanyBoxObjectsRenterParameter>
                </template>
            </ul>
        </div>
        <Dropdown
            v-model="extraIsOpen"
            v-tippy="'Подробнее'"
            class="company-box-objects-renter__dropdown"
        />
    </div>
</template>

<script>
import Dropdown from '@/components/common/Dropdown/Dropdown.vue';
import dayjs from 'dayjs';
import CompanyBoxObjectsRenterParameter from '@/components/Company/Box/CompanyBoxObjectsRenterParameter.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';

export default {
    name: 'CompanyBoxObjectsRenter',
    components: { WithUnitType, CompanyBoxObjectsRenterParameter, Dropdown },
    props: {
        deal: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            extraIsOpen: false
        };
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        isExpired() {
            return this.deal.restOfTheTerm < 60 && this.deal.restOfTheTerm > 1;
        }
    },
    methods: {
        createdAt() {
            return dayjs(this.deal.dealDate).format('DD.MM.YY');
        }
    }
};
</script>
