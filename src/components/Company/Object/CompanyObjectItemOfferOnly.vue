<template>
    <div class="px-2" :class="col">
        <div
            class="object-offer only"
            v-if="offer.noOffer"
            :class="[
        {
          general: offer.type_id == 2,
        },
        classList,
      ]"
        >
            <div class="row no-gutters object-info">
                <div class="col-12 align-self-center">
                    <div class="image-container">
                        <div class="params">
                            <span>{{ offer.deal_type_name }} </span>
                            <span class="object_class">
                {{ offer.class_name }}
              </span>
                            <span
                                class="duplicate_count"
                                title="количество отправлений"
                                v-if="offer.duplicate_count > 1"
                            >
                {{ offer.duplicate_count }}
              </span>
                        </div>
                        <span class="visual_id">
              {{ offer.visual_id }}
            </span>
                        <span
                            class="badge badge-secondary isGeneral"
                            v-if="offer.type_id == 2"
                        >Общий</span
                        >
                        <span
                            class="badge badge-info isGeneral"
                            v-else-if="offer.type_id == 1"
                        >Блок</span
                        >
                        <span class="badge badge-warning isGeneral" v-else>Неизвестно</span>
                        <a href="#" @click.prevent>
                            <img :src="offer.image" alt="image"/>
                        </a>
                        <div class="icon-unselect" @click.prevent="clickUnSelectObject">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                </div>
                <div class="col-12 main text-center">
          <span class="badge badge-warning mb-1" v-if="offer.status != 1"
          >В архиве</span
          >
                    <div class="actions">
                        <i class="fas fa-eye" @click="clickView(offer)"></i>
                    </div>
                    <div class="price">
                        <i class="fas fa-ruble-sign"></i>
                        <p class="value">{{ offer.price }} <small></small></p>
                    </div>
                    <div class="area">
                        <i class="fas fa-square-full"></i>
                        <p>
                            {{ offer.area }}
                            <small>м<sup>2</sup></small>
                        </p>
                    </div>
                    <div class="comments" v-if="offer.comments">
                        <p v-if="offer.comments.length" class="title">Комментарии</p>
                        <p
                            v-for="comment in offer.comments"
                            :key="comment.id"
                            :class="{ current: comment.timeline_step_id == currentStepId }"
                        >
                            {{ comment.comment }}
                        </p>
                    </div>
                    <div class="address">
                        <p class="title">Адрес</p>
                        <p>{{ offer.address }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="object-offer only"
            v-else
            :class="[
        {
          passive: offer.status != 1,
          general: offer.type_id == 2,
          selected: isSelected,
        },
        classList,
      ]"
        >
            <div class="row no-gutters object-info">
                <div class="col-12 align-self-center">
                    <div class="image-container">
                        <div class="params">
                            <span>{{ offer.deal_type_name }} </span>
                            <span class="object_class">
                {{ offer.class_name }}
              </span>
                            <span
                                class="duplicate_count"
                                title="количество отправлений"
                                v-if="offer.duplicate_count > 1"
                            >
                {{ offer.duplicate_count }}
              </span>
                        </div>
                        <span class="visual_id">
              {{ offer.visual_id }}
            </span>
                        <span
                            class="badge badge-danger isGeneral test_only"
                            v-if="offer.test_only"
                        >Тестовый лот</span
                        >
                        <span
                            class="badge badge-secondary isGeneral"
                            v-if="offer.type_id == 2"
                        >Общий</span
                        >
                        <span
                            class="badge badge-info isGeneral"
                            v-else-if="offer.type_id == 1"
                        >Блок</span
                        >
                        <span class="badge badge-warning isGeneral" v-else>Неизвестно</span>
                        <a href="#" @click.prevent="clickSelectObject">
                            <img :src="offer.thumb" alt="image"/>
                        </a>
                        <div class="icon-unselect" @click.prevent="clickUnSelectObject">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                </div>
                <div
                    class="col-12 main text-center"
                    :class="{ 'animated-background': isNewRecommended }"
                >
          <span class="badge badge-warning mb-1" v-if="offer.status != 1"
          >Пассив</span
          >
                    <div v-if="isSelected" class="comment">
            <textarea
                class="mb-1"
                v-model.trim="localComment"
                ref="comment"
                rows="3"
                @blur="unfocusTextarea"
                @keypress.enter="enterTextarea"
                placeholder="Комментарий клиенту"
            />
                    </div>
                    <div class="actions">
                        <div class="mb-2">
              <span class="badge badge-success" v-if="isNewRecommended"
              >новое в подборке</span
              >
                        </div>
                        <i
                            v-if="offer.type_id != 3"
                            class="fas fa-star"
                            :class="{
                selected: FAVORITES_OFFERS.find(
                  (item) => item.original_id == offer.original_id
                ),
              }"
                            @click="clickFavotiteOffer(offer)"
                        ></i>
                        <i
                            class="fas fa-file-pdf"
                            v-if="offer.type_id != 3"
                            @click="clickViewPdf(offer)"
                        ></i>
                        <i class="fas fa-eye" @click="clickView(offer)"></i>
                    </div>
                    <div class="location">
                        <p v-if="offer.district_name">
                            {{ offer.district_name }}
                        </p>
                        <p
                            class="region_item"
                            v-if="offer.region_name && offer.district_moscow_name"
                        >
                            {{ offer.region_name }}
                        </p>
                        —
                        <p v-if="offer.district_moscow_name">
                            {{ offer.district_moscow_name }}
                        </p>
                        <p v-if="offer.direction_name && offer.district_moscow_name">
                            — {{ offer.direction_name }}
                        </p>
                        <p v-if="offer.direction_name && !offer.district_moscow_name">
                            {{ offer.direction_name }}
                        </p>
                    </div>
                    <div class="object_type">
                        <p>
                            {{ offer.object_type_name }}
                        </p>
                    </div>
                    <div class="price">
                        <i class="fas fa-ruble-sign"></i>
                        <p
                            class="value"
                            v-if="offer.deal_type == 1 || offer.deal_type == 4"
                        >
                            <!-- {{ offer.calc_price_general }} -->
                            {{ offer.calc_price_warehouse }}
                            <small>руб за м<sup>2</sup>/г</small>
                        </p>
                        <p class="value" v-if="offer.deal_type == 2">
                            {{ offer.calc_price_sale }} <small>руб за м<sup>2</sup></small>
                        </p>
                        <p class="value" v-if="offer.deal_type == 3">
                            {{ offer.calc_price_safe_pallet }} <small>руб за 1 п. м.</small>
                        </p>
                        <small class="tax">
                            {{ taxForm }}
                        </small>
                    </div>
                    <div class="area">
                        <i class="fas fa-square-full"></i>
                        <p>
                            {{ offer.calc_area_general }}
                            <small>м<sup>2</sup></small>
                        </p>
                    </div>
                    <div class="extraVisible" @click="toggleExtraInfoVisible">
                        <i
                            class="far fa-arrow-alt-circle-down text-center mt-1 extra"
                            v-if="!extraInfoVisible"
                        ></i>
                        <i
                            class="far fa-arrow-alt-circle-up text-center mt-1 extra"
                            v-if="extraInfoVisible"
                        ></i>
                    </div>
                </div>
                <div class="col-12 text-center" v-if="extraInfoVisible">
                    <div class="comments" v-if="offer.comments">
                        <p v-if="offer.comments.length" class="title">Комментарии</p>
                        <p
                            v-for="comment in offer.comments"
                            :key="comment.id"
                            :class="{ current: comment.timeline_step_id == currentStepId }"
                        >
                            {{ comment.comment }}
                        </p>
                    </div>
                    <div class="params">
                        <div class="params__item">
                            <p class="title">Площадь объекта:</p>
                            <p class="value">
                                {{ $formatter.number(offer.area_building) }}
                                <small> м<sup>2</sup></small>
                            </p>
                        </div>
                        <div class="params__item">
                            <p class="title">Этажи:</p>
                            <p class="value">{{ offer.calc_floors }}</p>
                        </div>
                        <div class="params__item">
                            <p class="title">Потолки:</p>
                            <p class="value">
                                {{ offer.calc_ceilingHeight }} <small>м</small>
                            </p>
                        </div>
                        <div class="params__item">
                            <p class="title">Электричество:</p>
                            <p class="value">
                                {{ $formatter.number(offer.power_value) }} <small>кВт</small>
                            </p>
                        </div>
                        <div class="params__item">
                            <p class="title">Тип ворот:</p>
                            <p class="value">{{ offer.gate_type }}</p>
                        </div>
                        <div class="params__item">
                            <p class="title">Отапливаемый:</p>
                            <p class="value">{{ offer.heated ? "да" : "нет" }}</p>
                        </div>
                        <div class="params__item">
                            <p class="title">Антипыль:</p>
                            <p class="value">{{ offer.self_leveling ? "да" : "нет" }}</p>
                        </div>
                        <div class="params__item">
                            <p class="title">Краны:</p>
                            <p class="value">{{ offer.has_cranes ? "да" : "нет" }}</p>
                        </div>
                        <div class="params__item">
                            <p class="title">От МКАД:</p>
                            <p class="value">{{ offer.from_mkad }} <small>км</small></p>
                        </div>
                    </div>

                    <div class="address">
                        <p class="title">Адрес</p>
                        <p>{{ offer.address }}</p>
                    </div>
                    <div class="description">
                        <p class="title">Ручное описание</p>
                        <p>
                            {{ offer.object.description || "—" }}
                        </p>
                    </div>
                    <div class="description-auto">
                        <p class="title">Авто описание</p>
                        <p>
                            {{ offer.object.description_auto || "—" }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {TaxFormList} from "@/const/const.js";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "CompanyObjectItemOfferOnly",
    data() {
        return {
            taxFormList: TaxFormList,
            extraInfoVisible: false,
            localComment: null,
        };
    },
    props: {
        offer: {
            type: Object,
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
        classList: {
            type: String,
            default() {
                return "";
            },
        },
        col: {
            type: String,
            default() {
                return "col-4";
            },
        },
        disabled: {
            type: Boolean,
            default: true,
        },
        currentStepId: {
            type: Number,
        },
    },
    computed: {
        ...mapGetters(["THIS_USER", "FAVORITES_OFFERS"]),
        isNewRecommended() {
            const newRecommended = this.$route.query.new_original_id;
            if (!newRecommended) return false;
            if (Array.isArray(newRecommended)) {
                return newRecommended.includes(this.offer.original_id.toString());
            }
            return newRecommended == this.offer.original_id;
        },
        offerUrl() {
            return this.$apiUrlHelper.generator().offerUrl(this.offer);
        },
        pdfUrl() {
            return this.$apiUrlHelper
                .generator()
                .pdfUrl(this.offer, this.THIS_USER.id);
        },
        taxForm() {
            if (
                this.offer.generalOffersMix &&
                this.offer.generalOffersMix.offer &&
                this.offer.generalOffersMix.offer.tax_form
            ) {
                return TaxFormList.find(
                    (item) => item.value == this.offer.generalOffersMix.offer.tax_form
                ).label;
            }

            return null;
        },
    },
    methods: {
        ...mapActions(["ADD_FAVORITES_OFFER", "DELETE_FAVORITES_OFFERS"]),
        toggleExtraInfoVisible() {
            this.extraInfoVisible = !this.extraInfoVisible;
        },
        clickSelectObject() {
            if (this.disabled || this.offer.type_id == 3) return;
            this.$emit("select", this.offer);
            setTimeout(() => {
                this.$refs.comment.focus();
            });
        },
        clickUnSelectObject() {
            this.$emit("unSelect", this.offer);
        },
        enterTextarea() {
            this.$refs.comment.blur();
        },
        unfocusTextarea() {
            this.$emit("addComment", this.offer, this.localComment);
        },
        async clickFavotiteOffer(offer) {
            if (
                !this.FAVORITES_OFFERS.find(
                    (item) => item.original_id == offer.original_id
                )
            ) {
                return this.ADD_FAVORITES_OFFER(offer);
            }
            await this.DELETE_FAVORITES_OFFERS(offer);
            this.$emit("deleteFavoriteOffer", offer);
        },
        clickViewPdf() {
            window.open(this.pdfUrl, "_blank");
        },
        clickView() {
            window.open(this.offerUrl, "_blank");
        },
    },
    mounted() {
        if (this.offer.comment) {
            this.localComment = this.offer.comment;
        }
    },
    watch: {
        offer: {
            handler() {
            },
            deep: true,
        },
    },
    emits: ["select", "unSelect", "addComment", "deleteFavoriteOffer"],
};
</script>

<style>
.animated-background {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 5s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>