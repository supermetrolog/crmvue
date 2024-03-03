import { entityOptions } from '@/const/options/options';

const characteristics = {
    outside_mkad: {
        name: 'Находится за пределами МКАД',
        types: entityOptions.defaults.boolean
    },
    show_inside_mkad: {
        name: 'Показывать в пределах МКАД',
        types: entityOptions.defaults.boolean
    },
    near_mo: {
        name: 'Прилежащий к МО',
        types: entityOptions.defaults.boolean
    },
    show_in_mo: {
        name: 'Показывать в МО',
        types: entityOptions.defaults.boolean
    }
};

export const locationProperties = {
    characteristics
};
