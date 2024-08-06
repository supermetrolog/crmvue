import api from '@/api/api';
import { reducer } from '@/utils/reducer.js';
import { alg } from '@/utils/alg';
import { entityProperties } from '@/const/properties/properties';
import { entityOptions } from '@/const/options/options';

const AREA_TYPES = [
    { property: ['floor', 'mezzanine'], labelTemplate: '$1' },
    { property: ['office'], labelTemplate: 'Офис, $1' },
    { property: ['tech'], labelTemplate: 'Техническая, $1' }
];

const Offers = {
    namespaced: true,
    state: {
        mixer: [],
        complex: null,
        floors: [],
        deals: [],
        parts: []
    },
    mutations: {
        setComplex(state, complex) {
            state.mixer = [];

            // Списки всех этажей, блоков и сделок

            const [floors, parts, deals, tradeOffers] = [
                ...alg.extractDeepProperty(complex, [
                    'objects.floorsRecords',
                    'objects.floorsRecords.parts',
                    'objects.commercialOffers',
                    'objects.commercialOffers.blocks'
                ])
            ];

            if (complex && complex.mixer_parts) {
                state.mixer = complex.mixer_parts;
            }

            state.floors = floors;
            state.complex = complex;
            state.deals = deals;
            state.parts = parts;

            tradeOffers.forEach(block => {
                const areaProperties = {
                    floor: [],
                    office: [],
                    tech: []
                };

                // Структуризация блоков конкретной сделки по этажам в виде {'этаж 1': ['блок 1', 'блок 2']}

                const partsWithFloors = alg.filterArrayByPropertyEntity(
                    parts.filter(part => block.parts.includes(part.id)),
                    'floor'
                );

                const reducerMinFunctionName = block.is_solid ? 'sum' : 'strictMin';

                Object.keys(partsWithFloors).forEach(key => {
                    const currentParts = partsWithFloors[key];

                    // Вычисление минимальной и максимальной площади (пол, офисы, технич.) всех этажей

                    AREA_TYPES.forEach(areaType => {
                        areaProperties[areaType.property[0]].push({
                            label: areaType.labelTemplate.replace(
                                '$1',
                                entityOptions.floor.name[key]
                            ),
                            valueMin: reducer[reducerMinFunctionName](
                                currentParts,
                                areaType.property.map(property => `area_${property}_min`)
                            ),
                            valueMax: reducer.sum(
                                currentParts,
                                areaType.property.map(property => `area_${property}_max`)
                            )
                        });
                    });
                });

                // Вычисление сводки по площади (S - складская, S - офисная).

                if (Object.keys(partsWithFloors).length) {
                    let reducerMinLambda = null;

                    // Различные методы вычисления минимума в зависимости от того, являются ли блоки делимыми внутри сделки

                    if (block.is_solid) {
                        reducerMinLambda = (acc, element) => acc + element.valueMin;
                    } else {
                        reducerMinLambda = (acc, element) => alg.strictMin(acc, element.valueMin);
                    }

                    const formatAreaProperties = Object.keys(areaProperties).reduce((acc, key) => {
                        return {
                            ...acc,
                            [key]: {
                                valueMin: areaProperties[key].reduce(reducerMinLambda, 0),
                                valueMax: reducer.sum(areaProperties[key], 'valueMax'),
                                description: areaProperties[key]
                            }
                        };
                    }, {});

                    block.preparedArea = formatAreaProperties;
                } else block.preparedArea = {};
            });
        }
    },
    actions: {
        async FETCH_COMPLEX(context, id) {
            const complex = (await api.complex.getComplexWithObjects(id)).data;
            context.commit('setComplex', complex);

            return complex;
        },
        async DELETE_COMPLEX({ commit }, id) {
            console.log('Delete complex #' + id);
            commit('setComplex', null);
        }
    },
    getters: {
        getPartById(state, id) {
            return state.parts.find(element => element.id === id);
        },
        getPartsByIds: state => ids => {
            return state.parts.filter(element => ids.includes(element.id));
        },
        getPartsByIdsWithFloors: state => ids => {
            const parts = state.parts.filter(element => ids.includes(element.id));

            return parts.reduce((acc, part) => {
                if (part.floor in acc) acc[part.floor].push(part);
                else acc[part.floor] = [part];

                return acc;
            }, {});
        },
        getFloorById(state, id) {
            return state.floors.find(element => element.id === id);
        },
        getFloorsByIds(state, ids) {
            return state.floors.filter(element => ids.includes(element.id));
        },
        getDealById(state, id) {
            return state.deals.find(element => element.id === id);
        },
        getDealsByIds(state, ids) {
            return state.deals.filter(element => ids.includes(element.id));
        },
        getDealServicesById: state => id => {
            const deal = state.deals.find(element => element.id === id);

            return entityProperties.deal.servicesWithCategories
                .map(category => ({
                    name: category.name,
                    properties: Object.keys(category.properties)
                        .map(property => ({
                            ...category.properties[property],
                            value: deal[property]
                        }))
                        .filter(element => element.value)
                }))
                .filter(element => element.properties.length);
        }
    }
};

export default Offers;
