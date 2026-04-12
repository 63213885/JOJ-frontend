import { createStore } from "vuex";
import { User } from "../../generated/models/User";

interface State {
  user: User | null;
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
    setUser(state, user: User) {
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
