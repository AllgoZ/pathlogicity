import type { Metadata } from "next";
import { getBlogs } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";
import { BlogsIndex } from "@/components/blogs/BlogsIndex";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Insights and stories on logistics infrastructure from Path Logicity.",
};

export default function BlogsPage() {
  return (
    <div data-inner>
      <PageHero kicker="Blogs" lines={["Stories from", "*Path Logicity*"]} intro="Insights and stories on logistics infrastructure." />
      <BlogsIndex posts={getBlogs()} />
    </div>
  );
}
