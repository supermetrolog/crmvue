<template>
    <MessengerDialogObjectPreviewSkeleton v-if="isLoading && opened" />
    <div v-else-if="opened" class="messenger-dialog-object-preview">
        <MessengerDialogPreviewTab title="Проверьте выбранный тип и назначение!">
            <EditableObjectPurposes
                @update="updatePurposes"
                :purposes="targetObject.purposes"
                :object-types="targetObject.object_type"
                :size="30"
                buttons-class="small"
            />
        </MessengerDialogPreviewTab>
        <MessengerDialogPreviewTab
            :title="objectDescriptionTabLabel"
            :has-warning="objectHasWarnings"
            :loading="isLoading"
        >
            <div class="messenger-dialog-preview__grid">
                <MessengerDialogPreviewRow label="фото" editable>
                    <template v-if="targetObject.photo?.length >= 5" #default>
                        {{ pluralPhotoLength }}
                    </template>
                    <template #warning>
                        менее 5 фото (загружено {{ targetObject.photo.length }})
                    </template>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="полная площадь" editable>
                    <WithUnitType v-if="fullArea" :unit-type="unitTypes.SQUARE_METERS">
                        {{ fullArea }}
                    </WithUnitType>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="эл-во общее" editable>
                    <WithUnitType v-if="targetObject.power" :unit-type="unitTypes.KILOWATT">
                        {{ toNumberFormat(Number(targetObject.power)) }}
                    </WithUnitType>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="эл-во выделенное">
                    <span class="color-light">[в разработке]</span>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow editable>
                    <template #label>
                        <span>м<sup>3</sup> водоснабжение</span>
                    </template>
                    <template #default>
                        <WithUnitType v-if="targetObject.water" :unit-type="unitTypes.CUBIC_METERS">
                            {{ toNumberFormat(Number(targetObject.water)) }}
                        </WithUnitType>
                    </template>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow editable>
                    <template #label>
                        <span>м<sup>3</sup> канализация</span>
                    </template>
                    <template v-if="targetObject.sewage || targetObject.sewage_rain" #default>
                        <p v-if="targetObject.sewage === 1">
                            <WithUnitType v-if="targetObject.sewage_central_value">
                                {{ toNumberFormat(targetObject.sewage_central_value) }}
                            </WithUnitType>
                            <span v-else class="messenger-warning">объем не заполнен</span>
                            <span>,</span>
                        </p>
                        <p v-else-if="targetObject.sewage === 2">центральной нет,</p>
                        <p v-else class="messenger-warning">центральная не заполнена,</p>
                        <p v-if="targetObject.sewage_rain === 1">+ есть ливневка</p>
                        <p v-else-if="targetObject.sewage_rain === 2">ливневки нет</p>
                        <p v-else class="messenger-warning">ливневка не заполнена</p>
                    </template>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="Ж/Д" editable>
                    <template v-if="targetObject.railway === 1">
                        <WithUnitType
                            v-if="targetObject.railway_value"
                            :unit-type="unitTypes.METERS"
                        >
                            Да, {{ toNumberFormat(targetObject.railway_value) }}
                        </WithUnitType>
                        <p v-else>
                            <span>Да, </span>
                            <span class="messenger-warning">длина не указана</span>
                        </p>
                    </template>
                    <span v-else-if="targetObject.railway === 2">нет</span>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="въезд на территорию" editable>
                    <MessengerDialogPreviewTippy
                        v-if="targetObject.entry_territory_type || targetObject.entry_territory"
                    >
                        <template #trigger>
                            <p v-if="targetObject.entry_territory_type">
                                {{ entryTerritoryType }}
                            </p>
                            <p v-if="targetObject.entry_territory">
                                {{ entryTerritoryPrice }}
                            </p>
                        </template>
                        <template #content>
                            <MessengerDialogObjectPreviewParking :object="targetObject" />
                        </template>
                    </MessengerDialogPreviewTippy>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="планировки" editable>
                    <template v-if="targetObject.building_layouts && buildingLayoutsCount" #default>
                        {{ pluralBuildingLayoutsCount }}
                    </template>
                    <template #warning>не загружены</template>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="кадастровый номер" editable>
                    <span v-if="targetObject.cadastral_number">{{
                        targetObject.cadastral_number
                    }}</span>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="земельный участок" editable>
                    <span class="color-light">[в разработке]</span>
                </MessengerDialogPreviewRow>
            </div>
        </MessengerDialogPreviewTab>
        <MessengerDialogPreviewTab v-if="showOffers" title="Проверьте цену и параметры сделки!">
            <Tabs
                ref="tabs"
                nav-class="messenger-dialog-preview__tabs"
                nav-item-class="messenger-dialog-preview__tab"
                nav-item-link-class="messenger-dialog-preview__tab-link"
                with-transition
                :transition-speed="0.8"
                :closed="!targetObject.offerMix?.length"
            >
                <Tab
                    v-if="anyTabShouldBeVisible || rentTabShouldBeVisible"
                    id="rent"
                    name="Аренда"
                    :is-disabled="!rentOfferMix"
                >
                    <MessengerDialogObjectPreviewRent
                        v-if="rentOfferMix"
                        :offer-mix="rentOfferMix"
                    />
                </Tab>
                <Tab
                    v-if="anyTabShouldBeVisible || saleTabShouldBeVisible"
                    id="sale"
                    name="Продажа"
                    :is-disabled="!saleOfferMix"
                >
                    <MessengerDialogObjectPreviewSale
                        v-if="saleOfferMix"
                        :offer-mix="saleOfferMix"
                    />
                </Tab>
                <Tab
                    v-if="anyTabShouldBeVisible || storageTabShouldBeVisible"
                    name="Отв.хран"
                    :is-disabled="!storageOfferMix"
                >
                    <MessengerDialogObjectPreviewStorage
                        v-if="storageOfferMix"
                        :offer-mix="storageOfferMix"
                    />
                </Tab>
                <Tab
                    v-if="anyTabShouldBeVisible || subleaseTabShouldBeVisible"
                    name="Субаренда"
                    :is-disabled="!subleaseOfferMix"
                >
                    <MessengerDialogObjectPreviewSublease
                        v-if="subleaseOfferMix"
                        :offer-mix="subleaseOfferMix"
                    />
                </Tab>
            </Tabs>
        </MessengerDialogPreviewTab>
    </div>
