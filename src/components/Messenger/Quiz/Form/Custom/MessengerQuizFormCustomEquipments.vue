<template>
    <div>
        <div class="d-flex flex-column gap-1">
            <div class="d-flex flex-column gap-1 align-items-start">
                <CheckboxChip v-model="hasOffers" show-checkbox text="Продать оборудование" />
                <AnimationTransition :speed="0.3">
                    <UiTextarea
                        v-if="hasOffers"
                        v-model="offersDescription"
                        auto-height
                        required
                        :min-height="50"
                        :max-height="200"
                        label="Описание по продаже"
                        placeholder="Что хотят продать? Условия, цены, подробности.."
                        class="w-100"
                        :v="v$.offersDescription"
                    />
                </AnimationTransition>
            </div>
            <div class="d-flex flex-column gap-1 align-items-start">
                <CheckboxChip v-model="hasRequests" show-checkbox text="Купить оборудование" />
                <AnimationTransition :speed="0.3">
                    <UiTextarea
                        v-if="hasRequests"
                        v-model="requestsDescription"
                        auto-height
                        required
                        :min-height="50"
                        :max-height="200"
                        label="Описание по покупке"
                        placeholder="Что хотят купить? Бюджет, подробности.."
                        class="w-100"
                        :v="v$.requestsDescription"
                    />
                </AnimationTransition>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import CheckboxChip from '@/components/common/Forms/CheckboxChip.vue';
import UiTextarea from '@/components/common/Forms/UiTextarea.vue';
import { useNotify } from '@/utils/use/useNotify.js';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const hasRequests = ref(false);
const hasOffers = ref(false);

const offersDescription = ref(null);
const requestsDescription = ref(null);

function getForm() {
    return {
        hasOffers: hasOffers.value,
        hasRequests: hasRequests.value,
        offersDescription: offersDescription.value,
        requestsDescription: requestsDescription.value
    };
}

const notify = useNotify();

function validate() {
    if (!hasRequests.value && !hasOffers.value) {
        notify.info('Заполните вопрос о потребности в оборудовании');
        return false;
    }

    if (hasRequests.value && !requestsDescription.value) {
        notify.info('Заполните описание о покупке оборудования');
        return false;
    }

    if (hasOffers.value && !offersDescription.value) {
        notify.info('Заполните описание о продаже оборудования');
        return false;
    }

    return true;
}

function setRequestsValue(value) {
    hasRequests.value = value;
}

function setOffersValue(value) {
    hasOffers.value = value;
}

function setRequestsDescription(value) {
    requestsDescription.value = value;
}

function setOffersDescription(value) {
    offersDescription.value = value;
}

defineExpose({
    getForm,
    validate,
    setRequestsValue,
    setOffersValue,
    setRequestsDescription,
    setOffersDescription
});

// form

const v$ = useVuelidate({
    offersDescription: { required: helpers.withMessage('Заполните описание', required) },
    requestsDescription: { required: helpers.withMessage('Заполните описание', required) }
});
</script>
