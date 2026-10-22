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

/**
 * The hero shows the Warehouse 17 site photograph as soon as the file is in /public (client round 5); until
 * then it keeps the illustrative render. `sitePhoto` tells the hero which one it is showing, so the label and
 * the reticle never claim the render is the site. The file check itself lives in `lib/content/server.ts`
 * (this module is also imported by client components, so it cannot touch `node:fs`).
 */
const getHero = (sitePhoto: boolean) => {
  const { photo, ...hero } = home.hero;
  return {
    ...hero,
    sitePhoto,
    siteLabel: sitePhoto ? photo.label : "Site",
    video: sitePhoto ? { ...hero.video, poster: photo.src, alt: photo.alt } : hero.video,
  };
};

export const getHomepage = ({ sitePhoto = false }: { sitePhoto?: boolean } = {}) => ({
  hero: getHero(sitePhoto),
  scale: home.scale,
  zones: home.zones,
  milestones: home.milestones,
  statusLastUpdated: home.statusLastUpdated,
  leasing: home.leasing,
  constra: home.constra,
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

/** The path of the Warehouse 17 photograph, for the server-side existence check. */
export const sitePhotoSrc = home.hero.photo.src;
