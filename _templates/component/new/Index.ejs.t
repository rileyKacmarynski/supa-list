---
to: <%= path %>/<%= Name %>/index.ts
---
<% ComponentName = h.inflection.camelize(name, false) %>
export { default } from './<%= Name %>'
export * from './<%= Name %>'