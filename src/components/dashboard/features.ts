import {
  FiHome, FiUsers, FiSettings, FiPlusCircle,
  FiCalendar, FiMail, FiFile, FiBarChart2, FiSearch, FiCloud,
  FiDollarSign, FiMessageSquare, FiGrid, FiActivity, FiLayers,
  FiBookmark, FiGlobe, FiTarget, FiMap, FiEdit, FiZap, FiBell,
  FiVideo, FiCpu, FiCreditCard, FiTrendingUp, FiGitBranch, FiLock
} from 'react-icons/fi';

export interface FeatureItem {
  name: string;
  icon: React.ComponentType;
  path: string;
}

export interface FeatureCategory {
  category: string;
  items: FeatureItem[];
}

export interface PlanFeatures {
  [plan: string]: FeatureCategory[];
}

const singleUserFeatures: FeatureCategory[] = [
  {
    category: 'Core Features',
    items: [
      { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
      { name: 'Create Lead', icon: FiPlusCircle, path: '/leads/create' },
      { name: 'View Properties', icon: FiGrid, path: '/properties' },
      { name: 'Manage Contacts', icon: FiUsers, path: '/contacts' },
      { name: 'Schedule Appointments', icon: FiCalendar, path: '/appointments' },
      { name: 'Task Management', icon: FiLayers, path: '/tasks' }
    ]
  },
  {
    category: 'Communication',
    items: [
      { name: 'Email Integration', icon: FiMail, path: '/email' },
      { name: 'Calendar Sync', icon: FiCalendar, path: '/calendar' },
      { name: 'Note Taking', icon: FiEdit, path: '/notes' },
      { name: 'Communication Tools', icon: FiMessageSquare, path: '/communication' }
    ]
  },
  {
    category: 'Tools',
    items: [
      { name: 'Document Management', icon: FiFile, path: '/documents' },
      { name: 'Basic Reports', icon: FiBarChart2, path: '/reports' },
      { name: 'Search & Filter', icon: FiSearch, path: '/search' },
      { name: 'Cloud Backup', icon: FiCloud, path: '/backup' },
      { name: 'Mortgage Calculator', icon: FiDollarSign, path: '/calculator' },
      { name: 'Lead Management', icon: FiTarget, path: '/leads' },
      { name: 'Property Listings', icon: FiGrid, path: '/listings' },
      { name: 'Analytics Dashboard', icon: FiBarChart2, path: '/analytics' }
    ]
  }
];

const teamFeatures: FeatureCategory[] = [
  {
    category: 'Team Features',
    items: [
      { name: 'User Management', icon: FiUsers, path: '/users' },
      { name: 'Role Access Control', icon: FiLock, path: '/roles' },
      { name: 'Email Marketing', icon: FiMail, path: '/email-marketing' },
      { name: 'Property Ads', icon: FiActivity, path: '/ads' },
      { name: 'Social Media Integration', icon: FiGlobe, path: '/social-media' }
    ]
  },
  {
    category: 'Communication & Tools',
    items: [
      { name: 'Team Document Management', icon: FiFile, path: '/team/documents' },
      { name: 'Team Analytics Dashboard', icon: FiBarChart2, path: '/team/analytics' },
      { name: 'Team Cloud Backup', icon: FiCloud, path: '/team/backup' }
    ]
  }
];

const corporateFeatures: FeatureCategory[] = [
  {
    category: 'Advanced Features',
    items: [
      { name: 'Property Search', icon: FiSearch, path: '/property-search' },
      { name: 'Automated Alerts', icon: FiBell, path: '/alerts' },
      { name: 'Interactive Maps', icon: FiMap, path: '/maps' },
      { name: 'Lead Capture Forms', icon: FiEdit, path: '/lead-forms' },
      { name: 'Saved Searches', icon: FiBookmark, path: '/saved-searches' }
    ]
  },
  {
    category: 'Enterprise Tools',
    items: [
      { name: 'Advanced Analytics', icon: FiTrendingUp, path: '/advanced-analytics' },
      { name: 'Deal Pipelines', icon: FiGitBranch, path: '/pipelines' },
      { name: 'Customer Portal', icon: FiUsers, path: '/customer-portal' },
      { name: 'Team Collaboration', icon: FiUsers, path: '/collaboration' },
      { name: 'Zapier Integration', icon: FiZap, path: '/zapier' }
    ]
  }
];

// Helper function to prevent duplicate categories
function mergeFeatures(baseFeatures: FeatureCategory[], additionalFeatures: FeatureCategory[]): FeatureCategory[] {
  const baseCategoryNames = baseFeatures.map(cat => cat.category);
  const newFeatures = additionalFeatures.filter(cat => !baseCategoryNames.includes(cat.category));
  return [...baseFeatures, ...newFeatures];
}

export const PLAN_FEATURES: PlanFeatures = {
  'single-user': singleUserFeatures,
  'team': mergeFeatures(singleUserFeatures, teamFeatures),
  'corporate': mergeFeatures(mergeFeatures(singleUserFeatures, teamFeatures), corporateFeatures)
};
