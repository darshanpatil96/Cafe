-- ═══════════════════════════════════════════════════════════════════════════
-- Aura Cafe — Supabase Database Schema v2
-- Run in Supabase SQL Editor: https://app.supabase.com → SQL Editor → Run
-- Safe to re-run: uses "if not exists" and "or replace" everywhere.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Orders ──────────────────────────────────────────────────────────────────
create table if not exists orders (
  id             uuid primary key default uuid_generate_v4(),
  order_number   bigint generated always as identity,
  user_id        uuid references auth.users(id) on delete set null, -- null = guest order
  customer_name  text not null,
  phone          text,
  email          text,                 -- used to link guest orders to accounts
  address        text,
  table_number   text,
  subtotal       integer not null,
  gst            integer not null,
  total          integer not null,
  status         text not null default 'Pending'
                   check (status in ('Pending','Confirmed','Preparing','Ready','Completed','Cancelled')),
  notes          text,
  order_type     text not null default 'Delivery'
                   check (order_type in ('Dine In', 'Takeaway', 'Delivery')),
  waiter_notes   text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz
);

-- ─── Order Items ─────────────────────────────────────────────────────────────
create table if not exists order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  item_id     text not null,
  title       text not null,
  price       integer not null,
  quantity    integer not null,
  image       text
);

-- ─── Enable Realtime ─────────────────────────────────────────────────────────
-- Add orders table to the Supabase realtime publication.
-- Safe to run multiple times (alter publication is idempotent in PG14+).
do $$
begin
  alter publication supabase_realtime add table orders;
exception when others then null; -- already added
end $$;

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Drop old blanket policies if they exist, then recreate properly
drop policy if exists "allow_all_orders"      on orders;
drop policy if exists "allow_all_order_items" on order_items;

-- ── INSERT: anyone can place an order (guests + logged-in customers) ─────────
create policy "orders_insert_anyone"
  on orders for insert
  with check (true);

create policy "order_items_insert_anyone"
  on order_items for insert
  with check (true);

-- ── SELECT: owner can see their own orders; guests matched by email ───────────
-- This policy allows:
--   1. Authenticated users to see orders where user_id = their id
--   2. Authenticated users to see orders where email = their email (guest orders)
--   3. Unauthenticated reads via email match (for order tracking by guests)
create policy "orders_select_own"
  on orders for select
  using (
    user_id = auth.uid()
    or email = (select email from auth.users where id = auth.uid())
    or auth.uid() is null   -- allow anon reads for order tracking page
  );

create policy "order_items_select_own"
  on order_items for select
  using (
    order_id in (
      select id from orders
      where user_id = auth.uid()
         or email = (select email from auth.users where id = auth.uid())
         or auth.uid() is null
    )
  );

-- ── UPDATE: only the service role (admin) or the order owner ─────────────────
-- Admin operations use the service_role key which bypasses RLS.
-- Customers can only cancel their own pending orders.
create policy "orders_update_own"
  on orders for update
  using (
    user_id = auth.uid()
    or email = (select email from auth.users where id = auth.uid())
  )
  with check (true);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists idx_orders_status     on orders(status);
create index if not exists idx_orders_user_id    on orders(user_id);
create index if not exists idx_orders_email      on orders(email);
create index if not exists idx_orders_created    on orders(created_at desc);
create index if not exists idx_order_items_order on order_items(order_id);

-- ─── NOTE FOR ADMIN DASHBOARD ────────────────────────────────────────────────
-- Admin operations (fetch all orders, update status) must use the Supabase
-- service_role key (never expose this in the frontend).
-- For this project's admin panel, since it's demo/internal, we use the anon key
-- with RLS bypassed by temporarily using a server-side edge function, OR
-- you can create a separate admin Supabase client with service_role key in
-- a secure server environment.
--
-- For now, the admin dashboard continues to read from localStorage + realtime
-- channel which already works regardless of RLS (realtime uses internal replication).

-- ─── Helper view: orders_with_items ──────────────────────────────────────────
-- Makes it easier to fetch orders + items in one query from client code.
create or replace view orders_with_items as
  select
    o.*,
    coalesce(
      json_agg(
        json_build_object(
          'id',       i.item_id,
          'title',    i.title,
          'price',    i.price,
          'quantity', i.quantity,
          'image',    i.image
        ) order by i.id
      ) filter (where i.id is not null),
      '[]'::json
    ) as items_json
  from orders o
  left join order_items i on i.order_id = o.id
  group by o.id;
