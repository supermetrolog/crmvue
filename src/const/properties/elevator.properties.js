import { unitTypes } from '@/const/unitTypes';
import { entityOptions } from '@/const/options/options';

const characteristics = {
    elevator_type: {
        name: 'Тип устройства',
        types: entityOptions.elevator.type
    },
    elevator_capacity: {
        name: 'Грузоподъемность',
        count: true,
        unitType: unitTypes.TON
    },
    elevator_location: {
        name: 'Расположение',
        types: entityOptions.elevator.location
    },
    elevator_length: {
        name: 'Длина',
        count: true,
        unitType: unitTypes.METERS
    },
    elevator_width: {
        name: 'Ширина',
        count: true,
        unitType: unitTypes.METERS
    },
    elevator_volume: {
        name: 'Вместимость',
        count: true,
        unitType: unitTypes.PALLET_PLACE
    },
    elevator_controls: {
        name: 'Управление',
        multiple: true,
        types: entityOptions.elevator.controls
    },
    elevator_condition: {
        name: 'Состояние',
        types: entityOptions.elevator.condition
    },
    elevator_supervision: {
        name: 'Под надзором',
        types: entityOptions.defaults.boolean
    },
    elevator_documents: {
        name: 'Документы',
        types: entityOptions.defaults.boolean
    }
};

export const elevatorProperties = {
    characteristics
};
