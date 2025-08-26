// "use client";

// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Package, CheckCircle, Truck, Home, Check, X } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// interface TrackOrderModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     order: {
//         _id: string;
//         orderStatus: string;
//         createdAt: string;
//         updatedAt: string;
//     };
// }

// const orderSteps = [
//     { status: "pending", label: "Order Placed", icon: Package, description: "Your order has been received" },
//     { status: "confirmed", label: "Order Confirmed", icon: CheckCircle, description: "We're preparing your order" },
//     { status: "processing", label: "Processing", icon: Package, description: "Items are being packed" },
//     { status: "shipped", label: "Shipped", icon: Truck, description: "Your order is on the way" },
//     { status: "delivered", label: "Delivered", icon: Home, description: "Order delivered successfully" },
//     { status: "cancelled", label: "Cancelled", icon: X, description: "Order has been cancelled" },
// ];

// export function TrackOrderModal({ open, onOpenChange, order }: TrackOrderModalProps) {
//     const currentStepIndex = orderSteps.findIndex((step) => step.status === order.orderStatus);
//     const progress = order.orderStatus === "delivered" ? 100 : order.orderStatus === "cancelled" ? 0 : ((currentStepIndex + 1) / (orderSteps.length - 1)) * 100;

//     const getStepStatus = (stepIndex: number) => {
//         if (order.orderStatus === "cancelled") return stepIndex === 5 ? "current" : "upcoming";
//         if (stepIndex < currentStepIndex) return "completed";
//         if (stepIndex === currentStepIndex) return "current";
//         return "upcoming";
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
//                 <DialogHeader className="pb-2">
//                     <DialogTitle className="flex items-center gap-2 text-lg">
//                         <Truck className="h-5 w-5" />
//                         Track Order #{order._id.slice(-8).toUpperCase()}
//                     </DialogTitle>
//                     <DialogDescription className="text-sm">{order.orderStatus === "cancelled" ? "This order was cancelled" : "Follow your order's journey"}</DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-4">
//                     {/* Progress Bar - Hide for cancelled orders */}
//                     {order.orderStatus !== "cancelled" && (
//                         <div className="space-y-1">
//                             <div className="flex justify-between text-xs text-muted-foreground">
//                                 <span>Order Progress</span>
//                                 <span>{Math.round(progress)}% Complete</span>
//                             </div>
//                             <Progress value={progress} className="h-1.5" />
//                         </div>
//                     )}

//                     {/* Timeline */}
//                     <div className="space-y-2">
//                         {orderSteps.map((step, index) => {
//                             const status = getStepStatus(index);
//                             const Icon = step.icon;

//                             if (order.orderStatus === "cancelled" && index !== 5) return null;

//                             return (
//                                 <div key={step.status} className="flex items-start gap-3">
//                                     <div className="flex flex-col items-center">
//                                         <div
//                                             className={`
//                                             flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs
//                                             ${status === "completed" ? "bg-green-100 border-green-500 text-green-600" : ""}
//                                             ${status === "current" && order.orderStatus !== "cancelled" ? "bg-blue-100 border-blue-500 text-blue-600" : ""}
//                                             ${status === "current" && order.orderStatus === "cancelled" ? "bg-red-100 border-red-500 text-red-600" : ""}
//                                             ${status === "upcoming" ? "bg-gray-100 border-gray-300 text-gray-400" : ""}
//                                         `}
//                                         >
//                                             {status === "completed" ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
//                                         </div>
//                                         {index < orderSteps.length - 1 && order.orderStatus !== "cancelled" && (
//                                             <div
//                                                 className={`
//                                                 w-0.5 h-6 mt-1
//                                                 ${status === "completed" ? "bg-green-500" : "bg-gray-300"}
//                                             `}
//                                             />
//                                         )}
//                                     </div>

//                                     <div className="flex-1 space-y-0.5">
//                                         <div className="flex items-center gap-1.5">
//                                             <span
//                                                 className={`
//                                                 text-sm font-medium
//                                                 ${status === "completed" ? "text-green-800" : ""}
//                                                 ${status === "current" && order.orderStatus !== "cancelled" ? "text-blue-800" : ""}
//                                                 ${status === "current" && order.orderStatus === "cancelled" ? "text-red-800" : ""}
//                                                 ${status === "upcoming" ? "text-gray-500" : ""}
//                                             `}
//                                             >
//                                                 {step.label}
//                                             </span>
//                                             {status === "current" && order.orderStatus !== "cancelled" && (
//                                                 <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0">
//                                                     In Progress
//                                                 </Badge>
//                                             )}
//                                             {status === "current" && order.orderStatus === "cancelled" && (
//                                                 <Badge variant="destructive" className="text-xs px-1.5 py-0">
//                                                     Cancelled
//                                                 </Badge>
//                                             )}
//                                         </div>
//                                         <p className="text-xs text-muted-foreground">{step.description}</p>
//                                         {status === "current" && order.orderStatus === "delivered" && <p className="text-xs text-green-600">✅ Delivered</p>}
//                                         {status === "current" && order.orderStatus === "shipped" && <p className="text-xs text-blue-600">Delivery: Soon</p>}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>

//                     {/* Order Dates */}
//                     <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-xs">
//                         <div className="flex justify-between">
//                             <span className="text-muted-foreground">Order Placed:</span>
//                             <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-muted-foreground">Last Updated:</span>
//                             <span className="font-medium">{new Date(order.updatedAt).toLocaleDateString()}</span>
//                         </div>
//                     </div>

