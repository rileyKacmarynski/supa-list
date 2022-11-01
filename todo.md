# To Do

## Next 13 came out!!!

- Create stories for each page
  - I think this should be pretty simple
- Get things working, then worry about server components
- Re-evaluate auth context provider
  - Why do I even have it? Wrapping the layout in the provider is going to be problematic with Next13.
  - Should I just call methods directly on the `AuthClient` or is there a reason to use state?
- Figure out how to do side list nav as a nested layout
- Create lists list component
- Lists CRUD with SUPABASE
  - don't forget about MSW
- should I get things working with supabase now, or get it working locally?
  - Maybe try to do the supabase route to get something working, then attack storing it locally and other fun jazz
