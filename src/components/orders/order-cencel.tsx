"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ShoppingBag, Home, ArrowLeft, CreditCard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OrderCancelPage() {
    const router = useRouter();

    return (
        <div className="container mx-auto p-6 max-w-2xl min-h-screen flex items-center justify-center">
            <div className="w-full space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>
                    <h1 className="text-4xl font-bold text-destructive">Order Cancelled</h1>
                    <p className="text-muted-foreground text-lg">Your payment was not completed.</p>
                </div>

                <Card className="border-destructive/20">
                    <CardHeader className="text-center">
                        <CardTitle className="text-destructive flex items-center justify-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Cancelled
                        </CardTitle>
                        <CardDescription>Your order was not processed successfully</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Payment Interrupted</AlertTitle>
                            <AlertDescription>The payment process was cancelled before completion. No charges were made to your account.</AlertDescription>
                        </Alert>

                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">What happened?</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• You closed the payment window</li>
                                <li>• Payment was declined by your bank</li>
                                <li>• There was a technical issue</li>
                                <li>• You decided not to complete the purchase</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">Need help?</h4>
                            <p className="text-sm text-blue-700">
                                If this was unexpected or you need assistance, please contact our support team at
                                <span className="font-medium"> support@amarshop.com</span> or call
                                <span className="font-medium"> +1 (555) 123-4567</span>.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3">
                        <Button onClick={() => router.push("/cart")} className="w-full bg-destructive hover:bg-destructive/90">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Cart
                        </Button>

                        <Button onClick={() => router.push("/products")} variant="outline" className="w-full">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Continue Shopping
                        </Button>

                        <Button onClick={() => router.push("/")} variant="ghost" className="w-full">
                            <Home className="h-4 w-4 mr-2" />
                            Go to Homepage
                        </Button>
                    </CardFooter>
                </Card>

                {/* Additional Help Section */}
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div>
                            <h4 className="font-medium">Will I be charged?</h4>
                            <p className="text-muted-foreground">No, your payment was not processed and no charges were made.</p>
                        </div>
                        <div>
                            <h4 className="font-medium">Can I try again?</h4>
                            <p className="text-muted-foreground">Yes, you can go back to your cart and try the payment again.</p>
                        </div>
                        <div>
                            <h4 className="font-medium">How long does it take to see the refund?</h4>
                            <p className="text-muted-foreground">If any temporary authorization was placed, it should be released within 3-5 business days.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
