// "use client";

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { IProduct } from "@/app/types/product";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Loader2, Upload, X } from "lucide-react";
// import { useCreateProductMutation } from "@/redux/features/product/productApi";
// import Image from "next/image";
// import { toast } from "sonner";

// const AddProductForm = () => {
//     const [preview, setPreview] = useState<string | null>(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const [tags, setTags] = useState<string[]>([]);
//     const [tagInput, setTagInput] = useState("");
//     const [createProduct] = useCreateProductMutation();

//     const form = useForm<Partial<IProduct>>({
//         defaultValues: {
//             name: "",
//             description: "",
//             price: 0,
//             discountPrice: undefined,
//             category: "",
//             tags: [],
//             images: [],
//             stock: 0,
//         },
//     });

//     const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (!file) return;

//         if (!file.type.startsWith("image/")) {
//             toast.error("Please upload an image file");
//             return;
//         }
//         if (file.size > 5 * 1024 * 1024) {
//             toast.error("Image must be less than 5MB");
//             return;
//         }

//         const previewUrl = URL.createObjectURL(file);
//         setPreview(previewUrl);
//         setIsUploading(true);

//         try {
//             const formData = new FormData();
//             formData.append("file", file);
//             formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
//             formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

//             const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || "Upload failed");
//             }

//             const data = await response.json();
//             const cloudinaryUrl = data.secure_url;

//             // Set the form value to the Cloudinary URL
//             form.setValue("images", [cloudinaryUrl]);

//             // UPDATE THE PREVIEW TO SHOW THE CLOUDINARY URL, NOT THE BLOB URL
//             setPreview(cloudinaryUrl);

//             toast.success("Image uploaded successfully");
//         } catch (error) {
//             console.error("Upload error:", error);
//             toast.error(error instanceof Error ? error.message : "Failed to upload image");
//             setPreview(null);
//             form.setValue("images", []);
//         } finally {
//             setIsUploading(false);
//             // Clean up the blob URL since we're now using the Cloudinary URL
//             URL.revokeObjectURL(previewUrl);
//         }
//     };

//     const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setTagInput(value);

//         // Check if the last character is a comma
//         if (value.endsWith(",")) {
//             const newTag = value.slice(0, -1).trim();
//             if (newTag && !tags.includes(newTag)) {
//                 const newTags = [...tags, newTag];
//                 setTags(newTags);
//                 form.setValue("tags", newTags);
//             }
//             setTagInput("");
//         }
//     };

//     const removeTag = (tagToRemove: string) => {
//         const newTags = tags.filter((tag) => tag !== tagToRemove);
//         setTags(newTags);
//         form.setValue("tags", newTags);
//     };

//     const onSubmit = async (values: Partial<IProduct>) => {
//         try {
//             await createProduct(values).unwrap();
//             toast.success("Product created successfully");
//             form.reset();
//             setPreview(null);
//             setTags([]);
//         } catch (err) {
//             console.log(err);
//             toast.error("Failed to create product");
//         }
//     };

//     return (
//         <div className="container mx-auto p-6 max-w-4xl">
//             <div className="flex flex-col gap-6">
//                 <div className="text-center">
//                     <h1 className="text-3xl font-bold">Add New Product</h1>
//                     <p className="text-muted-foreground">Fill in the details below to create a new product</p>
//                 </div>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Product Information</CardTitle>
//                         <CardDescription>Enter the details of your product</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                             <Tabs defaultValue="basic" className="w-full">
//                                 <TabsList className="grid w-full grid-cols-3">
//                                     <TabsTrigger value="basic">Basic Info</TabsTrigger>
//                                     <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
//                                     <TabsTrigger value="media">Media</TabsTrigger>
//                                 </TabsList>

//                                 <TabsContent value="basic" className="space-y-4 pt-4">
//                                     <div className="grid gap-4 md:grid-cols-2">
//                                         <div className="space-y-2">
//                                             <Label htmlFor="name">Product Name *</Label>
//                                             <Input id="name" placeholder="Enter product name" {...form.register("name", { required: true })} />
//                                         </div>

