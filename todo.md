# To Do

- Deploy to vercel
  - run tests / setup CI
- Try out playwright
  - Really don't want to mess more with testing, but I'm not all that happy with the way cypress has turned out
    want to try vitest with playwright
    - It's tough to run all your component tests easily and quickly, vitest works better for that
    - playwright is supposedly quicker and the "record" functionality has peaked my interest
    - On the other hand the the browser experience for cypress e2e tests is really nice
- should I get things working with supabase now, or get it working locally?
  - Maybe try to do the supabase route to get something working, then attack storing it locally and other fun jazz

# Chores

- I need to rearrange the project
  - I think I'm going to ignore this for now
- try using hygen for scaffolding components
  - Should try this. Not sure about cy component tests yet, so I'll wait until I make a decision on those vs vitest before doing this

# Stuff that might get easier in the next version of NextJS

- add a second layout for unauthed stuff
  - could make this myself, but improvements here are coming in the next nextjs version
- try adding stories for the pages
  - can I create a folder for each page with an index that exports the page?
  - this stuff is coming later in Next.js forget about it for now
