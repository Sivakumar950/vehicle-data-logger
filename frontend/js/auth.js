const Auth = {
    signIn: async () => {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard.html`
            }
        });
        if (error) {
            Utils.showToast(error.message, 'error');
            console.error('Login error:', error);
        }
    },
    signOut: async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            Utils.showToast(error.message, 'error');
            console.error('Logout error:', error);
        } else {
            window.location.href = 'index.html';
        }
    },
    getSession: async () => {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) {
            console.error('Get session error:', error);
            return null;
        }
        return session;
    },
    requireAuth: async () => {
        const session = await Auth.getSession();
        if (!session) {
            window.location.href = 'index.html';
            return null;
        }
        return session;
    },
    requireNoAuth: async () => {
        const session = await Auth.getSession();
        if (session) {
            window.location.href = 'dashboard.html';
        }
    }
};

supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        const currentPath = window.location.pathname;
        if (!currentPath.endsWith('index.html') && currentPath !== '/') {
            window.location.href = 'index.html';
        }
    }
});
