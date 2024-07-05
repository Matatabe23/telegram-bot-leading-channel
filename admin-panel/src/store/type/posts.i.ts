import { IPosts, IPublishTime } from '@/types'

export interface IStoreState {
  isLoader: boolean,
  postsList: IPosts[],
  totalCount: number,
  publishTime: IPublishTime[],
  form: {
    currentPage: number,
    postsPerPage: number
  }
}