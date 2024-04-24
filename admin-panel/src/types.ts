export interface authInfo {
  name: string,
  password: string
}

export interface IMainPages {
  islogin: boolean,
  loader: boolean,
  auth: authInfo,
  name: string,
  password: string,
  confirmPassword: string,
}