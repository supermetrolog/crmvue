<template>
    <div>
        <ObjectPurposes
            @select="select"
            :purposes="purposes"
            :size="size"
            :object-types="objectTypes"
        >
            <template #item="{ purpose }">
                <ObjectPurpose
                    @click="select(purpose.id)"
                    :disabled="loading"
                    class="object-purposes__editable"
                    :class="{
                        selected: selected[purpose.id] === true,
                        unselected: selected[purpose.id] === false
                    }"
                    :purpose="purpose"
                >
                    <template #tippy>
                        <p class="mb-1">{{ purpose.name }}</p>
                        <p v-if="selected[purpose.id] === undefined" class="color-light">
                            <template v-if="purposesCache[purpose.id]">
                                Нажмите, чтобы убрать назначение из акивного.
                            </template>
                            <template v-else>Нажмите, чтобы отметить назначение активным.</template>
                        </p>
                        <p v-else-if="selected[purpose.id]" class="color-success">
                            Вы отметили назначение как активное. Нажмите, чтобы отменить выбор.
                        </p>
                        <p v-else class="color-danger">
                            Вы убрали назначение из активных. Нажмите, чтобы вернуть его в активные.
                        </p>
                    </template>
                </ObjectPurpose>
            </template>
        </ObjectPurposes>
        <AnimationTransition :speed="0.4">
            <div v-if="hasDiff" class="d-flex gap-1 flex-wrap mt-2">
                <slot name="button" :update="update" :clear="clear" :loading="loading">
                    <MessengerButton
                        v-tippy="'В разработке'"
                        @click="update"
                        :disabled="loading"
                        :class="buttonsClass"
                        color="success"
                    >
                        Сохранить изменения
                    </MessengerButton>
                    <MessengerButton
                        @click="clear"
                        :disabled="loading"
                        :class="buttonsClass"
                        color="dark"
                    >
                        Отменить изменения
                    </MessengerButton>
                </slot>
            </div>
        </AnimationTransition>
    </div>
</template>
<script setup>
import ObjectPurposes from '@/components/Object/ObjectPurposes.vue';
import { computed, ref, watch } from 'vue';
import ObjectPurpose from '@/components/Object/ObjectPurpose.vue';
import { spliceWithPrimitive } from '@/utils/index.js';
import { isEmptyObject } from '@/utils/alg.js';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

const emit = defineEmits(['update']);
const props = defineProps({
    purposes: {
        type: Array,
        default: () => []
    },
    objectTypes: {
        type: Array,
        default: () => [1, 2, 3]
    },
    loading: {
        type: Boolean,
        default: false
    },
    size: {
        type: Number,
        default: 40
    },
    buttonsClass: {
        type: [String, Array, Object],
        default: null
    }
});

const selected = ref({});
const localePurposes = ref([]);

watch(
    () => props.purposes,
    () => {
        localePurposes.value = [...props.purposes];
    },
    { immediate: true }
);

const purposesCache = computed(() =>
    props.purposes.reduce((acc, purposeId) => {
        acc[purposeId] = true;
        return acc;
    }, {})
);

const hasDiff = computed(() => !isEmptyObject(selected.value));

const select = purposeId => {
    const purposeState = selected.value[purposeId];

    switch (purposeState) {
        case true:
            delete selected.value[purposeId];
            spliceWithPrimitive(localePurposes.value, purposeId);

            return;
        case false:
            delete selected.value[purposeId];
            localePurposes.value.push(purposeId);
            return;
        default:
            if (purposesCache.value[purposeId]) {
                selected.value[purposeId] = false;
                spliceWithPrimitive(localePurposes.value, purposeId);
            } else {
                selected.value[purposeId] = true;
                localePurposes.value.push(purposeId);
            }

            return;
    }
};

const update = () => {
    emit('update', localePurposes.value);
};

const clear = () => {
    selected.value = {};
    localePurposes.value = [...props.purposes];
};
</script>
