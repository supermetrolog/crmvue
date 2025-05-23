<template>
    <div class="timeline-step">
        <teleport to="body">
            <Modal
                @close="sendModalIsVisible = false"
                :show="sendModalIsVisible"
                title="Отправка маршрута"
                width="1200"
            >
                <FormLetter
                    @send="localSend"
                    :formdata="preparedLetterMessage"
                    :loading="isSending"
                >
                    <CompanyObjectsList
                        @addComment="addComment"
                        :objects="normalizedObjects"
                        :selected-objects="normalizedObjects"
                        :disabled="true"
                        col="col-3"
                        label="Выбранные предложения"
                    />
                </FormLetter>
            </Modal>
        </teleport>
        <div class="row">
            <div class="col-12 mb-2">
                <TimelineInfo
                    @next="$emit('next-step')"
                    title="4. Организация осмотра объектов"
                    :success="data.additional"
                    :disabled="!data.objects.length"
                    :step
                    :timeline="TIMELINE"
                >
                    <p>
                        4.2. Скорректируйте маршрут и отправьте всю необходимую информацию по
                        объектам клиенту.
                    </p>
                    <template #footer>
                        <div class="d-flex gap-2 flex-wrap align-items-center">
                            <TimelineButton
                                @click="sendRoute"
                                tooltip="
                                    Нажмите, чтобы отправить клиенту ссылку на созданный маршрут
                                "
                                :disabled="disabled"
                                color="success"
                            >
                                <span>Отправить клиенту</span>
                                <i class="fas fa-paper-plane icon"></i>
                            </TimelineButton>
                            <TimelineButton
                                @click="sendRoute(true)"
                                tooltip="
                                    Нажмите, чтобы отправить себе ссылку на созданный маршрут
                                "
                                :disabled="disabled"
                            >
                                <span>Отправить себе</span>
                                <i class="fa-solid fa-paper-plane icon"></i>
                            </TimelineButton>
                        </div>
                    </template>
                </TimelineInfo>
            </div>
            <div v-if="correctObjects.length" class="col-12">
                <div v-if="hasArchivedOffers" class="row mb-2">
                    <div class="col-12">
                        <DashboardChip class="dashboard-bg-warning-l">
                            <p>
                                <i class="fa-solid fa-exclamation-triangle mr-1"></i>
                                <span>
                                    В некоторых выбранных предложениях отсутствует необходимая для
                                    построения маршрута информация об адресе.
                                </span>
                            </p>
                            <p>
                                Показано {{ correctObjects.length }} из
                                {{ data.objects.length }} предложений.
                            </p>
                        </DashboardChip>
                    </div>
                </div>
                <div v-if="!userLocation" class="row mb-2">
                    <div class="col-12">
                        <DashboardChip class="dashboard-bg-danger-l timeline-routes-error mx-auto">
                            Разрешите передачу вашего местоположения браузеру и перезагрузите
                            страницу!
                        </DashboardChip>
                    </div>
                </div>
                <div v-else class="row">
                    <div class="col-12 mb-2">
                        <div class="d-flex gap-2">
                            <Button @click="optimizeRoute" icon>
                                <span>Оптимизировать маршрут</span>
                                <i class="fas fa-route icon"></i>
                            </Button>
                            <a class="button button--info" :href="routeLink" target="_blank">
                                Открыть маршрут на Яндекс.Картах
                            </a>
                        </div>
                    </div>
                    <div class="col-5">
                        <div class="timeline-routes">
                            <DashboardCard class="timeline-routes__item">
                                <div class="d-flex gap-3">
                                    <Button
                                        v-tippy="'Нажмите, чтобы редактировать ваше местоположение'"
                                        @click="userLocationFormIsVisible = true"
                                        icon
                                        info
                                        class="flex-shrink-0"
                                    >
                                        <span>Мое местоположение</span>
                                        <i class="fa-solid fa-pen icon"></i>
                                    </Button>
                                    <AnimationTransition :speed="0.5">
                                        <MultiSelect
                                            v-if="userLocationFormIsVisible"
                                            v-model="newUserLocation"
                                            extra-classes="long-text"
                                            class="timeline-routes__multiselect"
                                            :filterResults="false"
                                            :min-chars="1"
                                            :resolve-on-load="false"
                                            :delay="0"
                                            :searchable="true"
                                            placeholder="Адрес начальной точки"
                                            :options="
                                                async query => {
                                                    return await getAddress(query);
                                                }
                                            "
                                        />
                                    </AnimationTransition>
                                </div>
                                <DashboardChip class="timeline-routes__chip first">A</DashboardChip>
                            </DashboardCard>
                            <VirtualDragList
                                v-model="correctObjects"
                                group="routes"
                                data-key="id"
                                :keeps="10"
                                chosenClass="chosen"
                                wrapClass="timeline-routes__item"
                                lockAxis="x"
                            >
                                <template #item="{ record, index }">
                                    <div class="timeline-routes__item">
                                        <DashboardCard class="timeline-routes__route">
                                            <div class="row">
                                                <div class="col-4 align-self-center pr-0 pl-2">
                                                    <img
                                                        :src="record.offer.thumb"
                                                        alt="Фото объекта"
                                                    />
                                                </div>
                                                <div class="col-8 pl-2">
                                                    <b>{{ record.offer.visual_id }}</b>
                                                    <p>{{ record.offer.object_type_name }}</p>
                                                    <p>{{ record.offer.address }}</p>
                                                </div>
                                            </div>
                                            <DashboardChip
                                                class="timeline-routes__chip"
                                                :class="{
                                                    last: index === correctObjects.length - 1
                                                }"
                                            >
                                                {{ alphabet[index + 1] }}
                                            </DashboardChip>
                                        </DashboardCard>
                                    </div>
                                </template>
                            </VirtualDragList>
                        </div>
                    </div>
                    <div class="col-7">
                        <Ymap :manual-route="correctObjects" :user-location="userLocation" />
                    </div>
                </div>
            </div>
            <div v-else-if="!data.objects" class="col-12">
                <DashboardChip class="dashboard-bg-warning-l timeline-routes-error mx-auto">
                    Для создания маршрута выполните прыдыдущий этап.
                </DashboardChip>
            </div>
            <div v-else class="col-12">
                <DashboardChip class="dashboard-bg-danger-l timeline-routes-error mx-auto">
                    <p>В выбранных предложениях не обнаружено информации об их адресе.</p>
                    <p>Возможно, предложения архивированы или занесены некорректно.</p>
                </DashboardChip>
            </div>
        </div>
    </div>
