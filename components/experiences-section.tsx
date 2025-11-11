"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { CustomVideoPlayer } from "@/components/custom-video-player";

// Stable defaults to avoid re-creating arrays across renders
const DEFAULT_ACTIVITIES: Activity[] = [
  { id: "1", name: "Family Camping" },
  { id: "2", name: "Wild Camping" },
  { id: "3", name: "Fishing" },
  { id: "4", name: "Mountain Biking" },
  { id: "5", name: "Luxury Cabin" },
  { id: "6", name: "Couple Camping" },
];

const DEFAULT_ACTIVITY_CARDS: ActivityCard[] = [
  {
    id: "1",
    title: "Kayaking",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    isNew: true,
  },
  {
    id: "2",
    title: "Fishing",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    isNew: true,
  },
  {
    id: "3",
    title: "Farm Visit",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    isNew: true,
  },
  {
    id: "4",
    title: "Cultural Exploration",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    isNew: true,
  },
];

const VIDEO_IDS = ["Scxs7L0vhZ4", "ysz5S6PUM-U", "dQw4w9WgXcQ", "aqz-KE-bpKQ"];
const CHIP_OFFSETS = [-8, 6, -4, 9, 5, -7, 3, -2];
const getDeterministicOffset = (index: number) =>
  CHIP_OFFSETS[index % CHIP_OFFSETS.length];

interface Activity {
  id: string;
  name: string;
}

interface ActivityCard {
  id: string;
  title: string;
  image: string;
  isNew?: boolean;
}

interface ExperiencesSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  videoThumbnail?: string;
  videoTitle?: string;
  activities?: Activity[];
  activityCards?: ActivityCard[];
}

