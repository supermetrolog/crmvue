import api from "@/api/api";
import { waitHash } from "../../utils";
const Letters = {
  state: {
    letters: [],
    wait_hash: null,
    pagination: null,
    selectedLetterId: null,
  },
  mutations: {
    updateLetters(state, data) {
      state.pagination = data.pagination;
      state.letters = data.data;
    },
    setWaitHash(state, hash) {
      state.wait_hash = hash;
      console.warn("SET WAIT HASH", state.wait_hash);
    },
    selectLetter(state, letterId) {
      state.selectedLetterId = letterId;
    },
  },
  actions: {
    async SEARCH_LETTERS(context, query) {
      let hash = waitHash(query);
      context.commit("setWaitHash", hash);
      const data = await api.letters.search(query);
      if (data) {
        if (hash == context.getters.WAIT_HASH) {
          context.commit("updateLetters", data);
        } else {
          return false;
        }
      }
      return data;
    },
    SELECT_LETTER(context, letterId) {
      context.commit("selectLetter", letterId);
    },
  },
  getters: {
    LETTERS(state) {
      return state.letters;
    },
    LETTERS_PAGINATION(state) {
      return state.pagination;
    },
    WAIT_HASH(state) {
      return state.wait_hash;
    },
    SELECTED_LETTER_ID(state) {
      return state.selectedLetterId
        ? state.selectedLetterId
        : state.letters[0].id;
    },
  },
};

export default Letters;
