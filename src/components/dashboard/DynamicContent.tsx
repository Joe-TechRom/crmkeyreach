'use client';

import React from 'react';
import { useView } from './Sidebar';
import { PLAN_FEATURES } from './features';

export function DynamicContent() {
  const { currentView } = useView();

  // Find the component to render based on currentView
  const findComponentForPath = (path: string) => {
    for (const planType in PLAN_FEATURES) {
      for (const category of PLAN_FEATURES[planType]) {
        const item = category.items.find(item => item.path === path);
        if (item) {
          return item.component;
        }
      }
    }
    return null;
  };

  const ComponentToRender = findComponentForPath(currentView);

  return ComponentToRender ? <ComponentToRender /> : null;
}
