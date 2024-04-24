import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { AuthState, adminData } from '@/types'
import { checkDataWeb } from '@/http/adminAPI';

const state: AuthState = {
  adminData: null,
  auth: false,
};

const getters: GetterTree<AuthState, any> = {
  getAdminData: (state) => state.adminData,
  getAuthInfo: (state) => state.auth,
};

const mutations: MutationTree<AuthState> = {
  setAdminData: (state, adminData: adminData) => {
    state.adminData = {
      id: adminData.id,
      name: adminData.name,
      role: adminData.role
    }
    state.auth = true;
  },
  setExitAuth: (state) => {
    state.auth = false;
  }
};

const actions: ActionTree<AuthState, any> = {
  storeAdminData: ({ commit }, adminData: adminData) => commit('setAdminData', adminData),
  checkDataWeb: async ({ commit }) => {
    try{
      const response = await checkDataWeb()
      commit('setAdminData', response)
      state.auth = true;
    } catch(e){
      console.log(e)
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
