import { z } from "zod";
import type { Address } from "@/types";

export const mobileSchema = z
  .string()
  .regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit Indian mobile number");

export const emailSchema = z.string().email();

export const pincodeSchema = z
  .string()
  .regex(/^\d{6}$/, "Enter a valid 6-digit pincode");

// Treat empty strings as undefined for optional fields
const emptyToUndefinedString = () =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().optional());

export const addressSchema = z.object({
  recipientName: z
    .string()
    .min(2, "Full name is required")
    .regex(/^[A-Za-z .'-]{2,}$/, "Enter a valid name"),
  phone: mobileSchema,
  email: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().email().optional()
  ),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: emptyToUndefinedString(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: pincodeSchema,
  country: z.string().min(2, "Country is required"),
  alternatePhone: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    mobileSchema.optional()
  ),
  landmark: emptyToUndefinedString(),
  addressType: z.enum(["home", "office", "other"]).optional(),
});

export const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  empId: z.string().optional(),
  mobile: mobileSchema,
});

export const orderInputSchema = z
  .object({
    campaignSlug: z.string().min(1),
    giftId: z.string().min(1),
    selectedGiftType: z.enum(["physical", "digital"]).optional(),
    employee: employeeSchema,
    address: addressSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.selectedGiftType === "physical" && !data.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Address is required for physical gifts",
      });
    }
  });

export type OrderInput = z.infer<typeof orderInputSchema>;


