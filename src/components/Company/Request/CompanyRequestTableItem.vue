<template>
    <Tr class="request-table-item" :class="{ cloned: request.cloned }">
        <Td class="text-center request-table-item__id">
            <p class="mb-1">#{{ request.id }}</p>
            <div class="request-table-item__buttons">
                <UserFoldersDropdown
                    @deleted-from-folder="$emit('deleted-from-folder', $event)"
                    morph="request"
                    :entity="request.id"
                />
                <UiDropdownActions :title small>
                    <template #menu>
                        <UiDropdownActionsGroup>
                            <UiDropdownActionsButton
                                @handle="$emit('open-survey')"
                                :icon="
                                    request.has_pending_survey
                                        ? 'fa-solid fa-play'
                                        : 'fa-solid fa-square-poll-horizontal'
                                "
                                :label="
                                    request.has_pending_survey
                                        ? 'Продолжить опрос'
                                        : 'Заполнить опрос'
                                "
                            />
                        </UiDropdownActionsGroup>
                        <UiDropdownActionsGroup>
                            <UiDropdownActionsButton
                                @handle="$emit('view')"
                                label="Подробнее"
                                icon="fa-solid fa-eye"
                            />
                            <UiDropdownActionsButton
                                @handle="$emit('to-chat')"
                                label="Открыть в чате"
                                icon="fa-solid fa-comment"
                            />
                            <a :href="timelineHref" target="_blank" class="text-inherit">
                                <UiDropdownActionsButton
                                    label="Открыть таймлайн"
                                    icon="fa-solid fa-up-right-from-square"
                                />
                            </a>
                        </UiDropdownActionsGroup>
                        <UiDropdownActionsGroup>
                            <UiDropdownActionsButton
                                @handle="$emit('create-task')"
                                icon="fa-solid fa-bolt"
                                label="Создать задачу"
                            />
                        </UiDropdownActionsGroup>
                        <UiDropdownActionsGroup>
                            <template v-if="!isDone">
                                <UiDropdownActionsButton
                                    v-if="isPassive"
                                    @handle="$emit('enable')"
                                    label="Восстановить"
                                    icon="fa-solid fa-undo"
                                />
                                <UiDropdownActionsButton
                                    v-else
                                    @handle="$emit('disable')"
                                    label="Архивировать"
                                    icon="fa-solid fa-ban"
                                />
                                <UiDropdownActionsButton
                                    v-if="canChangeConsultant"
                                    @handle="$emit('change-consultant')"
                                    label="Изменить консультанта"
                                    icon="fa-solid fa-user-tag"
                                />
                            </template>
                            <UiDropdownActionsButton
                                @handle="$emit('edit')"
                                label="Редактировать"
                                icon="fa-solid fa-pen"
                            />
                            <UiDropdownActionsButton
                                @handle="$emit('clone')"
                                label="Клонировать"
                                icon="fa-solid fa-clone"
                            />
                        </UiDropdownActionsGroup>
                    </template>
                </UiDropdownActions>
                <UiButtonIcon
                    v-if="request.has_pending_survey"
                    @click="$emit('open-survey')"
                    small
                    icon="fa-solid fa-play"
                    label="Продолжить заполнение опроса"
                    :color="
                        request.pending_survey_status === 'draft'
                            ? 'success-light'
                            : 'warning-light'
                    "
                />
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
                <p ref="createdAtEl" class="text-grey fs-1">
                    <i class="fa-solid fa-calendar mr-1" />
                    <span>{{ createdAt }}</span>
                </p>
            </div>
            <div class="d-flex gap-1 mt-3">
                <UiButton
                    v-if="request.tasks_count"
                    @click="$emit('show-tasks')"
                    color="danger-light"
                    icon="fa-solid fa-arrow-up-right-from-square"
                    class="fs-2"
                    small
                    rect
                >
                    Задачи ({{ request.tasks_count }})
                </UiButton>
                <UiButton
                    v-if="request.created_task_ids?.length"
                    @click="$emit('show-created-tasks')"
                    color="success-light"
                    icon="fa-solid fa-plus"
                    class="fs-2"
                    small
                    rect
                >
                    Созданы задачи ({{ request.created_task_ids?.length }})
                </UiButton>
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
        <Td class="text-center request-table__status position-relative" sort="updated_at">
            <UiField v-if="request.cloned" color="dark" class="fs-2 mx-auto mb-1">
                <i class="fa-solid fa-clone" />
                <span>Клонирован</span>
            </UiField>
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
            <TableDateBlock
                class="text-center"
                :date="request.updated_at ?? request.created_at"
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
import { computed, defineProps, useTemplateRef } from 'vue';
import { ucFirst } from '@/utils/formatters/string.js';
import { DealTypeList, DirectionList, DistrictList, PassiveWhyRequest } from '@/const/const.js';
import Avatar from '@/components/common/Avatar.vue';
import CompanyElement from '@/components/Company/CompanyElement.vue';
import CompanyContact from '@/components/Company/CompanyContact.vue';
import TableDateBlock from '@/components/common/Table/TableDateBlock.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiDropdownActionsGroup from '@/components/common/UI/DropdownActions/UiDropdownActionsGroup.vue';
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';
import { useAuth } from '@/composables/useAuth';
import { toBeautifulDateFormat } from '@/utils/formatters/date.ts';
import { useTippy } from 'vue-tippy';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UserFoldersDropdown from '@/components/UserFolder/UserFoldersDropdown.vue';

defineEmits([
    'to-chat',
    'view',
    'open-survey',
    'disable',
    'enable',
    'edit',
    'change-consultant',
    'clone',
    'create-task',
    'show-tasks',
    'deleted-from-folder'
]);

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
const isDone = computed(() => props.request.status === 2);

const passiveWhyComment = computed(() => {
    if (!props.request.passive_why) return 'Причина не указана';

    let text = PassiveWhyRequest[props.request.passive_why]?.label ?? 'Другое';
    if (props.request.passive_why_comment) text += ': ' + props.request.passive_why_comment;
    return text;
});

const title = computed(() => {
    if (props.request.name) return `${props.request.name} (#${props.request.id})`;
    return `Запрос #${props.request.id}`;
});

const timelineHref = computed(() => {
    return `/companies/${props.request.company_id}?request_id=${props.request.id}&consultant_id=${currentUserId.value}&step=0`;
});

const { currentUserIsModeratorOrHigher, currentUserId } = useAuth();

const canChangeConsultant = computed(() => {
    return (
        currentUserIsModeratorOrHigher.value || currentUserId.value === props.request.consultant_id
    );
});

const createdAt = computed(() => toBeautifulDateFormat(props.request.created_at));

useTippy(useTemplateRef('createdAtEl'), { content: 'Дата создания запроса' });
</script>
