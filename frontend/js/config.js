const CONFIG = {
    SUPABASE_URL: 'https://qckmkzfqfakaxilycbhj.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFja21remZxZmFrYXhpbHljYmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwODIxMjksImV4cCI6MjA5MTY1ODEyOX0.TIKFOTpF_OhbkLQwwbzOCXPg1K-XSX1UP5_lij_qnpg', // TODO: REPLACE THIS WITH YOUR SUPABASE ANON KEY
    API_BASE_URL: '/api'
};

const supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
