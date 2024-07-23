<template>
    <div ref="backdrop" class="messenger-quiz__done">
        <div ref="inner">
            <IconDocumentDone ref="icon" class="mx-auto mb-3" />
            <Button
                @click="$emit('close')"
                class="messenger-quiz__done-button"
                :class="{ hidden: !isVisible }"
                info
                small
            >
                Закрыть опрос
            </Button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import gsap from 'gsap';
import IconDocumentDone from '@/components/common/Icons/IconDocumentDone.vue';
import Button from '@/components/common/Button.vue';

defineEmits(['close']);

const isVisible = shallowRef(false);

const backdrop = ref(null);
const icon = ref(null);
const inner = ref(null);

onMounted(() => {
    const timeline = gsap.timeline();

    timeline.from(backdrop.value, { opacity: 0, duration: 0.5 }).fromTo(
        inner.value,
        { translateY: -(backdrop.value.clientHeight / 2 + 100) },
        {
            translateY: 0,
            duration: 2,
            ease: 'elastic.out(0.6, 0.4)',
            onComplete: () => {
                if (icon.value) icon.value.play();
                isVisible.value = true;
            }
        }
    );
});
</script>
