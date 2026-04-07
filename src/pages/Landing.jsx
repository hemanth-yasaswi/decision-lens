import React from 'react';
import { Hero } from '../components/Hero';
import { FeatureGrid } from '../components/FeatureGrid';
import { Stats } from '../components/Stats';
import { CTA } from '../components/CTA';

export function Landing() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <Stats />
      <CTA />
    </>
  );
}
