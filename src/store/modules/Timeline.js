// import axios from "axios"
const Timeline = {
    state: {
        timeline: []
    },
    mutations: {
        updateTimeline(state, timeline) {
            state.timeline = timeline
            console.log(timeline);
        },
        updateItem(state, newItem) {
            state.timeline = state.timeline.map((branch) => {
                branch.map((item) => {
                    if (item.id === newItem.id) {
                        item = newItem;
                    }
                    return item;
                })
                return branch;
            })
        },
        createNewBranch(state, item) {
            state.timeline.push([{
                //      ID нужно получать с сервера (иначе ID будет повторяться чего нельзя допустить!)
                id: 231,
                company_id: item.object_id,
                comment: "ЫЫЫЫЫЫЫЫЫЫЫ",
                step: item.step,
                datetime: "16 фев 15:21",
                isBranch: true
            }]);
        },
        createNewItem(state, param) {
            state.timeline[param.currentBranch].push({
                //      ID нужно получать с сервера (иначе ID будет повторяться чего нельзя допустить!)
                id: 231,
                company_id: param.item.object_id,
                comment: "ЫЫЫЫЫЫЫЫЫЫЫ",
                step: param.item.step + 1,
                datetime: "16 фев 15:21",
                isBranch: true
            })
        }
    },
    actions: {
        async FETCH_TIMELINE(context) {
            // await axios
            //     .get("http://localhost:3000/timeline")
            //     .then((Response) => {
            //         context.commit('updateTimeline', Response.data)
            //     });
            const data = [
                [{
                        id: 0,
                        company_id: 3241,
                        comment: "",
                        step: 0,
                        datetime: "16 фев 15:21",
                        isBranch: false,
                        actions: {
                            done: 0,
                            negative: 1,
                            additional: 0,
                            feedbackWay: [],
                            date: "",
                            objects: [{
                                    id: 2412
                                },
                                {
                                    id: 5312
                                },
                                {
                                    id: 3123
                                },
                                {
                                    id: 5222
                                }
                            ]

                        }
                    },
                    {
                        id: 1,
                        company_id: 3241,
                        comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
                        step: 1,
                        datetime: "16 фев 15:21",
                        isBranch: false,
                        actions: {
                            done: 1,
                            negative: 0,
                            additional: 0,
                            feedbackWay: [],
                            date: "",
                            objects: [{
                                    id: 2412
                                },
                                {
                                    id: 5312
                                },
                                {
                                    id: 3123
                                },
                                {
                                    id: 5222
                                }
                            ]

                        }
                    },
                    {
                        id: 2,
                        company_id: 3241,
                        comment: "Lorem ipsum dolor sit atibus numquam equeepellendus esse commodi deseruntLorem ipsum dolor sit amet, consectetur adipisicing elit..",
                        step: 2,
                        datetime: "16 фев 15:21",
                        isBranch: false,
                        actions: {
                            negative: 0,
                            feedbackWay: [],
                            objects: [{
                                    id: 2412
                                },
                                {
                                    id: 5312
                                },
                                {
                                    id: 3123
                                },
                                {
                                    id: 5222
                                }
                            ]

                        }
                    },
                    {
                        id: 3,
                        company_id: 3241,
                        comment: "Lorem ipsum dolor sit amet, consecit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.",
                        step: 3,
                        datetime: "16 фев 15:21",
                        isBranch: false,
                        actions: {
                            negative: 0,
                            objects: [{
                                    id: 2412
                                },
                                {
                                    id: 5312
                                },
                                {
                                    id: 3123
                                },
                                {
                                    id: 5222
                                }
                            ]

                        }
                    },
                    {
                        id: 4,
                        company_id: 3241,
                        comment: "Lorem ipsum dolor sit amet, consecit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.",
                        step: 4,
                        datetime: "16 фев 15:21",
                        isBranch: false,
                        actions: {
                            negative: 0,
                            objects: [{
                                    id: 2412
                                },
                                {
                                    id: 5312
                                },
                                {
                                    id: 3123
                                },
                                {
                                    id: 5222
                                }
                            ]

                        }
                    },
                    {
                        id: 5,
                        company_id: 3241,
                        comment: "Lorem ipsum dolor sit amet, consecit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.",
                        step: 5,
                        datetime: "16 фев 15:21",
                        isBranch: false,
                        actions: {
                            negative: 0,
                            additional: 0,
                            objects: [{
                                    id: 2412,
                                    type: 0
                                },
                                {
                                    id: 5312,
                                    type: 0
                                },
                                {
                                    id: 3123,
                                    type: 1
                                },
                                {
                                    id: 5222,
                                    type: 1
                                }
                            ]

                        }
                    },
                    {
                        id: 6,
                        company_id: 3241,
                        comment: "Lorem ipsum dolor sit amet, consecit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.",
                        step: 6,
                        datetime: "16 фев 15:21",
                        isBranch: false,
                        actions: {
                            negative: 0,
                            done: 1

                        }
                    }
                ],
                [{
                        id: 4,
                        company_id: 3241,
                        comment: "Lorem ipsum dolor sit atibus numquam equeepellendus esse commodi deseruntLorem ipsum dolor sit amet, consectetur adipisicing elit..",
                        step: 2,
                        datetime: "16 фев 15:21",
                        isBranch: true,
                        actions: {
                            done: 0,
                            negative: 0,
                            feedbackWay: [],
                            objects: [{
                                    id: 2412
                                },
                                {
                                    id: 5312
                                },
                                {
                                    id: 3123
                                }
                            ]

                        }
                    },
                    {
                        id: 5,
                        company_id: 3241,
                        comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam necessitatibus numquam earum ipsa fugiat veniam suscipit, officiis repudiandae, eum recusandae neque dignissimos. Cum fugit laboriosam culpa, repellendus esse commodi deserunt.",
                        step: 3,
                        datetime: "16 фев 15:21",
                        isBranch: true
                    }
                ]
            ];
            context.commit('updateTimeline', data);
        },
        async UPDATE_ITEM(context, newItem) {
            context.commit('updateItem', newItem)
        },
        async CREATE_NEW_BRANCH(context, item) {
            context.commit('createNewBranch', item);
        },
        async CREATE_NEW_ITEM(context, param) {
            context.commit('createNewItem', param);
        }
    },
    getters: {
        TIMELINE(state) {
            // console.log(state)
            return state.timeline
        }
    }
}

export default Timeline;