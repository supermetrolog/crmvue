<template>
    <div v-if="data" class="col inspection px-0">
        <TimelineStepStage
            :id="1"
            @stageClicked="stageClicked"
            class="mb-2"
            :title="
                'Шаг 1. Отметить объекты, которые заинтересовали клиента' +
                (data.timelineStepObjects.length ? ` (${data.timelineStepObjects.length})` : '')
            "
            :isDone="!!data.timelineStepObjects.length"
            :isCurrent="!data.timelineStepObjects.length"
            :isClicked="clickedStage === 1"
        >
            <ButtonList
                v-if="!disabled"
                @done="$emit('done')"
                @send="$emit('send')"
                @negative="$emit('negative')"
                :buttons="buttons"
            />
        </TimelineStepStage>
        <TimelineStepStage
            :id="2"
            @stageClicked="stageClicked"
            class="mb-2"
            title="Шаг 2. Отправить всю необходимую информацию по объектам клиенту"
            :isDone="!!data.additional"
            :isCurrent="!!data.timelineStepObjects.length"
            :isClicked="clickedStage === 2"
        >
            <div v-if="!disabled" class="row no-gutters">
                <div class="col-6 pr-1">
                    <CustomButton
                        @confirm="sendRoute()"
                        title="Отправить маршрут клиенту"
                        :options="{
                            btnClass: 'success',
                            btnVisible: false,
                            defaultBtn: true,
                            disabled: false
                        }"
                    >
                        <template #btnContent>
                            <i class="fas fa-paper-plane"></i>

                            отправить клиенту
                        </template>
                    </CustomButton>
                </div>
                <div class="col-6">
                    <CustomButton
                        @confirm="sendRoute(true)"
                        title="Отправить маршрут себе"
                        :options="{
                            btnClass: 'success_alt',
                            btnVisible: false,
                            defaultBtn: true,
                            disabled: false
                        }"
                    >
                        <template #btnContent>
                            <i class="fas fa-paper-plane"></i>

                            отправить себе
                        </template>
                    </CustomButton>
                </div>
                <span
v-if="manualRoute.length > 9"
class="text-danger"
                    >У вас более 9-ти объектов, маршрут будет построен некорректно!</span
                >
            </div>
        </TimelineStepStage>
        <div v-if="data.timelineStepObjects.length && userLocation && clickedStage !== 1" class="row">
            <div class="col-5">
                <div class="row no-gutters">
                    <div class="col-12">
                        <h3 class="text-center">Маршрут</h3>
                        <CustomButton
                            @confirm="selectOptimizeRoute"
                            :options="{
                                btnClass: 'primary',
                                btnVisible: false,
                                defaultBtn: true,
                                disabled: false
                            }"
                        >
                            <template #btnContent>
                                <i class="fas fa-route"></i>
                                оптимизировать
                            </template>
                        </CustomButton>
                    </div>
                    <div class="col-12">
                        <div class="car-routes">
                            <ul class="routes mt-1">
                                <li>
                                    <b> Мое местоположение </b>
                                    <small @click="openUserLocationForm" class="edit-btn">[ред.]</small>
                                </li>
                                <FormGroup v-if="userLocationForm" class="mb-1">
                                    <MultiSelect
                                        v-model="newUserLocation"
                                        extraClasses="long-text"
                                        label="Ваше местоположение"
                                        :filterResults="false"
                                        :minChars="1"
                                        :resolveOnLoad="false"
                                        :delay="0"
                                        :searchable="true"
                                        :options="
                                            async query => {
                                                return await getAddress(query);
                                            }
                                        "
                                    />
                                </FormGroup>
                                <draggable class="dragArea list-group w-full" :list="manualRoute">
                                    <transition-group>
                                        <li
                                            v-for="object in manualRoute"
                                            :key="object.offer.id"
                                            class="route success_block"
                                        >
                                            <div class="row">
                                                <div class="col-4 align-self-center pr-0 pl-2">
                                                    <img :src="object.offer.thumb" alt="Фото объекта" />
                                                </div>
                                                <div class="col-8 pl-2">
                                                    <b>
                                                        {{ object.offer.visual_id }}
                                                    </b>
                                                    <p>{{ object.offer.object_type_name }}</p>
                                                    <p>{{ object.offer.address }}</p>
                                                </div>
                                            </div>
                                        </li>
                                    </transition-group>
                                </draggable>
                            </ul>
                        </div>
                    </div>
                    <div class="col-12 mt-3"></div>
                </div>
            </div>
            <div class="col-7 align-self-center">
                <a :href="routeLink" target="_blank">Открыть маршрут на Яндекс.Картах </a>
                <Ymap v-if="currentStepObjects.length" :manualRoute="manualRoute" :userLocation="userLocation" />
            </div>
        </div>
        <div v-if="!userLocation && data.timelineStepObjects.length && clickedStage !== 1" class="px-3">
            <h3 class="text-danger">Разрешите передачу вашего местоположения и перезагрузите страницу!</h3>
        </div>
    </div>
