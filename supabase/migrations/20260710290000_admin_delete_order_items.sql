drop policy if exists "authenticated can delete order items" on public.order_items;

create policy "authenticated can delete order items"
  on public.order_items for delete
  to authenticated
  using (true);
