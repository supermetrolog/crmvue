<template>
    <div class="object-holding">
        <div class="object-holding__body">
            <div class="object-holding__carousel">
                <div class="object-holding__badges">
                    <div class="object-holding__type">
                        <i v-if="object.is_land" v-tippy="'Участок'" class="fa-solid fa-tree"></i>
                        <i v-else v-tippy="'Строение'" class="fa-solid fa-warehouse"></i>
                    </div>
                    <div class="object-holding__badge">ID {{ object.id }}</div>
                </div>
                <Carousel
                    v-if="objectPhoto"
                    :title="`Объект #${object.id}`"
                    :slides="objectPhoto"
                />
                <button
                    v-if="objectPhoto.length"
                    @click.prevent="openDownloader(objectPhoto)"
                    class="object-holding__download"
                >
                    Скачать фотографии
                </button>
            </div>
            <div class="object-holding__info">
                <div class="object-holding__info-left">
                    <ComplexHoldingParameters :object="object" />
                </div>
                <div class="object-holding__info-right">
                    <ComplexHoldingCompany v-if="object.company" :company="object.company" />
                    <span v-else>Компания не найдена..</span>
                </div>
            </div>
        </div>
        <ComplexHoldingTabs :object="object" />
    </div>
</template>

<script setup>
import Carousel from '@/components/common/Carousel.vue';
import ComplexHoldingParameters from '@/components/Complex/Holding/ComplexHoldingParameters.vue';
import ComplexHoldingTabs from '@/components/Complex/Holding/ComplexHoldingTabs.vue';
import ComplexHoldingCompany from '@/components/Complex/Holding/ComplexHoldingCompany.vue';
import { computed, inject, provide } from 'vue';
import { $generatorURL as $url } from '@/plugins/url.js';

const props = defineProps({
    object: {
        type: Object,
        required: true
    }
});

provide('objectIsLand', props.object.is_land);
const openDownloader = inject('openDownloader');

const objectPhoto = computed(() =>
    props.object.photo
        ? props.object.photo.map(el => ({
              src: $url.api.objects() + el
          }))
        : []
);
</script>
