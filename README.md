## Introspecting database using dirzzle

```sh
bunx drizzle-kit introspect:mysql --config=drizzle.railway.config.ts

rm -rf meta/ schema.ts 00**
bunx drizzle-kit introspect:mysql --config=drizzle.user.config.ts
```
