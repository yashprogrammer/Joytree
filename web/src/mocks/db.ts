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
    title: "Wooden Perpetual Calendar with Clock",
    imageUrl: "/Products/Calander/2.jpg",
    description:
      "Enhance your home or office decor with our Wooden Perpetual Calendar with Clock. This elegant and functional piece combines the timeless beauty of wood with the convenience of a perpetual calendar and a built-in clock.",
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
    title: "Printed Customised Floral Copper Bottle",
    imageUrl: "/Products/Water bottle/2.jpg",
    description:
      "The Printed Customized Floral Copper Bottle is a beautiful and personalized way to enjoy the benefits of copper-infused water. With its eye-catching floral design and customized printing option, this bottle combines style and functionality. Stay hydrated in a unique and eco-friendly manner with this stunning copper bottle.",
    type: "physical",
  },
];

export const employees: Employee[] = [];

export const tokenToEmployeeId = new Map<string, string>();

export const orders: Order[] = [];



