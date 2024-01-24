import * as userDatabase from '@database/users.database'
export async function stageUser(
  {
    id,
    email,
  }: {
    id: string
    email: string
  },
) {
  const data = await userDatabase.stageUser({
    id,
    email,
  })

  return data
}
