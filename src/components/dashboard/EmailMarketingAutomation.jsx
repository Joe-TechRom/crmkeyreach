'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const mockTriggers = [
  { id: 1, name: 'New Lead Created' },
  { id: 2, name: 'Property Viewed' },
  { id: 3, name: 'Client Added' },
];

const mockEmailTemplates = [
    { id: 1, name: 'Welcome Email', content: 'Welcome to our platform!' },
    { id: 2, name: 'Property Alert', content: 'A new property matching your criteria is available!' },
    { id: 3, name: 'Follow Up', content: 'Just checking in to see if you have any questions.' },
];

function EmailMarketingAutomation() {
  const { user } = useUser();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [campaignName, setCampaignName] = useState('');

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('email_marketing_automation', user.tier, features.features)) {
    return null; // Don't render if user doesn't have access
  }

  const handleCreateCampaign = () => {
    if (!selectedTrigger || !selectedTemplate || !campaignName) {
      alert('Please select a trigger, template, and enter a campaign name.');
      return;
    }

    const newCampaign = {
      id: campaigns.length + 1,
      name: campaignName,
      trigger: selectedTrigger,
      template: selectedTemplate,
      status: 'Active',
    };
    setCampaigns([...campaigns, newCampaign]);
    setCampaignName('');
    alert('Campaign created successfully!');
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Email Marketing Automation
      </Text>
      <Input
        type="text"
        placeholder="Campaign Name"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
        mb={2}
      />
        <Select
            placeholder="Select a Trigger"
            onChange={(e) => setSelectedTrigger(mockTriggers.find(t => t.id === parseInt(e.target.value)))}
            mb={2}
        >
            {mockTriggers.map((trigger) => (
                <option key={trigger.id} value={trigger.id}>
                    {trigger.name}
                </option>
            ))}
        </Select>
        <Select
            placeholder="Select an Email Template"
            onChange={(e) => setSelectedTemplate(mockEmailTemplates.find(t => t.id === parseInt(e.target.value)))}
            mb={2}
        >
            {mockEmailTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                    {template.name}
                </option>
            ))}
        </Select>
      <Button onClick={handleCreateCampaign} mb={4}>
        Create Campaign
      </Button>
      {campaigns.length > 0 && (
        <>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Your Campaigns
          </Text>
          <ul>
            {campaigns.map((campaign) => (
              <li key={campaign.id} style={{ marginBottom: '5px' }}>
                <Text>
                  <strong>Name:</strong> {campaign.name}
                </Text>
                <Text>
                  <strong>Trigger:</strong> {campaign.trigger.name}
                </Text>
                <Text>
                  <strong>Template:</strong> {campaign.template.name}
                </Text>
                <Text>
                  <strong>Status:</strong> {campaign.status}
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

export default EmailMarketingAutomation;
