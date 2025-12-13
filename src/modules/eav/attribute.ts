import { Identifiable, SoftDelete, Timestamps } from '@/types/base';

export enum AttributeValueType {
    String = 'string',
    Int = 'int',
    Float = 'float',
    Bool = 'bool',
    Date = 'date',
    DateTime = 'datetime',
    Json = 'json'
}

export const AttributeValueTypeOptions = {
    [AttributeValueType.String]: 'Текст',
    [AttributeValueType.Int]: 'Целое число',
    [AttributeValueType.Float]: 'Дробное число',
    [AttributeValueType.Bool]: 'Логическое значение',
    [AttributeValueType.Date]: 'Дата',
    [AttributeValueType.DateTime]: 'Дата и время',
    [AttributeValueType.Json]: 'JSON'
};

export enum AttributeInputType {
    Text = 'text',
    Number = 'number',
    Email = 'email',
    Phone = 'phone',
    Url = 'url',
    Date = 'date',
    Time = 'time',
    Checkbox = 'checkbox',
    Radio = 'radio',
    Select = 'select',
    MultiSelect = 'multiselect',
    Custom = 'custom'
}

export const AttributeInputTypeOptions = {
    [AttributeInputType.Text]: 'Текст',
    [AttributeInputType.Number]: 'Число',
    [AttributeInputType.Email]: 'Email',
    [AttributeInputType.Phone]: 'Телефон',
    [AttributeInputType.Url]: 'Ссылка',
    [AttributeInputType.Date]: 'Дата',
    [AttributeInputType.Time]: 'Время',
    [AttributeInputType.Checkbox]: 'Чекбокс',
    [AttributeInputType.Radio]: 'Радио',
    [AttributeInputType.Select]: 'Выбор',
    [AttributeInputType.MultiSelect]: 'Мультивыбор',
    [AttributeInputType.Custom]: 'Настраиваемый'
};

export interface Attribute extends Identifiable, Timestamps, SoftDelete {
    kind: string;
    label: string;
    description: string;
    value_type: AttributeValueType;
    input_type: AttributeInputType;
    created_by_id: string;
}