</template>
<script setup>
import MessengerDialogPreviewTab from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewTab.vue';
import { computed, onMounted, ref, shallowRef, toRef, useTemplateRef, watch } from 'vue';
import MessengerDialogPreviewRow from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewRow.vue';
import api from '@/api/api.js';
import { plural } from '@/utils/plural.js';
import MessengerDialogObjectPreviewSkeleton from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewSkeleton.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { complexOptions } from '@/const/options/complex.options.js';
import MessengerDialogObjectPreviewParking from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewParking.vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import MessengerDialogObjectPreviewRent from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewRent.vue';
import { dealOptions } from '@/const/options/deal.options.js';
import EditableObjectPurposes from '@/components/Object/EditableObjectPurposes.vue';
import Tab from '@/components/common/Tabs/Tab.vue';
import Tabs from '@/components/common/Tabs/Tabs.vue';
import MessengerDialogObjectPreviewSale from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewSale.vue';
import MessengerDialogObjectPreviewStorage from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewStorage.vue';
import MessengerDialogPreviewTippy from '@/components/Messenger/Dialog/Preview/MessengerDialogPreviewTippy.vue';
import MessengerDialogObjectPreviewSublease from '@/components/Messenger/Dialog/Object/MessengerDialogObjectPreviewSublease.vue';
import { objectChatMemberTypes } from '@/const/messenger.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { usePlural } from '@/composables/usePlural.js';

const emit = defineEmits(['changed-warnings']);
const props = defineProps({
    objectId: Number,
    object: Object,
    objectChatMemberType: String,
    opened: {
        type: Boolean,
        default: true
    },
    showOffers: {
        type: Boolean,
        default: true
    }
});

const tabs = useTemplateRef('tabs');

