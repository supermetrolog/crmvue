<template>
    <div class="messenger-dialog messenger-dialog-request" :class="{ current: current }">
        <span
            v-if="model.expressRequest"
            v-tippy="'Экспресс-запрос'"
            class="messenger-dialog-request__express"
        >
            <i class="fa-solid fa-fire"></i>
        </span>
        <div class="messenger-dialog__body messenger-dialog-request__body">
            <Avatar
                v-if="model.consultant"
                :size="30"
                :label="`${model.consultant.userProfile.medium_name} - консультант`"
                :src="model.consultant.userProfile.avatar"
                class="messenger-dialog__avatar messenger-dialog-request__avatar"
            />
            <p class="messenger-dialog-request__header">
                <span class="messenger-dialog-request__id">ID{{ model.id }}</span>
                <span v-if="model.company" class="messenger-dialog-request__company">
                    от: {{ companyName }}
                </span>
            </p>
            <p v-if="hasActivity" class="messenger-dialog-request__category">
                {{ categoryName }}
            </p>
            <p v-else class="messenger-warning">Профиль деятельности не заполнен!</p>
            <p class="messenger-dialog-request__description" :class="{ active: isActive }">
                <i v-if="isActive" class="fa-solid fa-up-long"></i>
                <span v-if="dealType" class="messenger-dialog-request__type">{{ dealType }}</span>
                <span v-if="model.minArea || model.maxArea">
                    <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                        {{ areaRange }}
                    </with-unit-type>
                </span>
            </p>
            <p v-if="locationText" class="messenger-dialog-request__regions">
                <Tooltip icon="fa-solid fa-earth-americas">
                    <template #content>
                        <div class="messenger-dialog-request__location">
                            <p v-if="model.regions">{{ regionsText }}</p>
                            <div v-if="model.directions?.length">
                                <p class="messenger-dialog-request__subtitle">Направления МО:</p>
                                <div class="messenger-dialog-request__list">
                                    <span
                                        v-for="(direction, key) in directions"
                                        :key="key"
                                        class="messenger-dialog-request__label"
                                    >
                                        {{ direction }}
                                    </span>
                                </div>
                            </div>
                            <div v-if="model.districts?.length">
                                <p class="messenger-dialog-request__subtitle">Округа Москвы:</p>
                                <div class="messenger-dialog-request__list">
                                    <span
                                        v-for="(district, key) in districts"
                                        :key="key"
                                        class="messenger-dialog-request__label"
                                    >
                                        {{ district }}
                                    </span>
                                </div>
                            </div>
                            <p v-if="model.distanceFromMKAD">
                                До {{ model.distanceFromMKAD }} км до МКАД
                            </p>
                        </div>
                    </template>
                </Tooltip>
                <span>{{ locationText }}</span>
            </p>
            <p v-else class="messenger-warning">Адрес не заполнен</p>
        </div>
        <div class="messenger-dialog__footer">
            <MessengerDialogPhone
                @click.stop="$emit('update-call')"
                :last-call="lastCall"
                :updated-at="model.updated_at"
                :disabled="isDisabled"
            />
            <MessengerDialogFunctions v-if="statistic" :counts="statistic" />
        </div>
    </div>
</template>
<script setup>
import MessengerDialogFunctions from '@/components/Messenger/Dialog/MessengerDialogFunctions.vue';
import MessengerDialogPhone from '@/components/Messenger/Dialog/MessengerDialogPhone.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import Tooltip from '@/components/common/Tooltip.vue';
import { computed } from 'vue';
import { requestOptions } from '@/const/options/request.options.js';
import { companyOptions } from '@/const/options/company.options.js';
import { dealOptions } from '@/const/options/deal.options.js';
import { locationOptions } from '@/const/options/location.options.js';
import { getCompanyName } from '@/utils/formatters/models/company.js';
import { toNumberOrRangeFormat } from '@/utils/formatters/number.js';
import { useStore } from 'vuex';
import Avatar from '@/components/common/Avatar.vue';

defineEmits(['update-call']);
const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    current: {
        type: Boolean,
        default: false
    },
    lastCall: {
        type: Object,
        default: null
    },
    statistic: {
        type: Object,
        default: null
    }
});

const store = useStore();

const isDisabled = computed(() => store.getters.THIS_USER.id !== props.model.consultant_id);
const isActive = computed(() => props.model.status === requestOptions.statusStatement.ACTIVE);
const hasActivity = computed(() => {
    return (
        props.model?.company &&
        (props.model.company.activityGroup !== null || props.model.company.activityProfile !== null)
    );
});
const categoryName = computed(() => {
    const activityInfo = [
        companyOptions.activityGroup[props.model.company.activityGroup],
        companyOptions.activityProfile[props.model.company.activityProfile]
    ].filter(Boolean);

    return activityInfo.length ? activityInfo.join(': ') : null;
});
const dealType = computed(() => dealOptions.type[props.model.dealType + 1]);
const directions = computed(() => {
    if (!props.model.directions) return [];

    return props.model.directions.map(
        element => locationOptions.directionWithShort[element.direction].full
    );
});
const districts = computed(() => {
    if (!props.model.districts) return [];

    return props.model.districts.map(element => locationOptions.district[element.district]);
});
const regionsText = computed(() => {
    if (!props.model.regions) return '';

    return props.model.regions.map(element => locationOptions.region[element.region]).join(', ');
});
const locationText = computed(() => {
    return [regionsText.value, ...directions.value, ...districts.value].join(', ');
});
const companyName = computed(() => getCompanyName(props.model.company, props.model.company.id));
const areaRange = computed(() => toNumberOrRangeFormat(props.model.minArea, props.model.maxArea));
</script>
