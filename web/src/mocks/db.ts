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
    imageUrls: [
      "/Products/Calander/Front.jpg",
      "/Products/Calander/2.jpg",
      "/Products/Calander/3.jpg",
      "/Products/Calander/4.jpg",
    ],
    description:
      "Enhance your home or office decor with our Wooden Perpetual Calendar with Clock. This elegant and functional piece combines the timeless beauty of wood with the convenience of a perpetual calendar and a built-in clock.",
    type: "physical",
  },
  {
    id: "g2",
    campaignId: "camp1",
    title: "iSoothe Eye Massager – Xech",
    imageUrl: "/Products/Eye Massager/iSoothe-.jpg",
    imageUrls: [
      "/Products/Eye Massager/Front.jpg",
      "/Products/Eye Massager/iSoothe-.jpg",
      "/Products/Eye Massager/iSoothe.jpg",
      "/Products/Eye Massager/iSoothe..jpg",
      "/Products/Eye Massager/iSoothe,.jpg",
    ],
    description:
      "The iSoothe Eye Massager is a high-quality eye massager that offers Bluetooth connectivity, foldable design, rechargeable battery, and adjustable head strap.",
    type: "physical",
  },
  {
    id: "g3",
    campaignId: "camp1",
    title: "Pebble Blaze 2.05 Infinite Display, Multi Sports Modes, Step Pedometer & Notication Smarwatch",
    imageUrl: "/Products/Smart watch/2.jpg",
    imageUrls: [
      "/Products/Smart watch/Front.jpg",
      "/Products/Smart watch/2.jpg",
      "/Products/Smart watch/3.jpg",
      "/Products/Smart watch/4.jpg",
    ],
    description:
      "Introducing the Pebble Blaze 2.05 Smartwatch, a fusion of style and performance. With its Infinite Display, Multi Sports Modes, Step Pedometer, and Notification features, this smartwatch is the perfect companion to keep you active, informed, and on top of your game.",
    type: "physical",
  },
  {
    id: "g4",
    campaignId: "camp1",
    title: "Printed Customised Floral Copper Bottle",
    imageUrl: "/Products/Water bottle/2.jpg",
    imageUrls: [
      "/Products/Water bottle/front.jpg",
      "/Products/Water bottle/2.jpg",
      "/Products/Water bottle/3.jpg",
      "/Products/Water bottle/4.jpg",
    ],
    description:
      "The Printed Customized Floral Copper Bottle is a beautiful and personalized way to enjoy the benefits of copper-infused water. With its eye-catching floral design and customized printing option, this bottle combines style and functionality. Stay hydrated in a unique and eco-friendly manner with this stunning copper bottle.",
    type: "physical",
  },
];

export const employees: Employee[] = [];

export const tokenToEmployeeId = new Map<string, string>();

export const orders: Order[] = [];



