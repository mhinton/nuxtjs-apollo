import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// Polyfill for `window.fetch()`
// require('whatwg-fetch');

export const state = () => ({ authUser: null });

export const mutations = {
  SET_USER(state, user) {
    state.authUser = user;
  }
};

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit("SET_USER", req.session.authUser);
    }
  },

  async login({ commit }, { username, password }) {
    try {
      const { data } = await axios.post("/api/login", { username, password });
      commit("SET_USER", data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error("Bad credentials");
      }
      throw error;
    }
  },

  async logout({ commit }) {
    await axios.post("/api/logout");
    commit("SET_USER", null);
  }
};

// const store = () =>
//   new Vuex.Store({
//     state: {
//       authUser: null,
//     },

//     mutations: {
//       SET_USER(state, user) {
//         state.authUser = user;
//       },
//     },

//     actions: {
//       // ...
//     },
//   });

// export default store;
