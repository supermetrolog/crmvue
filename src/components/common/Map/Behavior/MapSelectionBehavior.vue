<template>
    <teleport v-if="container" :to="container">
        <canvas
            v-if="isActive"
            ref="canvas"
            class="canvas"
            style="pointer-events: none"
            :style="canvasStyle"
        ></canvas>
    </teleport>
    <YandexMapControlButton :settings="{ onClick: onClickBehavior, background: backgroundColor }">
        <div class="d-flex align-items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="-2 -2 28 28">
                <g fill="none" fill-rule="evenodd" stroke="currentColor">
                    <path stroke-width="2" d="M17 2l5 11-9 9-11-6L4 4z"></path>
                    <path
                        fill="#FFF"
                        d="M3.3 5.348c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm13-2c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm5 11c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm-9 9c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048zm-11-6c.716.414 1.634.168 2.048-.55.414-.716.168-1.634-.55-2.048-.716-.414-1.634-.168-2.048.55-.414.716-.168 1.634.55 2.048z"
                    ></path>
                </g>
            </svg>
            <span>Область</span>
        </div>
    </YandexMapControlButton>
    <YandexMapControlButton
        v-if="resetButtonIsVisible"
        :settings="{ onClick: onClickResetBehavior, background: resetBackgroundColor }"
    >
        <div class="d-flex align-items-center gap-2">
            <i class="fa-solid fa-pen" />
            <span>Изменить область</span>
        </div>
    </YandexMapControlButton>
    <MapPolygon v-if="coordinates" :coordinates />
    <YandexMapListener v-if="isActive" :settings="{ onMouseMove, onMouseDown, onMouseUp }" />
</template>
<script setup lang="ts">
import {
    computed,
    nextTick,
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    ref,
    shallowRef,
    useTemplateRef,
    watch
} from 'vue';
import { InteractivityModelKey } from 'yandex-maps';
import { useMapContext } from '@/components/common/Map/useMapContext';
import { BehaviorType, DomEvent, DomEventHandlerObject, LngLat } from '@yandex/ymaps3-types';
import { getBoundsFromCoords, YandexMapControlButton, YandexMapListener } from 'vue-yandex-maps';
import MapPolygon from '@/components/common/Map/MapPolygon.vue';
import simplify from 'simplify-js';

export type BehaviorSelectionOptions = {
    strokeColor: string;
    fillColor: string;
    interactivityModel: InteractivityModelKey;
    strokeWidth: number;
    opacity: number;
    tolerance: number;
    polygonZoomDuration: number;
};

const defaultOptions = {
    strokeColor: '#1679e7',
    fillColor: '#a2c9d8',
    interactivityModel: 'default#transparent',
    strokeWidth: 4,
    opacity: 0.7,
    tolerance: 1,
    polygonZoomDuration: 100
} as const satisfies BehaviorSelectionOptions;

const emit = defineEmits<{
    (e: 'selected', coords: LngLat[]): void;
    (e: 'removed'): void;
}>();

const props = withDefaults(
    defineProps<{
        coordinates?: LngLat[];
        options?: Partial<BehaviorSelectionOptions>;
        title?: string;
        resetTitle?: string;
    }>(),
    {
        options: () => ({}),
        title: 'Выделить область',
        resetTitle: 'Изменить область'
    }
);

const preparedOptions = computed(() => {
    return { ...defaultOptions, ...props.options };
});

const { map, setBounds, settings } = useMapContext();

const resetButtonIsVisible = ref(false);
const resetButtonIsEnabled = ref(false);
const resetBackgroundColor = computed(() => {
    if (resetButtonIsEnabled.value) return 'rgba(16, 185, 129, 0.5)';

    return settings.value.theme === 'dark' ? '#111' : '#fff';
});

const buttonIsEnabled = ref(false);
const backgroundColor = computed(() => {
    if (buttonIsEnabled.value) return 'rgba(16, 185, 129, 0.5)';

    return settings.value.theme === 'dark' ? '#111' : '#fff';
});

function onClickResetBehavior() {
    try {
        resetButtonIsEnabled.value = true;
        startInteractiveDrawing();
    } catch (e) {
        console.warn('[map-behavior-selection]:', e);
    }
}

let resizeObserver: ResizeObserver | null = null;

const container = shallowRef<HTMLElement | null>(null);

onBeforeMount(() => {
    if (map.value) {
        container.value = map.value.container;
    }
});

onMounted(() => {
    setCanvasSizeToContainer();

    if (map.value) {
        resizeObserver = new ResizeObserver(() => setCanvasSizeToContainer());
        resizeObserver.observe(map.value.container);
    }
});

onBeforeUnmount(() => {
    onRemovePolygon();

    if (resizeObserver) {
        if (map.value) {
            resizeObserver.unobserve(map.value.container);
        }

        resizeObserver.disconnect();
    }

    container.value = null;
});

function onClickBehavior() {
    if (props.coordinates?.length) {
        buttonIsEnabled.value = false;
        emit('removed');
        onRemovePolygon();

        return;
    }

    try {
        buttonIsEnabled.value = true;
        startInteractiveDrawing();
    } catch (e) {
        console.warn('[map-behavior-selection]:', e);
    }
}

// polygon

const canvasStyle = computed(() => ({
    position: 'absolute',
    left: '0',
    top: '0',
    opacity: String(preparedOptions.value.opacity),
    pointerEvents: 'none',
    zIndex: 100
}));

function onCreatePolygon(coords: LngLat[]) {
    buttonIsEnabled.value = true;
    zoomToPolygon(coords);

    resetButtonIsVisible.value = true;
}

function onRemovePolygon() {
    if (!map.value) return;

    buttonIsEnabled.value = false;
    resetButtonIsVisible.value = false;
}

