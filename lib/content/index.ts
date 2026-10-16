/**
 * Single swap point for the CMS. Components never import /content directly —
 * replace these getters with CMS queries later without touching the UI.
 */
import * as home from "@/content/home";

export const getSettings = () => home.settings;
export const getNavigation = () => home.navigation;
export const getPartners = () => home.partners;

/** "+91 98998 80388" → "tel:+919899880388" */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const getHomepage = () => ({
  hero: home.hero,
  scale: home.scale,
  zones: home.zones,
  milestones: home.milestones,
  statusLastUpdated: home.statusLastUpdated,
  pathGroup: home.pathGroup,
  renders: home.renders,
  glance: home.glance,
  amenities: home.amenities,
  destinations: home.destinations,
  gatiShakti: home.gatiShakti,
  sustainability: home.sustainability,
  benefits: home.benefits,
  siteTour: home.siteTour,
  news: home.news,
});

export const getEnquiry = () => home.enquiry;
export const getBlogs = () => home.blogs;

export type Homepage = ReturnType<typeof getHomepage>;
