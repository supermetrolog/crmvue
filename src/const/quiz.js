const questionsFromRent = [
    {
        id: 1,
        text: 'Свободные площади в аренду?',
        answer: true,
        additions: [
            {
                id: 1,
                label: 'Сейчас'
            },
            {
                id: 2,
                label: 'Освобождается'
            },
            {
                id: 3,
                label: 'Готов освободить за $'
            }
        ],
        interests: [
            {
                id: 1,
                label: 'Стеллажи'
            },
            {
                id: 2,
                label: 'Техника'
            },
            {
                id: 3,
                label: 'Продает стеллажи и технику'
            }
        ]
    },
    {
        id: 2,
        text: 'Есть ли желание продать объект?',
        answer: true,
        additions: [
            {
                id: 1,
                label: 'С потоком'
            },
            {
                id: 2,
                label: 'Пустой'
            }
        ],
        interests: [
            {
                id: 1,
                label: 'Стеллажи'
            },
            {
                id: 2,
                label: 'Техника'
            }
        ]
    },
    {
        id: 3,
        text: 'Планирует ли развитие?',
        answer: true,
        additions: [
            {
                id: 1,
                label: 'Строиться тут же'
            },
            {
                id: 2,
                label: 'Купит готовый объект'
            },
            {
                id: 3,
                label: 'Купит участок под стройку'
            }
        ],
        interests: [
            {
                id: 1,
                label: 'Есть свои средства'
            },
            {
                id: 2,
                label: 'Нужен инвестор'
            }
        ]
    }
];
export const questions = {
    rent: questionsFromRent
};
