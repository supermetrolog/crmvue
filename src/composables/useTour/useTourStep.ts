import { inject, onMounted } from 'vue';
import { TOUR_PROVIDE_KEY, TourID } from '@/composables/useTour/useTour';
import { DriveStep } from 'driver.js';

export interface TourStep extends DriveStep {
    key: number;
}

export function createTourStepElementGenerator(tourId: TourID) {
    return (name: string) => `[data-tour-id="${tourId}:${name}"]`;
}

export function useTourStep(step: TourStep) {
    const tour = inject(TOUR_PROVIDE_KEY);

    onMounted(() => {
        tour?.addStep(step);
    });
}
