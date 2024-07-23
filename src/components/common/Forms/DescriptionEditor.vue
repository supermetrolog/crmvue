<template>
    <div class="row">
        <div class="col-12">
            <div class="d-flex">
                <Button
                    @click="currentDescriptionIsManual = true"
                    class="w-100 no-rounded"
                    :info="!currentDescriptionIsManual"
                    :success="currentDescriptionIsManual"
                >
                    Ручное описание
                </Button>
                <Button
                    @click="currentDescriptionIsManual = false"
                    class="w-100 no-rounded"
                    :info="currentDescriptionIsManual"
                    :success="!currentDescriptionIsManual"
                >
                    Системное описание
                </Button>
            </div>
        </div>
        <VueEditor
            v-if="currentDescriptionIsManual"
            v-model="description"
            class="col-12"
            label="Ручное описание"
        />
        <VueEditor v-else v-model="descriptionAuto" class="col-12" label="Системное описание" />
        <div class="col-12">
            <Switch
                v-model="descriptionManualUse"
                true-title="Использовать ручное описание в рекламе"
            />
        </div>
    </div>
</template>
<script setup>
import Button from '@/components/common/Button.vue';
import Switch from '@/components/common/Forms/Switch.vue';
import VueEditor from '@/components/common/Forms/VueEditor.vue';
import { shallowRef } from 'vue';

const description = defineModel('description');
const descriptionAuto = defineModel('description-auto');
const descriptionManualUse = defineModel('manual-use');

const currentDescriptionIsManual = shallowRef(true);
</script>
