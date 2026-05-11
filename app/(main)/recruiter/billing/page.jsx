"use client";

import { useState } from "react";
import { ArrowLeft, Coins, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "@/app/provider";

const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 10,
    price: 29,
    pricePerCredit: 2.9,
    popular: false,
    features: [
      "10 Interview Credits",
      "Perfect for small teams",
      "Valid for 6 months",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional Pack",
    credits: 25,
    price: 59,
    pricePerCredit: 2.36,
    popular: true,
    features: [
      "25 Interview Credits",
      "Best value for money",
      "Valid for 12 months",
      "Priority email support",
      "Bulk interview creation",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Pack",
    credits: 50,
    price: 99,
    pricePerCredit: 1.98,
    popular: false,
    features: [
      "50 Interview Credits",
      "Best price per credit",
      "Valid for 12 months",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
  },
];

export default function Billing() {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]); // Default to professional
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, updateUserCredits } = useUser();

  const handlePurchase = async () => {
    setLoading(true);

    try {
      // Update user credits
      const currentCredits = user?.credits || 0;
      const newCredits = currentCredits + selectedPackage.credits;

      const result = await updateUserCredits(newCredits);

      if (result.success) {
        toast.success(
          `Successfully purchased ${selectedPackage.credits} credits! You now have ${newCredits} credits.`,
        );

        setTimeout(() => {
          router.push("/recruiter/dashboard");
        }, 2000);
      } else {
        toast.error("Failed to update credits. Please try again.");
        console.error("Credit update error:", result.error);
      }
    } catch (error) {
      toast.error("Purchase failed. Please try again.");
      console.error("Purchase error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#f8fafc,white,#f1f5f9)] py-8 px-4 sm:px-5 lg:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Purchase Interview Credits
            </h1>

            <p className="text-[13px] text-slate-500 mt-1">
              Buy credits to create AI-powered interviews
            </p>
          </div>
        </div>

        {/* Current Credits */}
        {user && (
          <Card className="mb-6 max-w-xs mx-auto rounded-xl border border-slate-200/70 bg-white/90 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
            <CardContent className="pt-5">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-blue-600" />

                  <span className="text-xs text-slate-500">
                    Current Credits
                  </span>
                </div>

                <div className="text-2xl font-bold text-blue-600">
                  {user.credits || 0}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Credit Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {CREDIT_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`
              relative
              cursor-pointer
              rounded-xl
              border
              transition-all
              duration-300
              hover:shadow-[0_10px_25px_rgba(15,23,42,0.06)]
              ${
                selectedPackage.id === pkg.id
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-slate-200/70 hover:border-slate-300"
              }
            `}
              onClick={() => setSelectedPackage(pkg)}
            >
              {pkg.popular && (
                <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2">
                  <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-medium text-white shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <CardTitle className="flex items-center justify-center gap-2 text-base">
                  <Coins className="w-4 h-4 text-blue-600" />
                  {pkg.name}
                </CardTitle>

                <div className="text-2xl font-bold text-slate-900">
                  ${pkg.price}
                </div>

                <div className="text-xs text-slate-500">
                  ${pkg.pricePerCredit.toFixed(2)} per credit
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2.5">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />

                      <span className="text-xs text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 text-center">
                  <div className="text-xl font-bold text-blue-600 mb-1">
                    {pkg.credits}
                  </div>

                  <div className="text-xs text-slate-500">
                    Interview Credits
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Purchase Section */}
        <Card className="max-w-sm mx-auto rounded-xl border border-slate-200/70 bg-white/90 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              Complete Purchase
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                <span className="text-sm font-medium text-slate-700">
                  Selected Package:
                </span>

                <span className="text-sm font-semibold text-blue-600">
                  {selectedPackage.name}
                </span>
              </div>

              <div className="flex justify-between items-center rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                <span className="text-sm font-medium text-slate-700">
                  Credits:
                </span>

                <span className="text-sm font-semibold text-blue-600">
                  {selectedPackage.credits} credits
                </span>
              </div>

              <div className="flex justify-between items-center rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
                <span className="font-semibold text-slate-800">Total:</span>

                <span className="text-blue-600 font-bold">
                  ${selectedPackage.price}
                </span>
              </div>

              <Button
                onClick={handlePurchase}
                disabled={loading}
                className="
                h-10
                w-full
                rounded-lg
                bg-slate-950
                hover:bg-slate-800
                text-sm
                text-white
                shadow-[0_8px_24px_rgba(15,23,42,0.08)]
                transition-all
                duration-300
              "
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  `Purchase ${selectedPackage.credits} Credits`
                )}
              </Button>

              <p className="text-[11px] text-slate-500 text-center">
                Credits are valid for 12 months from purchase date
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
