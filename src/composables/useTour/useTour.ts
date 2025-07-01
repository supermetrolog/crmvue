import { InjectionKey, onBeforeUnmount, onMounted, provide, ref, shallowRef } from 'vue';
import { getTourFromCache, saveTourToCache } from '@/composables/useTour/cache';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { createDriver, DriverOptions } from '@/integrations/driver';
import api from '@/api/api';
import { Driver } from 'driver.js';
import { captureException } from '@sentry/vue';
import { TourStep } from '@/composables/useTour/useTourStep';

export const TOUR_PROVIDE_KEY: InjectionKey<{
    addStep: (step: TourStep) => void;
    addSteps: (steps: TourStep[]) => void;
}> = Symbol('tour');

export type TourID = string;

export type TourOptions<T = DriverOptions> = T & {
    autorun?: boolean;
    force?: boolean;
    steps?: TourStep[];
};

export function useTour(tourId: TourID, options: TourOptions = {}) {
    const instance = shallowRef<Driver | null>(null);

    const isRunning = ref(false);
    const isAlreadyShown = ref(false);

    const { autorun = true, force: forceAutoRun = false } = options;

    const tourSteps = ref<TourStep[]>([]);

    function addStep(step: TourStep) {
        tourSteps.value.push(step);
    }

    function addSteps(steps: TourStep[]) {
        tourSteps.value.push(...steps);
    }

    provide(TOUR_PROVIDE_KEY, { addStep, addSteps });

    async function checkIsAlreadyShown() {
        const cache = getTourFromCache(tourId);

        if (!isNullish(cache)) {
            isAlreadyShown.value = true;
            return;
        }

        const response = await api.tour.status({ tour_id: tourId });

        if (isNullish(response)) {
            isAlreadyShown.value = false;
            return;
        }

        if (!response.viewed) {
            isAlreadyShown.value = false;
            return;
        }

        isAlreadyShown.value = true;
    }

    void checkIsAlreadyShown();

    async function markAsViewed(viewedSteps: number, totalSteps: number) {
        try {
            await api.tour.markAsViewed({
                tour_id: tourId,
                steps_viewed: viewedSteps,
                steps_total: totalSteps
            });
        } catch (error) {
            captureException(error, {
                data: {
                    tour_id: tourId
                }
            });
        } finally {
            saveTourToCache(tourId);
        }
    }

    function onDestroyStarted(...args: Parameters<NonNullable<DriverOptions['onDestroyed']>>) {
        void markAsViewed(
            (args[2].driver.getActiveIndex() ?? 0) + 1,
            args[2].config.steps?.length ?? 1
        );

        destroy();
    }

    async function run(steps?: TourStep[]) {
        const targetSteps = [
            ...(steps ?? []),
            ...(options.steps ?? []),
            ...(tourSteps.value ?? [])
        ].sort((a, b) => a.key - b.key);

        instance.value = createDriver({
            ...options,
            steps: targetSteps,
            onDestroyStarted
        });

        isRunning.value = true;
        instance.value.drive();
    }

    async function softRun(steps?: TourStep[]) {
        await checkIsAlreadyShown();
        if (!isAlreadyShown.value) await run(steps);
    }

    function destroy() {
        instance.value?.destroy();
    }

    onMounted(() => {
        if (forceAutoRun) void run();
        else if (autorun) void softRun();
    });

    onBeforeUnmount(() => {
        destroy();
    });

    return {
        run,
        softRun,
        destroy,
        isRunning,
        isAlreadyShown,
        instance
    };
}
