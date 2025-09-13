import type { Address, Campaign, Company, Employee, GiftOption, Order } from "@/types";

export const companies: Company[] = [
  { id: "c1", name: "Joytree", slug: "joytree" },
];

export const campaigns: Campaign[] = [
  {
    id: "camp1",
    slug: "diwali-2025",
    title: "Diwali 2025 Gifting",
    companyId: "c1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

export const gifts: GiftOption[] = [
  { id: "g1", campaignId: "camp1", title: "Chocolate Hamper", imageUrl: "/file.svg", type: "physical" },
  { id: "g2", campaignId: "camp1", title: "Coffee Mug", imageUrl: "/file.svg", type: "physical" },
  { id: "g3", campaignId: "camp1", title: "Amazon Gift Card", imageUrl: "/file.svg", type: "digital" },
  { id: "g4", campaignId: "camp1", title: "Spotify 3-month", imageUrl: "/file.svg", type: "digital" },
];

export const employees: Employee[] = [];

export const tokenToEmployeeId = new Map<string, string>();

export const orders: Order[] = [];



