import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useParams, Link, useLocation } from 'react-router-dom'
import { modules, PASS } from './data.js'

const KEY = 'agentes-ia-progreso-v1'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }

function Module({ progress, save }) {
  const { id } = useParams()
  const idx = modules.findIndex(m => m.id === id)
  const m = modules[idx]
  const [ans, setAns] = useState({})
  const [result, setResult] = useState(null)
  useEffect(() => { setAns({}); setResult(null); window.scrollTo(0, 0) }, [id])
  if (!m) return <p>Módulo no encontrado. <Link to="/">Volver al inicio</Link></p>
  const submit = () => {
    const ok = m.quiz.filter((q, i) => ans[i] === q.a).length
    const score = ok * 10
    setResult(score)
    const prev = progress[m.id] || { best: 0 }
    save({ ...progress, [m.id]: { best: Math.max(prev.best, score), done: prev.done || score >= PASS } })
  }
  const next = modules[idx + 1]
  return (
    <article>
      <h1>{m.title}</h1>
      <section className="theory">{m.theory.map((t, i) => <p key={i}>{t}</p>)}</section>
      <h2>Ejercicio: 10 preguntas</h2>
      {m.quiz.map((q, i) => (
        <fieldset key={i} className="q">
          <legend>{i + 1}. {q.q}</legend>
          {q.o.map((o, j) => {
            const cls = result === null ? '' : j === q.a ? 'right' : ans[i] === j ? 'wrong' : ''
            return (
              <label key={j} className={cls}>
                <input type="radio" name={`q${i}`} disabled={result !== null} checked={ans[i] === j} onChange={() => setAns({ ...ans, [i]: j })} /> {o}
              </label>
            )
          })}
        </fieldset>
      ))}
      {result === null
        ? <button className="btn" disabled={Object.keys(ans).length < 10} onClick={submit}>Calificar ({Object.keys(ans).length}/10 contestadas)</button>
        : <div className={`result ${result >= PASS ? 'ok' : 'no'}`} role="status">
            <strong>Calificación: {result}/100.</strong> {result >= PASS ? 'Módulo completado.' : `Necesitas ${PASS} o más para completarlo.`}
            <div className="row">
              <button className="btn" onClick={() => { setAns({}); setResult(null); window.scrollTo(0, 0) }}>Reintentar</button>
              {result >= PASS && next && <Link className="btn" to={`/modulo/${next.id}`}>Siguiente módulo</Link>}
            </div>
          </div>}
    </article>
  )
}

export default function App() {
  const [progress, setProgress] = useState(load)
  const [dark, setDark] = useState(() => localStorage.getItem('tema') ? localStorage.getItem('tema') === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('tema', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => setOpen(false), [loc.pathname])
  const save = p => { setProgress(p); try { localStorage.setItem(KEY, JSON.stringify(p)) } catch {} }
  const done = modules.filter(m => progress[m.id]?.done).length
  return (
    <div className="shell">
      <header className="top">
        <button className="icon" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
        <span className="brand">Agentes inteligentes</span>
        <button className="icon" onClick={() => setDark(!dark)} aria-label="Cambiar tema">{dark ? 'Claro' : 'Oscuro'}</button>
      </header>
      <nav className={`side ${open ? 'open' : ''}`} aria-label="Módulos">
        <NavLink to="/" end>Inicio</NavLink>
        {modules.map((m, i) => (
          <NavLink key={m.id} to={`/modulo/${m.id}`}>
            <span>{i + 1}. {m.title}</span>
            <small>{progress[m.id]?.done ? `Completado (${progress[m.id].best})` : progress[m.id] ? `Mejor: ${progress[m.id].best}` : 'Pendiente'}</small>
          </NavLink>
        ))}
        <button className="link" onClick={() => { if (confirm('¿Borrar todo el progreso?')) save({}) }}>Reiniciar progreso</button>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<article>
            <h1>Agentes inteligentes y sistemas web con IA</h1>
            <p>Ocho módulos: teoría breve y un ejercicio de 10 preguntas que se califica al instante. Con {PASS} o más completas el módulo. Tu progreso se guarda en este navegador.</p>
            <p className="big">{done} de {modules.length} módulos completados</p>
            <Link className="btn" to={`/modulo/${(modules.find(m => !progress[m.id]?.done) || modules[0]).id}`}>{done ? 'Continuar' : 'Empezar'}</Link>
          </article>} />
          <Route path="/modulo/:id" element={<Module progress={progress} save={save} />} />
          <Route path="*" element={<p>Página no encontrada. <Link to="/">Inicio</Link></p>} />
        </Routes>
      </main>
    </div>
  )
}
