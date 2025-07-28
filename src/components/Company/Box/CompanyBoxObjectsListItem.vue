<template>
    <div class="company-box-object">
        <div class="company-box-object__wrapper">
            <div class="company-box-object__preview">
                <a :href="oldObjectUrl" class="button button--small w-100" target="_blank">
                    Старая версия
                </a>
                <a
                    v-tippy="object.description_auto"
                    :href="objectUrl"
                    target="_blank"
                    class="company-box-object__thumb"
                >
                    <VLazyImage
                        :src="object.thumb ?? imageSrc"
                        class="company-box-object__image"
                        alt="complex image"
                    />
                </a>
            </div>
            <div class="company-box-object__info">
                <div class="company-box-object__title">
                    <DashboardChip class="dashboard-bg-light">ID-{{ object.id }}</DashboardChip>
                    <DashboardChip class="dashboard-bg-light">
                        <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                            {{ $formatter.number(object.area_building) }}
                        </WithUnitType>
                    </DashboardChip>
                </div>
                <p>{{ object.address }}</p>
                <p v-if="object.complex.location && location.length">{{ location }}</p>
                <p v-if="object.from_mkad">{{ object.from_mkad }} км от МКАД</p>
            </div>
        </div>
        <div
            v-if="object.offerMix.length || object.deals.length"
            class="company-box-object__dropdown"
        >
            <hr />
            <AccordionSimple v-if="object.offerMix.length" without-render class="mb-1">
                <template #title>
                    <AccordionSimpleTriggerButton :label="objectsDropdownTitle" />
                </template>
                <template #body>
                    <div class="company-box-object__list mt-2">
                        <CompanyBoxObjectsOffer
                            v-for="offer in object.offerMix"
                            :key="offer.id"
                            :offer="offer"
                        />
                    </div>
                </template>
            </AccordionSimple>
            <AccordionSimple v-if="object.deals.length" without-render>
                <template #title>
                    <AccordionSimpleTriggerButton :label="dealsDropdownTitle" />
                </template>
                <template #body>
                    <div class="company-box-object__list mt-2">
                        <CompanyBoxObjectsRenter
                            v-for="deal in object.deals"
                            :key="deal.id"
                            :deal="deal"
                        />
                    </div>
                </template>
            </AccordionSimple>
        </div>
    </div>
</template>

<script>
import { OldDbDirectionList } from '@/const/const.js';
import CompanyBoxObjectsOffer from '@/components/Company/Box/CompanyBoxObjectsOffer.vue';
import CompanyBoxObjectsRenter from '@/components/Company/Box/CompanyBoxObjectsRenter.vue';
import VLazyImage from 'v-lazy-image';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTriggerButton from '@/components/common/Accordion/AccordionSimpleTriggerButton.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { getApiFileNotFound, getLinkComplexOld, getLinkUpload } from '@/utils/url.js';

export default {
    name: 'CompanyBoxObjectsListItem',
    components: {
        DashboardChip,
        AccordionSimpleTriggerButton,
        AccordionSimple,
        WithUnitType,
        VLazyImage,
        CompanyBoxObjectsRenter,
        CompanyBoxObjectsOffer
    },
    props: {
        object: {
            type: Object,
            required: true
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        imageSrc() {
            if (Array.isArray(this.object.photo)) {
                return getLinkUpload(this.object.photo[0]);
            }

            return getApiFileNotFound();
        },
        objectUrl() {
            return this.$router.resolve({
                name: 'ComplexView',
                params: { complex_id: this.object.complex_id }
            }).href;
        },
        oldObjectUrl() {
            return getLinkComplexOld(this.object.complex_id);
        },
        location() {
            let direction =
                typeof this.object.complex.location.direction === 'number'
                    ? OldDbDirectionList[this.object.complex.location.direction]?.long
                    : null;
            let highway = this.object.complex.location.highwayRel?.title
                ? this.object.complex.location.highwayRel.title
                : null;

            highway ? (highway = highway[0].toUpperCase() + highway.slice(1) + ' ш.') : highway;

            if (direction && highway) return `${direction}, ${highway}`;
            if (direction || highway) return `${direction || highway}`;
            return '';
        },
        activeOffers() {
            return this.object.offerMix.filter(offer => offer.status === 1);
        },
        archiveOffers() {
            return this.object.offerMix.filter(offer => offer.status !== 1);
        },
        ourDeals() {
            return this.object.deals.filter(deal => deal.is_our);
        },
        enemyDeals() {
            return this.object.deals.filter(deal => !deal.is_our);
        },
        objectsDropdownTitle() {
            return `Предложения (${this.activeOffers.length}${this.archiveOffers.length ? '/' + this.archiveOffers.length : ''})`;
        },
        dealsDropdownTitle() {
            return `Арендаторы (${this.ourDeals.length}${this.enemyDeals.length ? '/' + this.enemyDeals.length : ''})`;
        }
    }
};
</script>
