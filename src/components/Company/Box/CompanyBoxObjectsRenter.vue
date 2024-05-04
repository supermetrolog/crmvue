<template>
    <div
        class="CompanyBoxObjectsRenter"
        :class="{
            'CompanyBoxObjectsRenter-success': deal.is_our,
            'CompanyBoxObjectsRenter-danger': deal.restOfTheTerm < 60 && deal.restOfTheTerm > 1
        }"
    >
        <i
            v-if="deal.restOfTheTerm < 60 && deal.restOfTheTerm > 1"
            class="fas fa-bolt fa-solid"
            title="Скоро истечет!"
        ></i>
        <a class="CompanyBoxObjectsRenter-logo">
            <img
                v-if="deal.logo"
                src="https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png"
                alt="нет лого"
            />
            <span v-else>нет лого</span>
        </a>
        <div class="CompanyBoxObjectsRenter-info">
            <span class="CompanyBoxObjectsRenter-info-name">{{ deal.company.nameRu || deal.company.nameEng }}</span>
            <ul class="CompanyBoxObjectsRenter-info-list">
                <li>
                    <span>чья сделка:</span>
                    <span v-if="deal.is_our == 1">PENNY LANE REALTY</span>
                    <span v-else-if="deal.is_competitor">{{ deal.competitor.full_name || 'неизвестно' }}</span>
                    <span v-else>нет данных</span>
                </li>
                <li>
                    <span>площадь:</span>
                    <span v-if="deal.area">{{ deal.area }} м2</span>
                    <span v-else>нет данных</span>
                </li>
                <template v-if="extraIsOpen">
                    <li>
                        <span>цена пола:</span>
                        <span v-if="deal.floorPrice">{{ deal.floorPrice }} м2/г</span>
                        <span v-else>нет данных</span>
                    </li>
                    <li>
                        <span>дата сделки:</span>
                        <span v-if="deal.dealDate">{{ dateFormatter(deal.dealDate) }}</span>
                        <span v-else>нет данных</span>
                    </li>
                    <li>
                        <span>консультант:</span>
                        <span v-if="deal.consultant?.userProfile">{{ deal.consultant.userProfile.short_name }}</span>
                        <span v-else>нет данных</span>
                    </li>
                    <li>
                        <span>срок:</span>
                        <span v-if="deal.contractTerm">{{ deal.contractTerm }} месяцев</span>
                        <span v-else>нет данных</span>
                    </li>
                </template>
            </ul>
        </div>
        <Dropdown v-model="extraIsOpen" class="CompanyBoxObjectsRenter-button" />
    </div>
</template>

<script>
import Dropdown from '@/components/common/Dropdown/Dropdown.vue';
import dayjs from 'dayjs';

export default {
    name: 'CompanyBoxObjectsRenter',
    components: { Dropdown },
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
    computed: {},
    methods: {
        dateFormatter(date) {
            return dayjs(date).format('DD.MM.YYYY');
        }
    }
};
</script>