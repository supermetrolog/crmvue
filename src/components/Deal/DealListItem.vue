<template>
    <div class="deal-item">
        <HoverActionsButton
            v-if="!readOnly"
            @click="updateDeal"
            label="Редактировать"
            class="deal-item__edit"
        >
            <i class="fa-solid fa-pen"></i>
        </HoverActionsButton>
        <HoverActionsButton
            v-if="!readOnly"
            @click="deleteDeal"
            label="Удалить"
            class="deal-item__delete"
        >
            <i class="fa-solid fa-times"></i>
        </HoverActionsButton>
        <div class="row">
            <div class="col-4 text-center align-self-center">
                <i class="fas fa-handshake deal-item__icon"></i>
            </div>
            <div class="col-8 pl-0">
                <div class="row no-gutters">
                    <div class="col-4 text-right pr-2"><p>название:</p></div>
                    <div class="col-8 pl-4">
                        <strong>{{ deal.name || '—' }}</strong>
                    </div>
                    <div class="col-4 text-right pr-2"><p>объект:</p></div>
                    <div class="col-8 pl-4">
                        <strong v-if="deal.offer">
                            <a :href="offerUrl" target="_blanc">
                                {{ deal.offer.visual_id }}
                            </a>
                        </strong>
                        <strong v-else>
                            <a :href="offerUrl" target="_blanc">
                                {{ deal.object_id }}
                            </a>
                        </strong>
                    </div>
                    <div class="col-4 text-right pr-2"><p>площадь:</p></div>
                    <div class="col-8 pl-4">
                        <strong v-if="deal.area"
                            >{{ $formatter.number(deal.area) }} м<sup>2</sup></strong
                        >
                        <strong v-else>—</strong>
                    </div>
                    <div class="col-4 text-right pr-2"><p>цена пола:</p></div>
                    <div class="col-8 pl-4">
                        <strong v-if="deal.floorPrice">{{
                            $formatter.currency(deal.floorPrice)
                        }}</strong>
                        <strong v-else>—</strong>
                    </div>
                    <div class="col-4 text-right pr-2"><p>юр. лицо:</p></div>
                    <div class="col-8 pl-4">
                        <strong>{{ deal.clientLegalEntity_full_name || '—' }}</strong>
                    </div>
                    <div v-if="deal.is_competitor" class="col-4 text-right pr-2 text-danger">
                        <p>конкурент:</p>
                    </div>
                    <div v-if="deal.is_competitor" class="col-8 pl-4">
                        <strong>
                            <router-link :to="'/companies/' + deal.competitor.id">
                                {{ deal.competitor.full_name || '—' }}
                            </router-link>
                        </strong>
                    </div>
                    <div class="col-4 text-right pr-2"><p>дата сделки:</p></div>
                    <div class="col-8 pl-4">
                        <strong>{{ deal.dealDate_format || '—' }}</strong>
                    </div>
                    <div class="col-4 text-right pr-2"><p>консультант:</p></div>
                    <div class="col-8 pl-4">
                        <strong>{{ deal.consultant.userProfile.short_name || '—' }}</strong>
                    </div>
                    <div
                        class="col-4 text-right pr-2"
                        title="Срок окончания контракта (если это аренда) (в месяцах)"
                    >
                        <p>срок:</p>
                    </div>
                    <div class="col-8 pl-4">
                        <strong>{{ deal.contractTerm || '—' }}</strong>
                    </div>
                    <div class="col-4 text-right pr-2"><p>описание:</p></div>
                    <div class="col-8 pl-4">
                        <strong>{{ deal.description || '—' }}</strong>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

export default {
    name: 'DealListItem',
    components: { HoverActionsButton },
    emits: ['update', 'delete'],
    props: {
        deal: {
            type: Object
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        offerUrl() {
            return this.$url.offerByObject(this.deal.offer ? this.deal.offer : this.deal);
        }
    },

    methods: {
        updateDeal() {
            this.$emit('update');
        },
        deleteDeal() {
            this.$emit('delete');
        }
    }
};
</script>
