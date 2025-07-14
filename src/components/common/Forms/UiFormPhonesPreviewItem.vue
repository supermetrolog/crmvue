<template>
    <div class="ui-form-phone-preview">
        <UiButtonIcon
            @click.prevent="$emit('set-as-main')"
            :active="phone.isMain === 1"
            color="light"
            label="Основной номер"
            icon="fa-solid fa-user-check"
            class="mr-1"
        />
        <div class="ui-form-phone-preview__inputs">
            <UiPhoneInput
                :phone="phone.native_phone ?? phone.phone"
                :country-code="phone.country_code"
                disabled
                class="ui-form-phone-preview__input"
            />
            <UiInput
                v-if="phone.exten"
                ref="extenInput"
                :model-value="phone.exten"
                disabled
                type="number"
                class="ui-form-phone-preview__exten"
            />
        </div>
        <div class="ui-form-phone-preview__buttons">
            <UiButtonIcon
                @click.prevent="$emit('edit')"
                color="light"
                label="Редактировать"
                icon="fa-solid fa-pen"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Phone } from '@/types/contact/phone';
import UiPhoneInput from '@/components/common/Forms/UiPhoneInput.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import UiInput from '@/components/common/Forms/UiInput.vue';
import { useTippy } from 'vue-tippy';
import { useTemplateRef } from 'vue';

defineEmits<{ (e: 'edit'): void; (e: 'set-as-main'): void }>();

defineProps<{
    phone: Phone;
}>();

useTippy(useTemplateRef('extenInput'), { content: 'Добавочный номер' });
</script>
