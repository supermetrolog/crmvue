import { inject, onMounted } from 'vue';
import { TOUR_PROVIDE_KEY, TourID } from '@/composables/useTour/useTour';
import { DriveStep } from 'driver.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';

export interface TourStep extends DriveStep {
    key: number;
}

export function createTourStepElementGenerator(tourId: TourID) {
    return (name: string) => `[data-tour-id="${tourId}:${name}"]`;
}

export function useTourStep(step?: TourStep) {
    const tour = inject(TOUR_PROVIDE_KEY);

    onMounted(() => {
        if (isNotNullish(step)) {
            addStep(step);
        }
    });

    function addStep(step: TourStep) {
        tour?.addStep(step);
    }

    return { addStep };
}
