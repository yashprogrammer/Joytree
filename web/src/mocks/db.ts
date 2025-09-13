import type { Campaign, Company, Employee, GiftOption, Order } from "@/types";

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
  {
    id: "g1",
    campaignId: "camp1",
    title: "Vego Hydrating Sip Bottle",
    imageUrl: "/Products/bottle.webp",
    description:
      "Elevate hydration by making it easier and more stylish with the Vego Sip Bottle. By switching to this reusable bottle, we are helping to reduce single-use plastic waste. Carefully made using safe, BPA-free materials that are tough and long-lasting. Featuring a secure, airtight cap to ensure no spills or leaks. Convenient sip opening; compact and lightweight.",
    type: "physical",
  },
  {
    id: "g2",
    campaignId: "camp1",
    title: "Premium Black Leather Laptop Sleeve Bag",
    imageUrl: "/Products/bag.webp",
    description:
      "Stylish and durable leather laptop sleeve offering superior protection while maintaining a sleek, professional look. Designed to fit most laptop sizes, keeping your device secure and scratch-free on the go.",
    type: "physical",
  },
  {
    id: "g3",
    campaignId: "camp1",
    title: "All-in-One Allure Desk Organizer",
    imageUrl: "/Products/organizer.webp",
    description:
      "Desk organizer with magnetic lamp (touch switch), wireless charger, alarm clock, USB & Type-C hub, mobile stand, and pen holder — a handy, space-saving addition to any workspace.",
    type: "physical",
  },
  {
    id: "g4",
    campaignId: "camp1",
    title: "Silver Rocket Shape Pen Holder",
    imageUrl: "/Products/penHolder.jpg",
    description:
      "Fun and quirky rocket-shaped pen holder crafted from high-quality materials for durability — adds personality to any desk setup.",
    type: "physical",
  },
];

export const employees: Employee[] = [];

export const tokenToEmployeeId = new Map<string, string>();

export const orders: Order[] = [];



