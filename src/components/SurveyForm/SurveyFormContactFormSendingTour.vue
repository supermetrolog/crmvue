<template>
    <div></div>
</template>
<script setup>
import { createTourStepElementGenerator } from '@/composables/useTour/useTourStep';
import { useTour } from '@/composables/useTour/useTour';

const createTourStepElement = createTourStepElementGenerator('survey-letter-sending');

const { run, softRun } = useTour('survey-letter-sending', {
    steps: [
        {
            key: 0,
            element: createTourStepElement('form'),
            popover: {
                title: 'Работа с письмами',
                description:
                    'Отправка писем клиентам значительно доработана. Добавлена автогенерация, шаблоны, подписи.',
                side: 'left'
            }
        },
        {
            key: 1,
            element: createTourStepElement('subject'),
            popover: {
                title: 'Тема письма',
                description: 'Тема является обязательной, должна привлечь внимание клиента.',
                side: 'left',
                align: 'center'
            }
        },
        {
            key: 2,
            element: createTourStepElement('subject-templates'),
            popover: {
                title: 'Шаблоны тем',
                description:
                    'На данный момент доступно 2 шаблона, которые могут быть использованы для первичного контакта с клиентом.',
                side: 'left',
                align: 'center'
            }
        },
        {
            key: 3,
            element: createTourStepElement('message'),
            popover: {
                title: 'Основное сообщение',
                description:
                    'Cообщение автогенерируется на основе данных о клиенте. Вы можете изменить его, или вовсе написать вручную.',
                side: 'left',
                align: 'center'
            }
        },
        {
            key: 4,
            element: createTourStepElement('signature'),
            popover: {
                title: 'Настройки подписи',
                description:
                    'По умолчанию подпись к письму будет прикреплена автоматически. Ее можно отключить или изменить вручную.',
                side: 'top',
                align: 'center'
            }
        },
        {
            key: 5,
            element: createTourStepElement('signature-checkbox'),
            popover: {
                title: 'Отключение подписи',
                description: 'Для отключения достаточно убрать галочку с этой функции.',
                side: 'top',
                align: 'center'
            }
        },
        {
            key: 6,
            element: createTourStepElement('signature-button'),
            popover: {
                title: 'Редактирование подписи',
                description:
                    'Сгенерированная подпись будет вставлена в в конец сообщения письма. Вы сможете вручную отредактировать ее или убрать лишнее.',
                side: 'top',
                align: 'center'
            }
        },
        {
            key: 7,
            element: createTourStepElement('letter-select'),
            popover: {
                title: 'Просмотр писем',
                description:
                    'Отправленные этому клиенту письма можно будет просмотреть в выпадающем списке.',
                side: 'bottom',
                align: 'center'
            }
        }
    ]
});

defineExpose({ run, softRun });
</script>
