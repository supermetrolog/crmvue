<template>
    <div>
        <div
            class="object-offer object-offer--only"
            :class="[
                {
                    passive: isPassive,
                    general: offer.type_id === 2,
                    selected: isSelected
                }
            ]"
        >
            <div class="row no-gutters object-offer__info">
                <div class="col-12 align-self-center">
                    <div class="object-offer__preview">
                        <div class="object-offer__chips">
                            <DashboardChip v-if="offer.deal_type_name" class="object-offer__chip">
                                {{ offer.deal_type_name }}
                            </DashboardChip>
                            <DashboardChip
                                v-else-if="isPassive"
                                class="object-offer__chip dashboard-bg-danger text-white"
                            >
                                Пассив
                            </DashboardChip>
                            <DashboardChip v-tippy="'Класс объекта'" class="object-offer__chip">
                                {{ offer.class_name }}
                            </DashboardChip>
                            <DashboardChip
                                v-if="offer.duplicate_count > 1"
                                v-tippy="'Количество отправлений'"
                                class="object-offer__duplicate"
                            >
                                {{ offer.duplicate_count }}
                            </DashboardChip>
                            <DashboardChip class="object-offer__chip ml-auto">
                                {{ offer.visual_id }}
                            </DashboardChip>
                        </div>
                        <span
                            v-if="offer.test_only"
                            class="object-offer__badge object-offer__test-only"
                        >
                            Тестовый лот
                        </span>
                        <span
                            v-if="offer.type_id === 2"
                            class="object-offer__badge object-offer__is-main"
                        >
                            Общий
                        </span>
                        <span
                            v-else-if="offer.type_id === 1"
                            class="object-offer__badge object-offer__is-block"
                        >
                            Блок
                        </span>
                        <span v-else class="object-offer__badge object-offer__is-undefined">
                            Неизвестно
                        </span>
                        <a
                            @click.prevent="select"
                            class="object-offer__photo"
                            href="#"
                            target="_blank"
                        >
                            <VLazyImage :src="offer.thumb" alt="image" />
                        </a>
                        <div
                            @click.prevent="$emit('unselect', offer)"
                            class="object-offer__unselect"
                        >
                            <i class="fas fa-check" />
                        </div>
                    </div>
                </div>
                <div
                    class="col-12 px-2 object-offer__content text-center"
                    :class="{ 'animated-background': isNewRecommended }"
                >
                    <DashboardChip
                        v-if="isPassive"
                        class="dashboard-bg-danger text-white mx-auto mb-1"
                    >
                        Пассив
                    </DashboardChip>
                    <Form v-if="isSelected" class="object-offer__form mb-2">
                        <textarea
                            ref="comment"
                            v-model.trim="localComment"
                            @blur="unfocusTextarea"
                            @keypress.enter="enterTextarea"
                            class="form__textarea"
                            rows="3"
                            placeholder="Комментарий клиенту"
                        />
                    </Form>
                    <div class="object-offer__actions mb-2">
                        <HoverActionsButton
                            v-if="offer.type_id !== 3"
                            @click="toggleFavorite(offer)"
                            :label="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
                            :active="isFavorite"
                        >
                            <i class="fa-solid fa-star" />
                        </HoverActionsButton>
                        <a v-if="offer.type_id !== 3" :href="pdfUrl" target="_blank">
                            <HoverActionsButton v-tippy="'Открыть в PDF'">
                                <i class="fa-solid fa-file-pdf" />
                            </HoverActionsButton>
                        </a>
                        <a :href="$url.offerByObject(offer)" target="_blank">
                            <HoverActionsButton v-tippy="'Открыть страницу предложения'">
                                <i class="fa-solid fa-eye" />
                            </HoverActionsButton>
                        </a>
                    </div>
                    <div class="object-offer__location">
                        {{ location }}
                    </div>
                    <p class="mb-1">{{ offer.object_type_name }}</p>
                    <div v-if="offer.deal_type" class="object-offer__price mb-1">
                        <DashboardChip class="dashboard-bg-success-l">
                            <div class="d-flex align-items-center gap-2">
                                <i class="fa-solid fa-ruble-sign" />
                                <with-unit-type
                                    v-if="offer.deal_type === 1 || offer.deal_type === 4"
                                    :unit-type="unitTypes.RUB_PER_SQUARE_METERS_PER_YEAR"
                                >
                                    {{ offer.calc_price_warehouse }}
                                </with-unit-type>
                                <with-unit-type
                                    v-else-if="offer.deal_type === 2"
                                    :unit-type="unitTypes.RUB_PER_SQUARE_METERS"
                                >
                                    {{ offer.calc_price_sale }}
                                </with-unit-type>
                            </div>
                        </DashboardChip>
                        <DashboardChip v-if="taxForm" class="dashboard-bg-gray-l">
                            {{ taxForm }}
                        </DashboardChip>
                    </div>
                    <DashboardChip class="dashboard-bg-success-l mx-auto">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fa-solid fa-square-full" />
                            <with-unit-type :unit-type="unitTypes.SQUARE_METERS">
                                {{ offer.calc_area_general }}
                            </with-unit-type>
                        </div>
                    </DashboardChip>
                </div>
                <div class="col-12">
                    <AccordionSimple without-render>
                        <template #title>
                            <AccordionSimpleTrigger>
                                <DashboardChip class="dashboard-bg-light w-100 br-0">
                                    <div class="d-flex justify-content-center gap-2">
                                        <span>Дополнительная информация</span>
                                        <AccordionSimpleTriggerIcon />
                                    </div>
                                </DashboardChip>
                            </AccordionSimpleTrigger>
                        </template>
                        <template #body>
                            <CompanyObjectItemOfferOnlyExternal
                                :currentStepID="currentStepID"
                                :offer="offer"
                            />
                        </template>
                    </AccordionSimple>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { TaxFormList } from '@/const/const.js';
