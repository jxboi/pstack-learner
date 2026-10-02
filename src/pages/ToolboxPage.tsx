import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { course } from '../content/course'
import type { WidgetStep } from '../content/types'
import { WIDGETS } from '../widgets'
import { PLAYBOOKS } from '../content/playbooks'
import { PromptWorkbench, PrincipleCards } from '../widgets/misc'
import { CodeBlock } from '../components/Markdown'

const CHEATS: [string, string][] = [
  ['/add-plugin pstack', 'Install the plugin'],
  ['/setup-pstack', 'Pick models per role and a reasoning budget'],
  ['/poteto-mode <goal + check>', 'Front door for any non-trivial task'],
  ['/how <question>', 'How does this code work now?'],
  ['/why <question>', 'Why was it built this way? With citations.'],
  ['/teach me <topic>. convince me.', 'Really understand a change or subsystem'],
  ['/recall catch me up on <topic>', 'Rebuild your own recent context'],
  ['/architect with checkpoint', 'Design types and boundaries, stop before code'],
  ['/arena this, 5 candidates', 'Parallel attempts, judge, pick base, graft'],
  ['/swarm <slices>. one report.', 'Parallel coverage across slices'],
  ['/interrogate the branch, skeptically', 'Multi-model adversarial review'],
  ['/tdd implement', 'Failing test first, then the fix'],
  ['/unslop <target>, no emdashes', 'Remove AI tells from prose'],
  ['/no-comments the diff', 'Comment Sicko reviews comments'],
  ['/blast-radius of <change>', 'What else could this break? Proven by code.'],
  ['/create-verification-skill', 'Teach agents to drive your app'],
  ['/show-me-your-work catch me up', 'Summarize a run from its decision log'],
  ['/automate-me', 'Draft your own -mode skill from your history'],
  ['/reflect <what happened>', 'Turn a session into skill edits'],
  ['/bro', 'Restate the last reply in plain words'],
]

const TABS = ['Prompt workbench', 'Simulations', 'Cheat sheet', 'Playbooks', 'Principles'] as const

const SIMS = course.flatMap((u) =>
  u.lessons.flatMap((l) => l.steps.filter((s): s is WidgetStep => s.kind === 'widget').map((s) => ({ step: s, unit: u, lesson: l }))),
)

function Simulations() {
  const [params, setParams] = useSearchParams()
  const id = params.get('sim') ?? SIMS[0].step.widget
  const cur = SIMS.find((x) => x.step.widget === id) ?? SIMS[0]
  const W = WIDGETS[cur.step.widget]
  return (
    <div className="sim-layout">
      <div className="card" style={{ padding: 8, display: 'grid', gap: 2, alignContent: 'start', maxHeight: '75vh', overflow: 'auto' }}>
        {SIMS.map((x) => (
          <button
            key={x.step.widget}
            className="menu-item"
            style={{ fontSize: 14, background: x.step.widget === cur.step.widget ? 'var(--brand-soft)' : undefined, color: x.step.widget === cur.step.widget ? 'var(--brand)' : undefined }}
            onClick={() => setParams({ tab: 'Simulations', sim: x.step.widget }, { replace: true })}
          >
            <span>{x.unit.icon}</span>
            <span>{x.step.title}</span>
          </button>
        ))}
      </div>
      <div className="card" style={{ padding: 24 }}>
        <div className="eyebrow">
          Unit {cur.unit.index} · {cur.lesson.title}
        </div>
        <h2 style={{ fontSize: 24, margin: '4px 0 6px' }}>{cur.step.title}</h2>
        {cur.step.intro && <p style={{ marginTop: 0, color: 'var(--ink-2)' }}>{cur.step.intro}</p>}
        <W key={cur.step.widget} />
        <Link to={`/learn/${cur.unit.id}/${cur.lesson.id}`} style={{ display: 'inline-block', marginTop: 14, fontWeight: 700, color: 'var(--sky-ink)', fontSize: 14 }}>
          Open the full lesson →
        </Link>
      </div>
    </div>
  )
}

export function ToolboxPage() {
  const [params, setParams] = useSearchParams()
  const tab = (TABS as readonly string[]).includes(params.get('tab') ?? '') ? (params.get('tab') as (typeof TABS)[number]) : 'Prompt workbench'
  const setTab = (t: (typeof TABS)[number]) => setParams({ tab: t }, { replace: true })
  const tabsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // On phones the tab row scrolls; keep the active tab visible when arriving via a deep link.
    tabsRef.current?.querySelector('.on')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [tab])
  const [group, setGroup] = useState<string>('All')
  const groups = ['All', ...Array.from(new Set(PLAYBOOKS.map((p) => p.group)))]
  return (
    <main className="page">
      <div className="container">
        <h1 style={{ fontSize: 34, fontWeight: 800 }}>Toolbox</h1>
        <p className="muted" style={{ margin: '6px 0 18px', fontSize: 16 }}>
          Reference and tools for using pstack on your own projects.
        </p>
        <div className="pill-tabs scroll" style={{ marginBottom: 18 }} ref={tabsRef}>
          {TABS.map((t) => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Prompt workbench' && (
          <div style={{ maxWidth: 820 }}>
            <PromptWorkbench />
          </div>
        )}

        {tab === 'Cheat sheet' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 10 }}>
            {CHEATS.map(([cmd, what]) => (
              <div key={cmd} className="card" style={{ padding: 14 }}>
                <CodeBlock code={cmd} />
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-2)', marginTop: -6 }}>{what}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Playbooks' && (
          <>
            <div className="pill-tabs scroll" style={{ marginBottom: 14 }}>
              {groups.map((g) => (
                <button key={g} className={group === g ? 'on' : ''} onClick={() => setGroup(g)}>
                  {g}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
              {PLAYBOOKS.filter((p) => group === 'All' || p.group === group).map((p) => (
                <div key={p.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 26 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800 }}>{p.name}</div>
                      <div className="eyebrow" style={{ fontSize: 10.5 }}>
                        {p.group}
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: '10px 0', fontSize: 14.5, color: 'var(--ink-2)' }}>{p.plain}</p>
                  <div className="mono" style={{ fontSize: 12, background: 'var(--code-bg)', color: 'var(--code-ink)', padding: '8px 10px', borderRadius: 8 }}>
                    <span style={{ color: '#ffb3cb' }}>/poteto-mode</span> {p.example}
                  </div>
                  <a
                    href={`https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/${p.id === 'perf-issue' ? 'perf-issue' : p.id}.md`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-block', marginTop: 10, fontSize: 13, fontWeight: 700, color: 'var(--sky-ink)' }}
                  >
                    Read the playbook on GitHub ↗
                  </a>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'Principles' && <PrincipleCards />}

        {tab === 'Simulations' && <Simulations />}
      </div>
    </main>
  )
}
