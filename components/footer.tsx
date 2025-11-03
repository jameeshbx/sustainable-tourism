"use client";

import { Button } from "@/components/ui/button";
import {
  Mountain,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Send,
} from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: string;
  sections?: FooterSection[];
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  copyright?: string;
  address?: string;
  newsletterText?: string;
}

export function Footer({
  logo = "trekking miles",
  sections = [
    {
      title: "Information",
      links: [
        { label: "Sustainable", href: "#sustainable" },
        { label: "Kayaking", href: "#kayaking" },
        { label: "Activities", href: "#activities" },
        { label: "Camping", href: "#camping" },
        { label: "Blog", href: "#blog" },
        { label: "Contacts", href: "#contact" },
      ],
    },
    {
      title: "Menu",
      links: [
        { label: "For Corporate", href: "#corporate" },
        { label: "Trekking", href: "#trekking" },
        { label: "Cultural Exploration", href: "#cultural" },
      ],
    },
  ],
  contactInfo = {
    phone: "+91 98765 43210",
    email: "info@trekkingmiles.com",
  },
  socialLinks = {
    facebook: "#",
    instagram: "#",
    twitter: "#",
  },
  copyright = "© 2025 Trekking Miles. All rights reserved.",
  address = "First Floor, Kerala Startup Mission, Kinfra Rd, HMT Colony, North Kalamassery, Kalamassery, Kochi, Kerala 683503",
  newsletterText = "",
}: FooterProps) {
  return (
    <footer className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12">
          <div className="bg-white rounded-3xl shadow-2xl px-6 sm:px-8 lg:px-12 py-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Logo */}
              <div className="md:col-span-4 flex md:block items-center">
                <div className="flex items-center space-x-3">
                  <Mountain className="h-12 w-12 text-green-700" />
                  <div>
                    <div className="text-2xl font-extrabold text-gray-900">
                      {logo}
                    </div>
                    <div className="text-xs text-gray-500">
                      a sustainable tourism initiative
                    </div>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="md:col-span-5 grid grid-cols-2 gap-8">
                {sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="text-gray-800 hover:text-black"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="md:col-span-3">
                <Button className="w-full md:w-auto bg-black text-white hover:bg-gray-800 rounded-xl px-6 mb-4">
                  Request a call
                </Button>
                <div className="space-y-2 text-sm text-gray-800">
                  <p>{contactInfo.phone}</p>
                  <p>{contactInfo.email}</p>
                </div>
              </div>
            </div>

            {/* Footer bottom line */}
            <div className="mt-10 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <a
                    aria-label="telegram"
                    href={socialLinks.facebook}
                    className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center"
                  >
                    <Send className="h-5 w-5" />
                  </a>
                  <a
                    aria-label="whatsapp"
                    href={socialLinks.instagram}
                    className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>
                <div className="text-center text-sm text-gray-700 flex-1">
                  <p>{address}</p>
                </div>
                <div className="hidden sm:flex gap-4 text-gray-400">
                  <a
                    href={socialLinks.facebook}
                    className="hover:text-gray-600"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href={socialLinks.instagram}
                    className="hover:text-gray-600"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href={socialLinks.twitter} className="hover:text-gray-600">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-4">
                {copyright}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
