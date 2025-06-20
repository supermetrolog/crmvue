<template>
    <div>
        <div class="d-flex flex-column gap-2">
            <div class="d-flex flex-column gap-1 align-items-start">
                <div class="d-flex gap-1">
                    <UiButton
                        @click="addOffer"
                        :disabled="hasOffers"
                        small
                        :color="hasOffers ? 'success' : 'white'"
                        icon="fa-solid fa-plus"
                    >
                        Продать оборудование
                    </UiButton>
                    <UiButton
                        @click="cancelOffer"
                        :disabled="!hasOffers"
                        small
                        color="white"
                        icon="fa-solid fa-xmark"
                    >
                        Очистить
                    </UiButton>
                </div>
                <template v-if="hasOffers">
                    <p class="mt-1 text-grey">Продажа:</p>
                    <VueEditor
                        v-model="offersDescription"
                        :min-height="50"
                        :max-height="200"
                        :toolbar="false"
                        required
                        placeholder="Что хотят продать? Условия, цены, подробности.."
                        class="w-100"
                        :v="v$.offersDescription"
                    />
                </template>
            </div>
            <div class="d-flex flex-column gap-1 align-items-start">
                <div class="d-flex gap-1">
                    <UiButton
                        @click="addRequest"
                        :disabled="hasRequests"
                        small
                        :color="hasRequests ? 'success' : 'white'"
                        icon="fa-solid fa-plus"
                    >
                        Купить оборудование
                    </UiButton>
                    <UiButton
                        @click="cancelRequest"
                        :disabled="!hasRequests"
                        small
                        color="white"
                        icon="fa-solid fa-xmark"
                    >
                        Очистить
                    </UiButton>
                </div>
                <template v-if="hasRequests">
                    <p class="mt-1 text-grey">Купля:</p>
                    <VueEditor
                        v-model="requestsDescription"
                        :min-height="50"
                        :max-height="200"
                        :toolbar="false"
                        required
                        placeholder="Что хотят купить? Бюджет, подробности.."
                        class="w-100"
                        :v="v$.requestsDescription"
                    />
                </template>
            </div>
        </div>
        <teleport to="body">
            <UiModal
                v-model:visible="offerFormIsVisible"
                @close="offerFormIsVisible = false"
                :width="720"
                custom-close
                :close-on-press-esc="false"
                :close-on-outside-click="false"
                title="Продажа оборудования"
            >
                <UiForm>
                    <VueEditor
                        v-model="offersDescription"
                        label="Описание по продаже"
                        :min-height="80"
                        :max-height="200"
                        :toolbar="false"
                        required
                        placeholder="Что хотят продать? Условия, цены, подробности.."
                        class="w-100"
                        :v="v$.offersDescription"
                    />
                </UiForm>
                <template #actions>
                    <UiButton
                        @click="saveOffer"
                        color="success-light"
                        small
                        icon="fa-solid fa-check"
                    >
                        Сохранить
                    </UiButton>
                    <UiButton @click="cancelOffer" color="light" small icon="fa-solid fa-ban">
                        Отмена
                    </UiButton>
                </template>
            </UiModal>
            <UiModal
                v-model:visible="requestFormIsVisible"
                @close="requestFormIsVisible = false"
                :width="720"
                custom-close
                :close-on-press-esc="false"
                :close-on-outside-click="false"
                title="Покупка оборудования"
            >
                <UiForm>
                    <VueEditor
                        v-model="requestsDescription"
                        :v="v$.requestsDescription"
                        :min-height="80"
                        :max-height="200"
                        :toolbar="false"
                        required
                        label="Описание по покупке"
                        placeholder="Что хотят купить? Бюджет, подробности.."
                        class="w-100"
                    />
                </UiForm>
                <template #actions>
                    <UiButton
                        @click="saveRequest"
                        color="success-light"
                        small
                        icon="fa-solid fa-check"
                    >
                        Сохранить
                    </UiButton>
                    <UiButton @click="cancelRequest" color="light" icon="fa-solid fa-ban" small>
                        Отмена
                    </UiButton>
                </template>
            </UiModal>
        </teleport>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { helpers, requiredIf } from '@vuelidate/validators';
import { useNotify } from '@/utils/use/useNotify.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';

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

const offerFormIsVisible = ref(false);
const requestFormIsVisible = ref(false);

const v$ = useVuelidate(
    {
        offersDescription: {
            required: helpers.withMessage(
                'Заполните описание',
                requiredIf(computed(() => hasOffers.value || offerFormIsVisible.value))
            )
        },
        requestsDescription: {
            required: helpers.withMessage(
                'Заполните описание',
                requiredIf(computed(() => hasRequests.value || requestFormIsVisible.value))
            )
        }
    },

    { offersDescription, requestsDescription }
);

function addOffer() {
    offersDescription.value = null;
    offerFormIsVisible.value = true;
}

function addRequest() {
    requestsDescription.value = null;
    requestFormIsVisible.value = true;
}

async function saveOffer() {
    const isValid = await v$.value.offersDescription.$validate();
    if (!isValid) return;

    offerFormIsVisible.value = false;
    hasOffers.value = true;
}

async function saveRequest() {
    const isValid = await v$.value.requestsDescription.$validate();
    if (!isValid) return;

    requestFormIsVisible.value = false;
    hasRequests.value = true;
}

function cancelOffer() {
    offerFormIsVisible.value = false;
    offersDescription.value = null;
    hasOffers.value = false;
    v$.value.$reset();
}

function cancelRequest() {
    requestFormIsVisible.value = false;
    requestsDescription.value = null;
    hasRequests.value = false;
    v$.value.$reset();
}
</script>
