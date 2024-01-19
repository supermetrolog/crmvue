import { max, maxDate, min } from '@//validators/index';

export const pricePerFloorValidators = rangeMaxPricePerFloor => {
    return [
        {
            func: max(rangeMaxPricePerFloor),
            message: 'Минимальная цена превышает максимальную',
            property: 'first'
        },
        {
            func: min(0),
            message: 'Некорректная отрицательная цена'
        }
    ];
};

export const dateRangeValidators = dateEnd => {
    return [
        {
            func: maxDate(dateEnd),
            message: 'Дата ОТ не может быть позже ДО',
            property: 'first'
        }
    ];
};

export const ceilingHeightValidators = maxCeilingHeight => {
    return [
        {
            func: max(maxCeilingHeight),
            message: 'Минимальная высота превышает максимальную',
            property: 'first'
        },
        {
            func: min(0),
            message: 'Некорректная отрицательная высота'
        }
    ];
};

export const areaRangeValidators = maxArea => {
    return [
        {
            func: max(maxArea),
            message: 'Минимальная S превышает максимальную',
            property: 'first'
        },
        {
            func: min(0),
            message: 'Некорректная отрицательная S'
        }
    ];
};
