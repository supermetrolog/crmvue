<template>
    <div class="d-flex gap-4">
        <div>
            <UiField color="light" class="w-100 mb-1 text-center font-weight-semi">
                Ссылка на бота
            </UiField>
            <UiQRCode :value="botLink" />
        </div>
        <div class="d-flex flex-column">
            <p class="font-weight-semi fs-4">Свяжите Whatsapp аккаунт с системой</p>
            <p class="text-dark mb-3">Укажите номер телефона, привязанный к Whatsapp</p>
            <UiForm>
                <UiInput
                    ref="inputEl"
                    v-model="modelPhone"
                    placeholder="+7 (___) ___-__-__"
                    required
                    :v="v$.phone"
                    lazy-validation
                    :disabled="isLoading"
                >
                    <UiButton
                        v-if="currentPhone"
                        @click.prevent="selectProfileNumber"
                        small
                        color="light"
                        icon="fa-solid fa-phone"
                        class="mt-1 text-dark"
                    >
                        <span>Номер профиля</span>
                        <span class="mx-1">|</span>
                        <span class="fs-2">{{ currentPhone }}</span>
                    </UiButton>
                </UiInput>
            </UiForm>
            <div class="d-flex mt-3 gap-2">
                <UiButton
                    @click="linkWhatsapp"
                    color="success"
                    icon="fa-solid fa-check"
                    bolder
                    :state
                >
                    Связать профили
                </UiButton>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import UiQRCode from '@/components/common/UI/UiQRCode.vue';
import UiForm from '@/components/common/Forms/UiForm.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { computed, reactive, ref, useTemplateRef } from 'vue';
import UiField from '@/components/common/UI/UiField.vue';
import { useMask } from '@/composables/useMask';
import { useAsync } from '@/composables/useAsync';
import api from '@/api/api';
import { useValidation } from '@/composables/useValidation';
import { helpers, minLength, required } from '@vuelidate/validators';
import { useAuth } from '@/composables/useAuth';
import { useButtonState } from '@/composables/useButtonState';
import { useNotify } from '@/utils/use/useNotify';

const emit = defineEmits<{
    (e: 'linked'): void;
}>();

const botLink = `https://wa.me/${import.meta.env.VITE_VUE_APP_WHATSAPP_BOT_PHONE}?text=%D0%9C%D0%B5%D0%BD%D1%8E`;

const inputEl = useTemplateRef('inputEl');

const modelPhone = ref(null);

const { unmasked: phone } = useMask(
    computed(() => inputEl.value?.inputEl),
    { mask: '+7 (###) ###-##-##' }
);

const notify = useNotify();

const { isLoading, execute: executeLink } = useAsync(api.userWhatsapp.link, {
    onFetchResponse() {
        success();
        notify.success('Whatsapp аккаунт привязан к профилю');
        emit('linked');
    },
    onFetchError() {
        error();
    }
});

const { v$, validate } = useValidation(
    {
        phone: {
            required: helpers.withMessage('Заполните номер', required),
            phone: helpers.withMessage('Заполните номер', minLength(10))
        }
    },
    reactive({ phone })
);

async function linkWhatsapp() {
    const isValid = await validate();

    if (!isValid) {
        return;
    }

    loading();
    await executeLink({ phone: `7${phone.value}` });
}

const { currentUser } = useAuth();

const currentPhone = computed(() => {
    if (currentUser.value.userProfile.phones?.length) {
        return currentUser.value.userProfile.phones[0].phone;
    }

    return undefined;
});

function selectProfileNumber() {
    modelPhone.value = currentPhone.value;
    phone.value = currentPhone.value.replaceAll(/[^0-9]/g, '').slice(1);
}

const { state, loading, success, error } = useButtonState();
</script>
