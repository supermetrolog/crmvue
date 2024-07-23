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
            if (answers?.length) commit('setQuestions', answers);
        }
    },
    getters: {}
};

export default Quizz;
