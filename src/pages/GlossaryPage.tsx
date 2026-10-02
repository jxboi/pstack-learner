import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { GLOSSARY, type Term } from '../content/glossary'
import { course } from '../content/course'

const TAGS: Term['tag'][] = ['Concept', 'Skill', 'Playbook', 'Cursor', 'Git', 'Principle']
const TAG_HUE: Record<Term['tag'], number> = { Concept: 205, Skill: 275, Playbook: 45, Cursor: 150, Git: 20, Principle: 185 }

export function GlossaryPage() {
  const [params, setParams] = useSearchParams()
  const [tag, setTag] = useState<Term['tag'] | 'All'>('All')
  const q = params.get('q') ?? ''
  const list = useMemo(() => {
    const needle = q.toLowerCase().trim()
    return GLOSSARY.filter((t) => (tag === 'All' || t.tag === tag) && (!needle || t.term.toLowerCase().includes(needle) || t.plain.toLowerCase().includes(needle))).sort((a, b) =>
      a.term.replace(/^\//, '').localeCompare(b.term.replace(/^\//, '')),
    )
  }, [q, tag])
  return (
    <main className="page">
      <div className="container">
        <h1 style={{ fontSize: 34, fontWeight: 800 }}>Glossary</h1>
        <p className="muted" style={{ margin: '6px 0 18px', fontSize: 16 }}>
          Every pstack term in one plain sentence. {GLOSSARY.length} terms.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
          <input className="input" style={{ maxWidth: 360 }} placeholder="Search terms…" value={q} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} aria-label="Search glossary" />
          <div className="pill-tabs scroll">
            {(['All', ...TAGS] as const).map((t) => (
              <button key={t} className={tag === t ? 'on' : ''} onClick={() => setTag(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="glossary-grid">
          {list.map((t, i) => {
            const unit = course.find((u) => u.id === t.unit)
            return (
              <motion.div key={t.term} className="card term-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.02 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                  <h3>{t.term}</h3>
                  <span className="chip" style={{ background: `hsl(${TAG_HUE[t.tag]} 80% 92%)`, color: `hsl(${TAG_HUE[t.tag]} 60% 28%)`, borderColor: 'transparent', fontSize: 11 }}>
                    {t.tag}
                  </span>
                </div>
                <p>{t.plain}</p>
                {unit && (
                  <Link to={`/unit/${unit.id}`} style={{ fontSize: 13, fontWeight: 700, color: 'var(--sky-ink)' }}>
                    {unit.icon} Learn it in Unit {unit.index} →
                  </Link>
                )}
              </motion.div>
            )
          })}
        </div>
        {list.length === 0 && <p className="muted">No terms match "{q}".</p>}
      </div>
    </main>
  )
}