function zoomToPolygon(coordinates: LngLat[]) {
    if (!map.value) return;

    const bounds = getBoundsFromCoords(coordinates);

    setBounds(bounds);
}

// draw

const isActive = ref(false);

const previouslyBehaviors = ref<Readonly<BehaviorType[]>>([]);

watch(
    isActive,
    (value, oldValue) => {
        if (!map.value || oldValue === undefined) {
            return;
        }

        if (value) {
            previouslyBehaviors.value = [...map.value.behaviors];

            map.value.setBehaviors([]);
        } else {
            map.value.setBehaviors([...previouslyBehaviors.value]);

            previouslyBehaviors.value = [];
        }
    },
    { immediate: true }
);

async function startInteractiveDrawing() {
    isActive.value = true;

    await nextTick();

    const points = await draw();
    if (!points || !points.length || !map.value || points?.length < 2) {
        isActive.value = false;
        return;
    }

    const simplified = simplify(points, preparedOptions.value.tolerance).map(pt => [
        pt.lng,
        pt.lat
    ]) as LngLat[];

    emit('selected', simplified);
}

const canvasElement = useTemplateRef('canvas');

const eventNoop = (event: DomEvent) => {};

let onPointerMove = eventNoop;
let onPointerDown = eventNoop;
let onPointerUp = eventNoop;

function onMouseMove(_: DomEventHandlerObject, event: DomEvent) {
    if (!isActive.value || !isDrawing.value) {
        return;
    }

    onPointerMove(event);
}

function onMouseDown(_: DomEventHandlerObject, event: DomEvent) {
    if (!isActive.value) {
        return;
    }

    onPointerDown(event);
}

function onMouseUp(_: DomEventHandlerObject, event: DomEvent) {
    if (!isActive.value) {
        return;
    }

    onPointerUp(event);
}

function setCanvasSizeToContainer() {
    if (!canvasElement.value || !map.value) return;

    const { x: width, y: height } = map.value.size;

    const ratio = window.devicePixelRatio || 1;

    canvasElement.value.style.width = width + 'px';
    canvasElement.value.style.height = height + 'px';

    canvasElement.value.width = Math.round(width * ratio);
    canvasElement.value.height = Math.round(height * ratio);

    const context = canvasElement.value.getContext('2d');
    if (context) {
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
}

const isDrawing = ref(false);

type Point = {
    x: number;
    y: number;
    lng: number;
    lat: number;
};

async function draw() {
    if (!canvasElement.value || !map.value) return Promise.reject('Canvas not exists');

    canvasElement.value.style.display = 'block';

    setCanvasSizeToContainer();

    const context = canvasElement.value.getContext('2d');
    if (!context) return Promise.reject('Canvas context not exists');

    context.clearRect(0, 0, canvasElement.value.width, canvasElement.value.height);
    context.lineWidth = preparedOptions.value.strokeWidth;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = preparedOptions.value.strokeColor;

    const points: Point[] = [];

    let drawing = false;

    isDrawing.value = false;

    let raf = 0;

    function toLocal(event: DomEvent) {
        const rect = canvasElement.value!.getBoundingClientRect();

        const x = event.screenCoordinates[0] - rect.left;
        const y = event.screenCoordinates[1] - rect.top;

        return { x, y, lng: event.coordinates[0], lat: event.coordinates[1] };
    }

    function drawAll() {
        if (!context || points.length === 0) return;

        const cssW = canvasElement.value!.getBoundingClientRect().width;
        const cssH = canvasElement.value!.getBoundingClientRect().height;

        context.clearRect(0, 0, cssW, cssH);

        context.beginPath();
        context.moveTo(points[0].x, points[0].y);

        if (points.length === 2) {
            context.lineTo(points[1].x, points[1].y);
        } else {
            for (let i = 1; i < points.length - 1; i++) {
                const midX = (points[i].x + points[i + 1].x) / 2;
                const midY = (points[i].y + points[i + 1].y) / 2;
                context.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
            }

            const last = points[points.length - 1];
            context.lineTo(last.x, last.y);
        }

        context.stroke();
    }

    onPointerDown = (event: DomEvent) => {
        drawing = true;
        isDrawing.value = true;

        const p = toLocal(event);

        points.length = 0;

        points.push(p);

        scheduleDraw();
    };

    onPointerMove = (event: DomEvent) => {
        if (!drawing) return;

        const p = toLocal(event);
        const last = points[points.length - 1];

        if (!last || Math.hypot(p.x - last.x, p.y - last.y) >= 0.5) {
            points.push(p);
        }

        scheduleDraw();
    };

    function scheduleDraw() {
        if (!raf) {
            raf = requestAnimationFrame(() => {
                drawAll();
                raf = 0;
            });
        }
    }

    function stop() {
        if (!drawing) return;
        drawing = false;

        canvasElement.value!.style.display = 'none';

        cleanup();

        resetButtonIsEnabled.value = false;

        resolveInteractive(points);
    }

    onPointerUp = (event: DomEvent) => {
        stop();
    };

    function cleanup() {
        onPointerMove = eventNoop;
        onPointerDown = eventNoop;
        onPointerUp = eventNoop;

        if (raf) cancelAnimationFrame(raf);

        isActive.value = false;
        isDrawing.value = false;
    }

    let resolveInteractive: (value: Point[]) => void;

    return new Promise<Point[]>(res => {
        resolveInteractive = res;
    });
}

watch(
    () => props.coordinates,
    newValue => {
        if (!newValue || !newValue.length) {
            onRemovePolygon();

            return;
        }

        onCreatePolygon(newValue);
    },
    { deep: true, immediate: true }
);
</script>
<style>
.ymap-container {
    position: relative;
}

[class$='float-button-text'] {
    padding: 0 !important;
}

.canvas {
    display: none;
}
</style>
