'use client';

import { useState } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { hasFeatureAccess } from '@/lib/utils/features';
import features from '@/lib/data/features.json';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Text } from '@chakra-ui/react';

const mockBrandingSettings = {
  logo: '/logo.png', // Path to a default logo
  primaryColor: '#007bff', // Default primary color
  secondaryColor: '#6c757d', // Default secondary color
  fontFamily: 'Arial', // Default font family
};

function CorporateBranding() {
  const { user } = useUser();
  const [brandingSettings, setBrandingSettings] = useState(mockBrandingSettings);
  const [newLogo, setNewLogo] = useState(null);
  const [newPrimaryColor, setNewPrimaryColor] = useState(brandingSettings.primaryColor);
  const [newSecondaryColor, setNewSecondaryColor] = useState(brandingSettings.secondaryColor);
  const [newFontFamily, setNewFontFamily] = useState(brandingSettings.fontFamily);

  if (!user) {
    return null; // Don't render if user is not available
  }

  if (!hasFeatureAccess('corporate_branding', user.tier, features.features) || user.role !== 'admin') {
    return null; // Don't render if user doesn't have access or is not an admin
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setNewLogo(file);
  };

  const handlePrimaryColorChange = (e) => {
    setNewPrimaryColor(e.target.value);
  };

  const handleSecondaryColorChange = (e) => {
    setNewSecondaryColor(e.target.value);
  };

  const handleFontFamilyChange = (e) => {
    setNewFontFamily(e.target.value);
  };

  const handleSaveBranding = () => {
    // Implement logic to save branding settings
    const updatedBrandingSettings = {
      logo: newLogo ? URL.createObjectURL(newLogo) : brandingSettings.logo,
      primaryColor: newPrimaryColor,
      secondaryColor: newSecondaryColor,
      fontFamily: newFontFamily,
    };
    setBrandingSettings(updatedBrandingSettings);
    console.log('Branding settings saved:', updatedBrandingSettings);
  };

  return (
    <Card>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Corporate Branding
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Customize Your Brand
      </Text>
      <Text mb={2}>
        <strong>Current Logo:</strong>
      </Text>
      <img src={brandingSettings.logo} alt="Current Logo" style={{ maxWidth: '100px', marginBottom: '10px' }} />
      <Input type="file" accept="image/*" onChange={handleLogoChange} mb={2} />
      <Text mb={2}>
        <strong>Primary Color:</strong>
      </Text>
      <Input type="color" value={newPrimaryColor} onChange={handlePrimaryColorChange} mb={2} />
      <Text mb={2}>
        <strong>Secondary Color:</strong>
      </Text>
      <Input type="color" value={newSecondaryColor} onChange={handleSecondaryColorChange} mb={2} />
      <Text mb={2}>
        <strong>Font Family:</strong>
      </Text>
      <select value={newFontFamily} onChange={handleFontFamilyChange} mb={2}>
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </select>
      <Button onClick={handleSaveBranding} mb={4}>
        Save Branding
      </Button>
    </Card>
  );
}

export default CorporateBranding;
