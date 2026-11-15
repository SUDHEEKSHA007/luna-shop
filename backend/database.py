import sqlite3
import os
import hashlib
import secrets
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), "luna.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

@contextmanager
def get_db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def _hash_pass(password: str, salt: str = "lunasalt123456789") -> str:
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}:{key.hex()}"

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Products table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                original_price REAL,
                image TEXT NOT NULL,
                rating REAL DEFAULT 4.8,
                reviews_count INTEGER DEFAULT 35,
                description TEXT NOT NULL,
                in_stock INTEGER DEFAULT 1,
                is_bestseller INTEGER DEFAULT 0,
                is_new INTEGER DEFAULT 0
            );
        """)

        # Cart items table (active user cart)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cart_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                product_id TEXT NOT NULL,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                image TEXT NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                category TEXT DEFAULT '',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                UNIQUE (user_id, product_id)
            );
        """)

        # Order history (cart checkout history snapshot)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_number TEXT UNIQUE NOT NULL,
                user_id INTEGER NOT NULL,
                subtotal REAL NOT NULL,
                discount REAL DEFAULT 0,
                shipping REAL DEFAULT 0,
                total_amount REAL NOT NULL,
                status TEXT DEFAULT 'Delivered',
                shipping_address TEXT,
                payment_method TEXT DEFAULT 'Credit Card / UPI',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );
        """)

        # Order items table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id TEXT NOT NULL,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                image TEXT NOT NULL,
                category TEXT DEFAULT '',
                FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
            );
        """)

        # Seed products if empty
        cursor.execute("SELECT COUNT(*) as count FROM products")
        if cursor.fetchone()["count"] == 0:
            seed_products(cursor)

        # Seed demo user & order history if empty
        cursor.execute("SELECT COUNT(*) as count FROM users WHERE email = 'demo@luna.com'")
        if cursor.fetchone()["count"] == 0:
            cursor.execute("""
                INSERT INTO users (name, email, password_hash)
                VALUES ('Aria Montgomery', 'demo@luna.com', ?)
            """, (_hash_pass("luna123"),))
            demo_user_id = cursor.lastrowid
            
            # Seed 1 initial cart item for demo user
            cursor.execute("""
                INSERT INTO cart_items (user_id, product_id, name, price, image, quantity, category)
                VALUES (?, 'pearl-earrings', 'Pearl Earrings', 1499.0, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80', 1, 'Earrings')
            """, (demo_user_id,))

            # Seed 1 past cart order history for demo user
            cursor.execute("""
                INSERT INTO orders (order_number, user_id, subtotal, discount, shipping, total_amount, status, shipping_address, payment_method, created_at)
                VALUES ('LUNA-2026-8841', ?, 4798.0, 200.0, 0.0, 4598.0, 'Delivered', '12 Kensington High St, Suite 4B', 'UPI / Card', '2026-11-01 14:20:00')
            """, (demo_user_id,))
            order_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO order_items (order_id, product_id, name, price, quantity, image, category)
                VALUES (?, 'golden-necklace', 'Golden Sunburst Necklace', 2899.0, 1, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80', 'Necklaces')
            """, (order_id,))
            cursor.execute("""
                INSERT INTO order_items (order_id, product_id, name, price, quantity, image, category)
                VALUES (?, 'charm-bracelet', 'Celestial Charm Bracelet', 1899.0, 1, 'https://images.unsplash.com/photo-1611591475853-bc2a2c0f2a96?auto=format&fit=crop&w=700&q=80', 'Bracelets')
            """, (order_id,))

def seed_products(cursor):
    sample_products = [
        (
            "pearl-earrings",
            "Pearl Earrings",
            "Earrings",
            1499.0,
            1899.0,
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
            4.9,
            84,
            "Lustrous baroque freshwater pearls suspended from delicate 18k gold vermeil posts. Timeless refinement for daytime or gala evenings.",
            1,
            1,
            0
        ),
        (
            "golden-necklace",
            "Golden Sunburst Necklace",
            "Necklaces",
            2899.0,
            3499.0,
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
            4.8,
            128,
            "Intricately engraved medallion suspended on an adjustable Figaro chain. Layer it or let it shine as your statement centerpiece.",
            1,
            1,
            0
        ),
        (
            "charm-bracelet",
            "Celestial Charm Bracelet",
            "Bracelets",
            1899.0,
            2299.0,
            "https://images.unsplash.com/photo-1611591475853-bc2a2c0f2a96?auto=format&fit=crop&w=700&q=80",
            4.7,
            49,
            "Delicate wristlet featuring lunar crescent and star motifs handset with sparkling micro-zirconia stones.",
            1,
            0,
            1
        ),
        (
            "minimal-ring",
            "Minimalist Stack Ring",
            "Rings",
            1199.0,
            1499.0,
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80",
            4.8,
            67,
            "Clean geometric band with high-polish mirror finish. Designed for stacking effortlessly across fingers.",
            1,
            0,
            0
        ),
        (
            "pearl-pendant",
            "Luminescent Pearl Pendant",
            "Necklaces",
            2199.0,
            2699.0,
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
            4.9,
            92,
            "A solitary teardrop cultured pearl encased in a sculptural warm-gold cradle. An heirloom-quality staple.",
            1,
            1,
            0
        ),
        (
            "floral-earrings",
            "Petal & Blossom Studs",
            "Earrings",
            1699.0,
            2099.0,
            "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=700&q=80",
            4.6,
            42,
            "Organic floral silhouette crafted with matte brushed gold petals and a luminous crystal core.",
            1,
            0,
            1
        ),
        (
            "emerald-cuff",
            "Emerald Accent Open Cuff",
            "Bracelets",
            2499.0,
            2999.0,
            "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=700&q=80",
            4.9,
            38,
            "Sleek architectural cuff tipped with deep-green created emerald baguettes. Flexible fit for any wrist size.",
            1,
            0,
            1
        ),
        (
            "opal-solitaire",
            "Opal Horizon Ring",
            "Rings",
            1799.0,
            2199.0,
            "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=700&q=80",
            4.8,
            55,
            "Natural Australian crystal opal exhibiting mesmerizing iridescent play-of-color mounted in 14k gold bezel.",
            1,
            1,
            0
        )
    ]
    cursor.executemany("""
        INSERT OR REPLACE INTO products (id, name, category, price, original_price, image, rating, reviews_count, description, in_stock, is_bestseller, is_new)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, sample_products)
