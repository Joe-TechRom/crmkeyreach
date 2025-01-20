export function getDashboardRoute(user) {
  if (!user) {
    return '/auth/signin';
  }

  switch (user.tier) {
    case 'single-user':
      return '/dashboard/single-user';
    case 'team':
      return '/dashboard/team';
    case 'corporate':
      return '/dashboard/corporate';
    default:
      return '/dashboard/single-user';
  }
}

export function redirectDashboard(user, router) {
  const route = getDashboardRoute(user);
  router.push(route);
}
