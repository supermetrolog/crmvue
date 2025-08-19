<template>
    <div class="survey-form-contact-form-element" :class="{ active }">
        <div class="survey-form-contact-form-element__icon" :class="iconClass">
            <i :class="icon" />
        </div>
        <div class="survey-form-contact-form-element__content">
            <div class="survey-form-contact-form-element__header">
                <slot name="header" />
            </div>
            <div class="survey-form-contact-form-element__footer">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ComponentClassAttribute } from '@/types/base';

defineProps<{
    icon: string;
    iconClass?: ComponentClassAttribute;
    active?: boolean;
}>();
</script>
