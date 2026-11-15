import random
import time
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from database import init_db, get_db
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_current_user_optional,
)
from models import (
    UserRegister,
    UserLogin,
    UserResponse,
    AuthResponse,
    ProductResponse,
    CartItemAdd,
    CartItemUpdate,
    CartItemResponse,
    CartResponse,
    CheckoutRequest,
    OrderResponse,
    OrderItemResponse,
    SyncCartRequest,
)

app = FastAPI(
    title="Luna Accessories API",
    description="Python FastAPI backend powering Luna Accessories luxury e-commerce platform with Cart & Order History persistence.",
    version="2.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Luna Accessories Python API", "timestamp": datetime.utcnow().isoformat()}

# ================= AUTHENTICATION ENDPOINTS =================

@app.post("/api/auth/register", response_model=AuthResponse)
def register(user_data: UserRegister):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email.lower(),))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists. Please log in."
            )
        
        pwd_hash = hash_password(user_data.password)
        cursor.execute("""
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
        """, (user_data.name.strip(), user_data.email.lower(), pwd_hash))
        
        user_id = cursor.lastrowid
        cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (user_id,))
        new_user = dict(cursor.fetchone())
        
        token = create_access_token(new_user["id"], new_user["email"], new_user["name"])
        return {
            "token": token,
            "user": new_user,
            "message": "Account created successfully! Welcome to Luna Accessories."
        }

