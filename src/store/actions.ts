import { ActionTree, ActionContext } from 'vuex'
import { ApiError, ClientError, InvalidCredentialsError, RequestError, UnknownApiError, User } from 'pnc-sdk';
import router from '@/router';
import api from '@/plugins/api';
import { localStorage } from '@/utils';

import { AlertDialogMessage, QueueMessage, State, Toast } from './state'
import { Mutations, MutationTypes } from './mutations'

export enum ActionTypes {
    ALERT = 'ALERT',
    SET_TOAST = 'SET_TOAST',
    ADD_MESSAGE_TO_QUEUE = 'ADD_MESSAGE_TO_QUEUE',
    ADD_ERROR_TO_QUEUE = 'ADD_ERROR_TO_QUEUE',
    SET_MESSAGE_QUEUE = 'SET_MESSAGE_QUEUE',
    HIDE_ALERT_DIALOG = 'HIDE_ALERT_DIALOG',
    SHOW_ALERT_DIALOG = 'SHOW_ALERT_DIALOG',
    SHOW_ALERT_ERROR = 'SHOW_ALERT_ERROR',
    SHOW_ALERT_SUCCESS = 'SHOW_ALERT_SUCCESS',
    HIDE_CONFIRM_DIALOG = 'HIDE_CONFIRM_DIALOG',
    SHOW_CONFIRM_DIALOG = 'SHOW_CONFIRM_DIALOG',
    SET_TOKEN = 'SET_TOKEN',
    FIRST_LOGIN = 'FIRST_LOGIN',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    TOGGLE_MENU = 'TOGGLE_MENU',
    HANDLE_API_ERROR = 'HANDLE_API_ERROR',
    TOGGLE_DARK_THEME = 'TOGGLE_DARK_THEME',
    CHANGE_PRIMARY_COLOUR = 'CHANGE_PRIMARY_COLOUR',
    RETRIEVE_DARK_THEME = 'RETRIEVE_DARK_THEME',
    RETRIEVE_PRIMARY_COLOUR = 'RETRIEVE_PRIMARY_COLOUR',
    STARTUP = 'STARTUP',
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
    [ActionTypes.SET_TOAST]({ commit }: AugmentedActionContext, payload: Toast | null): void;
    [ActionTypes.ALERT]({ dispatch }: AugmentedActionContext, payload: { message: string, alertType?: AlertType }): void;
    [ActionTypes.ADD_MESSAGE_TO_QUEUE]({ commit }: AugmentedActionContext, message: QueueMessage): void;
    [ActionTypes.ADD_ERROR_TO_QUEUE]({ commit }: AugmentedActionContext, text: string): void;
    [ActionTypes.SET_MESSAGE_QUEUE]({ commit }: AugmentedActionContext, queue: QueueMessage[]): void;
    [ActionTypes.HIDE_ALERT_DIALOG]({ commit }: AugmentedActionContext): void;
    [ActionTypes.SHOW_ALERT_DIALOG]({ commit }: AugmentedActionContext, message: AlertDialogMessage): void;
    [ActionTypes.SHOW_ALERT_ERROR]({ commit }: AugmentedActionContext, text: string): void;
    [ActionTypes.SHOW_ALERT_SUCCESS]({ commit }: AugmentedActionContext, text: string): void;
    [ActionTypes.HIDE_CONFIRM_DIALOG]({ commit }: AugmentedActionContext): void;
    [ActionTypes.SHOW_CONFIRM_DIALOG]({ commit }: AugmentedActionContext, value: { text: string; callback: (answer: boolean) => void | Promise<void> } | null): void;
    [ActionTypes.SET_TOKEN]({ commit }: AugmentedActionContext, token: string | null): void;
    [ActionTypes.FIRST_LOGIN]({ commit }: AugmentedActionContext): Promise<void>;
    [ActionTypes.LOGIN]({ commit }: AugmentedActionContext, body: { username: string; password: string }): Promise<void>;
    [ActionTypes.LOGOUT]({ commit }: AugmentedActionContext): void;
    [ActionTypes.TOGGLE_MENU]({ commit }: AugmentedActionContext): void;
    [ActionTypes.HANDLE_API_ERROR]({ commit }: AugmentedActionContext, error: { error: Error, config: any }): void;
    [ActionTypes.TOGGLE_DARK_THEME]({ commit }: AugmentedActionContext): void;
    [ActionTypes.CHANGE_PRIMARY_COLOUR]({ commit }: AugmentedActionContext, colour: string | null): void;
    [ActionTypes.RETRIEVE_DARK_THEME]({ commit }: AugmentedActionContext): void;
    [ActionTypes.RETRIEVE_PRIMARY_COLOUR]({ commit }: AugmentedActionContext, colour: string | null): void;
    [ActionTypes.STARTUP]({ commit }: AugmentedActionContext): Promise<void>;
}

export enum AlertType {
    NONE,
    ERROR_ALERT,
    ERRORS_QUEUE,
}

