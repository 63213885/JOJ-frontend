import { createStore } from "vuex";
import { LoginUserVO } from "../../generated/user";

interface State {
  user: LoginUserVO | null;
  isLoggedIn: boolean;
  isInitializing: boolean;
}

export default createStore<State>({
  state: {
    user: null,
    isLoggedIn: false,
    isInitializing: true,
  },
  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isLoggedIn,
    isInitializing: (state) => state.isInitializing,
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
    setInitialized(state) {
      state.isInitializing = false;
    },
  },
  actions: {},
  modules: {},
});