//                                         <div className="space-y-2">
//                                             <Label htmlFor="category">Category *</Label>
//                                             <Input id="category" placeholder="Enter product category" {...form.register("category", { required: true })} />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="description">Description *</Label>
//                                         <Textarea id="description" placeholder="Describe your product in detail" className="min-h-[120px]" {...form.register("description", { required: true })} />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="tags">Tags (comma separated)</Label>
//                                         <div className="flex flex-wrap gap-2 mb-2">
//                                             {tags.map((tag) => (
//                                                 <Badge key={tag} variant="secondary" className="px-3 py-1">
//                                                     {tag}
//                                                     <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full outline-none focus:ring-2 focus:ring-ring">
//                                                         <X className="h-3 w-3" />
//                                                     </button>
//                                                 </Badge>
//                                             ))}
//                                         </div>
//                                         <Input id="tags" placeholder="Type tags separated by commas (e.g., tag1, tag2, tag3)" value={tagInput} onChange={handleTagInput} />
//                                         <p className="text-sm text-muted-foreground">Type tags separated by commas. Press comma to add a tag.</p>
//                                     </div>
//                                 </TabsContent>

//                                 <TabsContent value="pricing" className="space-y-4 pt-4">
//                                     <div className="grid gap-4 md:grid-cols-2">
//                                         <div className="space-y-2">
//                                             <Label htmlFor="price">Price *</Label>
//                                             <Input type="number" id="price" step="0.01" min="0" placeholder="0.00" {...form.register("price", { required: true, valueAsNumber: true })} />
//                                         </div>

//                                         <div className="space-y-2">
//                                             <Label htmlFor="discountPrice">Discount Price</Label>
//                                             <Input type="number" id="discountPrice" step="0.01" min="0" placeholder="0.00" {...form.register("discountPrice", { valueAsNumber: true })} />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="stock">Stock Quantity *</Label>
//                                         <Input type="number" id="stock" min="0" placeholder="0" {...form.register("stock", { required: true, valueAsNumber: true })} />
//                                     </div>
//                                 </TabsContent>
//                                 <TabsContent value="media" className="space-y-4 pt-4">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="images">Product Image</Label>
//                                         <div className="flex items-center justify-center w-full">
//                                             <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-border/25">
//                                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                                     {isUploading ? (
//                                                         <>
//                                                             <Loader2 className="w-10 h-10 mb-3 text-muted-foreground animate-spin" />
//                                                             <p className="text-sm text-muted-foreground">Uploading image...</p>
//                                                         </>
//                                                     ) : preview ? (
//                                                         <div className="relative w-full h-56">
//                                                             <Image src={preview} alt="Preview" fill className="object-contain rounded-md" unoptimized={true} />
//                                                         </div>
//                                                     ) : (
//                                                         <>
//                                                             <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
//                                                             <p className="mb-2 text-sm text-muted-foreground">
//                                                                 <span className="font-semibold">Click to upload</span> or drag and drop
//                                                             </p>
//                                                             <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
//                                                         </>
//                                                     )}
//                                                 </div>
//                                                 <input id="dropzone-file" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </TabsContent>
//                             </Tabs>

//                             <Separator />

