import { existsSync } from "node:fs";
import { join } from "node:path";
import { getHomepage, sitePhotoSrc } from "./index";

/** getHomepage for server components: switches the hero to the Warehouse 17 photograph once the file exists in /public. */
export const getHomepageWithAssets = () => getHomepage({ sitePhoto: existsSync(join(process.cwd(), "public", sitePhotoSrc)) });
