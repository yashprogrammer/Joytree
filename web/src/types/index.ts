export type Company = { id: string; name: string; slug: string };
export type Campaign = {
  id: string;
  slug: string;
  title: string;
  companyId: string;
  videoUrl?: string;
  startsAt?: string;
  endsAt?: string;
};
export type GiftOption = {
  id: string;
  campaignId: string;
  title: string;
  imageUrl: string;
  description?: string;
  type: "physical" | "digital";
};
export type Employee = {
  id: string;
  mobile: string;
  name?: string;
  email?: string;
  empId?: string;
};
export type Address = {
  // Recipient info
  recipientName?: string;
  phone?: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  alternatePhone?: string;
  landmark?: string;
  addressType?: "home" | "office" | "other";
};
export type Order = {
  id: string;
  campaignId: string;
  employeeId: string;
  giftId: string;
  address?: Address;
  status: "PLACED";
  createdAt: string;
};


