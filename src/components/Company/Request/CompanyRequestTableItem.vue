<template>
    <Tr class="request-table-item">
        <Td class="text-center request-table-item__id">
            <p class="mb-1">#{{ request.id }}</p>
            <div class="request-table-item__buttons">
                <HoverActionsButton @click="$emit('to-chat')" label="Открыть в чате">
                    <i class="fa-solid fa-comment" />
                </HoverActionsButton>
                <HoverActionsButton @click="$emit('view')" label="Подробнее">
                    <i class="fa-solid fa-eye" />
                </HoverActionsButton>
            </div>
        </Td>
        <Td class="request-table__deal" sort="dealType">
            <div class="row no-gutters">
                <div class="col-6">
                    <h4
                        v-if="request.dealType !== null"
                        :class="{ 'text-warning': !request.status }"
                    >
                        {{ dealType }}
                    </h4>
                </div>
                <div class="col-6 text-right">
                    <p
                        v-if="request.expressRequest"
                        class="text-danger d-block"
                        :class="{ 'text-grey': request.status !== 1 }"
                    >
                        <b>срочно</b>
                    </p>
                </div>
                <div class="col-12">
                    <Progress :percent="request.timeline_progress" title="Обработано" />
                </div>
            </div>
        </Td>
        <Td class="text-center request-table__area request-table-item__area">
            <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                <b>{{ $formatter.numberOrRangeNew(request.minArea, request.maxArea) }}</b>
            </WithUnitType>
        </Td>
        <Td class="text-center request-table__price" sort="pricePerFloor">
            <p v-if="request.pricePerFloor !== null">
                <WithUnitType :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR">
                    <b>
                        {{
                            $formatter.number(
                                request.price_per_floor_month ?? request.pricePerFloor
                            )
                        }}
                    </b>
                </WithUnitType>
                <br />
                <WithUnitType :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_MONTH">
                    <b>{{ $formatter.number(request.pricePerFloorMonth) }}</b>
                </WithUnitType>
            </p>
            <p v-else>&#8212;</p>
        </Td>
        <Td class="text-center request-table__region py-1">
            <div>
                <p v-if="request.regions.length">
                    {{ regionsText }}
                </p>
                <p v-else>&#8212;</p>
                <div v-if="request.directions.length">
                    <p class="d-inline"><b>Московская область: </b></p>
                    <p class="d-inline">
                        {{ directionsText }}
                    </p>
                </div>
                <div v-if="request.districts.length">
                    <p class="d-inline"><b>Москва: </b></p>
                    <p class="d-inline">
                        {{ districtsText }}
                    </p>
                </div>
                <p v-if="!request.distanceFromMKADnotApplicable">
                    до {{ request.distanceFromMKAD }} км до МКАД
                </p>
            </div>
        </Td>
        <Td class="request-table__company">
            <CompanyElement
                v-if="request.company"
                class="request-table-item__company"
                :company="request.company"
            />
            <p v-else>&#8212;</p>
            <CompanyContact
                v-if="request.contact"
                class="request-table-item__contact mt-2"
                :contact="request.contact"
            />
        </Td>
        <Td class="text-center">
            <Avatar
                v-if="request.consultant"
                class="mx-auto"
                size="55"
                :src="request.consultant.userProfile.avatar"
                :label="request.consultant.userProfile.medium_name"
            />
            <p v-else>&#8212;</p>
        </Td>
        <Td class="text-center request-table__status" sort="updated_at">
            <UiField
                v-if="isPassive"
                :tooltip="passiveWhyComment"
                class="dashboard-bg-danger offer-table-item__chip text-white"
            >
                Пассив
            </UiField>
            <UiField v-else-if="isActive" class="dashboard-bg-success-l offer-table-item__chip">
                Актив
            </UiField>
            <UiField v-else class="dashboard-bg-primary-l offer-table-item__chip">
                Завершен
            </UiField>
            <!--            <OfferTableItemCall @click="openSurvey" :call="company.last_call" />-->
            <!--            <HoverActionsButton-->
            <!--                @click="openInChat"-->
            <!--                class="my-2 mx-auto offer-table-item__chat"-->
            <!--                :label="`У вас ${offer.unread_message_count} непрочитанных сообщений по этой компании`"-->
            <!--            >-->
            <!--                <div class="d-flex flex-column">-->
            <!--                    <i class="fa-solid fa-comment" />-->
            <!--                    <span>{{ offer.unread_message_count }}</span>-->
            <!--                </div>-->
            <!--            </HoverActionsButton>-->
            <TableDateBlock
                class="text-center"
                :date="request.updated_at || request.created_at"
                label="Обновление"
            />
        </Td>
    </Tr>
</template>

<script setup>
import Td from '@/components/common/Table/Td.vue';
import Tr from '@/components/common/Table/Tr.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import Progress from '@/components/common/Progress.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed, defineProps } from 'vue';
import { ucFirst } from '@/utils/formatters/string.js';
import { DealTypeList, DirectionList, DistrictList, PassiveWhyRequest } from '@/const/const.js';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import Avatar from '@/components/common/Avatar.vue';
import CompanyElement from '@/components/Company/CompanyElement.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import UiField from '@/components/common/UI/UiField.vue';

defineEmits(['to-chat', 'view']);
const props = defineProps({
    request: {
        type: Object,
        required: true
    }
});

const regionsText = computed(() =>
    props.request.regions.map(elem => ucFirst(elem.info.title)).join(', ')
);
const directionsText = computed(() =>
    props.request.directions.map(elem => DirectionList[elem.direction].full).join(', ')
);
const districtsText = computed(() =>
    props.request.districts.map(elem => DistrictList[elem.district]).join(', ')
);
const dealType = computed(() => DealTypeList[props.request.dealType].label);

const isPassive = computed(() => !props.request.status);
const isActive = computed(() => props.request.status === 1);

const passiveWhyComment = computed(() => {
    if (!props.request.passive_why) return 'Причина не указана';

    let text = PassiveWhyRequest[props.request.passive_why]?.label ?? 'Другое';
    if (props.request.passive_why_comment) text += ': ' + props.request.passive_why_comment;
    return text;
});
</script>
