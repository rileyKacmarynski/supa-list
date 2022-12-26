# To Do

- finish moving everything over to react query
  - figure out some way to do keys
  - dont fetch list details prior to loading
- get CRUD working for items
  - don't forget about MSW
  - Figure out how we're going to handle reordering
- Work on styling list

# At some point

- How do we manage offline features?
  - Can swr help us out here?
  - is it worth bringing in something like replicache?
  - I'm not imagining conflicts really creating a problem, so maybe we can get away with optimistic UI and SWR
  - Unsure how SWR can work in offline situations though (can it handle syncing changes)
