<template>
    <div
        class="company-box-objects-renter"
        :class="{
            'company-box-objects-renter--success': deal.is_our,
            'company-box-objects-renter--danger': isExpired
        }"
    >
        <UiTooltipIcon
            v-if="isExpired"
            tooltip="Скоро истечет!"
            icon="fa-solid fa-bolt"
            class="icon company-box-objects-renter__expired"
        />
        <div class="company-box-objects-renter__info">
            <p class="company-box-objects-renter__title">
                {{ companyName }}
            </p>
            <ul class="company-box-objects-renter__list">
                <CompanyBoxObjectsRenterParameter label="Чья сделка">
                    <template v-if="deal.is_our === 1">RAYS ARMA</template>
                    <template v-else-if="deal.is_competitor">
                        {{ deal.competitor.full_name || 'Неизвестно' }}
                    </template>
                </CompanyBoxObjectsRenterParameter>
                <CompanyBoxObjectsRenterParameter label="Площадь">
                    <WithUnitType v-if="deal.area" :unit-type="unitTypes.SQUARE_METERS">
                        {{ dealArea }}
                    </WithUnitType>
                </CompanyBoxObjectsRenterParameter>
                <CompanyBoxObjectsRenterParameter label="Цена пола">
                    <WithUnitType
                        v-if="deal.floorPrice"
                        :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
                    >
                        {{ floorPrice }}
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
            ref="dropdownEl"
            v-model="extraIsOpen"
            class="company-box-objects-renter__dropdown"
        />
    </div>
</template>

<script setup>
import Dropdown from '@/components/common/Dropdown/Dropdown.vue';
import dayjs from 'dayjs';
import CompanyBoxObjectsRenterParameter from '@/components/Company/Box/CompanyBoxObjectsRenterParameter.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import UiTooltipIcon from '@/components/common/UI/UiTooltipIcon.vue';
import { computed, ref, useTemplateRef } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { useTippyText } from '@/composables/useTippyText.js';

const props = defineProps({
    deal: {
        type: Object,
        required: true
    }
});

const extraIsOpen = ref(false);

const companyName = computed(() => getCompanyName(props.deal.company));
const dealArea = computed(() => toNumberFormat(props.deal.area));
const floorPrice = computed(() => toNumberFormat(props.deal.floorPrice));

const isExpired = computed(() => props.deal.restOfTheTerm < 60 && props.deal.restOfTheTerm > 1);
const createdAt = computed(() => dayjs(props.deal.dealDate).format('DD.MM.YY'));

useTippyText(useTemplateRef('dropdownEl'), 'Подробнее');
</script>
