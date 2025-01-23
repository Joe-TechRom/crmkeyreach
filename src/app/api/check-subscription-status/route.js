import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;

    // Get subscription status from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('user_id', user.id)
      .single();

    if (profileError) throw profileError;

    return NextResponse.json({
      status: profile.subscription_status,
      userId: user.id
    });

  } catch (error) {
    console.error('Failed to check subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}
