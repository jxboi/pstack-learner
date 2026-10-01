import { useState, type ReactNode } from 'react'

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) out.push(<strong key={`${keyBase}-${i++}`}>{inline(tok.slice(2, -2), `${keyBase}-${i}`)}</strong>)
    else out.push(<code key={`${keyBase}-${i++}`}>{tok.slice(1, -1)}</code>)
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard blocked */
    }
  }
  const lines = code.split('\n')
  return (
    <pre className="codeblock">
      <button className="copy" onClick={copy} type="button">
        {copied ? 'Copied' : 'Copy'}
      </button>
      {lines.map((line, i) => {
        const m = line.match(/^(\/[a-z0-9-]+)(.*)$/)
        return (
          <span key={i}>
            {m ? (
              <>
                <span className="slash">{m[1]}</span>
                {m[2]}
              </>
            ) : (
              line
            )}
            {i < lines.length - 1 ? '\n' : ''}
          </span>
        )
      })}
    </pre>
  )
}

export function Markdown({ text, className = '' }: { text: string; className?: string }) {
  const blocks: ReactNode[] = []
  const parts = text.split(/```\n?/)
  parts.forEach((part, pi) => {
    if (pi % 2 === 1) {
      blocks.push(<CodeBlock key={`c${pi}`} code={part.replace(/\n$/, '')} />)
      return
    }
    const paras = part.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    paras.forEach((p, i) => {
      const lines = p.split('\n')
      const k = `${pi}-${i}`
      if (lines.every((l) => /^- /.test(l))) {
        blocks.push(
          <ul key={k}>
            {lines.map((l, j) => (
              <li key={j}>{inline(l.slice(2), `${k}-${j}`)}</li>
            ))}
          </ul>,
        )
      } else if (lines.every((l) => /^\d+\. /.test(l))) {
        blocks.push(
          <ol key={k}>
            {lines.map((l, j) => (
              <li key={j}>{inline(l.replace(/^\d+\. /, ''), `${k}-${j}`)}</li>
            ))}
          </ol>,
        )
      } else if (lines.length > 1 && lines.slice(1).every((l) => /^(- |\d+\. )/.test(l))) {
        const ordered = /^\d+\. /.test(lines[1])
        const items = lines.slice(1).map((l, j) => <li key={j}>{inline(l.replace(/^(- |\d+\. )/, ''), `${k}-${j}`)}</li>)
        blocks.push(<p key={`${k}p`}>{inline(lines[0], `${k}h`)}</p>)
        blocks.push(ordered ? <ol key={k}>{items}</ol> : <ul key={k}>{items}</ul>)
      } else {
        blocks.push(<p key={k}>{inline(lines.join(' '), k)}</p>)
      }
    })
  })
  return <div className={`md ${className}`}>{blocks}</div>
}

export function Inline({ text }: { text: string }) {
  return <>{inline(text, 'i')}</>
}