import { mapActions, mapGetters } from 'vuex';
import { unitTypes } from '@/const/unitTypes.js';
import AccordionSimpleTriggerIcon from '@/components/common/Accordion/AccordionSimpleTriggerIcon.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import AccordionSimple from '@/components/common/Accordion/AccordionSimple.vue';
import AccordionSimpleTrigger from '@/components/common/Accordion/AccordionSimpleTrigger.vue';
import CompanyObjectItemOfferOnlyExternal from '@/components/Company/Object/CompanyObjectItemOfferOnlyExternal.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import VLazyImage from 'v-lazy-image';
import Form from '@/components/common/Forms/Form.vue';
import WithUnitType from '@/components/common/WithUnitType.vue';

export default {
    name: 'CompanyObjectItemOfferOnly',
    components: {
        WithUnitType,
        Form,
        VLazyImage,
        HoverActionsButton,
        CompanyObjectItemOfferOnlyExternal,
        AccordionSimpleTrigger,
        AccordionSimple,
        DashboardChip,
        AccordionSimpleTriggerIcon
    },
    emits: ['select', 'unselect', 'addComment', 'deleteFavoriteOffer'],
    props: {
        offer: {
            type: Object
        },
        isSelected: {
            type: Boolean,
            default: false
        },
        col: {
            type: String,
            default: 'col-4'
        },
        disabled: {
            type: Boolean,
            default: true
        },
        currentStepID: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            extraInfoVisible: false,
            localComment: null
        };
    },
    computed: {
        unitTypes() {
            return unitTypes;
        },
        ...mapGetters(['THIS_USER', 'FAVORITES_OFFERS']),
        isNewRecommended() {
            const newRecommended = this.$route.query.new_original_id;
            if (!newRecommended) return false;

            if (Array.isArray(newRecommended)) {
                return newRecommended.includes(this.offer.original_id.toString());
            }
            return Number(newRecommended) === this.offer.original_id;
        },
        pdfUrl() {
            return this.$url.pdf(
                {
                    type_id: 2,
                    offer_id: this.offer.original_id,
                    object_id: this.offer.object_id
                },
                this.THIS_USER.id
            );
        },
        taxForm() {
            if (this.offer.generalOffersMix?.offer?.tax_form)
                return TaxFormList[this.offer.generalOffersMix.offer.tax_form - 1].label;
            return null;
        },
        isFavorite() {
            return this.$store.state.Offers.favoritesOffersCache[this.offer.original_id];
        },
        isPassive() {
            return this.offer.status !== 1;
        },
        location() {
            return [
                this.offer.district_name,
                this.offer.region_name,
                this.offer.district_moscow_name,
                this.offer.direction_name
            ]
                .filter(Boolean)
                .join(' — ');
        }
    },
    methods: {
        ...mapActions(['ADD_FAVORITES_OFFER', 'DELETE_FAVORITES_OFFERS']),
        select() {
            if (this.disabled || this.offer.type_id === 3) return;

            this.$emit('select', this.offer);
            this.$nextTick(() => {
                this.$refs.comment.focus();
            });
        },
        enterTextarea() {
            this.$refs.comment.blur();
        },
        unfocusTextarea() {
            this.$emit('addComment', this.offer.id, this.localComment);
        },
        async toggleFavorite(offer) {
            if (!this.isFavorite) return await this.ADD_FAVORITES_OFFER(offer);

            await this.DELETE_FAVORITES_OFFERS(offer);
            this.$emit('deleteFavoriteOffer', offer);
        }
    },
    created() {
        if (this.offer.comment) this.localComment = this.offer.comment;
    }
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
        background-position: 0 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
</style>
