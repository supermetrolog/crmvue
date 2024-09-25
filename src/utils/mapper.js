import { alg } from '@/utils/alg';
import { formatterObject } from '@/plugins';
import { deleteObjectsWithEmptyProperties } from '@/utils/deleteObjectsWithEmptyProperties.js';
import { dayjsFromMoscow } from '@/utils/index.js';

const propertiesToTableFormat = (object, props) => {
    return Object.keys(props).reduce((acc, property) => {
        const currentPropertyObject = props[property];

        // Проверяем, имеют ли свойства условия для вывода

        if (currentPropertyObject.condition && object[currentPropertyObject.condition] !== 1)
            return acc;

        if (currentPropertyObject.lengthCondition && !object[currentPropertyObject.lengthCondition])
            return acc;

        // Базовый объект, который отдадим
        const formattedObject = {
            name: currentPropertyObject.name
        };

        if (currentPropertyObject.unitType)
            formattedObject.unitType = currentPropertyObject.unitType;

        // Обработка свойств в виде min/max
        if (currentPropertyObject.range) {
            if (Number(object[`${property}_min`])) {
                formattedObject.value = formatterObject.numberOrRangeNew(
                    object[`${property}_min`],
                    object[`${property}_max`]
                );
            } else {
                formattedObject.value = null;
            }
        }

        // Обработка свойств в виде тип-количество ([1, 4, 2, 6] - 4шт. типа 1, 6шт. типа 2)
        else if (currentPropertyObject.count && currentPropertyObject.types) {
            if (object[property] instanceof Array && object[property].length) {
                const pairs = alg.chunk(object[property], 2);

                const types = pairs.reduce((acc, pair) => {
                    if (pair[0] in acc) acc[pair[0]] += pair[1];
                    else acc[pair[0]] = pair[1];

                    return acc;
                }, {});

                formattedObject.value = Object.keys(types).map(key => ({
                    type: currentPropertyObject.types[key],
                    value: types[key]
                }));
                formattedObject.multiple = true;
            } else if (object[property] instanceof Object && !(object[property] instanceof Array)) {
                formattedObject.value = Object.keys(object[property]).map(key => ({
                    type: currentPropertyObject.types[key],
                    value: object[property][key]
                }));
            } else {
                formattedObject.value = null;
            }
        }

        // Обработка простых свойств со значением количества в виде (power: 3430) в формате value !== 0
        else if (currentPropertyObject.count && currentPropertyObject.strict) {
            formattedObject.value = object[property] ? object[property] : null;
        }

        // Обработка простых свойств со значением количества в виде (power: 3430)
        else if (currentPropertyObject.count) {
            formattedObject.value = object[property];
        }

        // Обработка свойств в виде массива типов ([1, 5, 3] - тип_1, тип_5, тип_3)
        else if (currentPropertyObject.types && currentPropertyObject.multiple) {
            if (object[property] instanceof Array && object[property].length) {
                formattedObject.value = object[property]
                    .map(element => currentPropertyObject.types[element])
                    .join(', ');
            } else {
                formattedObject.value = null;
            }
        }

        // Обработка свойств, где необходимо узнать длину массива
        else if (currentPropertyObject.arraySize) {
            if (object[property] instanceof Array) formattedObject.value = object[property].length;
            else if (object[property] instanceof Object)
                formattedObject.value = Object.keys(object[property]).length;
            else formattedObject.value = null;
        }

        // Обработка самых простых свойств виде свойство:тип
        else if (currentPropertyObject.types) {
            formattedObject.value = currentPropertyObject.types[object[property]] ?? null;
        }

        // Вдруг взялись какие-то непонятные приколыши
        else {
            formattedObject.value = object[property] ? 'Да/есть' : null;
        }

        return [...acc, formattedObject];
    }, []);
};

const propertiesToTableFormatWithSections = (object, sections) => {
    return sections.map((section, index) => {
        const properties = propertiesToTableFormat(object, section.properties);

        return {
            id: section.id || `#${index}`,
            name: section.name,
            properties: properties
        };
    });
};