export function ExperiencesSection({
  title = "Explore Activities",
  subtitle = "Experiences the Green Way",
  description = "Step into the wild responsibly. From trekking and camping in the Western Ghats to kayaking, fishing, shikara rides, farm visits, Cultural Exploration and village tours, our curated experiences let you explore Kerala's hidden beauty while caring for the planet. Every activity follows our Eco Escapes Promise — respect nature, support locals, and reduce your footprint.",
  videoThumbnail = "https://images.unsplash.com/photo-1549887534-1541e9323be1?q=80&w=1480&auto=format&fit=crop",
  videoTitle = "Watch Our Video",
  activities = DEFAULT_ACTIVITIES,
  activityCards = DEFAULT_ACTIVITY_CARDS,
}: ExperiencesSectionProps) {
  const [config, setConfig] = useState<{
    experiencesTitle?: string;
    experiencesSubtitle?: string;
    experiencesDescription?: string;
    experiencesVideoUrl?: string;
    experiencesVideoThumbnail?: string;
    experiencesVideoTitle?: string;
    experiencesCtaText?: string;
    experiencesCtaLink?: string;
    experienceActivities?: Array<{ id: string; name: string }>;
    experienceCards?: Array<{
      id: string;
      title: string;
      image: string;
      isNew?: boolean;
      tourCount?: string;
    }>;
  } | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/landing-page?section=experiences");
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        }
      } catch (error) {
        console.error("Error fetching experiences config:", error);
      }
    };

    fetchConfig();
  }, []);

  // Use config data if available, otherwise use props
  const finalTitle = config?.experiencesTitle || title;
  const finalSubtitle = config?.experiencesSubtitle || subtitle;
  const finalDescription = config?.experiencesDescription || description;
  const finalVideoUrl = config?.experiencesVideoUrl;
  const finalVideoThumbnail = config?.experiencesVideoThumbnail || videoThumbnail;
  const finalVideoTitle = config?.experiencesVideoTitle || videoTitle;
  const finalCtaText = config?.experiencesCtaText || "Explore More";
  const finalCtaLink = config?.experiencesCtaLink || "#";
  const finalActivities = config?.experienceActivities || activities;
  const finalActivityCards = config?.experienceCards || activityCards;

  const leftActivities = useMemo(
    () => finalActivities.filter((_, i) => i % 2 === 0),
    [finalActivities]
  );
  const rightActivities = useMemo(
    () => finalActivities.filter((_, i) => i % 2 === 1),
    [finalActivities]
  );

  return (
    <section id="what-we-do" className="py-20 bg-white text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy + chips */}
          <div className="space-y-6">
            <div>
              <p className="text-[#F7921E] font-pecita tracking-wide text-[28px] leading-none">
                {finalTitle}
              </p>
              <h2 className="mt-3 text-black text-4xl sm:text-5xl font-extrabold leading-tight">
                {finalSubtitle.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < finalSubtitle.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </h2>
            </div>
            <p className="text-gray-300 max-w-xl">{finalDescription}</p>

            <div className="relative">
              {/* fuzzy shadow cluster */}
              <div className="pointer-events-none absolute inset-0 -z-[1] blur-xl opacity-80">
                <div className="w-full h-full rounded-3xl bg-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.6)]" />
              </div>

              {/* slightly scattered activity chips */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
                <div className="flex flex-col gap-3 -rotate-6">
                  {leftActivities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="inline-flex w-fit self-start items-center gap-2 rounded-xl bg-white text-gray-900 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.6)] border border-black/10"
                      style={{
                        transform: `translateX(${getDeterministicOffset(
                          index
                        )}px)`,
                      }}
                    >
                      <span className="text-[#FF9F1C]">
                        <CheckCircle2 className="h-5 w-5" />
                      </span>
                      <span className="font-medium">{activity.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 rotate-6 translate-y-6">
                  {rightActivities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="inline-flex w-fit self-start items-center gap-2 rounded-xl bg-white text-gray-900 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.6)] border border-black/10"
                      style={{
                        transform: `translateX(${getDeterministicOffset(
                          index + 1
                        )}px)`,
                      }}
                    >
                      <span className="text-[#FF9F1C]">
                        <CheckCircle2 className="h-5 w-5" />
                      </span>
                      <span className="font-medium">{activity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right video spotlight */}
          <div className="relative">
            <div className="relative overflow-hidden h-[480px] bg-transparent rounded-t-[160px]">
              {finalVideoUrl ? (
                <CustomVideoPlayer
                  videoUrl={finalVideoUrl}
                  thumbnail={finalVideoThumbnail}
                  title={finalVideoTitle}
                  className="w-full h-full rounded-t-[160px]"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={finalVideoThumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  {finalVideoTitle && (
                    <div className="absolute bottom-8 left-10 flex items-center gap-3">
                      <div>
                        <p className="text-[#FFC043] italic">New</p>
                        <p className="font-semibold text-white">
                          {finalVideoTitle}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cards */}
        {finalActivityCards.length > 0 && (
          <div className="mt-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {finalActivityCards.map((card) => (
                <Card
                  key={card.id}
                  className="overflow-hidden bg-transparent border-0 shadow-none"
                >
                  <div className="group relative aspect-[3/4] rounded-xl overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {card.tourCount && (
                      <div className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wide">
                        <span className="bg-[#FF8C2E] text-white px-2 py-1 rounded-md">
                          {card.tourCount}
                        </span>
                      </div>
                    )}
                    {card.isNew && (
                      <div className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide">
                        <span className="bg-[#FF8C2E] text-white px-2 py-1 rounded-md">
                          NEW
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 text-left">
                      <p className="text-white/80 text-sm">Experience</p>
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {finalCtaText && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="secondary"
                  className="bg-black text-white text-lg py-5 px-8 md:py-6 md:px-10 hover:bg-black/80"
                  onClick={() => {
                    if (finalCtaLink.startsWith("#")) {
                      const element = document.querySelector(finalCtaLink);
                      element?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.location.href = finalCtaLink;
                    }
                  }}
                >
                  {finalCtaText}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
