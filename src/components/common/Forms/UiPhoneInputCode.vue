<template>
    <UiDropdownActions title="Выберите страну" :disabled>
        <template #trigger>
            <UiButton
                @click.prevent
                rect
                class="py-2 px-1 d-flex align-items-center"
                style="background-color: #f1f1f1"
            >
                <template #icon>
                    <div style="height: 24px">
                        <component :is="countryIcons[modelValue]" height="24" width="40" />
                    </div>
                </template>
            </UiButton>
        </template>
        <template #menu>
            <UiPhoneInputCodeItem
                v-for="option in options"
                :key="option.value"
                v-model="modelValue"
                :label="option.label"
                :code="option.code"
                :value="option.value"
            >
                <template #icon>
                    <component :is="countryIcons[option.value]" width="30" />
                </template>
            </UiPhoneInputCodeItem>
        </template>
    </UiDropdownActions>
</template>

<script setup lang="ts">
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import IconFlagRussia from '@/components/common/Icons/IconFlagRussia.vue';
import IconFlagBelarus from '@/components/common/Icons/IconFlagBelarus.vue';
import IconFlagUkraine from '@/components/common/Icons/IconFlagUkraine.vue';
import UiPhoneInputCodeItem from '@/components/common/Forms/UiPhoneInputCodeItem.vue';
import { PhoneCountryCode, PhoneCountryCodeEnum } from '@/types/contact/phone';
import type { Component } from 'vue';

const modelValue = defineModel<PhoneCountryCode>({ default: PhoneCountryCodeEnum.RU });

defineProps<{
    disabled?: boolean;
}>();

const countryIcons: Record<PhoneCountryCode, Component> = {
    [PhoneCountryCodeEnum.RU]: IconFlagRussia,
    [PhoneCountryCodeEnum.BY]: IconFlagBelarus,
    [PhoneCountryCodeEnum.UA]: IconFlagUkraine
};

const options = [
    { label: 'Россия', code: '+7', value: PhoneCountryCodeEnum.RU },
    { label: 'Беларусь', code: '+375', value: PhoneCountryCodeEnum.BY },
    { label: 'Украина', code: '+380', value: PhoneCountryCodeEnum.UA }
];
</script>
