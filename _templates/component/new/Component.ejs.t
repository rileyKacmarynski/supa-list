---
to: <%= path %>/<%= Name %>/<%= Name %>.tsx
---
import React from 'react'

export interface <%= Name %>Props { }

const <%= Name %>: React.FC<<%= Name %>Props> = (props) => {

  return (
    <>
      <h1><%= Name %></h1>
      <code>{JSON.stringify(props)}</code>
    </>
  )
}

export default <%= Name %>