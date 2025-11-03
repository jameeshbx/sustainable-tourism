"use client";

import { ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  image?: string;
  excerpt?: string;
  link?: string;
}

interface BlogSectionProps {
  title?: string;
  description?: string;
  featuredPost?: BlogPost;
  secondaryPost?: BlogPost;
  sidebarPosts?: BlogPost[];
}

function ReadMore({
  onClick,
  small = false,
}: {
  onClick?: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 text-green-700 hover:text-green-800 ${
        small ? "text-sm" : "text-base"
      } font-medium`}
    >
      Read More
      <span className="inline-flex items-center justify-center rounded-full border border-green-700/50 p-1 group-hover:bg-green-100">
        <ArrowRight className={small ? "h-3 w-3" : "h-4 w-4"} />
      </span>
    </button>
  );
}

function OverlayCard({
  title,
  onClick,
  className = "",
}: {
  title: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`bg-white/95 backdrop-blur-sm shadow-sm border border-black/10 p-6 sm:p-7 max-w-[36rem] ${className}`}
    >
      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black">
        {title}
      </h3>
      <div className="mt-4">
        <ReadMore onClick={onClick} />
      </div>
    </div>
  );
}

export function BlogSection({
  title = "FROM THE GREEN TRAILS",
  description = "Dive into stories of responsible travel across Kerala — from lush Western Ghats trekking escapes to the voices of communities preserving biodiversity and culture. Discover real journeys that make a positive impact.",
  featuredPost = {
    id: "1",
    title: "Silent Valley — Deep in the Heart of the Western Ghats",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
    link: "#silent-valley",
  },
  secondaryPost = {
    id: "5",
    title: "Casting in the Reno Tahoe Wilderness",
    image:
      "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    link: "#reno-tahoe",
  },
  sidebarPosts = [
    {
      id: "2",
      title: "A Solo Trekker’s Guide to Meesapulimala",
      link: "#meesapulimala",
    },
    {
      id: "3",
      title: "Running Through the Hills: Munnar Trail Adventures",
      link: "#munnar-trails",
    },
    { id: "4", title: "Wayanad’s Rainforest", link: "#wayanad-rainforest" },
  ],
}: BlogSectionProps) {
  const goTo = (href?: string) => {
    if (!href) return;
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="blog" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row: title on left, description on right */}
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:items-end">
          <h2 className="lg:col-span-7 text-3xl sm:text-5xl font-extrabold tracking-tight leading-none text-black">
            {title}
          </h2>
          <p className="lg:col-span-5 text-sm sm:text-[13px] leading-5 text-black/70 lg:max-w-[36ch]">
            {description}
          </p>
        </div>

        {/* Featured image with overlay */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-12 relative">
            <div className="relative overflow-hidden">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="h-[380px] w-full object-cover sm:h-[460px]"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0">
              <div className="pointer-events-auto px-4 sm:px-6 lg:px-8 pb-4">
                <OverlayCard
                  title={featuredPost.title}
                  onClick={() => goTo(featuredPost.link)}
                  className="ml-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Secondary image card */}
          <div className="lg:col-span-7 relative">
            <div className="relative overflow-hidden">
              <img
                src={secondaryPost.image}
                alt={secondaryPost.title}
                className="h-[340px] w-full object-cover"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 lg:px-8 pb-4">
              <OverlayCard
                title={secondaryPost.title}
                onClick={() => goTo(secondaryPost.link)}
              />
            </div>
          </div>

          {/* Sidebar list with dividers */}
          <div className="lg:col-span-5">
            <div className="divide-y divide-black/10 border-t border-b border-black/10">
              {sidebarPosts.map((post) => (
                <div key={post.id} className="py-6">
                  <button
                    type="button"
                    className="text-left"
                    onClick={() => goTo(post.link)}
                  >
                    <h4 className="text-xl font-extrabold text-black leading-snug">
                      {post.title}
                    </h4>
                  </button>
                  <div className="mt-3">
                    <ReadMore small onClick={() => goTo(post.link)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
