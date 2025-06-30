<template>
    <div></div>
</template>
<script setup>
import { createTourStepElementGenerator } from '@/composables/useTour/useTourStep';
import { useTour } from '@/composables/useTour/useTour';

const createTourStepElement = createTourStepElementGenerator('call-scheduler');

const { run } = useTour('call-scheduler', {
    autorun: true,
    steps: [
        {
            key: 0,
            popover: {
                title: 'Планирование звонка',
                description:
                    'Добро пожаловать в форму планирования звонка. Здесь можно быстро создать задачу на определенную дату!'
            }
        },
        {
            key: 1,
            element: createTourStepElement('start'),
            popover: {
                title: 'Дата звонка',
                description: 'Вы можете выбрать дату планируемого звонка из фиксированного списка.',
                side: 'right',
                align: 'center'
            }
        },
        {
            key: 2,
            element: createTourStepElement('custom-start'),
            popover: {
                title: 'Произвольная дата',
                description:
                    'Если вы не нашли нужную дату в списке, то можете выбрать дату вручную на календаре.',
                side: 'bottom',
                align: 'center'
            }
        },
        {
            key: 3,
            element: createTourStepElement('calendar'),
            popover: {
                title: 'Календарь',
                description:
                    'В календаре можно выбрать произвольную дату и точное время. Также можно ознакомиться с уже запланированными звонками на календарный месяц.',
                side: 'left',
                align: 'center'
            },
            onHighlighted: element => {
                element?.click();
            },
            onDeselected: element => {
                element?.click();
            }
        },
        {
            key: 4,
            element: createTourStepElement('contact'),
            popover: {
                title: 'Контакт для звонка',
                description:
                    'Вы можете указать точный контакт для звонка. Он будет прикреплен к задаче',
                side: 'top',
                align: 'center'
            }
        },
        {
            key: 5,
            element: createTourStepElement('comment'),
            popover: {
                title: 'Комментарий к задаче',
                description:
                    'В комментарии можно оставить любую дополнительную информацию, которая будет прикреплена к задаче. Это поможет вам не забыть что-то важное.',
                side: 'bottom',
                align: 'center'
            }
        }
    ]
});

defineExpose({ run });
</script>
