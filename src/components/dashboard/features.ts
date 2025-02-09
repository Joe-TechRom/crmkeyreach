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
  component: React.ComponentType; // Add a component property
}

export interface FeatureCategory {
  category: string;
  items: FeatureItem[];
}

export interface PlanFeatures {
  [plan: string]: FeatureCategory[];
}

// Import your component *here*.  This avoids circular dependencies.
import CreateLeadForm from '@/components/dashboard/features/CreateLeadForm';
import PropertiesView from '@/components/dashboard/features/PropertiesView'; // Example
import ContactsView from '@/components/dashboard/features/ContactsView'; // Example
import AppointmentsView from '@/components/dashboard/features/AppointmentsView';
import TasksView from '@/components/dashboard/features/TasksView';
import EmailIntegrationView from '@/components/dashboard/features/EmailIntegrationView';
import CalendarSyncView from '@/components/dashboard/features/CalendarSyncView';
import NoteTakingView from '@/components/dashboard/features/NoteTakingView';
import CommunicationToolsView from '@/components/dashboard/features/CommunicationToolsView';
import DocumentManagementView from '@/components/dashboard/features/DocumentManagementView';
import BasicReportsView from '@/components/dashboard/features/BasicReportsView';
import SearchAndFilterView from '@/components/dashboard/features/SearchAndFilterView';
import CloudBackupView from '@/components/dashboard/features/CloudBackupView';
import MortgageCalculatorView from '@/components/dashboard/features/MortgageCalculatorView';
import LeadManagementView from '@/components/dashboard/features/LeadManagementView';
import PropertyListingsView from '@/components/dashboard/features/PropertyListingsView';
import AnalyticsDashboardView from '@/components/dashboard/features/AnalyticsDashboardView';
import UserManagementView from '@/components/dashboard/features/UserManagementView';
import RoleAccessControlView from '@/components/dashboard/features/RoleAccessControlView';
import EmailMarketingView from '@/components/dashboard/features/EmailMarketingView';
import PropertyAdsView from '@/components/dashboard/features/PropertyAdsView';
import SocialMediaIntegrationView from '@/components/dashboard/features/SocialMediaIntegrationView';
import TeamDocumentManagementView from '@/components/dashboard/features/TeamDocumentManagementView';
import TeamAnalyticsDashboardView from '@/components/dashboard/features/TeamAnalyticsDashboardView';
import TeamCloudBackupView from '@/components/dashboard/features/TeamCloudBackupView';
import PropertySearchView from '@/components/dashboard/features/PropertySearchView';
import AutomatedAlertsView from '@/components/dashboard/features/AutomatedAlertsView';
import InteractiveMapsView from '@/components/dashboard/features/InteractiveMapsView';
import LeadCaptureFormsView from '@/components/dashboard/features/LeadCaptureFormsView';
import SavedSearchesView from '@/components/dashboard/features/SavedSearchesView';
import AdvancedAnalyticsView from '@/components/dashboard/features/AdvancedAnalyticsView';
import DealPipelinesView from '@/components/dashboard/features/DealPipelinesView';
import CustomerPortalView from '@/components/dashboard/features/CustomerPortalView';
import TeamCollaborationView from '@/components/dashboard/features/TeamCollaborationView';
import ZapierIntegrationView from '@/components/dashboard/features/ZapierIntegrationView';
import DashboardHome from '@/app/dashboard/default/page'; // Import your default dashboard


