import { dealOptions } from '@/const/options/deal.options';
import { floorOptions } from '@/const/options/floor.options';
import { partOptions } from '@/const/options/part.options';
import { complexOptions } from '@/const/options/complex.options';
import { objectOptions } from '@/const/options/object.options';
import { elevatorOptions } from '@/const/options/elevator.options';
import { craneOptions } from '@/const/options/crane.options';
import { contactOptions } from '@/const/options/contact.options';
import { locationOptions } from '@/const/options/location.options';
import { requestOptions } from '@/const/options/request.options';
import { companyOptions } from '@/const/options/company.options';
import { equipmentOptions } from '@/const/options/equipment.options.js';
import { taskOptions } from '@/const/options/task.options.js';

const defaultsOptions = {
    boolean: {
        1: 'Да/есть',
        2: 'Нет'
    },
    booleanSimple: {
        1: 'Да',
        2: 'Нет'
    },
    booleanStatement: {
        UNKNOWN: 0,
        TRUE: 1,
        FALSE: 2
    }
};

export const entityOptions = {
    deal: dealOptions,
    floor: floorOptions,
    part: partOptions,
    complex: complexOptions,
    object: objectOptions,
    elevator: elevatorOptions,
    crane: craneOptions,
    contact: contactOptions,
    location: locationOptions,
    request: requestOptions,
    company: companyOptions,
    equipment: equipmentOptions,
    task: taskOptions,
    defaults: defaultsOptions
};
