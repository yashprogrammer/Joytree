import { z } from "zod";
import type { Address, Employee, GiftOption } from "@/types";

export const mobileSchema = z
  .string()
  .regex(/^[6-9][0-9]{9}$/g, "Enter a valid 10-digit Indian mobile number");

export const emailSchema = z.string().email();

export const pincodeSchema = z
  .string()
  .regex(/^\d{6}$/g, "Enter a valid 6-digit pincode");

export const addressSchema: z.ZodType<Address> = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: pincodeSchema,
});

export const employeeSchema: z.ZodType<
  Pick<Employee, "name" | "email" | "empId" | "mobile">
> = z.object({
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


