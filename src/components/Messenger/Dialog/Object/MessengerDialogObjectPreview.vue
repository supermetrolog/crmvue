<template>
    <MessengerDialogObjectPreviewSkeleton v-if="isLoading" />
    <div v-else class="messenger-dialog-object-preview">
        <MessengerDialogPreviewTab title="Проверьте выбранный тип и назначение!">
            <EditableObjectPurposes
                @update="updatePurposes"
                :purposes="object.purposes"
                :object-types="object.object_type"
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
                    <template v-if="object.photo?.length >= 5" #default>
                        {{ pluralPhotoLength }}
                    </template>
                    <template #warning>менее 5 фото (загружено {{ object.photo.length }})</template>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="полная площадь" editable>
                    <WithUnitType v-if="object.area_building" :unit-type="unitTypes.SQUARE_METERS">
                        {{ toNumberFormat(Number(object.area_building)) }}
                    </WithUnitType>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="эл-во общее" editable>
                    <WithUnitType v-if="object.power" :unit-type="unitTypes.KILOWATT">
                        {{ toNumberFormat(Number(object.power)) }}
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
                        <WithUnitType v-if="object.water" :unit-type="unitTypes.CUBIC_METERS">
                            {{ toNumberFormat(Number(object.water)) }}
                        </WithUnitType>
                    </template>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow editable>
                    <template #label>
                        <span>м<sup>3</sup> канализация</span>
                    </template>
                    <template v-if="object.sewage || object.sewage_rain" #default>
                        <p v-if="object.sewage === 1">
                            <WithUnitType v-if="object.sewage_central_value">
                                {{ toNumberFormat(object.sewage_central_value) }}
                            </WithUnitType>
                            <span v-else class="messenger-warning">объем не заполнен</span>
                            <span>,</span>
                        </p>
                        <p v-else-if="object.sewage === 2">центральной нет,</p>
                        <p v-else class="messenger-warning">центральная не заполнена,</p>
                        <p v-if="object.sewage_rain === 1">+ есть ливневка</p>
                        <p v-else-if="object.sewage_rain === 2">ливневки нет</p>
                        <p v-else class="messenger-warning">ливневка не заполнена</p>
                    </template>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="Ж/Д" editable>
                    <template v-if="object.railway === 1">
                        <WithUnitType v-if="object.railway_value" :unit-type="unitTypes.METERS">
                            Да, {{ toNumberFormat(object.railway_value) }}
                        </WithUnitType>
                        <p v-else>
                            <span>Да, </span>
                            <span class="messenger-warning">длина не указана</span>
                        </p>
                    </template>
                    <span v-else-if="object.railway === 2">нет</span>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="въезд на территорию" editable>
                    <MessengerDialogPreviewTippy
                        v-if="object.entry_territory_type || object.entry_territory"
                    >
                        <template #trigger>
                            <p v-if="object.entry_territory_type">
                                {{ entryTerritoryType }}
                            </p>
                            <p v-if="object.entry_territory">
                                {{ entryTerritoryPrice }}
                            </p>
                        </template>
                        <template #content>
                            <MessengerDialogObjectPreviewParking :object="object" />
                        </template>
                    </MessengerDialogPreviewTippy>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="планировки" editable>
                    <template v-if="object.building_layouts && buildingLayoutsCount" #default>
                        {{ pluralBuildingLayoutsCount }}
                    </template>
                    <template #warning>не загружены</template>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="кадастровый номер" editable>
                    <span v-if="object.cadastral_number">{{ object.cadastral_number }}</span>
                </MessengerDialogPreviewRow>
                <MessengerDialogPreviewRow label="земельный участок" editable>
                    <span class="color-light">[в разработке]</span>
                </MessengerDialogPreviewRow>
            </div>
        </MessengerDialogPreviewTab>
        <MessengerDialogPreviewTab title="Проверьте цену и параметры сделки!">
            <Tabs
                ref="tabs"
                nav-class="messenger-dialog-preview__tabs"
                nav-item-class="messenger-dialog-preview__tab"
                nav-item-link-class="messenger-dialog-preview__tab-link"
                with-transition
                :transition-speed="0.8"
                :closed="!object.offerMix?.length"
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
import { computed, onMounted, shallowRef, toRef, useTemplateRef } from 'vue';
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

defineEmits(['update-call']);
const props = defineProps({
    objectId: {
        type: Number,
        required: true
    },
    objectChatMemberType: String,
    opened: {
        type: Boolean,
        default: false
    }
});

const tabs = useTemplateRef('tabs');

const isLoading = shallowRef(true);
const object = shallowRef(null);

const objectDescriptionTabLabel = computed(() => {
    if (objectHasWarnings.value) return 'Объект имеет недочеты!';
    return 'Проверьте информацию об объекте!';
});

const objectHasWarnings = computed(() => {
    return (
        object.value.photo?.length < 5 ||
        !object.value.power ||
        !object.value.water ||
        (!object.value.sewage && !object.value.sewage_rain) ||
        !object.value.railway ||
        (!object.value.entry_territory_type && !object.value.entry_territory) ||
        !object.value.building_layouts?.length ||
        !object.value.cadastral_number
    );
});

const pluralPhotoLength = usePlural(
    toRef(() => object.value?.photo?.length),
    '%d фотография',
    '%d фотографии',
    '%d фотографий'
);

const buildingLayoutsCount = computed(() => {
    if (Array.isArray(object.value.building_layouts)) return object.value.building_layouts.length;
    else if (typeof object.value.building_layouts === 'string')
        return JSON.parse(object.value.building_layouts)?.length;

    return 0;
});

const pluralBuildingLayoutsCount = computed(() =>
    plural(buildingLayoutsCount.value, 'загружена %d пл.', 'загружено %d пл.', 'загружено %d пл.')
);

const entryTerritoryType = computed(
    () => complexOptions.entryTerritory[object.value.entry_territory_type]
);
const entryTerritoryPrice = computed(
    () => complexOptions.entryTerritoryPrice[object.value.entry_territory]
);

const rentOfferMix = computed(() =>
    object.value.offerMix.find(element => element.deal_type === dealOptions.typeStatement.RENT)
);

const saleOfferMix = computed(() =>
    object.value.offerMix.find(element => element.deal_type === dealOptions.typeStatement.SALE)
);

const storageOfferMix = computed(() =>
    object.value.offerMix.find(element => element.deal_type === dealOptions.typeStatement.STORAGE)
);

const subleaseOfferMix = computed(() =>
    object.value.offerMix.find(element => element.deal_type === dealOptions.typeStatement.SUBLEASE)
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
    if (response.data?.length) object.value = response.data[0];

    isLoading.value = false;
};

const updatePurposes = async purposes => {
    console.log(purposes);
};

onMounted(async () => {
    await fetchObject();
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
