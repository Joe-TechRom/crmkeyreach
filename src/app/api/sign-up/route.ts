import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/supabase';

export async function POST(request: Request): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();

  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const username = String(formData.get('username')); // Get username from form
  const phone_number = String(formData.get('phone_number')); // Get phone number from form
  const plan = String(formData.get('plan')); // Get plan from form

  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // Store username in auth.users metadata
          phone_number: phone_number, // Store phone number in auth.users metadata
        },
        emailRedirectTo: `${requestUrl.origin}/api/auth/confirm`, // Modified callback URL
      },
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 }); // Return JSON error response
    }

    // Store the email in a cookie for use in the AuthErrorPage
    const response = NextResponse.redirect(
      `${requestUrl.origin}/auth/verify-email`,
      {
        status: 302, // Changed to 302 for redirect
      }
    );

    response.cookies.set('emailForVerification', email, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error("Unexpected error during signup:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // Handle unexpected errors
  }
}
