import { defineStore } from 'pinia';
import { IStoreState, adminData } from '@/store/type/auth.i';
import { checkDataWeb } from '@/http/adminAPI';

const parseDataForAdmin = ({
  id, name, role
}: adminData): adminData => ({
  id,
  name,
  role
});

export const useAuth = defineStore('auth', {
  state: (): IStoreState => ({
    adminData: null,
    auth: false,
  }),

  actions: {
    setStateValueByKey<T extends keyof IStoreState
      = keyof IStoreState>(key: T, value: any) {
      this[key] = value;
    },

    async checkDataWeb() {
      try {
        const response: any = await checkDataWeb()
        this.adminData = parseDataForAdmin(response)
        this.auth = true;
      } catch (e) {
        console.log(e)
      }
    },

    setAdminData(adminData: adminData)  {
      this.adminData = parseDataForAdmin(adminData)
    },

    setExitAuth()  {
      this.auth = false;
    }
  }
});
