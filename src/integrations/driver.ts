import { Config, driver } from 'driver.js';

export type DriverOptions = Config;

const defaultOptions: DriverOptions = {
    disableActiveInteraction: true,
    nextBtnText: 'Далее',
    prevBtnText: 'Назад',
    doneBtnText: 'Завершить',
    progressText: '{{current}} из {{total}}',
    showProgress: true
};

export function createDriver(options: DriverOptions = {}) {
    return driver({ ...defaultOptions, ...options });
}
