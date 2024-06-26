<template>
    <div class="CompanyBoxObjectsListItem">
        <div class="CompanyBoxObjectsListItem-wrapper">
            <div class="CompanyBoxObjectsListItem-image" :title="object.description_auto || 'нет описания'">
                <div class="CompanyBoxObjectsListItem-image-container">
                    <a :href="objectUrl" target="_blank">
                        <img :src="imageSrc" alt="image" />
                    </a>
                </div>
            </div>
            <div class="CompanyBoxObjectsListItem-info">
                <div class="CompanyBoxObjectsListItem-info-title">
                    <span>ID-{{ object.id }}</span>
                    <span> | </span>
                    <span>{{ $formatter.number(object.area_building) }} м<sup>2</sup></span>
                </div>
                <div class="CompanyBoxObjectsListItem-info-address">
                    <span>{{ object.address }}</span>
                </div>
                <div v-if="!!locationHandler" class="CompanyBoxObjectsListItem-info-direction">
                    <span>{{ locationHandler }}</span>
                </div>
                <div v-if="object.from_mkad" class="CompanyBoxObjectsListItem-info-mkad">
                    {{ object.from_mkad }} км от МКАД
                </div>
            </div>
        </div>
        <div class="CompanyBoxObjectsListItem-dropdown">
            <hr />
            <div class="CompanyBoxObjectsListItem-dropdown-switchers">
                <Dropdown
                    v-if="object.offerMix.length"
                    v-model="offersIsOpen"
                    :title="'Предложения'"
                    :main-number="activeOffers.length"
                    :side-number="archiveOffers.length"
                />
                <Dropdown
                    v-if="object.deals.length"
                    v-model="rentersIsOpen"
                    :title="'Арендаторы'"
                    :main-number="ourDeals.length"
                    :side-number="enemyDeals.length"
                />
            </div>
            <div class="CompanyBoxObjectsListItem-dropdown-offers" :class="{ open: offersIsOpen }">
                <CompanyBoxObjectsOffer v-for="offer in object.offerMix" :key="offer.id" :offer="offer" />
            </div>
            <div class="CompanyBoxObjectsListItem-dropdown-offers" :class="{ open: rentersIsOpen }">
                <CompanyBoxObjectsRenter v-for="deal in object.deals" :key="deal.id" :deal="deal" />
            </div>
        </div>
    </div>
</template>

<script>
import { DistrictList, OldDbDirectionList } from '@/const/const.js';
import Dropdown from '@/components/common/Dropdown/Dropdown.vue';
import CompanyBoxObjectsOffer from '@/components/Company/Box/CompanyBoxObjectsOffer.vue';
import CompanyBoxObjectsRenter from '@/components/Company/Box/CompanyBoxObjectsRenter.vue';

export default {
    name: 'CompanyBoxObjectsListItem',
    components: {
        CompanyBoxObjectsRenter,
        CompanyBoxObjectsOffer,
        Dropdown
    },
    props: {
        object: {
            type: Object
        }
    },
    data() {
        return {
            offersIsOpen: false,
            rentersIsOpen: false
        };
    },
    computed: {
        directionList: () => OldDbDirectionList,
        districtList: () => DistrictList,
        imageSrc() {
            const photo = this.object.photo;
            if (photo && Array.isArray(photo)) {
                return 'https://pennylane.pro' + photo[0];
            }
            return this.$url.api.fileNotFound();
        },
        objectUrl() {
            return 'https://pennylane.pro/complex/' + this.object.complex_id;
        },
        locationHandler() {
            let direction =
                typeof this.object.complex.location.direction === 'number'
                    ? this.directionList[this.object.complex.location.direction].long
                    : null;
            let highway = this.object.complex.location.highwayRel?.title
                ? this.object.complex.location.highwayRel.title
                : null;
            highway ? (highway = highway[0].toUpperCase() + highway.slice(1) + ' ш.') : highway;
            if (direction && highway) {
                return `${direction}, ${highway}`;
            }
            if (direction || highway) {
                return `${direction || highway}`;
            } else {
                return '';
            }
        },
        activeOffers() {
            return this.object.offerMix.filter(offer => offer.status == 1);
        },
        archiveOffers() {
            return this.object.offerMix.filter(offer => offer.status != 1);
        },
        ourDeals() {
            return this.object.deals.filter(deal => deal.is_our);
        },
        enemyDeals() {
            return this.object.deals.filter(deal => !deal.is_our);
        }
    }
};
</script>

<style></style>