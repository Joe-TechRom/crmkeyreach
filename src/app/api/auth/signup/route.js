import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabaseClient'; // Import server-side client

export async function POST(req) {
  try {
    const supabase = createSupabaseServerClient(); // Use server-side client
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Password strength validation (example)
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
        },
      },
    });

    if (error) {
      console.error('Supabase signup error:', error);
      // Handle specific Supabase errors (e.g., email already exists)
      if (error.message.includes('duplicate key value violates unique constraint')) {
        return NextResponse.json({ error: 'Email address already in use' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('API signup error:', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
