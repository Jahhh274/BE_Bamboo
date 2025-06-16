export interface Color{
    id: number,
    name: string,
}

export interface Category {
    id: number,
    name: string,
    description: string,
    created_at: Date,
    updated_at: Date,
}  

export interface Supplier {
    id: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    created_at: Date,
    updated_at: Date,
}

export interface Product {
    id: number,
    name: string,
    image_url: string,
    description: string,
    category_id: number,
    color_id: number,
    created_at: Date,
    updated_at: Date,
}

export interface Warehouse {
    id: number,
    selling_price: number,
    quantity: number,
    product_id: number,
    created_at: Date,
    updated_at: Date,
}

export interface ImportReceipt {
    id: number,
    product_id: number,
    price_import: number,
    quantity: number,
    import_date: Date,
    supplier_id: number,
    created_at: Date,
    updated_at: Date,
}

export interface User {
    id: number,
    username: string,
    password: string,
    email: string,
    full_name: string,
    phone: string,
    address: string,
    role: string,
    created_at: Date,
    updated_at: Date,
}

export interface Review {
    id: number,
    user_id: number,
    product_id: number,
    rating: number,
    comment: string,
    created_at: Date,
}

export interface Payment {
    id: number,
    transaction_id: string,
    method: string
}

export interface OrderDetail {
    id: number,
    user_id: number,
    product_id: number,
    quantity: number,
    price: number,
    total_price: number,
    payment_id: number,
}

export interface Order {
    id: number,
    order_detail_id: number,
    status: string,
    total_price: Date,
    created_at: Date,
    updated_at: Date,
}

export interface Cart {
    id: number,
    user_id: number,
    product_id: number,
    price: number,
    quantity: number,
    created_at: Date,
} 

