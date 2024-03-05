import { unitTypes } from '@/const/unitTypes';
import { entityOptions } from '@/const/options/options';

export const characteristics = {
    crane_capacity: {
        name: 'Грузоподъемность',
        count: true,
        unitType: unitTypes.TON
    },
    crane_span: {
        name: 'Длина пролета',
        count: true,
        unitType: unitTypes.METERS
    },
    crane_hook_height: {
        name: 'Высота до крюка',
        count: true,
        unitType: unitTypes.METERS
    },
    crane_beam: {
        name: 'Тип балки',
        types: entityOptions.crane.beam
    },
    crane_hoisting: {
        name: 'Подъемный механизм',
        types: entityOptions.crane.hoisting
    },
    crane_location: {
        name: 'Расположение',
        types: entityOptions.crane.location
    },
    crane_hooks: {
        name: 'Количество крюков',
        count: true,
        unitType: unitTypes.PIECES
    },
    crane_beams_amount: {
        name: 'Количество балок/мостов',
        count: true,
        unitType: unitTypes.PIECES
    },
    crane_documents: {
        name: 'Документы',
        types: entityOptions.defaults.boolean
    },
    crane_supervision: {
        name: 'Под надзором',
        types: entityOptions.defaults.boolean
    }
};

export const craneProperties = {
    characteristics
};
