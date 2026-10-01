import type { ComponentType } from 'react'
import type { WidgetId } from '../content/types'
import { AgentLoop, SkillAnatomy, SlopVsClean, RepoExplorer, ModelRoles } from './basics'
import { Router, TodoFill, PromptGrader, WhyDetective } from './routing'
import { ArenaSim, SwarmSim, DesignLadder } from './design'
import { CommentSicko, TddCycle, StackLander, BabysitQueue } from './ship'
import { OvernightContract, NightLoop } from './night'
import { PrincipleCards, EvalBlind, PromptWorkbench } from './misc'

export const WIDGETS: Record<WidgetId, ComponentType> = {
  'agent-loop': AgentLoop,
  'skill-anatomy': SkillAnatomy,
  'slop-vs-clean': SlopVsClean,
  'repo-explorer': RepoExplorer,
  'model-roles': ModelRoles,
  router: Router,
  'todo-fill': TodoFill,
  'prompt-grader': PromptGrader,
  'why-detective': WhyDetective,
  'arena-sim': ArenaSim,
  'swarm-sim': SwarmSim,
  'design-ladder': DesignLadder,
  'comment-sicko': CommentSicko,
  'tdd-cycle': TddCycle,
  'stack-lander': StackLander,
  'babysit-queue': BabysitQueue,
  'overnight-contract': OvernightContract,
  'night-loop': NightLoop,
  'principle-cards': PrincipleCards,
  'eval-blind': EvalBlind,
  'prompt-workbench': PromptWorkbench,
}
