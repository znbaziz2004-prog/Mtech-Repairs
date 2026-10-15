# Database

Mtech & Repairs uses **MySQL** (via Sequelize). Models live in `backend/src/models/`
and tables are created automatically on first server start (`sequelize.sync()`).

## One-time setup

```sql
CREATE DATABASE mtech_repairs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then fill the `DB_*` values in `backend/.env`.

## Tables

| Table               | Purpose                                              |
|---------------------|------------------------------------------------------|
| `devices`           | Devices the shop repairs                             |
| `services`          | Repair / diagnostic / accessory service catalog      |
| `bookings`          | Customer repair booking requests                     |
| `products`          | Devices for sale / sell-in requests                  |
| `accessories`       | Accessories catalog                                  |
| `contact_messages`  | Contact form submissions                             |
| `testimonials`      | Customer reviews                                     |
| `admins`            | Admin panel users                                    |
| `orders`            | Customer orders                                      |
| `order_items`       | Line items of an order (FK -> `orders.id`, cascade)  |

## Seeding / migrating

```
npm run seed            # starter data + admin account from .env
npm run migrate:mongo   # optional: copy old MongoDB data into MySQL (run once)
```