export const actions: ActionTree<State, State> & Actions = {
    [ActionTypes.SET_TOAST]({ commit }, payload) {
        commit(MutationTypes.SET_TOAST, payload);
    },
    [ActionTypes.ALERT]({ dispatch }, { message, alertType }) {
        switch (alertType) {
            case AlertType.ERROR_ALERT:
                dispatch(ActionTypes.SHOW_ALERT_ERROR, message);
                break;
            case AlertType.ERRORS_QUEUE:
                dispatch(ActionTypes.ADD_ERROR_TO_QUEUE, message);
                break;
            default:
                break;
        }
    },
    [ActionTypes.ADD_MESSAGE_TO_QUEUE]({ commit }, message) {
        commit(MutationTypes.ADD_MESSAGE_TO_QUEUE, message);
    },
    [ActionTypes.ADD_ERROR_TO_QUEUE]({ dispatch }, text) {
        dispatch(ActionTypes.ADD_MESSAGE_TO_QUEUE, { text, color: 'red' });
    },
    [ActionTypes.SET_MESSAGE_QUEUE]({ commit }, queue) {
        commit(MutationTypes.SET_MESSAGE_QUEUE, queue);
    },
    [ActionTypes.HIDE_ALERT_DIALOG]({ commit }) {
        commit(MutationTypes.SET_ALERT_DIALOG, null);
    },
    [ActionTypes.SHOW_ALERT_DIALOG]({ commit }, message) {
        commit(MutationTypes.SET_ALERT_DIALOG, message);
    },
    [ActionTypes.SHOW_ALERT_ERROR]({ dispatch }, text) {
        dispatch(ActionTypes.SHOW_ALERT_DIALOG, { text, color: 'red', title: 'Error' });
    },
    [ActionTypes.SHOW_ALERT_SUCCESS]({ dispatch }, text) {
        dispatch(ActionTypes.SHOW_ALERT_DIALOG, { text, color: 'green', title: 'Success' });
    },
    [ActionTypes.HIDE_CONFIRM_DIALOG]({ commit }) {
        commit(MutationTypes.SET_CONFIRM_DIALOG, null);
    },
    [ActionTypes.SHOW_CONFIRM_DIALOG]({ commit }, value) {
        commit(MutationTypes.SET_CONFIRM_DIALOG, value);
    },
    [ActionTypes.SET_TOKEN]({ commit }, token) {
        commit(MutationTypes.SET_TOKEN, token);
        api.token = token;

        if (token) {
            localStorage.setItem('apiToken', token);
        }
        else {
            localStorage.removeItem('apiToken');
        }
    },
    async [ActionTypes.FIRST_LOGIN]({ commit, dispatch }) {
        const token = localStorage.getItem('apiToken');
        if (token) {
            try {
                dispatch(ActionTypes.SET_TOKEN, token);
                const user = await api.users.getMe() as User;
                commit(MutationTypes.SET_USER, user);
            }
            catch (error) {
                dispatch(ActionTypes.SET_TOKEN, null);
                console.warn('Get user me failed', error);
            }
        }
    },
    async [ActionTypes.LOGIN]({ commit, dispatch }, body) {
        const { username, password } = body;
        const { token, user } = await api.auth.loginUser(username, password);
        dispatch(ActionTypes.SET_TOKEN, token);
        commit(MutationTypes.SET_USER, user as User);
    },
    [ActionTypes.LOGOUT]({ commit, dispatch }) {
        dispatch(ActionTypes.SET_TOKEN, null);
        commit(MutationTypes.SET_USER, null);
        router.push('/');
    },
    [ActionTypes.TOGGLE_MENU]({ commit, state }) {
        commit(MutationTypes.SET_SHOW_MENU, !state.showMenu);
    },
    [ActionTypes.HANDLE_API_ERROR]({ dispatch }, err) {
        const { error, config } = err;

        if (!config.noLog) {
            console.error(error);
        }

        if (!config.noHandle) {
            const alertType = config.alertType ?? AlertType.ERROR_ALERT;
            if (error instanceof ApiError) {
                if (error.code === 401 && !(error instanceof InvalidCredentialsError)) {
                    dispatch(ActionTypes.ALERT, { message: 'User not authenticated', alertType });
                    throw null;
                }
                else if (error.code === 403) {
                    dispatch(ActionTypes.ALERT, { message: `User has no permission to complete the task`, alertType });
                    throw null;
                }
                else if (error instanceof UnknownApiError) {
                    dispatch(ActionTypes.ALERT, { message: `Generic server error`, alertType });
                    throw null;
                }
                else {
                    throw error;
                }
            }
            else if (error instanceof RequestError) {
                dispatch(ActionTypes.ALERT, { message: `The server does not answer. It could be possible that there is not internet connection`, alertType });
                throw null
            }
            else if (error instanceof ClientError) {
                dispatch(ActionTypes.ALERT, { message: `Generic client error`, alertType });
                throw null
            }
            else {
                throw error;
            }
        }

    },
    [ActionTypes.TOGGLE_DARK_THEME]({ commit, state }) {
        if (state.darkTheme) {
            localStorage.removeItem('isDarkTheme');
        }
        else {
            localStorage.setItem('isDarkTheme', 'true');
        }

        commit(MutationTypes.SET_DARK_THEME, !state.darkTheme);
    },
    [ActionTypes.CHANGE_PRIMARY_COLOUR]({ commit }, colour) {
        commit(MutationTypes.SET_PRIMARY_COLOUR, colour);

        if (colour) {
            localStorage.setItem('primaryColour', colour);
        }
        else {
            localStorage.removeItem('primaryColour');
        }
    },
    [ActionTypes.RETRIEVE_DARK_THEME]({ commit }) {
        const isDarkTheme = localStorage.getItem('isDarkTheme') !== null;
        commit(MutationTypes.SET_DARK_THEME, isDarkTheme);
    },
    [ActionTypes.RETRIEVE_PRIMARY_COLOUR]({ commit }) {
        const primaryColour = localStorage.getItem('primaryColour');
        commit(MutationTypes.SET_PRIMARY_COLOUR, primaryColour);
    },
    async [ActionTypes.STARTUP]({ dispatch }) {
        await dispatch(ActionTypes.FIRST_LOGIN);
        dispatch(ActionTypes.RETRIEVE_DARK_THEME);
        dispatch(ActionTypes.RETRIEVE_PRIMARY_COLOUR);
    }
}