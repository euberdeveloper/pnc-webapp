import { MutationTree } from 'vuex'
import { User } from 'pnc-sdk';

import { AlertDialogMessage, QueueMessage, State, Toast } from './state'

export enum MutationTypes {
    SET_TOAST = 'SET_TOAST',
    ADD_MESSAGE_TO_QUEUE = 'ADD_MESSAGE_TO_QUEUE',
    SET_MESSAGE_QUEUE = 'SET_MESSAGE_QUEUE',
    SET_ALERT_DIALOG = 'SET_ALERT_DIALOG',
    SET_CONFIRM_DIALOG = 'SET_CONFIRM_DIALOG',
    SET_USER = 'SET_USER',
    SET_TOKEN = 'SET_TOKEN',
    SET_SHOW_MENU = 'SET_SHOW_MENU',
    SET_DARK_THEME = 'SET_DARK_THEME',
    SET_PRIMARY_COLOUR = 'SET_PRIMARY_COLOUR',
}

export interface Mutations<S = State> {
    [MutationTypes.SET_TOAST](state: S, toast: Toast | null): void;
    [MutationTypes.ADD_MESSAGE_TO_QUEUE](state: S, text: QueueMessage): void;
    [MutationTypes.SET_MESSAGE_QUEUE](state: S, queue: QueueMessage[]): void;
    [MutationTypes.SET_ALERT_DIALOG](state: S, message: AlertDialogMessage | null): void;
    [MutationTypes.SET_CONFIRM_DIALOG](state: S, value: { text: string; callback: (answer: boolean) => void | Promise<void> } | null): void;
    [MutationTypes.SET_USER](state: S, user: User | null): void;
    [MutationTypes.SET_TOKEN](state: S, token: string | null): void;
    [MutationTypes.SET_SHOW_MENU](state: S, show: boolean): void;
    [MutationTypes.SET_DARK_THEME](state: S, token: boolean): void;
    [MutationTypes.SET_PRIMARY_COLOUR](state: S, token: string | null): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.SET_TOAST](state, text) {
        state.toast = text;
    },
    [MutationTypes.ADD_MESSAGE_TO_QUEUE](state, message) {
        state.messagesQueue.push(message);
    },
    [MutationTypes.SET_MESSAGE_QUEUE](state, queue) {
        state.messagesQueue = queue;
    },
    [MutationTypes.SET_ALERT_DIALOG](state, message) {
        state.alertDialog = message;
    },
    [MutationTypes.SET_CONFIRM_DIALOG](state, value) {
        state.confirmDialog = value;
    },
    [MutationTypes.SET_USER](state, user) {
        state.user = user;
    },
    [MutationTypes.SET_TOKEN](state, token) {
        state.token = token;
    },
    [MutationTypes.SET_SHOW_MENU](state, show) {
        state.showMenu = show;
    },
    [MutationTypes.SET_DARK_THEME](state, isDark) {
        state.darkTheme = isDark;
    },
    [MutationTypes.SET_PRIMARY_COLOUR](state, colour) {
        state.primaryColour = colour;
    }
}