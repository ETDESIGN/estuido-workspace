// Agent Task Queue Manager
// Provides a simple system to track what each agent is working on

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked'
export type AgentId = 'gm' | 'cto' | 'qa'

export interface Task {
  id: string
  title: string
  description: string
  assignee: AgentId
  status: TaskStatus
  priority: 'P0' | 'P1' | 'P2'
  createdAt: number
  updatedAt: number
  completedAt?: number
}

interface TaskQueue {
  tasks: Task[]
  lastUpdated: number | null
}

const QUEUE_FILE = join(process.cwd(), 'data', 'task-queue', 'queue.json')

function loadQueue(): TaskQueue {
  if (!existsSync(QUEUE_FILE)) {
    return { tasks: [], lastUpdated: null }
  }
  try {
    return JSON.parse(readFileSync(QUEUE_FILE, 'utf-8'))
  } catch {
    return { tasks: [], lastUpdated: null }
  }
}

function saveQueue(queue: TaskQueue): void {
  queue.lastUpdated = Date.now()
  writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2))
}

export function addTask(
  title: string,
  description: string,
  assignee: AgentId,
  priority: 'P0' | 'P1' | 'P2' = 'P1'
): Task {
  const queue = loadQueue()
  const task: Task = {
    id: `task-${Date.now()}`,
    title,
    description,
    assignee,
    status: 'pending',
    priority,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  queue.tasks.push(task)
  saveQueue(queue)
  return task
}

export function getTasks(assignee?: AgentId): Task[] {
  const queue = loadQueue()
  if (assignee) {
    return queue.tasks.filter(t => t.assignee === assignee)
  }
  return queue.tasks
}

export function getTaskById(id: string): Task | undefined {
  const queue = loadQueue()
  return queue.tasks.find(t => t.id === id)
}

export function updateTaskStatus(id: string, status: TaskStatus): Task | undefined {
  const queue = loadQueue()
  const task = queue.tasks.find(t => t.id === id)
  if (task) {
    task.status = status
    task.updatedAt = Date.now()
    if (status === 'completed') {
      task.completedAt = Date.now()
    }
    saveQueue(queue)
    return task
  }
  return undefined
}

export function getActiveTasks(assignee?: AgentId): Task[] {
  const queue = loadQueue()
  let tasks = queue.tasks.filter(t => t.status === 'in_progress' || t.status === 'pending')
  if (assignee) {
    tasks = tasks.filter(t => t.assignee === assignee)
  }
  // Sort by priority
  const priorityOrder = { P0: 0, P1: 1, P2: 2 }
  return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
}

export function getAgentStatus(): Record<AgentId, { currentTask: Task | null; activeCount: number }> {
  const queue = loadQueue()
  
  const agents: AgentId[] = ['gm', 'cto', 'qa']
  const status: Record<AgentId, { currentTask: Task | null; activeCount: number }> = {} as any
  
  for (const agent of agents) {
    const agentTasks = queue.tasks.filter(t => t.assignee === agent)
    const inProgress = agentTasks.find(t => t.status === 'in_progress')
    const activeCount = agentTasks.filter(t => t.status === 'in_progress' || t.status === 'pending').length
    
    status[agent] = {
      currentTask: inProgress || null,
      activeCount,
    }
  }
  
  return status
}

export function clearCompletedTasks(): number {
  const queue = loadQueue()
  const before = queue.tasks.length
  queue.tasks = queue.tasks.filter(t => t.status !== 'completed')
  saveQueue(queue)
  return before - queue.tasks.length
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2)
  const command = args[0]
  
  switch (command) {
    case 'list':
      console.log('📋 All Tasks:')
      getTasks().forEach(t => {
        console.log(`  [${t.status}] ${t.priority} ${t.assignee}: ${t.title}`)
      })
      break
      
    case 'active':
      console.log('🎯 Active Tasks:')
      getActiveTasks().forEach(t => {
        console.log(`  [${t.status}] ${t.priority} ${t.assignee}: ${t.title}`)
      })
      break
      
    case 'status':
      console.log('👥 Agent Status:')
      const agentStatus = getAgentStatus()
      for (const [agent, info] of Object.entries(agentStatus)) {
        const task = info.currentTask
        console.log(`  ${agent}: ${task ? `Working on "${task.title}"` : 'Idle'} (${info.activeCount} active)`)
      }
      break
      
    case 'add':
      const [, , title, description, assignee, priority] = args
      if (!title || !assignee) {
        console.error('Usage: add <title> <description> <assignee> [priority]')
        process.exit(1)
      }
      const newTask = addTask(title, description || '', assignee as AgentId, (priority as any) || 'P1')
      console.log(`✅ Created task: ${newTask.id}`)
      break
      
    case 'update':
      const [, , id, status] = args
      if (!id || !status) {
        console.error('Usage: update <task-id> <status>')
        process.exit(1)
      }
      const updated = updateTaskStatus(id, status as TaskStatus)
      if (updated) {
        console.log(`✅ Updated task ${id} to ${status}`)
      } else {
        console.error(`❌ Task ${id} not found`)
      }
      break
      
    case 'clear':
      const cleared = clearCompletedTasks()
      console.log(`🗑️ Cleared ${cleared} completed tasks`)
      break
      
    default:
      console.log(`
Agent Task Queue CLI

Commands:
  list                    - List all tasks
  active                  - List active (pending/in_progress) tasks
  status                  - Show status of each agent
  add <title> <desc> <assignee> [priority] - Add a new task
  update <id> <status>    - Update task status
  clear                   - Remove completed tasks

Examples:
  node task-queue.ts add "Fix sidebar" "Navigation not working" cto P0
  node task-queue.ts update task-1234567890 in_progress
  node task-queue.ts status
`)
  }
}