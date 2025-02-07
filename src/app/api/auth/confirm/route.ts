import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (token_hash && type) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error('Error verifying OTP:', error);
      return NextResponse.redirect(new URL('/auth/auth-code-error', req.url));
    }

    if (data.session) {
      const { user } = data.session;

      if (!user) {
        console.error('User is null after OTP verification');
        return NextResponse.redirect(new URL('/signin', req.url));
      }

      // Create or update user profile with retry logic
      const maxRetries = 3;
      let retryCount = 0;
      let profileError;

      while (retryCount < maxRetries) {
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            email: user.email,
            name: user.user_metadata.name,
            phone_number: user.user_metadata.phone_number,
            updated_at: new Date().toISOString(),
          }, 
          { 
            onConflict: 'user_id',
            ignoreDuplicates: false
          });

        if (!upsertError) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }

        profileError = upsertError;
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }

      console.error('Final profile error:', profileError);
      return NextResponse.redirect(new URL('/signup', req.url));
    }
  }

  return NextResponse.redirect(new URL('/signin', req.url));
}