@app.post("/api/auth/login", response_model=AuthResponse)
def login(credentials: UserLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?", (credentials.email.lower(),))
        user_row = cursor.fetchone()
        
        if not user_row or not verify_password(credentials.password, user_row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password. Please try again."
            )
        
        user = {
            "id": user_row["id"],
            "name": user_row["name"],
            "email": user_row["email"],
            "created_at": user_row["created_at"]
        }
        token = create_access_token(user["id"], user["email"], user["name"])
        return {
            "token": token,
            "user": user,
            "message": f"Welcome back, {user['name']}!"
        }

@app.get("/api/auth/me")
def get_profile(current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cart_items_count FROM cart_items WHERE user_id = ?", (current_user["id"],))
        cart_count = cursor.fetchone()["cart_items_count"]

        cursor.execute("SELECT COUNT(*) as orders_count FROM orders WHERE user_id = ?", (current_user["id"],))
        orders_count = cursor.fetchone()["orders_count"]

    return {
        "user": current_user,
        "stats": {
            "cart_items_count": cart_count,
            "orders_count": orders_count
        }
    }

# ================= PRODUCTS ENDPOINTS =================

@app.get("/api/products", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("popular")
):
    query = "SELECT * FROM products WHERE 1=1"
    params = []

    if category and category.lower() != "all":
        query += " AND LOWER(category) = LOWER(?)"
        params.append(category)

    if search:
        search_pattern = f"%{search.strip().lower()}%"
        query += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)"
        params.extend([search_pattern, search_pattern])

    if sort_by == "price-asc":
        query += " ORDER BY price ASC"
    elif sort_by == "price-desc":
        query += " ORDER BY price DESC"
    elif sort_by == "rating":
        query += " ORDER BY rating DESC"
    elif sort_by == "new":
        query += " ORDER BY is_new DESC, price ASC"
    else:
        # Default: bestsellers first, then name
        query += " ORDER BY is_bestseller DESC, rating DESC"

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        products = []
        for r in rows:
            p = dict(r)
            p["in_stock"] = bool(p["in_stock"])
            p["is_bestseller"] = bool(p["is_bestseller"])
            p["is_new"] = bool(p["is_new"])
            products.append(p)
        return products

@app.get("/api/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
        p = dict(row)
        p["in_stock"] = bool(p["in_stock"])
        p["is_bestseller"] = bool(p["is_bestseller"])
        p["is_new"] = bool(p["is_new"])
        return p

# ================= CART ENDPOINTS =================

def _calculate_cart_totals(items: list) -> dict:
    total_items = sum(item["quantity"] for item in items)
    subtotal = sum(item["price"] * item["quantity"] for item in items)
    # Free shipping on orders over ₹2000, else ₹150 (free when cart is empty)
    shipping = 0.0 if (subtotal >= 2000 or subtotal == 0) else 150.0
    discount = 0.0
    total = subtotal + shipping - discount
    return {
        "items": items,
        "total_items": total_items,
        "subtotal": round(subtotal, 2),
        "shipping": round(shipping, 2),
        "discount": round(discount, 2),
        "total": round(total, 2),
    }

@app.get("/api/cart", response_model=CartResponse)
def get_cart(current_user: Optional[dict] = Depends(get_current_user_optional)):
    if not current_user:
        return _calculate_cart_totals([])

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, product_id, name, price, image, quantity, category, updated_at
            FROM cart_items
            WHERE user_id = ?
            ORDER BY updated_at DESC
        """, (current_user["id"],))
        rows = [dict(r) for r in cursor.fetchall()]
        return _calculate_cart_totals(rows)

@app.post("/api/cart/add", response_model=CartResponse)
def add_to_cart(item: CartItemAdd, current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, quantity FROM cart_items
            WHERE user_id = ? AND product_id = ?
        """, (current_user["id"], item.product_id))
        existing = cursor.fetchone()

        if existing:
            new_qty = existing["quantity"] + item.quantity
            cursor.execute("""
                UPDATE cart_items
                SET quantity = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (new_qty, existing["id"]))
        else:
            cursor.execute("""
                INSERT INTO cart_items (user_id, product_id, name, price, image, quantity, category)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (current_user["id"], item.product_id, item.name, item.price, item.image, item.quantity, item.category or ""))

    return get_cart(current_user)

@app.put("/api/cart/update", response_model=CartResponse)
def update_cart_item(item: CartItemUpdate, product_id: str = Query(...), current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        if item.quantity <= 0:
            cursor.execute("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", (current_user["id"], product_id))
        else:
            cursor.execute("""
                UPDATE cart_items
                SET quantity = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ? AND product_id = ?
            """, (item.quantity, current_user["id"], product_id))

    return get_cart(current_user)

@app.delete("/api/cart/item/{product_id}", response_model=CartResponse)
def delete_cart_item(product_id: str, current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", (current_user["id"], product_id))

    return get_cart(current_user)

@app.delete("/api/cart/clear", response_model=CartResponse)
def clear_cart(current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM cart_items WHERE user_id = ?", (current_user["id"],))

    return get_cart(current_user)

@app.post("/api/cart/sync", response_model=CartResponse)
def sync_cart(sync_data: SyncCartRequest, current_user: dict = Depends(get_current_user)):
    """Merges offline/guest cart items into the user's persisted cart upon logging in."""
    with get_db() as conn:
        cursor = conn.cursor()
        for item in sync_data.items:
            cursor.execute("""
                SELECT id, quantity FROM cart_items
                WHERE user_id = ? AND product_id = ?
            """, (current_user["id"], item.product_id))
            existing = cursor.fetchone()
            if existing:
                cursor.execute("""
                    UPDATE cart_items
                    SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (item.quantity, existing["id"]))
            else:
                cursor.execute("""
                    INSERT INTO cart_items (user_id, product_id, name, price, image, quantity, category)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (current_user["id"], item.product_id, item.name, item.price, item.image, item.quantity, item.category or ""))

    return get_cart(current_user)

# ================= CART HISTORY & CHECKOUT ENDPOINTS =================

@app.post("/api/checkout", response_model=OrderResponse)
def checkout(payload: CheckoutRequest, current_user: dict = Depends(get_current_user)):
    """
    Checkouts the active cart:
    - Creates a permanent order snapshot in the order history
    - Records every item purchased
    - Clears the active cart
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT product_id, name, price, image, quantity, category
            FROM cart_items
            WHERE user_id = ?
        """, (current_user["id"],))
        cart_rows = [dict(r) for r in cursor.fetchall()]

        if not cart_rows:
            raise HTTPException(status_code=400, detail="Cannot checkout with an empty cart.")

        subtotal = sum(item["price"] * item["quantity"] for item in cart_rows)
        discount = 0.0
        if payload.promo_code and payload.promo_code.strip().upper() in ["LUNA10", "WELCOME10"]:
            discount = round(subtotal * 0.10, 2)
        
        shipping = 0.0 if subtotal >= 2000 else 150.0
        total_amount = round(subtotal + shipping - discount, 2)

        order_num = f"LUNA-{datetime.utcnow().year}-{random.randint(1000, 9999)}"

        cursor.execute("""
            INSERT INTO orders (order_number, user_id, subtotal, discount, shipping, total_amount, status, shipping_address, payment_method)
            VALUES (?, ?, ?, ?, ?, ?, 'Confirmed', ?, ?)
        """, (
            order_num,
            current_user["id"],
            subtotal,
            discount,
            shipping,
            total_amount,
            payload.shipping_address or "Standard Shipping Address",
            payload.payment_method or "Credit Card / UPI"
        ))
        order_id = cursor.lastrowid

        for item in cart_rows:
            cursor.execute("""
                INSERT INTO order_items (order_id, product_id, name, price, quantity, image, category)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (order_id, item["product_id"], item["name"], item["price"], item["quantity"], item["image"], item["category"]))

        # Clear the active cart
        cursor.execute("DELETE FROM cart_items WHERE user_id = ?", (current_user["id"],))

    return get_order_by_id(order_id, current_user)

@app.get("/api/cart/history", response_model=List[OrderResponse])
def get_cart_history(current_user: dict = Depends(get_current_user)):
    """Fetches all past orders / cart checkout history for the authenticated user."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, order_number, created_at, total_amount, subtotal, discount, shipping, status, shipping_address, payment_method
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
        """, (current_user["id"],))
        order_rows = [dict(r) for r in cursor.fetchall()]

        results = []
        for o in order_rows:
            cursor.execute("""
                SELECT id, product_id, name, price, quantity, image, category
                FROM order_items
                WHERE order_id = ?
            """, (o["id"],))
            o["items"] = [dict(item) for item in cursor.fetchall()]
            results.append(o)

        return results

@app.get("/api/cart/history/{order_id}", response_model=OrderResponse)
def get_order_by_id(order_id: int, current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, order_number, created_at, total_amount, subtotal, discount, shipping, status, shipping_address, payment_method
            FROM orders
            WHERE id = ? AND user_id = ?
        """, (order_id, current_user["id"]))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Order not found")
        order = dict(row)

        cursor.execute("""
            SELECT id, product_id, name, price, quantity, image, category
            FROM order_items
            WHERE order_id = ?
        """, (order_id,))
        order["items"] = [dict(item) for item in cursor.fetchall()]
        return order

