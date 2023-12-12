export const Menu = new Map([
    [
        "admin",
        [
            {
                id: 0,
                name: "Компании",
                icon: "fa-solid fa-industry"
            },
            {id: 6, name: "Предложка", icon: "fas fa-city", url: "/offers"},
            {
                id: 1,
                name: "Статистика",
                icon: "fa-solid fa-chart-bar",
                url: "/statistic",
            },
            {
                id: 2,
                name: "Календарь",
                icon: "fa-solid fa-calendar",
                url: "/calendar",
                exact: true,
            },
            {id: 3, name: "Настройки", icon: "fas fa-cog", url: "/setting"},
            {id: 4, name: "Юзеры", icon: "fas fa-users", url: "/users"},
            {
                id: 5,
                name: "Аккаунт",
                icon: "fa-solid fa-user-astronaut",
                url: "/account",
            },
        ],
    ],
    [
        "agent",
        [
            {
                id: 0,
                name: "Компании",
                icon: "fa-solid fa-industry",
                url: "/companies",
            },
            {
                id: 6,
                name: "Предложка",
                icon: "fa-solid fa-city",
                url: "/offers"
            },
            {
                id: 5,
                name: "Аккаунт",
                icon: "fa-solid fa-user-astronaut",
                url: "/account",
            },
        ],
    ],
]);
export const InternalMenu = new Map([
    [
        "statistic",
        [
            {id: 0, name: "общая", url: "/statistic/", exact: true},
            {id: 1, name: "сделка", url: "/statistic/deal"},
            {id: 2, name: "брак", url: "/statistic/brak"},
        ],
    ],
    [
        "offers",
        [
            {id: 0, name: "главная", url: "/offers/", exact: true},
            {id: 1, name: "карта", url: "/offers/map"},
        ],
    ],
    [
        "companies",
        [
            {id: 0, name: "главная", url: "/companies", exact: true},
            {id: 1, name: "группы компаний", url: "/companies/groups"},
            {id: 2, name: "запросы", url: "/companies/requests"},
            {id: 3, name: "сделки", url: "/companies/deals"},
        ],
    ],
    [
        "setting",
        [
            {id: 0, name: "все", url: "/setting/", exact: true},
            {id: 1, name: "в работе", url: "/setting/in-work"},
            {id: 2, name: "сделка", url: "/setting/deal"},
            {id: 3, name: "брак", url: "/setting/brak"},
        ],
    ],
]);