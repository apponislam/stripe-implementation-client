import { IProduct } from "@/app/types/product";
import { useDeleteProductMutation } from "@/redux/features/product/productApi";
import Swal from "sweetalert2";

export const useProductDeleteHandler = () => {
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();

    const handleDeleteProduct = async (product: IProduct) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: "Are you sure?",
            html: `
                    <div class="text-left">
                        <p>You are about to delete:</p>
                        <p class="font-semibold mt-2">${product.name}</p>
                        <p class="text-sm text-muted-foreground mt-2">This action cannot be undone!</p>
                    </div>
                `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: false,
        });

        // If user confirms deletion
        if (result.isConfirmed) {
            try {
                await deleteProduct(product._id).unwrap();

                // Show success message
                Swal.fire({
                    title: "Deleted!",
                    text: `"${product.name}" has been deleted successfully.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });

                return true;
            } catch (error) {
                console.log(error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete product. Please try again.",
                    icon: "error",
                });

                return false;
            }
        }

        return false;
    };

    return { handleDeleteProduct, isDeleting: isLoading };
};
