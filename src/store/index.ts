import { createStore } from "vuex";
import { AuthControllerService, LoginUserVO } from "../../generated/user";

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
    updateUser(state, updates: Partial<LoginUserVO>) {
      if (state.user) {
        state.user = { ...state.user, ...updates };
      }
    },
    clearUser(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
    setInitialized(state) {
      state.isInitializing = false;
    },
  },
  actions: {
    async fetchCurrentUser({ commit, state }) {
      if (!state.isInitializing) return;
      try {
        const res = await AuthControllerService.getLoginUserUsingGet();
        if (res.code === 0 && res.data) {
          commit("setUser", res.data);
        }
      } catch (error) {
        console.log("未登录或获取用户信息失败", error);
      } finally {
        commit("setInitialized");
      }
    },
  },
  modules: {},
});
