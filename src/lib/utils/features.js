// src/lib/utils/features.js
function hasFeatureAccess(featureName, userTier, features) {
  if (!features || typeof features !== 'object') {
    console.warn("features.json is missing or invalid.");
    return false;
  }

  if (!featureName || typeof featureName !== 'string') {
    console.warn("Invalid feature name provided.");
    return false;
  }

  if (!userTier || typeof userTier !== 'string') {
    console.warn("Invalid user tier provided.");
    return false;
  }

  const feature = features[featureName];

  if (!feature) {
    console.warn(`Feature "${featureName}" not found in features.json.`);
    return false;
  }

  if (!feature.tiers || !Array.isArray(feature.tiers)) {
      console.warn(`Feature "${featureName}" has invalid tiers definition.`);
      return false;
  }

  return feature.tiers.includes(userTier);
}

export { hasFeatureAccess };