const propertiesToParametersFormat = (object, properties) => {
    const formattedObject = [];

    if (properties.range) {
        Object.keys(properties.range).forEach(property => {
            const valueMin = Number(object[`${property}_min`]);

            if (valueMin) {
                formattedObject.push({
                    ...properties.range[property],
                    valueMin: valueMin,
                    valueMax: Number(object[`${property}_max`]),
                    range: true
                });
            }
        });
    }

    if (properties.count) {
        Object.keys(properties.count).forEach(property => {
            formattedObject.push({
                ...properties.count[property],
                value:
                    object[property] instanceof Array
                        ? object[property].length
                        : object[property] instanceof Object
                          ? Object.keys(object[property]).length
                          : object[property],
                count: true
            });
        });
    }

    if (properties.types) {
        Object.keys(properties.types).forEach(property => {
            const currentPropertyObject = properties.types[property];
            let valueObj = { value: object[property] };

            if (currentPropertyObject.countProperty)
                valueObj.valueCount = object[currentPropertyObject.countProperty];

            if (currentPropertyObject.withCount) {
                if (valueObj.value instanceof Array)
                    valueObj.value = valueObj.value.length ? valueObj.value : null;
                else if (valueObj instanceof Object)
                    valueObj.value = Object.keys(valueObj.value).reduce((acc, key) => {
                        acc.push(key, valueObj.value[key]);
                        return acc;
                    }, []);
            }

            if (!currentPropertyObject.types && valueObj.value == 2) valueObj.value = null;

            formattedObject.push({ ...currentPropertyObject, ...valueObj });
        });
    }

    return deleteObjectsWithEmptyProperties(formattedObject, 'value', 0);
};

const propertiesToPrices = (object, properties, isRange = false) => {
    return Object.keys(properties).reduce((acc, property) => {
        let currentValueObject = {};

        if (properties[property] instanceof Object)
            currentValueObject = { ...properties[property] };
        else currentValueObject.name = properties[property];

        if (isRange) {
            if (object[property + '_min'] || object[property + '_max']) {
                currentValueObject.valueMin = object[property + '_min'];
                currentValueObject.valueMax = object[property + '_max'];
            }
        } else {
            currentValueObject.value = object[property];
        }

        if (currentValueObject.value || currentValueObject.valueMin || currentValueObject.valueMax)
            acc.push(currentValueObject);

        return acc;
    }, []);
};

const propertiesToRangeFormat = (object, properties) => {
    return Object.keys(properties).reduce((acc, property) => {
        let currentValueObject = {
            name: properties[property].name,
            valueMin: object[property + '_min'],
            valueMax: object[property + '_max']
        };

        if (currentValueObject.valueMin || currentValueObject.valueMax)
            acc.push(currentValueObject);

        return acc;
    }, []);
};

/**
 * Создает `label` для сообщений. Имеет свойство `isLabel = true` для отличия от сообщений.
 * `id` генерирует на основе сообщения.
 *
 * @param {Message} message
 * @returns {MessageLabel}
 */
function createLabel(message) {
    return {
        isLabel: true,
        label: message.dayjs_date,
        id: message.id + '-label'
    };
}

/**
 * @typedef MessagesToSectionsResult
 * @property {array<Message|MessageLabel>} messages
 * @property {boolean} hasLeakedMessages
 */

/**
 * Анализ сообщений и вставка label'ов между сообщениями из разных дней.
 * Дополнительно добавление `dayjs_date` в тело сообщения.
 *
 * @param {array<Message>} messages - список сырых сообщений
 * @param {dayjs.Dayjs|null} [lastMessageDate=null]
 * @param {boolean} [reversed=false] - проверка на соответсвие дате с начала
 * @returns {MessagesToSectionsResult} - список сообщений + label'ов между ними
 */
export function messagesToSections(messages, lastMessageDate = null, reversed = false) {
    let hasLeakedMessages = false;

    const _messages = messages.reduce((acc, message, index) => {
        message.dayjs_date = dayjsFromMoscow(message.created_at);

        if (index === 0) {
            if (lastMessageDate && reversed)
                hasLeakedMessages = message.dayjs_date.isSame(lastMessageDate, 'day');
            acc.push(createLabel(message), message);
            return acc;
        }

        if (index === messages.length - 1 && lastMessageDate && !reversed)
            hasLeakedMessages = message.dayjs_date.isSame(lastMessageDate, 'day');

        if (messages[index - 1].dayjs_date.isBefore(message.dayjs_date, 'day'))
            acc.push(createLabel(message), message);
        else acc.push(message);

        return acc;
    }, []);

    return { messages: _messages, hasLeakedMessages };
}

export const mapper = {
    propertiesToTableFormat,
    propertiesToTableFormatWithSections,
    propertiesToParametersFormat,
    propertiesToPrices,
    propertiesToRangeFormat
};