const singleUserFeatures: FeatureCategory[] = [
  {
    category: 'Core Features',
    items: [
      { name: 'Dashboard', icon: FiHome, path: '/dashboard', component: DashboardHome },
      { name: 'Create Lead', icon: FiPlusCircle, path: '/leads', component: CreateLeadForm },
      { name: 'View Properties', icon: FiGrid, path: '/properties', component: PropertiesView },
      { name: 'Manage Contacts', icon: FiUsers, path: '/contacts', component: ContactsView },
      { name: 'Schedule Appointments', icon: FiCalendar, path: '/appointments', component: AppointmentsView },
      { name: 'Task Management', icon: FiLayers, path: '/tasks', component: TasksView }
    ]
  },
  {
    category: 'Communication',
    items: [
      { name: 'Email Integration', icon: FiMail, path: '/email', component: EmailIntegrationView },
      { name: 'Calendar Sync', icon: FiCalendar, path: '/calendar', component: CalendarSyncView },
      { name: 'Note Taking', icon: FiEdit, path: '/notes', component: NoteTakingView },
      { name: 'Communication Tools', icon: FiMessageSquare, path: '/communication', component: CommunicationToolsView }
    ]
  },
  {
    category: 'Tools',
    items: [
      { name: 'Document Management', icon: FiFile, path: '/documents', component: DocumentManagementView },
      { name: 'Basic Reports', icon: FiBarChart2, path: '/reports', component: BasicReportsView },
      { name: 'Search & Filter', icon: FiSearch, path: '/search', component: SearchAndFilterView },
      { name: 'Cloud Backup', icon: FiCloud, path: '/backup', component: CloudBackupView },
      { name: 'Mortgage Calculator', icon: FiDollarSign, path: '/calculator', component: MortgageCalculatorView },
      { name: 'Lead Management', icon: FiTarget, path: '/leads', component: LeadManagementView }, // Note:  Same path as Create Lead
      { name: 'Property Listings', icon: FiGrid, path: '/listings', component: PropertyListingsView },
      { name: 'Analytics Dashboard', icon: FiBarChart2, path: '/analytics', component: AnalyticsDashboardView }
    ]
  }
];

const teamFeatures: FeatureCategory[] = [
  {
    category: 'Team Features',
    items: [
      { name: 'User Management', icon: FiUsers, path: '/users', component: UserManagementView },
      { name: 'Role Access Control', icon: FiLock, path: '/roles', component: RoleAccessControlView },
      { name: 'Email Marketing', icon: FiMail, path: '/email-marketing', component: EmailMarketingView },
      { name: 'Property Ads', icon: FiActivity, path: '/ads', component: PropertyAdsView },
      { name: 'Social Media Integration', icon: FiGlobe, path: '/social-media', component: SocialMediaIntegrationView }
    ]
  },
  {
    category: 'Communication & Tools',
    items: [
      { name: 'Team Document Management', icon: FiFile, path: '/team/documents', component: TeamDocumentManagementView },
      { name: 'Team Analytics Dashboard', icon: FiBarChart2, path: '/team/analytics', component: TeamAnalyticsDashboardView },
      { name: 'Team Cloud Backup', icon: FiCloud, path: '/team/backup', component: TeamCloudBackupView }
    ]
  }
];

const corporateFeatures: FeatureCategory[] = [
  {
    category: 'Advanced Features',
    items: [
      { name: 'Property Search', icon: FiSearch, path: '/property-search', component: PropertySearchView },
      { name: 'Automated Alerts', icon: FiBell, path: '/alerts', component: AutomatedAlertsView },
      { name: 'Interactive Maps', icon: FiMap, path: '/maps', component: InteractiveMapsView },
      { name: 'Lead Capture Forms', icon: FiEdit, path: '/lead-forms', component: LeadCaptureFormsView },
      { name: 'Saved Searches', icon: FiBookmark, path: '/saved-searches', component: SavedSearchesView }
    ]
  },
  {
    category: 'Enterprise Tools',
    items: [
      { name: 'Advanced Analytics', icon: FiTrendingUp, path: '/advanced-analytics', component: AdvancedAnalyticsView },
      { name: 'Deal Pipelines', icon: FiGitBranch, path: '/pipelines', component: DealPipelinesView },
      { name: 'Customer Portal', icon: FiUsers, path: '/customer-portal', component: CustomerPortalView },
      { name: 'Team Collaboration', icon: FiUsers, path: '/collaboration', component: TeamCollaborationView },
      { name: 'Zapier Integration', icon: FiZap, path: '/zapier', component: ZapierIntegrationView }
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
