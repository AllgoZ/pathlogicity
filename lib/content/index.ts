/**
 * Single swap point for the CMS. Components never import /content directly —
 * replace these getters with CMS queries later without touching the UI.
 */
import * as home from "@/content/home";

export const getSettings = () => home.settings;
export const getNavigation = () => home.navigation;

export const getHomepage = () => ({
  hero: home.hero,
  scale: home.scale,
  zones: home.zones,
  milestones: home.milestones,
  statusLastUpdated: home.statusLastUpdated,
  pathGroup: home.pathGroup,
  glance: home.glance,
  destinations: home.destinations,
  gatiShakti: home.gatiShakti,
  sustainability: home.sustainability,
  benefits: home.benefits,
  siteTour: home.siteTour,
  news: home.news,
});

export const getEnquiry = () => home.enquiry;

export type Homepage = ReturnType<typeof getHomepage>;
