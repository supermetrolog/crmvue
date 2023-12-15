import Form from '@/components/common/Forms/Form.vue';
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import Input from '@/components/common/Forms/Input.vue';
import Checkbox from '@/components/common/Forms/Checkbox.vue';
import Radio from '@/components/common/Forms/Radio.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import CheckboxIcons from '@/components/common/Forms/CheckboxIcons.vue';
import { SearchFormMixin } from '@/components/common/mixins.js';
import { mapActions, mapGetters } from 'vuex';
import {
    ActivePassiveFUCK,
    DealTypeList,
    DirectionList,
    DistrictList,
    FloorTypesFUCK,
    GateTypeList,
    ObjectClassList,
    ObjectTypeList,
    OutsideMkad,
    RegionList,
    YesNo,
    YesNoFUCK
} from '@/const/const.js';

export const FormMixin = {
    mixins: [SearchFormMixin],
    name: 'OfferSearchForm',
    components: {
        Form,
        FormGroup,
        Input,
        MultiSelect,
        Checkbox,
        Radio,
        CheckboxIcons
    },
    data() {
        return {
            dealTypeList: DealTypeList.get('param'),
            objectClassList: ObjectClassList.get('param'),
            gateTypeList: GateTypeList.get('param'),
            yesNoFUCKOptions: YesNoFUCK.get('param'),
            yesNoOptions: YesNo.get('param'),
            outsideMkadOptions: OutsideMkad.get('param'),
            floorTypesFUCKOptions: FloorTypesFUCK.get('param'),
            objectTypeListWareHouse: ObjectTypeList.get('warehouse'),
            objectTypeListProduction: ObjectTypeList.get('production'),
            objectTypeListPlot: ObjectTypeList.get('plot'),
            regionList: RegionList.get('param'),
            directionList: DirectionList.get('param'),
            districtList: DistrictList.get('param'),
            activePassiveOptions: ActivePassiveFUCK.get('param'),
            region: null
        };
    },
    props: {
        additionalButtons: {
            type: Array
        },
        objectsCount: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapGetters(['FAVORITES_OFFERS', 'REGION_LIST']),
        favoritesCount() {
            return this.FAVORITES_OFFERS.length;
        },
        filterCount() {
            let count = 0;
            for (const key in this.$options.defaultFormProperties) {
                if (Object.hasOwnProperty.call(this.form, key)) {
                    const value = this.form[key];
                    if (
                        value !== null &&
                        value !== '' &&
                        key != 'fakeRegion' &&
                        key != 'region_neardy' &&
                        key != 'outside_mkad'
                    ) {
                        if (Array.isArray(value)) {
                            if (value.length) {
                                count++;
                            }
                        } else {
                            count++;
                        }
                    }
                }
            }
            return count;
        }
    },
    defaultFormProperties: {
        all: null,
        rangeMinElectricity: null,
        rangeMaxDistanceFromMKAD: null,
        deal_type: null,
        agent_id: null,
        rangeMaxArea: null,
        rangeMinArea: null,
        rangeMaxPricePerFloor: null,
        rangeMinPricePerFloor: null,
        rangeMinCeilingHeight: null,
        rangeMaxCeilingHeight: null,
        class: [],
        gates: [],
        heated: null,
        water: null,
        gas: null,
        steam: null,
        sewage_central: null,
        racks: null,
        railway: null,
        has_cranes: null,
        floor_types: [],
        purposes: [],
        object_type: [],
        region: [],
        fakeRegion: null,
        direction: [],
        district_moscow: [],
        status: null,
        firstFloorOnly: null,
        ad_realtor: null,
        ad_cian: null,
        ad_yandex: null,
        ad_free: null,
        favorites: null,
        outside_mkad: null,
        region_neardy: null,
        polygon: null
    },
    methods: {
        ...mapActions(['FETCH_CONSULTANT_LIST', 'FETCH_REGION_LIST']),
        setDefaultFields() {
            this.form = { ...this.$options.defaultFormProperties };
        },
        async setQueryFields() {
            this.form = { ...this.form, ...this.$route.query };
            if (this.form.purposes && !Array.isArray(this.form.purposes)) {
                this.form.purposes = [this.form.purposes];
            }
            if (this.form.class && !Array.isArray(this.form.class)) {
                this.form.class = [this.form.class];
            }
            if (this.form.gates && !Array.isArray(this.form.gates)) {
                this.form.gates = [this.form.gates];
            }
            if (this.form.region && !Array.isArray(this.form.region)) {
                this.form.region = [this.form.region];
            }
            if (this.form.direction && !Array.isArray(this.form.direction)) {
                this.form.direction = [this.form.direction];
            }
            if (this.form.polygon && !Array.isArray(this.form.polygon)) {
                this.form.polygon = [this.form.polygon];
            }
            if (this.form.district_moscow && !Array.isArray(this.form.district_moscow)) {
                this.form.district_moscow = [this.form.district_moscow];
            }
            if (this.form.object_type && !Array.isArray(this.form.object_type)) {
                this.form.object_type = [this.form.object_type];
            }

            if (this.form.floor_types && !Array.isArray(this.form.floor_types)) {
                this.form.floor_types = [this.form.floor_types];
            }
            let array = [];
            this.form.purposes.forEach(item => {
                array.push(+item);
            });
            this.form.purposes = array;
            array = [];
            this.form.object_type.forEach(item => {
                array.push(+item);
            });
            this.form.object_type = array;
            let query = { ...this.form };
            this.deleteEmptyFields(query);
            await this.$router.replace({ query });
        },
        changeRegion() {
            if (
                this.form.fakeRegion == null ||
                (Array.isArray(this.form.fakeRegion) && this.form.fakeRegion.length == 0)
            ) {
                this.form.region = [];
                this.form.direction = [];
                this.form.district_moscow = [];
                this.form.region_neardy = null;
                this.form.outside_mkad = null;
                return;
            }
            this.form.direction = [];
            this.form.region_neardy = null;
            this.form.district_moscow = [];
            this.form.outside_mkad = null;
            if (this.form.fakeRegion == 'mskandmo') {
                return (this.form.region = [1, 6]);
            }
            if (this.form.fakeRegion == 'mskinsidemkad') {
                this.form.region = [6];
                return (this.form.outside_mkad = 0);
            }
            if (this.form.fakeRegion == 'moandmskoutsidemkad') {
                this.form.region = [1, 6];
                return (this.form.outside_mkad = 1);
            }
            if (this.form.fakeRegion == 'moandregionneardy') {
                this.form.region = [1];
                return (this.form.region_neardy = 1);
            }

            this.form.region = [this.form.fakeRegion];
        },
        selectObjectType(isSelected, type) {
            this.form.object_type = this.form.object_type.filter(item => item != type);
            if (isSelected) {
                this.form.object_type.push(type);
            }
        },
        clickFavorites() {
            if (this.form.favorites) {
                this.form.favorites = null;
            } else {
                this.form.favorites = 1;
            }
        }
    }
};
