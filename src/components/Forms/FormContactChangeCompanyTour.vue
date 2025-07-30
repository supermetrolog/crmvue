<template>
    <div></div>
</template>
<script setup>
import { createTourStepElementGenerator } from '@/composables/useTour/useTourStep';
import { useTour } from '@/composables/useTour/useTour';

const createTourStepElement = createTourStepElementGenerator('contact-change-company');

const { run } = useTour('contact-change-company', {
    autorun: true,
    steps: [
        {
            key: 0,
            popover: {
                title: 'Перенос контакта',
                description:
                    'Теперь контакта можно перенести в другую компанию компанию автоматически!'
            }
        },
        {
            key: 1,
            element: createTourStepElement('current-company'),
            popover: {
                title: 'Текущая компания',
                description: 'Это текущая компания, к которой прикреплен переносимый контакт.',
                side: 'top',
                align: 'center'
            }
        },
        {
            key: 2,
            element: createTourStepElement('disable-contact'),
            popover: {
                title: 'Архивация контакта',
                description:
                    'По умолчанию контакт в текущей компании архивируется. Но вы можете просто отключить эту функцию при необходимости',
                side: 'right',
                align: 'center'
            }
        },
        {
            key: 3,
            element: createTourStepElement('company-picker'),
            popover: {
                title: 'Выбор компании',
                description:
                    'С помощью поиска вы можете выбрать компанию, в которую нужно перенести контакт. Поиск доступен по названию или ID.',
                side: 'right',
                align: 'center'
            }
        },
        {
            key: 4,
            element: createTourStepElement('consultant-picker'),
            popover: {
                title: 'Изменение консультанта',
                description:
                    'Если теперь у контакта новый ведущий консультант, то просто выберите его в этом списке. При переносе этот консультант будет прикреплен к контакту.',
                side: 'right',
                align: 'center'
            }
        }
    ]
});

defineExpose({ run });
</script>
