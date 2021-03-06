import {AppState} from './App.state';
import {createAction, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from './entities/api/user';
import {decode} from 'jsonwebtoken';
import {JwtPayload} from './entities/common/jwt-payload';

const slice = createSlice({
    initialState: new AppState(),
    name: 'app',
    reducers: {
        triggerSidebar(state) {
            state.sidebarCollapse = !state.sidebarCollapse;
        },
        changeWindowSize: (state, {payload}: PayloadAction<{width: number, height: number}>) => {
            state.windowWidth = payload.width;
            state.windowHeight = payload.height;
            state.isMobile = payload.width < 768;
        },
        appUserChange(state, {payload}: PayloadAction<User | undefined>) {
            state.user = payload as any;
        },
        appTokenChange(state, {payload}: PayloadAction<string>) {
            state.token = payload;
            const info = decode(payload) as JwtPayload;
            state.tokenInfo = info;
            state.authenticated = info?.exp > new Date().valueOf() / 1000;
        }
    }
});

export const { appUserChange, triggerSidebar, changeWindowSize, appTokenChange } = slice.actions;
export const appInitialize = createAction('app/initialize')

const appReducer = slice.reducer;

export default appReducer;
