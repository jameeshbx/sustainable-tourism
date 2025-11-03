"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CraftStory {
  id: string;
  title: string;
  image: string;
  description?: string;
  link?: string;
}

interface CraftStoriesProps {
  stories?: CraftStory[];
}

export function CraftStories({
  stories = [
    {
      id: "1",
      title: "Craft Stories of 2025",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description:
        "Discover the inspiring stories behind our local artisans and their traditional crafts.",
      link: "#craft-stories",
    },
    {
      id: "2",
      title: "Meet the Makers of TM",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description:
        "Get to know the talented craftspeople who create the beautiful products you love.",
      link: "#makers",
    },
  ],
}: CraftStoriesProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="overflow-hidden hover:shadow-xl transition-shadow group p-0 rounded-none"
            >
              <div className="relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-120 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                      {story.title}
                    </h3>
                    <Button
                      className="bg-white text-gray-900 hover:bg-gray-100"
                      onClick={() => {
                        const element = document.querySelector(
                          story.link || "#"
                        );
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
