// src/lib/hooks/useUser.tsx
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

    return { user, isLoading, error };
};

export default useUser;
