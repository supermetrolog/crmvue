<template>
    <UiDropdownActions title="Выберите страну">
        <template #trigger>
            <UiButton
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

<script setup>
import UiDropdownActions from '@/components/common/UI/DropdownActions/UiDropdownActions.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import IconFlagRussia from '@/components/common/Icons/IconFlagRussia.vue';
import IconFlagBelarus from '@/components/common/Icons/IconFlagBelarus.vue';
import IconFlagKazakhstan from '@/components/common/Icons/IconFlagKazakhstan.vue';
import IconFlagUkraine from '@/components/common/Icons/IconFlagUkraine.vue';
import UiPhoneInputCodeItem from '@/components/common/Forms/UiPhoneInputCodeItem.vue';

const modelValue = defineModel({ type: String, default: 'ru' });

const countryIcons = {
    ru: IconFlagRussia,
    by: IconFlagBelarus,
    kz: IconFlagKazakhstan,
    ua: IconFlagUkraine
};

const options = [
    { label: 'Россия', code: '+7', value: 'ru' },
    { label: 'Беларусь', code: '+375', value: 'by' },
    { label: 'Казахстан', code: '+7', value: 'kz' },
    { label: 'Украина', code: '+380', value: 'ua' }
];
</script>
