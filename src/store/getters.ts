import { UserRole } from '@prebenorwegian/sdk';
import { GetterTree } from 'vuex'

import { getRoleIcon } from '@/utils';

import { State } from './state'

export type Getters = {
  role(state: State): UserRole | null;
  roleIcon(state: State): string | null;
}

export const getters: GetterTree<State, State> & Getters = {
  role: (state) => {
    return state.user?.role ?? null;
  },
  roleIcon: (state) => {
    return getRoleIcon(state.user?.role);
  }
}