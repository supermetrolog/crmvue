<template>
    <div class="survey-form-object__content">
        <div class="survey-form-object__description">
            <Tippy interactive :interactive-border="10" :delay="400">
                <template #default>
                    <p ref="address" class="survey-form-object__address fs-2">
                        <span>{{ object.address }}</span>
                        <span v-if="object.from_mkad">; {{ object.from_mkad }} км от мкад </span>
                    </p>
                </template>
                <template #content>
                    <p class="fs-2 color-light mb-1">Адрес строения:</p>
                    <p class="fs-2 mb-2">
                        <span>{{ object.address }}</span>
                        <span v-if="object.from_mkad">; {{ object.from_mkad }} км от мкад </span>
                    </p>
                    <div class="d-flex gap-2">
                        <UiButton
                            @click.stop="copyAddress"
                            mini
                            color="light"
                            :icon="alreadyCopied ? 'fa-solid fa-check' : 'fa-solid fa-copy'"
                            :disabled="alreadyCopied"
                        >
                            {{ alreadyCopied ? 'Скопировано' : 'Копировать' }}
                        </UiButton>
                        <UiButton
                            @click.stop="$emit('show-map')"
                            mini
                            color="light"
                            icon="fa-solid fa-map-location-dot"
                        >
                            Открыть на карте
                        </UiButton>
                    </div>
                </template>
            </Tippy>
        </div>
        <div class="d-flex gap-1 flex-wrap fs-2 font-weight-semi">
            <span>{{ object.is_land ? 'Участок' : 'Строение' }}</span>
            <span>|</span>
            <WithUnitType :unit-type="unitTypes.SQUARE_METERS">
                {{ fullArea }}
            </WithUnitType>
            <template v-if="!object.is_land">
                <span>|</span>
                <span>{{ object.object_class_text }} класс</span>
            </template>
        </div>
        <div v-if="object.offers" class="d-flex gap-1 flex-wrap mt-2">
            <SurveyFormObjectOffer
                v-for="offer in preparedOffers"
                :key="offer.id"
                :offer="offer"
                class="survey-form-object__offer mr-1"
            />
            <span v-if="!preparedOffers.length" class="d-flex gap-1 align-items-center">
                <i class="fa-solid fa-ban mb-1" />
                <span>Без активных предложений</span>
            </span>
        </div>
    </div>
</template>
<script setup>
import WithUnitType from '@/components/common/WithUnitType.vue';
import { unitTypes } from '@/const/unitTypes.js';
import { computed, useTemplateRef } from 'vue';
import { toNumberFormat } from '@/utils/formatters/number.js';
import SurveyFormObjectOffer from '@/components/SurveyForm/Object/SurveyFormObjectOffer.vue';
import { useTippyText } from '@/composables/useTippyText.js';
import { Tippy } from 'vue-tippy';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useClipboard } from '@vueuse/core';
import { useNotify } from '@/utils/use/useNotify.js';

defineEmits(['show-map']);

const props = defineProps({
    object: {
        type: Object,
        required: true
    }
});

const fullArea = computed(() => {
    if (props.object.is_land) return toNumberFormat(props.object.area_field_full);
    return toNumberFormat(props.object.area_building);
});

useTippyText(useTemplateRef('objectTypeField'), 'Тип объекта');
useTippyText(useTemplateRef('fullAreaField'), 'Общая площадь');

const preparedOffers = computed(() => {
    return props.object.offers.filter(offer => !offer.isDeleted && offer.status === 1);
});

// copy

const { copy, text: clipboardText } = useClipboard();
const notify = useNotify();

const alreadyCopied = computed(() => props.object.address === clipboardText.value);

function copyAddress() {
    copy(props.object.address);
    notify.info('Адрес скопирован в буфер обмена');
}
</script>
