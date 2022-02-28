import Vue from 'vue';
import Vuex, { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';

import { State, state } from './state';
import { Getters, getters } from './getters';
import { Mutations, mutations } from './mutations';
import { Actions, actions } from './actions';

export { AlertDialogMessage, QueueMessage, State, Toast } from './state';
export { MutationTypes } from './mutations';
export { ActionTypes, AlertType } from './actions';

Vue.use(Vuex)

export type Store = Omit<
  VuexStore<State>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
}


export default new Vuex.Store<State>({
  state,
  getters,
  mutations,
  actions
}) as Store;

