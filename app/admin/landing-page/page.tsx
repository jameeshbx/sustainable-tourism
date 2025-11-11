"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Layout,
  Film,
  List,
  Grid3x3,
} from "lucide-react";
import { AdminNavbar } from "@/components/admin-navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface HeroCard {
  id?: string;
  image: string;
  title: string;
  subtitle?: string;
  navigationLink?: string;
  enabled: boolean;
  order: number;
}

interface ExperienceActivity {
  id?: string;
  name: string;
  enabled: boolean;
  order: number;
}

interface ExperienceCard {
  id?: string;
  title: string;
  image: string;
  isNew: boolean;
  tourCount?: string;
  enabled: boolean;
  order: number;
}

type ExpandedSection = "hero" | "heroCards" | "experiences" | "expActivities" | "expCards" | null;

export default function LandingPageConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>("hero");
  const [config, setConfig] = useState({
    heroBackgroundImage: "",
    heroHeadline: "",
    heroSubtext: "",
    heroCtaText: "",
    heroCtaLink: "",
  });
  const [heroCards, setHeroCards] = useState<HeroCard[]>([]);
  const [editingCard, setEditingCard] = useState<HeroCard | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  
  // Experiences Section State
  const [experiencesConfig, setExperiencesConfig] = useState({
    experiencesTitle: "",
    experiencesSubtitle: "",
    experiencesDescription: "",
    experiencesVideoUrl: "",
    experiencesVideoThumbnail: "",
    experiencesVideoTitle: "",
    experiencesCtaText: "",
    experiencesCtaLink: "",
  });
  const [experienceActivities, setExperienceActivities] = useState<ExperienceActivity[]>([]);
  const [experienceCards, setExperienceCards] = useState<ExperienceCard[]>([]);
  const [editingActivity, setEditingActivity] = useState<ExperienceActivity | null>(null);
  const [editingExpCard, setEditingExpCard] = useState<ExperienceCard | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showExpCardForm, setShowExpCardForm] = useState(false);

  const toggleSection = (section: ExpandedSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      // Fetch Hero section
      const heroResponse = await fetch("/api/landing-page?section=hero");
      if (heroResponse.ok) {
        const heroData = await heroResponse.json();
        setConfig({
          heroBackgroundImage: heroData.heroBackgroundImage || "",
          heroHeadline: heroData.heroHeadline || "",
          heroSubtext: heroData.heroSubtext || "",
          heroCtaText: heroData.heroCtaText || "",
          heroCtaLink: heroData.heroCtaLink || "",
        });
        setHeroCards(
          heroData.heroCards?.map((card: HeroCard) => ({
            ...card,
            enabled: card.enabled !== undefined ? card.enabled : true,
          })) || []
        );
      }
      
      // Fetch Experiences section
      const expResponse = await fetch("/api/landing-page?section=experiences");
      if (expResponse.ok) {
        const expData = await expResponse.json();
        setExperiencesConfig({
          experiencesTitle: expData.experiencesTitle || "",
          experiencesSubtitle: expData.experiencesSubtitle || "",
          experiencesDescription: expData.experiencesDescription || "",
          experiencesVideoUrl: expData.experiencesVideoUrl || "",
          experiencesVideoThumbnail: expData.experiencesVideoThumbnail || "",
          experiencesVideoTitle: expData.experiencesVideoTitle || "",
          experiencesCtaText: expData.experiencesCtaText || "",
          experiencesCtaLink: expData.experiencesCtaLink || "",
        });
        setExperienceActivities(
          expData.experienceActivities?.map((act: ExperienceActivity) => ({
            ...act,
            enabled: act.enabled !== undefined ? act.enabled : true,
          })) || []
        );
        setExperienceCards(
          expData.experienceCards?.map((card: ExperienceCard) => ({
            ...card,
            enabled: card.enabled !== undefined ? card.enabled : true,
            isNew: card.isNew !== undefined ? card.isNew : false,
          })) || []
        );
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/landing-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "hero",
          heroBackgroundImage: config.heroBackgroundImage,
          heroHeadline: config.heroHeadline,
          heroSubtext: config.heroSubtext,
          heroCtaText: config.heroCtaText,
          heroCtaLink: config.heroCtaLink,
          heroCards: heroCards.map((card, index) => ({
            ...card,
            order: card.order !== undefined ? card.order : index,
          })),
        }),
      });

      if (response.ok) {
        alert("Hero section saved successfully!");
        fetchConfig();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save"}`);
      }
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Failed to save hero section");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveExperiences = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/landing-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "experiences",
          experiencesTitle: experiencesConfig.experiencesTitle,
          experiencesSubtitle: experiencesConfig.experiencesSubtitle,
          experiencesDescription: experiencesConfig.experiencesDescription,
          experiencesVideoUrl: experiencesConfig.experiencesVideoUrl,
          experiencesVideoThumbnail: experiencesConfig.experiencesVideoThumbnail,
          experiencesVideoTitle: experiencesConfig.experiencesVideoTitle,
          experiencesCtaText: experiencesConfig.experiencesCtaText,
          experiencesCtaLink: experiencesConfig.experiencesCtaLink,
          experienceActivities: experienceActivities.map((act, index) => ({
            ...act,
            order: act.order !== undefined ? act.order : index,
          })),
          experienceCards: experienceCards.map((card, index) => ({
            ...card,
            order: card.order !== undefined ? card.order : index,
          })),
        }),
      });

      if (response.ok) {
        alert("Experiences section saved successfully!");
        fetchConfig();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save"}`);
      }
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Failed to save experiences section");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCard = () => {
    const newCard: HeroCard = {
      image: "",
      title: "",
      subtitle: "",
      navigationLink: "",
      enabled: true,
      order: heroCards.length,
    };
    setEditingCard(newCard);
    setShowCardForm(true);
  };

  const handleEditCard = (card: HeroCard) => {
    setEditingCard({ ...card });
    setShowCardForm(true);
  };

  const handleSaveCard = () => {
    if (!editingCard) return;

    if (editingCard.id) {
      // Update existing card
      setHeroCards(
        heroCards.map((card) =>
          card.id === editingCard.id ? editingCard : card
        )
      );
    } else {
      // Add new card
      const newCard = {
        ...editingCard,
        id: `temp-${Date.now()}`,
      };
      setHeroCards([...heroCards, newCard]);
    }

    setEditingCard(null);
    setShowCardForm(false);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      setHeroCards(heroCards.filter((card) => card.id !== cardId));
    }
  };

  const handleToggleCardEnabled = (cardId: string) => {
    setHeroCards(
      heroCards.map((card) =>
        card.id === cardId ? { ...card, enabled: !card.enabled } : card
      )
    );
  };

  const handleMoveCard = (index: number, direction: "up" | "down") => {
    const newCards = [...heroCards];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newCards.length) {
      [newCards[index], newCards[newIndex]] = [
        newCards[newIndex],
        newCards[index],
      ];
      newCards[index].order = index;
      newCards[newIndex].order = newIndex;
      setHeroCards(newCards);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavbar
        title="Landing Page Configuration"
        backHref="/admin/dashboard"
        userName="Admin"
      />

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Landing Page Configuration
            </h1>
            <p className="text-gray-600">
              Manage and configure all sections of your landing page. Expand a section to edit its content.
            </p>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-4">
            {/* Hero Section Configuration */}
            <Card className="overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <button
                onClick={() => toggleSection("hero")}
                className="w-full"
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-500 rounded-lg text-white">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          Hero Section
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          Background image, headline, subtext, and CTA button
                        </CardDescription>
                      </div>
                    </div>
                    {expandedSection === "hero" ? (
                      <ChevronDown className="h-6 w-6 text-gray-600" />
                    ) : (
                      <ChevronRight className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
              </button>
              
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  expandedSection === "hero"
                    ? "max-h-[5000px] opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <CardContent className="pt-6 space-y-6 bg-white">
              {/* Background Image */}
              <div className="space-y-2">
                <Label>Hero Background Image</Label>
                <ImageUpload
                  onImageUpload={(url) =>
                    setConfig({ ...config, heroBackgroundImage: url })
                  }
                  currentImageUrl={config.heroBackgroundImage}
                  label="Hero Background Image"
                />
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={config.heroHeadline}
                  onChange={(e) =>
                    setConfig({ ...config, heroHeadline: e.target.value })
                  }
                  placeholder="TRAVEL. EXPERIENCE. EMPOWER LOCAL."
                />
              </div>

              {/* Subtext */}
              <div className="space-y-2">
                <Label htmlFor="subtext">Subtext</Label>
                <Textarea
                  id="subtext"
                  value={config.heroSubtext}
                  onChange={(e) =>
                    setConfig({ ...config, heroSubtext: e.target.value })
                  }
                  placeholder="Discover sustainable adventures..."
                  rows={3}
                />
              </div>

              {/* CTA Text */}
              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Button Text</Label>
                <Input
                  id="ctaText"
                  value={config.heroCtaText}
                  onChange={(e) =>
                    setConfig({ ...config, heroCtaText: e.target.value })
                  }
                  placeholder="Request More"
                />
              </div>

              {/* CTA Link */}
              <div className="space-y-2">
                <Label htmlFor="ctaLink">CTA Button Link</Label>
                <Input
                  id="ctaLink"
                  value={config.heroCtaLink}
                  onChange={(e) =>
                    setConfig({ ...config, heroCtaLink: e.target.value })
                  }
                  placeholder="#contact"
                />
              </div>
                </CardContent>
                <div className="px-6 pb-6 flex justify-end border-t bg-gray-50 pt-4">
                  <Button
                    onClick={handleSaveHero}
                    disabled={saving}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Hero Section"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Hero Cards Configuration */}
            <Card className="overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <button
                onClick={() => toggleSection("heroCards")}
                className="w-full"
              >
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-500 rounded-lg text-white">
                        <Grid3x3 className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          Hero Cards
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          Manage carousel cards for the hero section
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                        {heroCards.length} cards
                      </span>
                      {expandedSection === "heroCards" ? (
                        <ChevronDown className="h-6 w-6 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </button>
              
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  expandedSection === "heroCards"
                    ? "max-h-[5000px] opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <CardContent className="pt-6 bg-white">
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={handleAddCard}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                  </div>
              {heroCards.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No cards added yet. Click &quot;Add Card&quot; to create one.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Order</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Subtitle</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heroCards
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((card, index) => (
                        <TableRow key={card.id || index}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleMoveCard(index, "up")}
                                disabled={index === 0}
                                className="disabled:opacity-50"
                              >
                                <GripVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell>
                            {card.image ? (
                              <Image
                                src={card.image}
                                alt={card.title || "Card image"}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ) : (
                              <span className="text-gray-400">No image</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {card.title || "Untitled"}
                          </TableCell>
                          <TableCell>{card.subtitle || "-"}</TableCell>
                          <TableCell>
                            {card.navigationLink ? (
                              <a
                                href={card.navigationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {card.navigationLink}
                              </a>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                handleToggleCardEnabled(card.id || "")
                              }
                              className={`px-2 py-1 rounded text-xs ${
                                card.enabled
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {card.enabled ? "Enabled" : "Disabled"}
                            </button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCard(card)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteCard(card.id || "")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
                </CardContent>
                <div className="px-6 pb-6 flex justify-end border-t bg-gray-50 pt-4">
                  <Button
                    onClick={handleSaveHero}
                    disabled={saving}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Hero Cards"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Card Form Modal */}
            {showCardForm && editingCard && (
              <Card className="border-2 border-purple-200 shadow-xl">
                <CardHeader>
                  <CardTitle>
                    {editingCard.id ? "Edit Card" : "Add New Card"}
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Card Image</Label>
                  <ImageUpload
                    onImageUpload={(url) =>
                      setEditingCard({ ...editingCard, image: url })
                    }
                    currentImageUrl={editingCard.image}
                    label="Card Image"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardTitle">Title *</Label>
                  <Input
                    id="cardTitle"
                    value={editingCard.title}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, title: e.target.value })
                    }
                    placeholder="Card title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardSubtitle">Subtitle</Label>
                  <Input
                    id="cardSubtitle"
                    value={editingCard.subtitle || ""}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        subtitle: e.target.value,
                      })
                    }
                    placeholder="Card subtitle (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardLink">Navigation Link</Label>
                  <Input
                    id="cardLink"
                    value={editingCard.navigationLink || ""}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        navigationLink: e.target.value,
                      })
                    }
                    placeholder="/destinations or #section (optional)"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="cardEnabled"
                    checked={editingCard.enabled}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        enabled: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="cardEnabled">Enabled</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingCard(null);
                      setShowCardForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCard} disabled={!editingCard.title}>
                    Save Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

            {/* Experiences Section Configuration */}
            <Card className="overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <button
                onClick={() => toggleSection("experiences")}
                className="w-full"
              >
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-orange-500 rounded-lg text-white">
                        <Film className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          Experiences Section
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          Content, video player, and section configuration
                        </CardDescription>
                      </div>
                    </div>
                    {expandedSection === "experiences" ? (
                      <ChevronDown className="h-6 w-6 text-gray-600" />
                    ) : (
                      <ChevronRight className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
              </button>
              
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  expandedSection === "experiences"
                    ? "max-h-[5000px] opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <CardContent className="pt-6 space-y-6 bg-white">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="expTitle">Title</Label>
                <Input
                  id="expTitle"
                  value={experiencesConfig.experiencesTitle}
                  onChange={(e) =>
                    setExperiencesConfig({
                      ...experiencesConfig,
                      experiencesTitle: e.target.value,
                    })
                  }
                  placeholder="Explore Activities"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <Label htmlFor="expSubtitle">Subtitle</Label>
                <Input
                  id="expSubtitle"
                  value={experiencesConfig.experiencesSubtitle}
                  onChange={(e) =>
                    setExperiencesConfig({
                      ...experiencesConfig,
                      experiencesSubtitle: e.target.value,
                    })
                  }
                  placeholder="Experiences the\nGreen Way"
                />
                <p className="text-sm text-gray-500">
                  Use \n for line breaks
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="expDescription">Description</Label>
                <Textarea
                  id="expDescription"
                  value={experiencesConfig.experiencesDescription}
                  onChange={(e) =>
                    setExperiencesConfig({
                      ...experiencesConfig,
                      experiencesDescription: e.target.value,
                    })
                  }
                  placeholder="Step into the wild responsibly..."
                  rows={4}
                />
              </div>

              {/* Video URL */}
              <div className="space-y-2">
                <Label htmlFor="expVideoUrl">Video URL</Label>
                <Input
                  id="expVideoUrl"
                  value={experiencesConfig.experiencesVideoUrl}
                  onChange={(e) =>
                    setExperiencesConfig({
                      ...experiencesConfig,
                      experiencesVideoUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com/video.mp4"
                />
                <p className="text-sm text-gray-500">
                  Direct video URL (MP4, WebM, etc.)
                </p>
              </div>

              {/* Video Thumbnail */}
              <div className="space-y-2">
                <Label>Video Thumbnail</Label>
                <ImageUpload
                  onImageUpload={(url) =>
                    setExperiencesConfig({
                      ...experiencesConfig,
                      experiencesVideoThumbnail: url,
                    })
                  }
                  currentImageUrl={experiencesConfig.experiencesVideoThumbnail}
                  label="Video Thumbnail"
                />
              </div>

              {/* Video Title */}
              <div className="space-y-2">
                <Label htmlFor="expVideoTitle">Video Title</Label>
                <Input
                  id="expVideoTitle"
                  value={experiencesConfig.experiencesVideoTitle}
                  onChange={(e) =>
                    setExperiencesConfig({
                      ...experiencesConfig,
                      experiencesVideoTitle: e.target.value,
                    })
                  }
                  placeholder="Watch Our Video"
                />
              </div>

              {/* CTA Text */}
              <div className="space-y-2">
                <Label htmlFor="expCtaText">CTA Button Text</Label>
                <Input
                  id="expCtaText"
                  value={experiencesConfig.experiencesCtaText}
                  onChange={(e) =>
                    setExperiencesConfig({
                      ...experiencesConfig,
                      experiencesCtaText: e.target.value,
                    })
                  }
                  placeholder="Explore More"
                />
              </div>

              {/* CTA Link */}
              <div className="space-y-2">
                <Label htmlFor="expCtaLink">CTA Button Link</Label>
                <Input
                  id="expCtaLink"
                  value={experiencesConfig.experiencesCtaLink}
                  onChange={(e) =>
                    setExperiencesConfig({
                      ...experiencesConfig,
                      experiencesCtaLink: e.target.value,
                    })
                  }
                  placeholder="/destinations or #section"
                />
              </div>
                </CardContent>
                <div className="px-6 pb-6 flex justify-end border-t bg-gray-50 pt-4">
                  <Button
                    onClick={handleSaveExperiences}
                    disabled={saving}
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Experiences Section"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Experience Activities */}
            <Card className="overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <button
                onClick={() => toggleSection("expActivities")}
                className="w-full"
              >
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-500 rounded-lg text-white">
                        <List className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          Experience Activities
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          Manage activity chips displayed in the experiences section
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                        {experienceActivities.length} activities
                      </span>
                      {expandedSection === "expActivities" ? (
                        <ChevronDown className="h-6 w-6 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </button>
              
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  expandedSection === "expActivities"
                    ? "max-h-[5000px] opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <CardContent className="pt-6 bg-white">
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={() => {
                        setEditingActivity({
                          name: "",
                          enabled: true,
                          order: experienceActivities.length,
                        });
                        setShowActivityForm(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </Button>
                  </div>
              {experienceActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No activities added yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experienceActivities
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((activity, index) => (
                        <TableRow key={activity.id || index}>
                          <TableCell className="font-medium">
                            {activity.name || "Untitled"}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => {
                                setExperienceActivities(
                                  experienceActivities.map((act) =>
                                    act.id === activity.id
                                      ? { ...act, enabled: !act.enabled }
                                      : act
                                  )
                                );
                              }}
                              className={`px-2 py-1 rounded text-xs ${
                                activity.enabled
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {activity.enabled ? "Enabled" : "Disabled"}
                            </button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingActivity(activity);
                                  setShowActivityForm(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to delete this activity?"
                                    )
                                  ) {
                                    setExperienceActivities(
                                      experienceActivities.filter(
                                        (act) => act.id !== activity.id
                                      )
                                    );
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
                </CardContent>
                <div className="px-6 pb-6 flex justify-end border-t bg-gray-50 pt-4">
                  <Button
                    onClick={handleSaveExperiences}
                    disabled={saving}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Activities"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Experience Cards */}
            <Card className="overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <button
                onClick={() => toggleSection("expCards")}
                className="w-full"
              >
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-teal-500 rounded-lg text-white">
                        <Layout className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          Experience Cards
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          Manage cards displayed in the experiences section
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                        {experienceCards.length} cards
                      </span>
                      {expandedSection === "expCards" ? (
                        <ChevronDown className="h-6 w-6 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </button>
              
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  expandedSection === "expCards"
                    ? "max-h-[5000px] opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <CardContent className="pt-6 bg-white">
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={() => {
                        setEditingExpCard({
                          title: "",
                          image: "",
                          isNew: false,
                          tourCount: "",
                          enabled: true,
                          order: experienceCards.length,
                        });
                        setShowExpCardForm(true);
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                  </div>
              {experienceCards.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No cards added yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Tour Count</TableHead>
                      <TableHead>New</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experienceCards
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((card, index) => (
                        <TableRow key={card.id || index}>
                          <TableCell>
                            {card.image ? (
                              <Image
                                src={card.image}
                                alt={card.title || "Card image"}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ) : (
                              <span className="text-gray-400">No image</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {card.title || "Untitled"}
                          </TableCell>
                          <TableCell>{card.tourCount || "-"}</TableCell>
                          <TableCell>
                            {card.isNew ? (
                              <span className="text-green-600">Yes</span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => {
                                setExperienceCards(
                                  experienceCards.map((c) =>
                                    c.id === card.id
                                      ? { ...c, enabled: !c.enabled }
                                      : c
                                  )
                                );
                              }}
                              className={`px-2 py-1 rounded text-xs ${
                                card.enabled
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {card.enabled ? "Enabled" : "Disabled"}
                            </button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingExpCard(card);
                                  setShowExpCardForm(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to delete this card?"
                                    )
                                  ) {
                                    setExperienceCards(
                                      experienceCards.filter(
                                        (c) => c.id !== card.id
                                      )
                                    );
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
                </CardContent>
                <div className="px-6 pb-6 flex justify-end border-t bg-gray-50 pt-4">
                  <Button
                    onClick={handleSaveExperiences}
                    disabled={saving}
                    size="lg"
                    className="bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Experience Cards"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Activity Form Modal */}
            {showActivityForm && editingActivity && (
              <Card className="border-2 border-green-200 shadow-xl">
                <CardHeader>
                  <CardTitle>
                    {editingActivity.id ? "Edit Activity" : "Add New Activity"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activityName">Activity Name *</Label>
                  <Input
                    id="activityName"
                    value={editingActivity.name}
                    onChange={(e) =>
                      setEditingActivity({
                        ...editingActivity,
                        name: e.target.value,
                      })
                    }
                    placeholder="Family Camping"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activityEnabled"
                    checked={editingActivity.enabled}
                    onChange={(e) =>
                      setEditingActivity({
                        ...editingActivity,
                        enabled: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="activityEnabled">Enabled</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingActivity(null);
                      setShowActivityForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (editingActivity.id) {
                        setExperienceActivities(
                          experienceActivities.map((act) =>
                            act.id === editingActivity.id
                              ? editingActivity
                              : act
                          )
                        );
                      } else {
                        setExperienceActivities([
                          ...experienceActivities,
                          {
                            ...editingActivity,
                            id: `temp-${Date.now()}`,
                          },
                        ]);
                      }
                      setEditingActivity(null);
                      setShowActivityForm(false);
                    }}
                    disabled={!editingActivity.name}
                  >
                    Save Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

            {/* Experience Card Form Modal */}
            {showExpCardForm && editingExpCard && (
              <Card className="border-2 border-teal-200 shadow-xl">
                <CardHeader>
                  <CardTitle>
                    {editingExpCard.id ? "Edit Card" : "Add New Card"}
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Card Image</Label>
                  <ImageUpload
                    onImageUpload={(url) =>
                      setEditingExpCard({ ...editingExpCard, image: url })
                    }
                    currentImageUrl={editingExpCard.image}
                    label="Card Image"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expCardTitle">Title *</Label>
                  <Input
                    id="expCardTitle"
                    value={editingExpCard.title}
                    onChange={(e) =>
                      setEditingExpCard({
                        ...editingExpCard,
                        title: e.target.value,
                      })
                    }
                    placeholder="Kayaking"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expCardTourCount">Tour Count</Label>
                  <Input
                    id="expCardTourCount"
                    value={editingExpCard.tourCount || ""}
                    onChange={(e) =>
                      setEditingExpCard({
                        ...editingExpCard,
                        tourCount: e.target.value,
                      })
                    }
                    placeholder="3 Tours"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="expCardIsNew"
                    checked={editingExpCard.isNew}
                    onChange={(e) =>
                      setEditingExpCard({
                        ...editingExpCard,
                        isNew: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="expCardIsNew">Mark as New</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="expCardEnabled"
                    checked={editingExpCard.enabled}
                    onChange={(e) =>
                      setEditingExpCard({
                        ...editingExpCard,
                        enabled: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="expCardEnabled">Enabled</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingExpCard(null);
                      setShowExpCardForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (editingExpCard.id) {
                        setExperienceCards(
                          experienceCards.map((card) =>
                            card.id === editingExpCard.id
                              ? editingExpCard
                              : card
                          )
                        );
                      } else {
                        setExperienceCards([
                          ...experienceCards,
                          {
                            ...editingExpCard,
                            id: `temp-${Date.now()}`,
                          },
                        ]);
                      }
                      setEditingExpCard(null);
                      setShowExpCardForm(false);
                    }}
                    disabled={!editingExpCard.title}
                  >
                    Save Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          </div>
        </div>
      </main>
    </div>
  );
}

