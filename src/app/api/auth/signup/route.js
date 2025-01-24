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

    // Add more robust password validation here if needed

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
        },
      },
    });

    if (authError) {
      console.error('Supabase signup error:', authError);
      // Handle specific Supabase errors (e.g., email already exists)
      if (authError.message.includes('duplicate key value violates unique constraint')) {
        return NextResponse.json({ error: 'Email address already in use' }, { status: 400 });
      }
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Create a profile in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Optionally, you might want to delete the user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }

    return NextResponse.json({ data: authData }, { status: 200 });
  } catch (error) {
    console.error('API signup error:', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