//                     {/* Support Info */}
//                     <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
//                         <h4 className="font-semibold text-blue-800 text-sm mb-1">Need Help?</h4>
//                         <p className="text-xs text-blue-700">
//                             Contact support at <span className="font-medium">support@amarshop.com</span>
//                         </p>
//                     </div>
//                 </div>

//                 <Button onClick={() => onOpenChange(false)} className="w-full mt-2" size="sm">
//                     Close
//                 </Button>
//             </DialogContent>
//         </Dialog>
//     );
// }

"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, CheckCircle, Truck, Home, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrackOrderModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: {
        _id: string;
        orderStatus: string;
        createdAt: string;
        updatedAt: string;
    };
}

const orderSteps = [
    { status: "pending", label: "Order Placed", icon: Package, description: "Your order has been received" },
    { status: "confirmed", label: "Order Confirmed", icon: CheckCircle, description: "We're preparing your order" },
    { status: "processing", label: "Processing", icon: Package, description: "Items are being packed" },
    { status: "shipped", label: "Shipped", icon: Truck, description: "Your order is on the way" },
    { status: "delivered", label: "Delivered", icon: Home, description: "Order delivered successfully" },
    { status: "cancelled", label: "Cancelled", icon: X, description: "Order has been cancelled" },
];

export function TrackOrderModal({ open, onOpenChange, order }: TrackOrderModalProps) {
    const currentStepIndex = orderSteps.findIndex((step) => step.status === order.orderStatus);
    const progress = order.orderStatus === "delivered" ? 100 : order.orderStatus === "cancelled" ? 0 : ((currentStepIndex + 1) / (orderSteps.length - 1)) * 100;

    const getStepStatus = (stepIndex: number) => {
        if (order.orderStatus === "cancelled") return stepIndex === 5 ? "current" : "upcoming";
        if (stepIndex < currentStepIndex) return "completed";
        if (stepIndex === currentStepIndex) return "current";
        return "upcoming";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader className="pb-2">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Truck className="h-5 w-5" />
                        Track Order #{order._id.slice(-8).toUpperCase()}
                    </DialogTitle>
                    <DialogDescription className="text-sm">{order.orderStatus === "cancelled" ? "This order was cancelled" : "Follow your order's journey"}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Progress Bar - Hide for cancelled orders */}
                    {order.orderStatus !== "cancelled" && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Order Progress</span>
                                <span>{Math.round(progress)}% Complete</span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="space-y-2">
                        {orderSteps.map((step, index) => {
                            const status = getStepStatus(index);
                            const Icon = step.icon;

                            if (order.orderStatus === "cancelled" && index !== 5) return null;

                            return (
                                <div key={step.status} className="flex items-start gap-3">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`
                                            flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs
                                            ${status === "completed" || (status === "current" && order.orderStatus === "delivered") ? "bg-green-100 border-green-500 text-green-600" : ""}
                                            ${status === "current" && order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" ? "bg-blue-100 border-blue-500 text-blue-600" : ""}
                                            ${status === "current" && order.orderStatus === "cancelled" ? "bg-red-100 border-red-500 text-red-600" : ""}
                                            ${status === "upcoming" ? "bg-gray-100 border-gray-300 text-gray-400" : ""}
                                        `}
                                        >
                                            {status === "completed" || (status === "current" && order.orderStatus === "delivered") ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                                        </div>
                                        {index < orderSteps.length - 1 && order.orderStatus !== "cancelled" && (
                                            <div
                                                className={`
                                                w-0.5 h-6 mt-1
                                                ${status === "completed" || (status === "current" && order.orderStatus === "delivered") ? "bg-green-500" : "bg-gray-300"}
                                            `}
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className={`
                                                text-sm font-medium
                                                ${status === "completed" || (status === "current" && order.orderStatus === "delivered") ? "text-green-800" : ""}
                                                ${status === "current" && order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" ? "text-blue-800" : ""}
                                                ${status === "current" && order.orderStatus === "cancelled" ? "text-red-800" : ""}
                                                ${status === "upcoming" ? "text-gray-500" : ""}
                                            `}
                                            >
                                                {step.label}
                                            </span>
                                            {status === "current" && order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && (
                                                <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0">
                                                    In Progress
                                                </Badge>
                                            )}
                                            {status === "current" && order.orderStatus === "delivered" && (
                                                <Badge variant="default" className="bg-green-100 text-green-800 text-xs px-1.5 py-0">
                                                    Completed
                                                </Badge>
                                            )}
                                            {status === "current" && order.orderStatus === "cancelled" && (
                                                <Badge variant="destructive" className="text-xs px-1.5 py-0">
                                                    Cancelled
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{step.description}</p>
                                        {status === "current" && order.orderStatus === "delivered" && <p className="text-xs text-green-600">✅ Delivered</p>}
                                        {status === "current" && order.orderStatus === "shipped" && <p className="text-xs text-blue-600">Delivery: Soon</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Dates */}
                    <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Order Placed:</span>
                            <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Updated:</span>
                            <span className="font-medium">{new Date(order.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Support Info */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 text-sm mb-1">Need Help?</h4>
                        <p className="text-xs text-blue-700">
                            Contact support at <span className="font-medium">support@amarshop.com</span>
                        </p>
                    </div>
                </div>

                <Button onClick={() => onOpenChange(false)} className="w-full mt-2" size="sm">
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
}
