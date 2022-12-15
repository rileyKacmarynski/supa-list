# To Do

- Lists CRUD with SUPABASE
  - just redirect back to login if user is unauthed. It's being a huge pain
- write playwright tests
- finish up styling
  - add some nice animations
- Bring in react query
  - I'm already getting annoyed at a bunch of useEffect stuff

# At some point

- What happens when you log out? should you keep your lists?
  - Maybe just redirect to login until I get to offline features
- How do we manage offline features?
  - I think (as of right now), I want to use React Query initially until things are functionally complete, then move to replicache
  - is it worth bringing in something like replicache?
  - I'm not imagining conflicts really creating a problem, so maybe we can get away with optimistic UI and React Query
  - Unsure how react query can work in offline situations though (can it handle syncing changes)
