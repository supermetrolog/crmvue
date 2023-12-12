<template>
    <div class="company-objects-list__item" :class="col">
        <div class="row no-gutters">
            <div class="col-4" :title="object.description_auto || 'нет описания'">
                <div class="image-container">
                    <a
                        :href="$apiUrlHelper.generator().objectUrl(object.complex_id)"
                        target="_blank"
                    >
                        <img :src="object.thumb" alt="image"/>
                    </a>
                </div>
            </div>
            <div class="col-8 desc">
                <div class="item__title">
                    <p>ID-{{ object.id }}</p>
                    <p>{{ $formatter.number(object.area_building) }} м<sup>2</sup></p>
                </div>
                <div class="address">
                    <p>{{ object.address }}</p>
                </div>
                <div class="params">
                    <div class="params__item">
                        <p class="title">Этажи:</p>
                        <p class="value">{{ object.floors || "—" }}</p>
                    </div>
                    <div class="params__item">
                        <p class="title">Потолки:</p>
                        <p class="value">{{ object.calc_ceiling_height || "—" }}</p>
                    </div>
                </div>
                <div class="params">
                    <div class="params__item">
                        <p class="title">Электричество:</p>
                        <p class="value">
                            {{ $formatter.number(object.power) }} <small>кВт</small>
                        </p>
                    </div>
                    <div class="params__item">
                        <p class="title">Тип ворот:</p>
                        <p class="value">{{ object.calc_gate_type || "—" }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row no-gutters" v-if="object.offerMix">
            <CompanyObjectItemOffer
                v-for="offer in object.offerMix"
                :key="offer.id"
                :offer="offer"
                class="main"
            />
        </div>
    </div>
</template>

<script>
import CompanyObjectItemOffer from "./CompanyObjectItemOffer.vue";

export default {
    name: "CompanyObjectItem",
    components: {
        CompanyObjectItemOffer,
    },
    props: {
        object: {
            type: Object,
        },
        col: {
            type: String,
            default: "col-12",
        },
    },
};
</script>

<style>
</style>