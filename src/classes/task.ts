import { Due } from './due'

export abstract class Task {
  assignee: number
  comment_count: number
  completed: boolean
  content: string
  due: Due
  id: number
  label_ids: number[]
  order: number
  priority: 1 | 2 | 3 | 4
  project_id: number
  section_id: number
  parent_id: number
  url: string
}
