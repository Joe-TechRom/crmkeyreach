// /src/lib/hooks/useUser.tsx
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';

interface User {
    id: string;
    email: string;
}

interface UseUserResult {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const useUser = (): UseUserResult => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
                if (error) {
                    setError(error.message);
                    setUser(null);
                } else if (supabaseUser) {
                    setUser({ id: supabaseUser.id, email: supabaseUser.email });
                } else {
                    setUser(null); // User is not authenticated
                }
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, isLoading, error };
};

export default useUser;
