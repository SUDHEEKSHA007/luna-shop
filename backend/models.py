from pydantic import BaseModel, Field
from typing import List, Optional

# Auth Models
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=150)
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: str

class AuthResponse(BaseModel):
    token: str
    user: UserResponse
    message: str

# Product Model
class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    price: float
    original_price: Optional[float] = None
    image: str
    rating: float
    reviews_count: int
    description: str
    in_stock: bool
    is_bestseller: bool
    is_new: bool

# Cart Models
class CartItemAdd(BaseModel):
    product_id: str
    name: str
    price: float
    image: str
    quantity: int = 1
    category: Optional[str] = ""

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product_id: str
    name: str
    price: float
    image: str
    quantity: int
    category: Optional[str] = ""
    updated_at: str

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total_items: int
    subtotal: float
    shipping: float
    discount: float
    total: float

# Checkout & Cart History Models
class CheckoutRequest(BaseModel):
    shipping_address: Optional[str] = "Standard Delivery Address"
    payment_method: Optional[str] = "Credit Card / UPI"
    promo_code: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    product_id: str
    name: str
    price: float
    quantity: int
    image: str
    category: Optional[str] = ""

class OrderResponse(BaseModel):
    id: int
    order_number: str
    created_at: str
    total_amount: float
    subtotal: float
    discount: float
    shipping: float
    status: str
    shipping_address: Optional[str]
    payment_method: Optional[str]
    items: List[OrderItemResponse]

class SyncCartRequest(BaseModel):
    items: List[CartItemAdd]
