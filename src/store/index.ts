import { createStore } from 'vuex';

interface State {
    token: string | null;
}

export default createStore<State>({
    state: {
        token: null,
    },
    mutations: {
        setToken(state, token: string) {
            state.token = token;
        },
    },
    actions: {
        // 可以在这里添加其他的 actions
    },
    getters: {
        // 可以在这里添加 getters
    },
});