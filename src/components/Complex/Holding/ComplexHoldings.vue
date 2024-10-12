<template>
    <div class="ObjectHoldings">
        <div class="ObjectHoldings-header">
            <p>СТРОЕНИЯ ({{ buildingsCount }}), УЧАСТКИ ({{ landsCount }})</p>
            <HoverActionsButton
                @click="holdingFormIsVisible = true"
                label="Добавить строение"
                small
            >
                <i class="fas fa-warehouse"></i>
            </HoverActionsButton>
            <HoverActionsButton @click="plotFormIsVisible = true" label="Добавить участок" small>
                <i class="fas fa-tree"></i>
            </HoverActionsButton>
        </div>
        <teleport to="body">
            <FormComplexHolding
                v-if="holdingFormIsVisible"
                @close="closeHoldingForm"
                @updated="onEditHolding"
                :holding="editingHolding"
            />
            <FormComplexPlot
                v-if="plotFormIsVisible"
                @close="plotFormIsVisible = false"
                :plot="editingHolding"
            />
        </teleport>
        <div class="ObjectHoldings-body">
            <ComplexHolding
                v-for="object in sortedObjects"
                :key="object.id"
                @edit="startEditHolding(object)"
                @intersected="onIntersected(object.id, $event)"
                :object="object"
                :target="targetObjectID === object.id"
            />
        </div>
        <AnimationTransition :speed="0.6">
            <ComplexHoldingChat
                v-if="holdingsQueue.length"
                v-model:target="targetObjectID"
                @open="openInChat"
                :queue="holdingsQueue"
            />
        </AnimationTransition>
    </div>
</template>

<script setup>
import FormComplexPlot from '@/components/Forms/Complex/FormComplexPlot.vue';
import ComplexHolding from '@/components/Complex/Holding/ComplexHolding.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';
import { computed, ref, shallowRef } from 'vue';
import FormComplexHolding from '@/components/Forms/Complex/FormComplexHolding.vue';
import ComplexHoldingChat from '@/components/Complex/Holding/ComplexHoldingChat.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';

const props = defineProps({
    objects: {
        type: Array,
        default: () => []
    }
});

const { openChat } = useMessenger();

const plotFormIsVisible = shallowRef(false);
const holdingFormIsVisible = shallowRef(false);
const editingHolding = ref(null);
const targetObjectID = shallowRef(null);

const buildingsCount = computed(() =>
    props.objects.reduce((acc, holding) => acc + Number(!holding.is_land), 0)
);
const landsCount = computed(() => props.objects.length - buildingsCount.value);
const sortedObjects = computed(() => props.objects.toReversed());

const holdingsQueue = ref([]);

const startEditHolding = holding => {
    editingHolding.value = holding;
    if (holding.is_land) plotFormIsVisible.value = true;
    else holdingFormIsVisible.value = true;
};

const closeHoldingForm = () => {
    holdingFormIsVisible.value = false;
    editingHolding.value = null;
};

const onEditHolding = () => {
    holdingFormIsVisible.value = false;
    editingHolding.value = null;
};

const onIntersected = (objectID, isIntersecting) => {
    if (isIntersecting) {
        holdingsQueue.value = [...holdingsQueue.value, objectID].toSorted((a, b) => b - a);
    } else {
        holdingsQueue.value = holdingsQueue.value.filter(element => element !== objectID);
    }
};

const openInChat = objectID => {
    const object = props.objects.find(element => element.id === objectID);
    if (object) openChat(object.company_id, objectID, 'object');
};
</script>
