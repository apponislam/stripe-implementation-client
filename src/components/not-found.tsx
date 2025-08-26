"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft, Search, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
            <div className="max-w-2xl w-full space-y-6">
                {/* 404 Graphic - Simplified */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4">
                        <AlertCircle className="h-16 w-16 text-destructive" />
                        <div className="text-8xl font-bold text-primary/50">404</div>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
                </div>

                <Card className="border-destructive/20 shadow-lg">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold text-destructive">Oops! Lost Your Way?</CardTitle>
                        <CardDescription className="text-lg">The page you&apos;re looking for doesn&apos;t exist or has been moved.</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Alert variant="destructive">
                            <AlertTitle>Let&apos;s Get You Back on Track</AlertTitle>
                            <AlertDescription>Don&apos;t worry, we&apos;ll help you find what you&apos;re looking for.</AlertDescription>
                        </Alert>

                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Quick Solutions:
                            </h4>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                                <li>• Double-check the URL for any typos</li>
                                <li>• Navigate back to the previous page</li>
                                <li>• Return to our homepage and browse from there</li>
                                <li>• Contact our support team for assistance</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Need Immediate Help?
                            </h4>
                            <p className="text-sm text-blue-700">
                                Our support team is ready to assist you. Reach out at <span className="font-medium">support@amarshop.com</span>
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => router.back()} variant="outline" className="flex-1 gap-2" size="lg">
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </Button>

                        <Button onClick={() => router.push("/")} className="flex-1 gap-2" size="lg">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Button>
                    </CardFooter>
                </Card>

                {/* Quick Links - Simplified */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <Button variant="ghost" onClick={() => router.push("/products")} className="h-auto py-4">
                        <div>
                            <div className="font-semibold">Browse Products</div>
                            <div className="text-xs text-muted-foreground">Explore our collection</div>
                        </div>
                    </Button>

                    <Button variant="ghost" onClick={() => router.push("/contact")} className="h-auto py-4">
                        <div>
                            <div className="font-semibold">Contact Support</div>
                            <div className="text-xs text-muted-foreground">Get assistance</div>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
}
