import {
    ActivePassiveFUCK,
    DealTypeList,
    DirectionList,
    DistrictList,
    FloorTypesFUCK,
    GateTypeList,
    ObjectClassList,
    ObjectTypeList,
    YesNo,
    YesNoFUCK
} from '@/const/const.js';
import { mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            searchFormModalVisible: false,
            filtersValueGetter: {
                rangeMinElectricity: value => value + ' кВт',
                rangeMaxDistanceFromMKAD: value => value + ' км',
                deal_type: value => DealTypeList.find(el => el.value == value).label.toUpperCase(),
                agent_id: value =>
                    this.CONSULTANT_LIST.length
                        ? this.CONSULTANT_LIST.find(elem => elem.value == value).label
                        : null,
                rangeMinArea: value => value + ' м<sup>2</sup>',
                rangeMaxArea: value => value + ' м<sup>2</sup>',
                rangeMinPricePerFloor: value => value + ' р',
                rangeMaxPricePerFloor: value => value + ' р',
                rangeMinCeilingHeight: value => value + ' м',
                rangeMaxCeilingHeight: value => value + ' м',
                class: value => {
                    if (!value) return null;
                    if (!Array.isArray(value)) value = [value];
                    return value.map(elem => ObjectClassList[elem]).join(', ');
                },
                gates: value => {
                    if (!value) return null;
                    if (!Array.isArray(value)) value = [value];
                    return value.map(elem => GateTypeList[elem]).join(', ');
                },
                heated: value => {
                    if (!value) return null;
                    return YesNoFUCK[value];
                },
                floor_types: value => {
                    if (!value) return null;
                    if (!Array.isArray(value)) value = [value];
                    return value.map(elem => FloorTypesFUCK[elem]).join(', ');
                },
                purposes: value => {
                    if (!value) return null;
                    if (!Array.isArray(value)) value = [value];
                    const options = [
                        ...ObjectTypeList.warehouse,
                        ...ObjectTypeList.production,
                        ...ObjectTypeList.plot
                    ];

                    return value
                        .map(elem => {
                            const param = options.find(el => el.id == elem);
                            return `<i title="${param.name}"" class="' ${param.icon} '"></i>`;
                        })
                        .join(', ');
                },
                object_type: value => {
                    if (!value) return null;
                    if (!Array.isArray(value)) value = [value];
                    const options = { 1: 'Склад', 2: 'Производство', 3: 'Участок' };
                    return value.map(elem => options[elem]).join(', ');
                },
                region: value => {
                    if (!value || !this.REGION_LIST) return null;
                    const result = this.REGION_LIST.find(reg => reg.value == value).label;
                    if (this.$route.query.polygon) {
                        return '<p class="text-danger">' + result + '</p>';
                    }
                    return result;
                },
                // fakeRegion: null,
                district_moscow: value => {
                    if (!value) return null;
                    if (!Array.isArray(value)) value = [value];
                    const result = value.map(elem => DistrictList[elem]).join(', ');
                    if (this.$route.query.polygon) {
                        return '<p class="text-danger">' + result + '</p>';
                    }
                    return result;
                },
                direction: value => {
                    if (!value) return null;
                    if (!Array.isArray(value)) value = [value];
                    const result = value.map(elem => DirectionList[elem].full).join(', ');
                    if (this.$route.query.polygon) {
                        return '<p class="text-danger">' + result + '</p>';
                    }
                    return result;
                },
                status: value => {
                    if (!value) return null;
                    return ActivePassiveFUCK[value];
                },
                // firstFloorOnly: null,
                ad_realtor: value => {
                    if (!value) return null;
                    return YesNo[value];
                },
                ad_cian: value => {
                    if (!value) return null;
                    return YesNo[value];
                },
                ad_yandex: value => {
                    if (!value) return null;
                    return YesNo[value];
                },
                ad_free: value => {
                    if (!value) return null;
                    return YesNo[value];
                },
                ad_avito: value => {
                    if (!value) return null;
                    return YesNo[value];
                },
                sort: value => value
            }
        };
    },
    computed: {
        ...mapGetters([
            'OFFERS',
            'OFFERS_PAGINATION',
            'THIS_USER',
            'FAVORITES_OFFERS',
            'CONSULTANT_LIST',
            'REGION_LIST'
        ]),
        selectedFilterList() {
            let list = [];
            for (const key in this.$route.query) {
                if (Object.hasOwnProperty.call(this.$route.query, key)) {
                    const value = this.$route.query[key];
                    if (key === 'region') {
                        list.push(
                            this.getFilterListOption('region', this.$route.query['fakeRegion'])
                        );
                        continue;
                    }
                    if (
                        value !== null &&
                        value !== '' &&
                        key !== 'fakeRegion' &&
                        key !== 'region_neardy' &&
                        key !== 'all' &&
                        key !== 'page' &&
                        key !== 'outside_mkad' &&
                        !(Array.isArray(value) && !value.length)
                    ) {
                        list.push(this.getFilterListOption(key, value));
                    }
                }
            }
            return list;
        }
    },
    filtersAliases: {
        polygon: 'Область на карте',
        rangeMaxArea: 'До:',
        rangeMinArea: 'От:',
        rangeMaxDistanceFromMKAD: 'От МКАД:',
        rangeMinElectricity: 'От:',
        rangeMaxPricePerFloor: 'До:',
        rangeMinPricePerFloor: 'От:',
        rangeMinCeilingHeight: 'Потолки От:',
        rangeMaxCeilingHeight: 'Потолки До:',
        class: 'Класс:',
        heated: 'Отопление:',
        water: 'Вода',
        gas: 'Газ',
        steam: 'Пар',
        sewage_central: 'КНС',
        is_fake: 'Показать фейковые',
        racks: 'Стеллажи',
        railway: 'Ж/Д ветка',
        has_cranes: 'Краны',
        firstFloorOnly: 'Только 1 этаж',
        ad_realtor: 'Realtor.ru:',
        ad_cian: 'Циан:',
        ad_yandex: 'Яндекс:',
        ad_free: 'Бесплатно:',
        ad_avito: 'Авито:',
        favorites: 'Избранные',
        sort: 'Сортировка:'
    },
    methods: {
        ...mapActions(['FETCH_CONSULTANT_LIST', 'FETCH_REGION_LIST']),
        removeFilter(filter) {
            const query = { ...this.$route.query };
            if (filter === 'fakeRegion') {
                delete query['region'];
            }
            if (filter === 'region') {
                delete query['fakeRegion'];
                delete query['direction'];
                delete query['district_moscow'];
                delete query['outside_mkad'];
                delete query['region_neardy'];
            }
            delete query[filter];

            this.$router.replace({ query });
        },
        getFilterListOption(key, value) {
            const option = {};
            option.value = key;
            const label = this.$options.filtersAliases[key] ?? null;
            const valueFn = this.filtersValueGetter[key]
                ? this.filtersValueGetter[key](value)
                : null;

            if (!label && !valueFn) {
                option.label = 'undefined';
            } else {
                option.label = [label, valueFn].filter(el => el !== null).join(' ');
            }
            return option;
        },
        toggleSearchFormModalVisible() {
            this.searchFormModalVisible = !this.searchFormModalVisible;
        }
    },
    async created() {
        await this.FETCH_CONSULTANT_LIST();
        await this.FETCH_REGION_LIST();
        this.mounted = true;
    }
};
