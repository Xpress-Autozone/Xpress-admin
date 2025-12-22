import { useSelector } from "react-redux";

const useDeleteProduct = () => {
  const { token } = useSelector((state) => state.auth);

  const deleteProduct = async (productId, hardDelete = false) => {
    try {
      console.log(
        `[useDeleteProduct] Deleting product ${productId}, hardDelete: ${hardDelete}`
      );

      const url = `http://localhost:3001/products/${productId}?hardDelete=${hardDelete}`;
      console.log(`[useDeleteProduct] Request URL: ${url}`);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log(`[useDeleteProduct] Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`[useDeleteProduct] Error response:`, errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`[useDeleteProduct] Product deleted successfully:`, data);

      return { success: true, data };
    } catch (err) {
      console.error(`[useDeleteProduct] Error deleting product:`, err);
      throw err;
    }
  };

  return { deleteProduct };
};

export default useDeleteProduct;
