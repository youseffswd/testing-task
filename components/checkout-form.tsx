"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";
import { useToast } from "./toast";
import { luhnCheck, validExpiry } from "@/lib/checkout";

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};
const initial: FormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};
export default function CheckoutForm() {
  const router = useRouter();
  const { items, dispatch } = useCart();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax;
  const change = (key: keyof FormData, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const validateField = (key: keyof FormData, value = form[key]) => {
    let message = "";
    if (
      ["name", "email", "phone", "address", "city", "postalCode"].includes(
        key,
      ) &&
      !value.trim()
    )
      message = "This field is required";
    if (key === "email" && value && !/^\S+@\S+\.\S+$/.test(value))
      message = "Enter a valid email address";
    if (key === "phone" && value && !/^[0-9+() -]{7,}$/.test(value))
      message = "Enter a valid phone number";
    if (key === "cardNumber" && !luhnCheck(value))
      message = "Enter a valid card number";
    if (key === "expiry" && !validExpiry(value))
      message = "Enter a valid expiry date";
    if (key === "cvc" && !/^\d{3,4}$/.test(value))
      message = "Enter a valid CVC";
    setErrors((current) => ({ ...current, [key]: message }));
    return !message;
  };
  const shippingFields: (keyof FormData)[] = [
    "name",
    "email",
    "phone",
    "address",
    "city",
    "postalCode",
  ];
  const paymentFields: (keyof FormData)[] = ["cardNumber", "expiry", "cvc"];
  const next = () => {
    const fields = step === 1 ? shippingFields : paymentFields;
    if (fields.every((field) => validateField(field))) setStep(step + 1);
  };
  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total,
          shipping: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
          },
          payment: {
            cardNumber: form.cardNumber,
            expiry: form.expiry,
            cvc: form.cvc,
          },
        }),
      });
      const data = await response.json();
      if (response.status === 422) {
        setErrors(data.errors || {});
        setStep(1);
        showToast("Please correct the checkout form.", "error");
        return;
      }
      if (response.status === 409) {
        showToast(
          data.message || "Some items are no longer in stock.",
          "error",
        );
        return;
      }
      if (!response.ok) throw new Error("Order failed");
      dispatch({ type: "clear" });
      router.push(`/orders/${data.order.id}/confirmation`);
    } catch (error) {
      console.error(error);
      showToast("Could not place your order. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };
  if (!items.length)
    return (
      <div className="rounded-xl bg-white p-10 text-center">
        <h1 className="text-2xl font-black">Nothing to check out</h1>
        <p className="mt-2 text-slate-500">Your cart is empty.</p>
      </div>
    );
  const Field = ({
    name,
    label,
    type = "text",
    placeholder,
  }: {
    name: keyof FormData;
    label: string;
    type?: string;
    placeholder?: string;
  }) => (
    <div>
      <label className="mb-1 block text-sm font-bold" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        className="field"
        type={type}
        value={form[name]}
        placeholder={placeholder}
        onChange={(event) => change(name, event.target.value)}
        onBlur={() => validateField(name)}
      />
      {errors[name] && <p className="error">{errors[name]}</p>}
    </div>
  );
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <section className="rounded-xl border bg-white p-6">
        <div className="mb-7 flex items-center gap-2 text-sm font-bold">
          <span
            className={
              step >= 1 ? "rounded-full bg-violet-700 px-2 py-1 text-white" : ""
            }
          >
            1
          </span>
          <span>Shipping</span>
          <span className="mx-1 text-slate-300">—</span>
          <span
            className={
              step >= 2 ? "rounded-full bg-violet-700 px-2 py-1 text-white" : ""
            }
          >
            2
          </span>
          <span>Payment</span>
          <span className="mx-1 text-slate-300">—</span>
          <span
            className={
              step >= 3 ? "rounded-full bg-violet-700 px-2 py-1 text-white" : ""
            }
          >
            3
          </span>
          <span>Review</span>
        </div>
        {step === 1 && (
          <div>
            <h2 className="text-xl font-black">Shipping details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field name="name" label="Full name" />
              </div>
              <Field name="email" label="Email address" type="email" />
              <Field name="phone" label="Phone number" />
              <div className="sm:col-span-2">
                <Field name="address" label="Street address" />
              </div>
              <Field name="city" label="City" />
              <Field name="postalCode" label="Postal code" />
            </div>
            <div className="mt-7 flex justify-end">
              <button className="btn" onClick={next}>
                Next: payment
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-black">Payment details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your payment details are only used to place this order.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  name="cardNumber"
                  label="Card number"
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <Field name="expiry" label="Expiry (MM/YY)" placeholder="08/28" />
              <Field name="cvc" label="CVC" placeholder="123" />
            </div>
            <div className="mt-7 flex justify-between">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn" onClick={next}>
                Review order
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-black">Review your order</h2>
            <div className="mt-5 rounded-lg bg-slate-50 p-4">
              <p className="font-bold">Delivering to</p>
              <p className="mt-1 text-sm text-slate-600">
                {form.name}
                <br />
                {form.address}
                <br />
                {form.city}, {form.postalCode}
                <br />
                {form.email}
              </p>
            </div>
            <div className="mt-5 space-y-2">
              {items.map((item) => (
                <div className="flex justify-between text-sm" key={item.id}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 flex justify-between">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn" disabled={submitting} onClick={submit}>
                {submitting
                  ? "Placing order…"
                  : `Place order — $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}
      </section>
      <aside className="h-fit rounded-xl border bg-white p-5">
        <h2 className="text-lg font-black">Order total</h2>
        <div className="mt-4 space-y-3 border-b pb-4 text-sm">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping ? `$${shipping.toFixed(2)}` : "Free"}</span>
          </p>
          <p className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </p>
        </div>
        <p className="mt-4 flex justify-between font-black">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </p>
      </aside>
    </div>
  );
}
