<template>
    <div class="offer-table-item-preview">
        <div class="offer-table-item-preview__header mb-1">
            <UiField v-if="isPassive" color="danger-light">Пассив</UiField>
            <UiField v-if="object.object_class_text" color="danger-light">
                {{ object.object_class_text }} класс
            </UiField>
            <UiField tooltip="Тип объекта" color="gray-l">
                {{ object.is_land ? 'Участок' : 'Строение' }}
            </UiField>
            <UiField v-if="!object.is_land && object.floors" color="gray-l">
                {{ floorsPluralLabel }}
            </UiField>
        </div>
        <component
            :is="as"
            @click.stop="$emit('click-preview')"
            class="offer-table-item-preview__container"
            :href="objectUrl"
            target="_blank"
        >
            <NoImage v-if="!object.thumb" />
            <OfferTableItemPreviewMotionSlider
                v-else
                :thumb="object.thumb"
                :photos="object.photo"
            />
            <div class="offer-table-item-preview__publishes">
                <UiButton
                    v-if="object.complex_objects_count > 1"
                    @click.stop.prevent="$emit('show-complex-objects')"
                    color="light"
                    class="offer-table-item-preview__complex align-self-end"
                    icon="fa-solid fa-arrow-up-right-from-square"
                    mini
                >
                    +{{ object.complex_objects_count - 1 }} в комплексе
                </UiButton>
                <span v-if="object.test_only" class="offer-table-item-preview__chip">Тест</span>
            </div>
        </component>
        <div v-if="object.object_type?.length > 0" class="offer-table-item-preview__types">
            <UiField
                v-for="element in objectTypes"
                :key="element.id"
                :tooltip="element.name"
                color="gray-l"
            >
                <i :class="element.icon" />
            </UiField>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { objectOptions } from '@/const/options/object.options.js';
import OfferTableItemPreviewMotionSlider from '@/components/Offer/TableItem/OfferTableItemPreviewMotionSlider.vue';
import NoImage from '@/components/common/NoImage.vue';
import UiField from '@/components/common/UI/UiField.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useRouter } from 'vue-router';
import { plural } from '@/utils/plural.js';
import { isArray } from '@/utils/helpers/array/isArray.ts';

defineEmits(['click-preview', 'show-complex-objects']);
const props = defineProps({
    object: {
        type: Object,
        required: true
    },
    isPassive: Boolean,
    as: {
        type: String,
        default: 'a'
    }
});

const objectTypes = computed(() => {
    if (isArray(props.object.object_type)) {
        return props.object.object_type.map((element, index) => ({
            id: index,
            name: objectOptions.typeGeneral[element - 1].name,
            icon: objectOptions.typeGeneral[element - 1].icon
        }));
    }

    return [];
});

const router = useRouter();

const objectUrl = computed(
    () =>
        router.resolve({ name: 'complex.view', params: { complex_id: props.object.complex_id } })
            ?.href
);

const floorsPluralLabel = computed(() =>
    plural(props.object.floors, '%d этаж', '%d этажа', '%d этажей')
);
</script>
