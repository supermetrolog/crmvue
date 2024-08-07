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
            <p class="messenger-dialog-request__header">
                <span class="messenger-dialog-request__id">ID{{ model.id }}</span>
                <span v-if="model.company" class="messenger-dialog-request__company">
                    от: {{ $formatter.companyName(model.company, model.company.id) }}
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
                        {{ $formatter.numberOrRangeNew(model.minArea, model.maxArea) }}
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
            />
            <MessengerDialogFunctions :counts="statistic" />
        </div>
    </div>
</template>
<script>
import MessengerDialogFunctions from '@/components/Messenger/Dialog/MessengerDialogFunctions.vue';
import MessengerDialogPhone from '@/components/Messenger/Dialog/MessengerDialogPhone.vue';
import { entityOptions } from '@/const/options/options';
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes';
import Tooltip from '@/components/common/Tooltip.vue';

export default {
    name: 'MessengerDialogRequest',
    components: {
        Tooltip,
        WithUnitType,
        MessengerDialogPhone,
        MessengerDialogFunctions
    },
    emits: ['update-call'],
    props: {
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
            required: true
        }
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        isActive() {
            return this.model.status === entityOptions.request.statusStatement.ACTIVE;
        },
        hasActivity() {
            return (
                this.model?.company &&
                (this.model?.company.activityGroup !== null ||
                    this.model?.company.activityProfile !== null)
            );
        },
        categoryName() {
            const activityInfo = [
                entityOptions.company.activityGroup[this.model.company.activityGroup],
                entityOptions.company.activityProfile[this.model.company.activityProfile]
            ].filter(Boolean);

            return activityInfo.length ? activityInfo.join(': ') : null;
        },
        dealType() {
            return entityOptions.deal.type[this.model.dealType + 1];
        },
        directions() {
            if (!this.model.directions) return [];

            return this.model.directions.map(
                element => entityOptions.location.directionWithShort[element.direction].full
            );
        },
        districts() {
            if (!this.model.districts) return [];

            return this.model.districts.map(
                element => entityOptions.location.district[element.district]
            );
        },
        regionsText() {
            if (!this.model.regions) return '';

            return this.model.regions
                .map(element => entityOptions.location.region[element.region])
                .join(', ');
        },
        locationText() {
            return [this.regionsText, ...this.directions, ...this.districts].join(', ');
        }
    }
};
</script>