const isLoading = ref(isNullish(props.object));
const localeObject = shallowRef(null);

const targetObject = computed(() => props.object ?? localeObject.value);

const objectDescriptionTabLabel = computed(() => {
    if (objectHasWarnings.value) return 'Объект имеет недочеты!';
    return 'Проверьте информацию об объекте!';
});

const objectHasWarnings = computed(() => {
    if (isNullish(targetObject.value)) return false;

    return (
        targetObject.value.photo?.length < 5 ||
        !targetObject.value.power ||
        !targetObject.value.water ||
        (!targetObject.value.sewage && !targetObject.value.sewage_rain) ||
        !targetObject.value.railway ||
        (!targetObject.value.entry_territory_type && !targetObject.value.entry_territory) ||
        !targetObject.value.building_layouts?.length ||
        !targetObject.value.cadastral_number
    );
});

watch(
    objectHasWarnings,
    value => {
        emit('changed-warnings', value);
    },
    { immediate: true }
);

const pluralPhotoLength = usePlural(
    toRef(() => targetObject.value.photo.length),
    '%d фотография',
    '%d фотографии',
    '%d фотографий'
);

const fullArea = computed(() => {
    return toNumberFormat(
        targetObject.value.is_land
            ? targetObject.value.area_field_full
            : targetObject.value.area_building
    );
});

const buildingLayoutsCount = computed(() => {
    if (Array.isArray(targetObject.value.building_layouts))
        return targetObject.value.building_layouts.length;
    else if (typeof targetObject.value.building_layouts === 'string')
        return JSON.parse(targetObject.value.building_layouts)?.length;

    return 0;
});

const pluralBuildingLayoutsCount = computed(() =>
    plural(buildingLayoutsCount.value, 'загружена %d пл.', 'загружено %d пл.', 'загружено %d пл.')
);

const entryTerritoryType = computed(
    () => complexOptions.entryTerritory[targetObject.value.entry_territory_type]
);
const entryTerritoryPrice = computed(
    () => complexOptions.entryTerritoryPrice[targetObject.value.entry_territory]
);

const rentOfferMix = computed(() =>
    targetObject.value.offerMix.find(
        element => element.deal_type === dealOptions.typeStatement.RENT
    )
);

const saleOfferMix = computed(() =>
    targetObject.value.offerMix.find(
        element => element.deal_type === dealOptions.typeStatement.SALE
    )
);

const storageOfferMix = computed(() =>
    targetObject.value.offerMix.find(
        element => element.deal_type === dealOptions.typeStatement.STORAGE
    )
);

const subleaseOfferMix = computed(() =>
    targetObject.value.offerMix.find(
        element => element.deal_type === dealOptions.typeStatement.SUBLEASE
    )
);

const selectActiveTab = () => {
    if (
        isNotNullish(props.objectChatMemberType) &&
        props.objectChatMemberType === objectChatMemberTypes.RENT_OR_SALE &&
        !rentOfferMix.value &&
        saleOfferMix.value
    )
        tabs.value.selectTab('#sale');
};

const fetchObject = async () => {
    isLoading.value = true;

    const response = await api.object.list({ id: props.objectId });
    if (response.data?.length) localeObject.value = response.data[0];

    isLoading.value = false;
};

const updatePurposes = async purposes => {
    console.log(purposes);
};

onMounted(async () => {
    if (isNullish(props.object)) {
        await fetchObject();
    }

    selectActiveTab();
});

// tabs

const anyTabShouldBeVisible = computed(() => isNullish(props.objectChatMemberType));

const rentTabShouldBeVisible = computed(() => {
    return props.objectChatMemberType === objectChatMemberTypes.RENT_OR_SALE;
});

const saleTabShouldBeVisible = computed(() => {
    return props.objectChatMemberType === objectChatMemberTypes.RENT_OR_SALE;
});

const storageTabShouldBeVisible = computed(() => {
    return props.objectChatMemberType === objectChatMemberTypes.STORAGE;
});

const subleaseTabShouldBeVisible = computed(() => {
    return props.objectChatMemberType === objectChatMemberTypes.SUBLEASE;
});
</script>