//                             <CardFooter className="flex justify-between px-0">
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={() => {
//                                         form.reset();
//                                         setPreview(null);
//                                         setTags([]);
//                                     }}
//                                 >
//                                     Reset Form
//                                 </Button>
//                                 <Button type="submit" disabled={isUploading} className="min-w-40">
//                                     {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                                     {isUploading ? "Uploading..." : "Create Product"}
//                                 </Button>
//                             </CardFooter>
//                         </form>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default AddProductForm;

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IProduct } from "@/app/types/product";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload, X, Trash2 } from "lucide-react";
import { useCreateProductMutation } from "@/redux/features/product/productApi";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddProductForm = () => {
    const [previews, setPreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [createProduct] = useCreateProductMutation();

    const form = useForm<Partial<IProduct>>({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            discountPrice: undefined,
            category: "",
            tags: [],
            images: [],
            stock: 0,
        },
    });

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newImageUrls: string[] = [...(form.getValues("images") || [])];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (!file.type.startsWith("image/")) {
                    toast.error("Please upload only image files");
                    continue;
                }
                if (file.size > 5 * 1024 * 1024) {
                    toast.error("Image must be less than 5MB");
                    continue;
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
                formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Upload failed");
                }

                const data = await response.json();
                newImageUrls.push(data.secure_url);
            }

            form.setValue("images", newImageUrls);
            setPreviews(newImageUrls); // Set previews to the actual Cloudinary URLs
            toast.success("Images uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to upload images");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues("images") || [];
        const newImages = currentImages.filter((_, i) => i !== index);
        form.setValue("images", newImages);

        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTagInput(value);

        // Check if the last character is a comma
        if (value.endsWith(",")) {
            const newTag = value.slice(0, -1).trim();
            if (newTag && !tags.includes(newTag)) {
                const newTags = [...tags, newTag];
                setTags(newTags);
                form.setValue("tags", newTags);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(newTags);
        form.setValue("tags", newTags);
    };

    const router = useRouter();

    const onSubmit = async (values: Partial<IProduct>) => {
        try {
            const result = await createProduct(values).unwrap();
            console.log(result);
            toast.success("Product created successfully");
            form.reset();
            setPreviews([]);
            setTags([]);

            router.push("/my-products");
        } catch (err) {
            console.log(err);
            toast.error("Failed to create product");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Add New Product</h1>
                    <p className="text-muted-foreground">Fill in the details below to create a new product</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                        <CardDescription>Enter the details of your product</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                    <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
                                    <TabsTrigger value="media">Media</TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic" className="space-y-4 pt-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Product Name *</Label>
                                            <Input id="name" placeholder="Enter product name" {...form.register("name", { required: true })} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category *</Label>
                                            <Input id="category" placeholder="Enter product category" {...form.register("category", { required: true })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea id="description" placeholder="Describe your product in detail" className="min-h-[120px]" {...form.register("description", { required: true })} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tags">Tags (comma separated)</Label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="px-3 py-1">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full outline-none focus:ring-2 focus:ring-ring">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <Input id="tags" placeholder="Type tags separated by commas (e.g., tag1, tag2, tag3)" value={tagInput} onChange={handleTagInput} />
                                        <p className="text-sm text-muted-foreground">Type tags separated by commas. Press comma to add a tag.</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="pricing" className="space-y-4 pt-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price *</Label>
                                            <Input type="number" id="price" step="0.01" min="0" placeholder="0.00" {...form.register("price", { required: true, valueAsNumber: true })} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="discountPrice">Discount Price</Label>
                                            <Input type="number" id="discountPrice" step="0.01" min="0" placeholder="0.00" {...form.register("discountPrice", { valueAsNumber: true })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock Quantity *</Label>
                                        <Input type="number" id="stock" min="0" placeholder="0" {...form.register("stock", { required: true, valueAsNumber: true })} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="media" className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="images">Product Images</Label>

                                        <div className="flex items-center justify-center w-full">
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-border/25">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {isUploading ? (
                                                        <>
                                                            <Loader2 className="w-10 h-10 mb-3 text-muted-foreground animate-spin" />
                                                            <p className="text-sm text-muted-foreground">Uploading images...</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                                            <p className="mb-2 text-sm text-muted-foreground">
                                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 5MB each)</p>
                                                            <p className="text-xs text-muted-foreground mt-1">You can select multiple images</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input id="dropzone-file" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} multiple />
                                            </label>
                                        </div>

                                        {/* Image preview grid - MOVED TO BOTTOM */}
                                        {previews.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm text-muted-foreground mb-2">{previews.length} image(s) uploaded:</p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {previews.map((previewUrl, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="aspect-square relative overflow-hidden rounded-md border">
                                                                <Image src={previewUrl} alt={`Preview ${index + 1}`} fill className="object-cover" />
                                                            </div>
                                                            <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}>
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <Separator />

                            <CardFooter className="flex justify-between px-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        form.reset();
                                        setPreviews([]);
                                        setTags([]);
                                    }}
                                >
                                    Reset Form
                                </Button>
                                <Button type="submit" disabled={isUploading} className="min-w-40">
                                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isUploading ? "Uploading..." : "Create Product"}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddProductForm;
