import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    if (!user) {
      console.warn('No user found in session.');
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }

    console.log('Current user ID:', user.id);

    // Get subscription status from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error getting profile:', profileError);
      throw profileError;
    }

    if (!profile) {
      console.warn('No profile found for user ID:', user.id);
      return NextResponse.json({ error: 'No profile found' }, { status: 404 });
    }

    console.log('Subscription status for user', user.id, ':', profile.subscription_status);

    return NextResponse.json({
      status: profile.subscription_status,
      userId: user.id,
    });
  } catch (error) {
    console.error('Failed to check subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}
