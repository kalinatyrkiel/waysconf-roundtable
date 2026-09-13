import { useCallback, useEffect, useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import tweetImage from './assets/joanna-maciejewska-tweet.png'
import coIntelligenceCover from './assets/co-intelligence-book-cover.png'
import bookCover from './assets/reverse-centaur-book-cover.png'
import './App.css'

function CentaurIcon() {
  return (
    <svg className="mode-icon" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="10" y="29" width="30" height="14" rx="7" fill="currentColor" />
      <path
        d="M38 35 45.5 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M46 18 55 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M44 15.5 43 8l6 5.5Z" fill="currentColor" />
      <path
        d="M15 43.5 14 56M23 44.5 22 56M31 44.5 32.5 56M38 43.5 40 56"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M10.5 32C6 34 4 39 4.5 45"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CyborgIcon() {
  return (
    <svg className="mode-icon" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="7" r="3" fill="currentColor" />
      <path
        d="M32 10v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <rect
        x="14"
        y="16"
        width="36"
        height="28"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
      />
      <circle cx="25" cy="27" r="3.2" fill="currentColor" />
      <circle cx="39" cy="27" r="3.2" fill="currentColor" />
      <path
        d="M25 36h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M22 50h20M22 50v6M42 50v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const exerciseQuestion =
  'What is one AI practice your team could adopt next week — and what would make it trustworthy?'

const timerStages = [
  { label: '1 · Think', seconds: 60 },
  { label: '2 · Pair', seconds: 120 },
  { label: '4 · Four', seconds: 240 },
  { label: 'All · Share', seconds: 0 },
]

function ExerciseOverview() {
  const stages = [
    ['1', 'Think alone', '1 min'],
    ['2', 'Compare in pairs', '2 min'],
    ['4', 'Build in fours', '4 min'],
    ['ALL', 'Share patterns', 'Together'],
  ]

  return (
    <>
      <h2 className="slide-title">Start alone. Build together.</h2>
      <div className="exercise-flow">
        {stages.map(([number, label, time]) => (
          <div className="exercise-step" key={number}>
            <span className="exercise-number">{number}</span>
            <strong>{label}</strong>
            <small>{time}</small>
          </div>
        ))}
      </div>
      <p className="small-instruction">One idea becomes a shared, practical next step.</p>
    </>
  )
}

function ExerciseTimer() {
  const [stage, setStage] = useState(0)
  const [remaining, setRemaining] = useState(timerStages[0].seconds)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running || remaining <= 0) return
    const interval = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setRunning(false)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [running, remaining])

  const selectStage = (index: number) => {
    setStage(index)
    setRemaining(timerStages[index].seconds)
    setRunning(false)
  }

  const minutes = Math.floor(remaining / 60)
  const seconds = String(remaining % 60).padStart(2, '0')

  return (
    <div className="timer-layout">
      <div className="stage-tabs">
        {timerStages.map((item, index) => (
          <button
            key={item.label}
            className={stage === index ? 'active' : ''}
            onClick={() => selectStage(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="timer-display" aria-live="polite">
        {timerStages[stage].seconds === 0 ? 'ALL' : `${minutes}:${seconds}`}
      </div>
      <p className="timer-question">{exerciseQuestion}</p>
      <div className="timer-actions">
        {timerStages[stage].seconds > 0 && (
          <button className="primary-button" onClick={() => setRunning(!running)}>
            {running ? 'Pause' : remaining === 0 ? 'Restart' : 'Start'}
          </button>
        )}
        <button className="secondary-button" onClick={() => selectStage(stage)}>
          Reset
        </button>
      </div>
    </div>
  )
}

const slides = [
  {
    eyebrow: 'WaysConf 2026 · Roundtable',
    content: (
      <>
        <h1>
          Scaling AI in
          <br />
          <span className="accent">design processes</span>
        </h1>
        <p className="lede">From personal prompting to reliable team practice.</p>
      </>
    ),
    className: 'hero-slide',
  },
  {
    eyebrow: 'Hello',
    content: (
      <div className="intro-grid">
        <div>
          <h2>Kalina Tyrkiel-Szymańska</h2>
          <p className="role">Content Designer & UX Writing Trainer</p>
          <p className="company">Zendesk</p>
        </div>
        <div className="intro-statement">
          <p>
            I mostly taught writing.
            <br />
            <strong>Now I mostly teach AI.</strong>
          </p>
        </div>
      </div>
    ),
  },
  {
    eyebrow: 'Wrong direction',
    content: (
      <figure className="media-frame">
        <img
          src={tweetImage}
          alt="Tweet by Joanna Maciejewska: the biggest problem with pushing all-things-AI is the wrong direction. She wants AI to do laundry and dishes so she can do art and writing, not the reverse."
        />
      </figure>
    ),
    className: 'media-slide',
  },
  {
    eyebrow: 'Ethan Mollick',
    content: (
      <figure className="media-frame">
        <img
          src={coIntelligenceCover}
          alt="Book cover: Co-Intelligence: Living and Working with AI by Ethan Mollick."
        />
      </figure>
    ),
    className: 'media-slide',
  },
  {
    eyebrow: 'A useful metaphor',
    content: (
      <div className="metaphor-layout">
        <div>
          <p className="kicker">Centaurs and cyborgs</p>
          <h2>
            Centaurs keep the <span className="underlined">line</span> between
            the person and the machine.
            <br />
            For cyborgs, it’s <span className="blurred">blurred</span>.
          </h2>
        </div>
        <div className="mode-cards">
          <article>
            <div className="card-head">
              <CentaurIcon />
              <span className="card-label">Centaur</span>
            </div>
            <p>AI drafts the error messages. You decide which ones ship.</p>
          </article>
          <article className="featured-card">
            <div className="card-head">
              <CyborgIcon />
              <span className="card-label">Cyborg</span>
            </div>
            <p>
              You stay in the same design. You propose, AI challenges, you
              change it, AI challenges again. The final flow is both of yours.
            </p>
          </article>
        </div>
      </div>
    ),
  },
  {
    eyebrow: 'Cory Doctorow',
    content: (
      <figure className="media-frame">
        <img
          src={bookCover}
          alt="Book cover: The Reverse Centaur’s Guide to Life After AI by Cory Doctorow."
        />
      </figure>
    ),
    className: 'media-slide',
  },
  {
    eyebrow: 'Cory Doctorow’s warning',
    content: (
      <div className="metaphor-layout">
        <div>
          <p className="kicker">Reverse centaur</p>
          <h2>
            The machine decides.
            <br />
            <span className="coral">The human absorbs the mess.</span>
          </h2>
        </div>
        <div className="mode-cards">
          <article>
            <div className="card-head">
              <CentaurIcon />
              <span className="card-label">Centaur</span>
            </div>
            <p>AI drafts error messages. You decide which ones ship.</p>
          </article>
          <article className="reverse-card">
            <div className="card-head">
              <span className="reverse-icon">
                <CentaurIcon />
              </span>
              <span className="card-label">Reverse centaur</span>
            </div>
            <p>
              Someone prompts without context and ships the copy. You keep
              cleaning up the mess.
            </p>
          </article>
        </div>
      </div>
    ),
    className: 'coral-wash',
  },
  {
    eyebrow: 'The easy part',
    content: (
      <>
        <h2 className="display">
          We all know how to
          <br />
          <span className="coral">write a prompt.</span>
        </h2>
        <div className="bottom-note">
          <span>But a clever prompt is not a process.</span>
        </div>
      </>
    ),
    className: 'statement-slide',
  },
  {
    eyebrow: 'Content design · a placeholder story',
    content: (
      <>
        <h2 className="slide-title">From prompt trick to team capability</h2>
        <div className="comparison">
          <article>
            <span className="card-label">Personal shortcut</span>
            <h3>“Rewrite this error message.”</h3>
            <ul>
              <li>Fast output</li>
              <li>Hidden context</li>
              <li>Inconsistent review</li>
            </ul>
          </article>
          <div className="arrow">→</div>
          <article className="featured-card">
            <span className="card-label">Shared pattern</span>
            <h3>Critique against agreed content standards.</h3>
            <ul>
              <li>Context travels with the task</li>
              <li>Quality criteria are visible</li>
              <li>A person owns the final call</li>
            </ul>
          </article>
        </div>
        <p className="placeholder-note">Replace with a real Kalina story before presenting.</p>
      </>
    ),
  },
  {
    eyebrow: 'Scaling is a systems problem',
    content: (
      <>
        <h2 className="slide-title">A single win is not enough</h2>
        <div className="scale-steps">
          <div><span>01</span><strong>Individual</strong><p>A useful prompt</p></div>
          <div><span>02</span><strong>Team</strong><p>A repeatable practice</p></div>
          <div><span>03</span><strong>System</strong><p>Guardrails + feedback</p></div>
        </div>
      </>
    ),
  },
  {
    eyebrow: 'A practical test',
    content: (
      <>
        <h2 className="slide-title">Can the practice survive beyond its inventor?</h2>
        <div className="test-grid">
          <div><span>Useful</span><p>Does it solve a real recurring problem?</p></div>
          <div><span>Usable</span><p>Can a teammate run it without you?</p></div>
          <div><span>Trustworthy</span><p>Are inputs, review, and accountability clear?</p></div>
          <div><span>Learnable</span><p>Does feedback improve the process over time?</p></div>
        </div>
      </>
    ),
    className: 'blue-slide',
  },
  {
    eyebrow: '1–2–4–All',
    content: <ExerciseOverview />,
  },
  {
    eyebrow: 'Your question',
    content: (
      <>
        <blockquote>{exerciseQuestion}</blockquote>
        <p className="small-instruction">
          Be specific: name the practice, the people, and the smallest useful first step.
        </p>
      </>
    ),
    className: 'question-slide',
  },
  {
    eyebrow: '1–2–4–All · Facilitation',
    content: <ExerciseTimer />,
    className: 'timer-slide',
  },
  {
    eyebrow: 'Bring it back',
    content: (
      <>
        <h2 className="display">
          Scale the <span className="accent">conditions</span>,
          <br />not only the tool.
        </h2>
        <div className="closing-prompts">
          <span>What will you try?</span>
          <span>Who needs to shape it?</span>
          <span>How will you know it works?</span>
        </div>
      </>
    ),
  },
  {
    eyebrow: 'Continue the conversation',
    content: (
      <div className="qr-layout">
        <div>
          <h2>Take the question<br />back to your team.</h2>
          <p>Resources and follow-up</p>
          <div className="placeholder-pill">Placeholder link — replace before presenting</div>
        </div>
        <div className="qr-card">
          <QRCodeSVG
            value="https://example.com/scaling-ai-in-design"
            size={230}
            bgColor="#ffffff"
            fgColor="#050505"
            level="M"
          />
        </div>
      </div>
    ),
  },
]

function App() {
  const initialSlide = useMemo(() => {
    const hash = Number(window.location.hash.replace('#', ''))
    return hash >= 1 && hash <= slides.length ? hash - 1 : 0
  }, [])
  const [current, setCurrent] = useState(initialSlide)

  const goTo = useCallback((index: number) => {
    const next = Math.min(Math.max(index, 0), slides.length - 1)
    setCurrent(next)
    window.history.replaceState(null, '', `#${next + 1}`)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'BUTTON') return
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(event.key)) {
        event.preventDefault()
        goTo(current + 1)
      }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        goTo(current - 1)
      }
      if (event.key === 'Home') goTo(0)
      if (event.key === 'End') goTo(slides.length - 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [current, goTo])

  const slide = slides[current]

  return (
    <main className="deck">
      <section
        className={`slide ${slide.className ?? ''}`}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('button')) return
          goTo(current + 1)
        }}
      >
        <div className="ambient-shape shape-one" />
        <div className="ambient-shape shape-two" />
        <header className="slide-header">
          <span className="wordmark">WaysConf 2026</span>
          <span>Roundtable</span>
        </header>
        <div className="slide-content">{slide.content}</div>
        <footer className="slide-footer">
          <span>Building what matters</span>
          <span>{String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        </footer>
      </section>

      <nav className="deck-controls" aria-label="Slide navigation">
        <button onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Previous slide">←</button>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
        </div>
        <button onClick={() => goTo(current + 1)} disabled={current === slides.length - 1} aria-label="Next slide">→</button>
      </nav>
    </main>
  )
}

export default App
