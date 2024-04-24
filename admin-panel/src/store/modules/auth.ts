import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { AuthState, adminData } from '@/types'

const state: AuthState = {
  adminData: null
};

const getters: GetterTree<AuthState, any> = {
  getadminData: (state) => state.adminData
};

const mutations: MutationTree<AuthState> = {
  setAdminData: (state, adminData: adminData) => {
    state.adminData = {
      id: adminData.id,
      name: adminData.name,
      role: adminData.role
    }
  }
};

const actions: ActionTree<AuthState, any> = {
  storeadminData: ({ commit }, adminData: adminData) => {
    commit('setAdminData', adminData);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
