import { createStore } from "vuex";
import { LoginUserVO } from "../../generated/models/LoginUserVO";

interface State {
  user: LoginUserVO | null;
  isLoggedIn: boolean;
}

export default createStore<State>({
  state: {
    user: null,
    isLoggedIn: false,
  },
  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isLoggedIn,
  },
  mutations: {
    setUser(state, user: LoginUserVO) {
      state.user = user;
      state.isLoggedIn = true;
    },
    clearUser(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
  actions: {},
  modules: {},
});
