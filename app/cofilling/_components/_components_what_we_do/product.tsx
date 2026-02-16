"use client";

import React from "react";
import ProductComponent, { ProductProps } from "./__components/product_componet";

interface ProductSectionProps {
    productData: ProductProps;
}

const Product: React.FC<ProductSectionProps> = ({ productData }) => {
    return (
        <div className="w-full flex flex-col items-center pb-20">
            {/* Main Product Display */}
            <ProductComponent {...productData} />
        </div>
    );
};

export default Product;