</template>

<script>
import FormGroup from '@/components/common/Forms/FormGroup.vue';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import { yandexmap } from '@/utils';
import CustomButton from '@/components/common/CustomButton.vue';
import { VueDraggableNext } from 'vue-draggable-next';
import Ymap from '@/components/common/Ymap.vue';
import { MixinSteps } from '@/components/Timeline/mixins.js';

export default {
    name: 'TimelineStepInspection',
    components: {
        Ymap,
        draggable: VueDraggableNext,
        CustomButton,
        FormGroup,
        MultiSelect
    },
    mixins: [MixinSteps],
    emits: ['done', 'negative', 'send', 'sendRoute'],
    props: {
        objects: {
            type: Array
        }
    },
    data() {
        return {
            currentStepObjects: [],
            userLocation: false,
            clickedStage: null,
            optimizedObjects: [],
            newUserLocation: '',
            userLocationForm: false,
            userLocationSearchOption: []
        };
    },
    computed: {
        yandexMapRoutesUrl() {
            let url = 'https://yandex.ru/maps/?rtext=~';
            if (this.userLocation) {
                url = 'https://yandex.ru/maps/?rtext=' + this.userLocation[0] + ',' + this.userLocation[1] + '~';
            }
            let lastPartUrl = '&rtt=auto';

            let coords = [];
            this.currentStepObjects.map((object, index) => {
                url += object.latitude + ',' + object.longitude;
                if (index != this.currentStepObjects.length - 1) {
                    url += '~';
                }
                coords.push({
                    original_id: object.original_id,
                    coord: [+object.latitude, +object.longitude]
                });
            });
            url += lastPartUrl;
            return url;
        },
        manualRoute() {
            return this.optimizedObjects.length ? this.optimizedObjects : this.currentStepObjects;
        },
        routeLink() {
            let array = this.manualRoute.map(object => `${object.offer.latitude},${object.offer.longitude}`).join('~');
            return `https://yandex.ru/maps/?rtext=${this.userLocation[0]},${this.userLocation[1]}~${array}&rtt=auto`;
        }
    },
    watch: {
        objects() {
            this.currentStepObjects = [...this.objects];
        },
        newUserLocation() {
            if (!this.newUserLocation) {
                this.getLocation();
            }
            this.getCoords();
        }
    },
    methods: {
        getLocation() {
            const options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            window.navigator.geolocation.getCurrentPosition(
                pos => {
                    this.userLocation = [pos.coords.latitude, pos.coords.longitude];
                },
                () => {},
                options
            );
        },
        clickNegative() {
            this.data.negative = 1;
            this.$emit('updateItem', this.data);
        },
        async selectOptimizeRoute() {
            const result = await yandexmap.getOptimizeRoutes(this.currentStepObjects, this.userLocation);
            this.optimizedObjects = result.map(id =>
                this.currentStepObjects.find(object => object.offer.original_id === id)
            );
        },
        stageClicked(id) {
            this.clickedStage = id;
        },
        sendRoute(sendToClient = false) {
            this.$emit('sendRoute', this.routeLink, sendToClient);
        },
        openUserLocationForm() {
            this.userLocationForm = true;
        },
        // async editUserLocation() {
        //   const result = await yandexmap.getAddress(this.newUserLocation);
        //   this.userLocation = await yandexmap.findCoordinates(result[0]);
        //   this.newUserLocation = result[0];
        //   this.userLocationSearchOption = result;
        // },
        async getAddress(query) {
            return await yandexmap.getAddress(query);
        },
        async getCoords() {
            this.userLocation = await yandexmap.findCoordinates(this.newUserLocation);
        }
    },
    mounted() {
        this.currentStepObjects = [...this.objects];
        this.getLocation();
    }
};
</script>

<style>
.red {
    color: red;
}
</style>