</template>

<script>
import {
    TimelineStepWithLetterMixin,
    TimelineStepWithObjectsMixin
} from '@/components/Timeline/mixins.js';
import TimelineInfo from '@/components/Timeline/TimelineInfo.vue';
import Button from '@/components/common/Button.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Ymap from '@/components/common/Ymap.vue';
import { yandexmap } from '@/utils/yandexMap.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import VirtualDragList from 'vue-virtual-draglist';
import DashboardCard from '@/components/Dashboard/Card/DashboardCard.vue';
import CompanyObjectsList from '@/components/Company/CompanyObjectsList.vue';
import FormLetter from '@/components/Forms/FormLetter.vue';
import Modal from '@/components/common/Modal.vue';
import { InspectionSendingRouteComment } from '@/components/Timeline/comments.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import TimelineButton from '@/components/Timeline/TimelineButton.vue';

export default {
    name: 'TimelineStepInspectionSending',
    components: {
        TimelineButton,
        Modal,
        FormLetter,
        CompanyObjectsList,
        DashboardCard,
        VirtualDragList,
        AnimationTransition,
        Ymap,
        MultiSelect,
        DashboardChip,
        Button,
        TimelineInfo
    },
    mixins: [TimelineStepWithObjectsMixin, TimelineStepWithLetterMixin],
    data() {
        return {
            userLocation: false,
            newUserLocation: '',
            userLocationSearchOption: [],
            userLocationFormIsVisible: false,
            alphabet: 'ABCDEFGHIJKL',
            preparedLetterMessageState: null,
            selectedObjects: [],
            correctObjects: [],
            isSending: false
        };
    },
    computed: {
        routeLink() {
            const array = this.correctObjects
                .map(object => `${object.offer?.latitude},${object.offer?.longitude}`)
                .join('~');

            return `https://yandex.ru/maps/?rtext=${this.userLocation[0]},${this.userLocation[1]}~${array}&rtt=auto`;
        },
        preparedLetterMessage() {
            return this.preparedLetterMessageState;
        },
        normalizedObjects() {
            return this.correctObjects.map(element => element.offer);
        },
        hasArchivedOffers() {
            return this.data.objects.length !== this.correctObjects.length;
        }
    },
    watch: {
        newUserLocation() {
            if (!this.newUserLocation) this.getLocation();
            this.getCoords();
        }
    },
    methods: {
        getLocation() {
            window.navigator.geolocation.getCurrentPosition(
                pos => {
                    this.userLocation = [pos.coords.latitude, pos.coords.longitude];
                },
                () => {},
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        },
        async getAddress(query) {
            return await yandexmap.getAddress(query);
        },
        async getCoords() {
            this.userLocation = await yandexmap.findCoordinates(this.newUserLocation);
        },
        async optimizeRoute() {
            const result = await yandexmap.getOptimizeRoutes(
                this.correctObjects,
                this.userLocation
            );

            const indexCache = this.correctObjects.reduce((acc, element, index) => {
                acc[element.offer.original_id] = index;
                return acc;
            }, {});

            this.correctObjects = result.map(key => this.correctObjects[indexCache[key]]);
        },
        sendRoute(sendToClient) {
            this.prepareLetterMessage(sendToClient);
            this.sendModalIsVisible = true;
        },
        prepareLetterMessage(selfSend) {
            const formData = {
                subject: 'Маршрут по предложенным объектам от RAYS ARMA',
                wayOfSending: [0],
                selfSend: selfSend ? 1 : 0,
                company_id: this.currentRequest.company_id,
                message: `<span>Маршрут на Яндекс-Картах по предложенным объектам доступен по <a href=${this.routeLink}>ссылке</a></span><p>С уважением, ${this.THIS_USER.userProfile.medium_name}</p><p>менеджер RAYS ARMA</p>`
            };

            if (this.defaultContactForSending !== null) {
                formData.defaultContactForSend = selfSend
                    ? {}
                    : {
                          id: this.defaultContactForSending.id,
                          type: 1
                      };
            }

            this.preparedLetterMessageState = formData;
        },
        async localSend(event) {
            this.isSending = true;

            this.selectedObjects = this.correctObjects.map(element => element.offer);

            await this.send(event);
            this.sendModalIsVisible = false;

            this.isSending = false;
        },

        // Переопределение из миксина для указания additional
        onBeforeSending(data) {
            data.additional = 1;
            data.status = 1;
            data.timelineStepObjects = [];
            data.done = 1;
        },

        // Переопределение из миксина для кастомного комментария
        getSendComment(...payload) {
            return new InspectionSendingRouteComment(...payload);
        }
    },
    created() {
        this.correctObjects = this.data.objects.filter(object => isNotNullish(object.offer));
        this.getLocation();
    }
};
</script>
