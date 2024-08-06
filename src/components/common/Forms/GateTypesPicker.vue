<template>
    <div class="form__group gate-types-picker">
        <span v-if="label" class="form__label">{{ label }}</span>
        <div v-for="(element, index) in field" :key="element.id" class="form__control">
            <label
                @mouseenter="isDeleteShowList[index] = true"
                @mouseleave="isDeleteShowList[index] = false"
                for=""
                class="form__label gate-types-picker__label"
                :class="{ required: required }"
            >
                <AnimationTransition>
                    <i
                        v-show="isDeleteShowList[index]"
                        @click="deleteInput(index)"
                        class="form__close fas fa-xmark-circle"
                    ></i>
                </AnimationTransition>
                <MultiSelect
                    v-model="field[index].type"
                    class="gate-types-picker__select col-6"
                    placeholder="Выберите тип ворот.."
                    :options="gateTypes"
                />
                <Input
                    v-model="field[index].count"
                    class="gate-types-picker__input"
                    type="number"
                    placeholder="Количество.."
                    unit="шт"
                />
            </label>
        </div>
        <div class="gate-types-picker__buttons mt-2">
            <Button @click="addInput" :disabled="hasEmptyInput" icon small success>
                <i class="fas fa-plus"></i>
                <span>Добавить поле</span>
            </Button>
            <Button @click="clean" :disabled="!modelValue.length" icon small danger>
                <i class="fas fa-trash"></i>
                <span>Очистить</span>
            </Button>
        </div>
    </div>
</template>
<script setup>
import Button from '@/components/common/Button.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { computed, onBeforeMount, ref, watch } from 'vue';
import { gateTypes } from '@/const/types.js';
import MultiSelect from '@/components/common/Forms/MultiSelect.vue';
import Input from '@/components/common/Forms/Input.vue';

const modelValue = defineModel({ type: Array, default: () => [] });
defineProps({
    label: {
        type: String,
        default: null
    },
    required: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const field = ref([]);
const isDeleteShowList = ref([false]);

const hasEmptyInput = computed(() => {
    return field.value.some(element => element.type === null || element.count === null);
});

watch(
    field,
    () => {
        modelValue.value = field.value.reduce((acc, element) => {
            if (element.type !== null && element.count !== 0)
                acc.push(
                    element.type ? Number(element.type) : null,
                    element.count ? Number(element.count) : null
                );
            return acc;
        }, []);
    },
    { deep: true }
);

watch(
    () => modelValue.value.length,
    () => {
        if (modelValue.value.length / 2 !== field.value.length) modelValueToField();
    }
);

const deleteInput = index => {
    if (field.value.length === 1) return;
    field.value.splice(index, 1);
};

let lastIndex = 0;

const createEmptyField = () => ({ id: lastIndex++, type: null, count: null });
const addInput = () => {
    if (!hasEmptyInput.value) {
        field.value.push(createEmptyField());
    }
};

const modelValueToField = () => {
    const _field = [];

    for (let i = 0; i < modelValue.value.length; i += 2) {
        _field.push({
            id: lastIndex++,
            type: modelValue.value[i],
            count: modelValue.value[i + 1]
        });
    }

    if (_field.length) field.value = _field;
    else field.value = [createEmptyField()];
};

const clean = () => {
    field.value = [createEmptyField()];
};

onBeforeMount(() => {
    if (modelValue.value.length) modelValueToField();
    else field.value = [createEmptyField()];
});
</script>
