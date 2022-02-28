import { User, UserRole } from "pnc-sdk"

export interface Toast {
    message: string;
    color: string;
}

export interface AlertDialogMessage {
    title?: string;
    text: string;
    color: string;
}

export interface QueueMessage {
    text: string
    color: string
}

export interface State {
    token: string | null;
    user: User | null;
    showMenu: boolean;
    toast: Toast | null;
    messagesQueue: QueueMessage[];
    alertDialog: AlertDialogMessage | null;
    confirmDialog: { text: string; callback: (answer: boolean) => void | Promise<void> } | null;
    darkTheme: boolean;
    primaryColour: string | null;
    roles: UserRole[];
}

export const state: State = {
    token: null,
    user: null,
    showMenu: true,
    toast: null,
    messagesQueue: [],
    alertDialog: null,
    confirmDialog: null,
    darkTheme: false,
    primaryColour: null,
    roles: Object.values(UserRole),
}
