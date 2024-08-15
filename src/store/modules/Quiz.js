import api from '@/api/api';

const Quizz = {
    state: {
        questions: []
    },
    mutations: {
        setQuestions(state, questions) {
            state.questions = questions;
        }
    },
    actions: {
        async fetchQuestions({ commit }) {
            const answers = await api.question.getWithAnswers();
            if (answers)
                commit(
                    'setQuestions',
                    answers.data.filter(element => element.deleted_at === null)
                );
        }
    },
    getters: {}
};

export default Quizz;
