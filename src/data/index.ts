import promptsData from "./prompts.json"

export type Prompt = (typeof promptsData)[0]

export const prompts = promptsData as Prompt[]

/** Một prompt có thể chạy được trên nhiều nền tảng (vd ChatGPT + Gemini). */
export function getPromptPlatforms(p: Prompt): string[] {
  const list = (p as { platforms?: string[] }).platforms
  if (Array.isArray(list) && list.length > 0) return list
  return [p.platform]
}

export const categories = [...new Set(prompts.map((p) => p.category))]

export const platforms = [
  ...new Set(prompts.flatMap((p) => getPromptPlatforms(p))),
].sort()

export function getPromptById(id: string): Prompt | undefined {
  return prompts.find((p) => p.id === id)
}

export function getPromptsByCategory(category: string): Prompt[] {
  if (category === "all") return prompts
  return prompts.filter((p) => p.category === category)
}

export function getPromptsByPlatform(platform: string): Prompt[] {
  if (platform === "all") return prompts
  return prompts.filter((p) => getPromptPlatforms(p).includes(platform))
}

export function searchPrompts(query: string): Prompt[] {
  const lowerQuery = query.toLowerCase()
  return prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.content.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}

export function getCategoryFromParams(params: Record<string, string | string[] | undefined>): string {
  const category = params.category
  if (typeof category === "string" && categories.includes(category)) {
    return category
  }
  return "all"
}