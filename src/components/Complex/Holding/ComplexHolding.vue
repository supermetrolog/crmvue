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

<script>
import Carousel from '@/components/common/Carousel.vue';
import ComplexHoldingParameters from '@/components/Complex/Holding/ComplexHoldingParameters.vue';
import ComplexHoldingTabs from '@/components/Complex/Holding/ComplexHoldingTabs.vue';
import ComplexHoldingCompany from '@/components/Complex/Holding/ComplexHoldingCompany.vue';

export default {
    name: 'ComplexHolding',
    components: {
        ComplexHoldingCompany,
        ComplexHoldingTabs,

        ComplexHoldingParameters,
        Carousel
    },
    provide() {
        return {
            objectIsLand: this.object.is_land
        };
    },
    inject: { openDownloader: 'openDownloader' },
    props: {
        object: {
            type: Object,
            required: true
        }
    },
    computed: {
        objectPhoto() {
            return this.object.photo
                ? this.object.photo.map(el => ({
                      src: this.$url.api.objects() + el
                  }))
                : [];
        }
    }
};
</script>
