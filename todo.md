# To Do

- start on displaying todo list
  - follow TDD, see if it's feasible with playwright, or just gets annoying
    - tests take a while to run, higher percentage code coverage isn't really what we're after with PW
  - keep on trucking on with msw even though it can be a pain
- might want to refactor the swr/supabase code stuff
  - I think for now I'm going to throw everything in those files just for simplicity

# At some point

- we should handle the lists through dynamic routing. Easier to just treat it as a SPA for now I think.
- How do we manage offline features?
  - Can swr help us out here?
  - is it worth bringing in something like replicache?
  - I'm not imagining conflicts really creating a problem, so maybe we can get away with optimistic UI and SWR
  - Unsure how SWR can work in offline situations though (can it handle syncing changes)

# Possible refactor for fun

I would like to toss all the "proper" architecture stuff out the window to see if it cleans stuff up. Mainly I want to:

- remove most of the abstractions around the supabse and swr stuff
- instead of hoisting state to a shared component lean on SWR as a shared cache and make calls closest to where the UI code for that thing is
- Hypothesis
  - The code will look nicer, but less prop drilling means less obvious dependencies
  - overall dev speed will be faster
  - Maybe grouping the fetching logic and stuff closer to where the UI uses it will lead to more concise code
  - Testing will be a pain. Instead of injecting stubs and mocks via props I'll have to stub things out at the module level
