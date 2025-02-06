export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-03'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skjrSdE1X813YOQ85C5ot3jm36Z5MxoZW4ZhDIxngLnD3iMaNNCIISGW6tyIbDhvgRI66xYkUmxe4BvfUrT5mYLYfAvOVox1sCTgOH0VzNRZ5ZTznYa4a2KdfJ72UOjyXrwDuLUyEkCXggaPWF7VJ1Nw064kQr6cqgLvBzv7CHpghJ5NNn4p",
  'Missing environment variable: NEXT_API_TOKEN'
)



function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
