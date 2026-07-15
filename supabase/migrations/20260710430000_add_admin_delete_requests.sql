drop policy if exists "authenticated can delete orders" on public.orders;

create policy "authenticated can delete orders"
  on public.orders for delete
  to authenticated
  using (true);

drop policy if exists "authenticated can delete callback requests" on public.callback_requests;

create policy "authenticated can delete callback requests"
  on public.callback_requests for delete
  to authenticated
  using (true);
