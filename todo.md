# To Do

- start working on list items
- Bring in react query
  - maybe not yet, hopefully we can do most things with supabase realtime.
  - I'm already getting annoyed at a bunch of useEffect stuff

# At some point

- we should handle the lists through dynamic routing. Easier to just treat it as a SPA for now I think.
- How do we manage offline features?
  - I think (as of right now), I want to use React Query initially until things are functionally complete, then move to replicache
  - is it worth bringing in something like replicache?
  - I'm not imagining conflicts really creating a problem, so maybe we can get away with optimistic UI and React Query
  - Unsure how react query can work in offline situations though (can it handle syncing changes)
