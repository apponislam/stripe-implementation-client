import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/forms/user-login-form";
import { RegistrationForm } from "@/components/forms/user-registration-form";

const page = () => {
    return (
        <div className="h-screen">
            <div className="flex-1 flex h-screen items-center justify-center p-4">
                <div className="w-full max-w-[400px] bg-card rounded-lg shadow-sm border p-6">
                    <Tabs defaultValue="login">
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="login">Log In</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login" className="pt-4">
                            <LoginForm />
                        </TabsContent>
                        <TabsContent value="register" className="pt-4">
                            <RegistrationForm />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default page;
