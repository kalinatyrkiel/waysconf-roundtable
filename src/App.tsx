import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import tweetImage from './assets/joanna-maciejewska-tweet.png'
import coIntelligenceCover from './assets/co-intelligence-book-cover.png'
import bookCover from './assets/reverse-centaur-book-cover.png'
import followUpQr from './assets/follow-up-qr.png'
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

const questionSets = [
  [
    'What are your centaur and reverse centaur tasks?',
    'What does AI help with, and where does it make things worse?',
  ],
  [
    'Scaling AI in your design team: what’s the one thing that works well?',
    'What’s the one thing you’d improve?',
  ],
  [
    'Getting closer to the centaur: what’s the one thing you want to try after this discussion?',
  ],
]

const bouncingTerms = [
  { word: 'Claude skills', lane: 0, drift: 0.05, dx: 7.5, dy: 5.3, offsetX: -1.2, offsetY: -3.9 },
  { word: 'Figma skills', lane: 0.17, drift: -0.05, dx: 9.4, dy: 6.7, offsetX: -6.8, offsetY: -1.1 },
  { word: '.md files', lane: 0.33, drift: 0.05, dx: 8.1, dy: 5.9, offsetX: -3.4, offsetY: -5.6 },
  { word: 'automations', lane: 0.5, drift: -0.05, dx: 10.6, dy: 7.3, offsetX: -9.2, offsetY: -2.8 },
  { word: 'workflows', lane: 0.67, drift: 0.05, dx: 8.8, dy: 6.1, offsetX: -4.7, offsetY: -6.4 },
  { word: 'evals', lane: 0.83, drift: -0.05, dx: 9.9, dy: 6.9, offsetX: -8.3, offsetY: -0.7 },
  { word: '(and many more)', lane: 1, drift: -0.04, dx: 11.2, dy: 7.8, offsetX: -5.9, offsetY: -4.6, white: true },
]

const timerStages = [
  { label: '1 · Think', seconds: 120 },
  { label: '2 · Person 1', seconds: 120 },
  { label: '2 · Person 2', seconds: 120 },
  { label: '4 · Four', seconds: 180 },
  { label: 'All · Share', seconds: 240 },
]

const harvestStages = timerStages.filter((stage) => !stage.label.includes('Person'))

function ExerciseOverview() {
  const stages = [
    ['1', 'Think alone', '2 min'],
    ['2', 'Compare in pairs', '4 min (2 min per person)'],
    ['4', 'Discuss in fours', '3 min'],
    ['ALL', 'Share findings', '4 min'],
  ]

  return (
    <>
      <h2 className="slide-title exercise-heading">
        I give you 3 questions
        <br />
        <span className="coral">You discuss</span>
      </h2>
      <div className="exercise-flow">
        {stages.map(([number, label, time]) => (
          <div className="exercise-step" key={number}>
            <span className="exercise-number">{number}</span>
            <strong>{label}</strong>
            {time ? <small>{time}</small> : <small className="time-placeholder">&nbsp;</small>}
          </div>
        ))}
      </div>
    </>
  )
}

function ExerciseTimer({
  questions,
  stages = timerStages,
}: {
  questions: string[]
  stages?: typeof timerStages
}) {
  const [stage, setStage] = useState(0)
  const [remaining, setRemaining] = useState(stages[0].seconds)
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
    setRemaining(stages[index].seconds)
    setRunning(false)
  }

  const minutes = Math.floor(remaining / 60)
  const seconds = String(remaining % 60).padStart(2, '0')

  return (
    <div className="timer-layout">
      <div className="stage-tabs">
        {stages.map((item, index) => (
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
        {`${minutes}:${seconds}`}
      </div>
      <div className="timer-copy">
        {stages[stage].label.includes('Person') && (
          <p className="speaker-cue">
            {stages[stage].label.includes('1') ? 'Person 1 speaks' : 'Person 2 speaks'}
          </p>
        )}
        <div className="timer-question">
          {questions.map((question) => (
            <p key={question}>{question}</p>
          ))}
        </div>
      </div>
      <div className="timer-actions">
        {stages[stage].seconds > 0 && (
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

function FavoriteToolSlide({ revealed, dropping }: { revealed: boolean; dropping: boolean }) {
  return (
    <div className="favorite-tool">
      <h2 className="display">
        My favorite
        <br />
        design tool?
      </h2>
      <div className={`favorite-reveal${revealed ? ' is-in' : ''}`} aria-hidden={!revealed}>
        <p className="favorite-answer">A comment.</p>
        <p className={`vibe-line${dropping ? ' is-in' : ''}`} aria-hidden={!dropping}>
          As we vibe code more, comments get harder to add…
        </p>
        <div className={`figma-comment${dropping ? ' is-dropping' : ''}`}>
          <span className="figma-pin">1</span>
          <article className="figma-thread">
            <header>
              <span className="figma-avatar">SK</span>
              <div>
                <strong>Susan Kare</strong>
                <time>2m</time>
              </div>
            </header>
            <p>I wonder if we should merge the 3 icons into one</p>
          </article>
        </div>
      </div>
    </div>
  )
}

type Slide = {
  eyebrow: string
  className?: string
  builds?: number
  content: ReactNode | ((build: number) => ReactNode)
}

const slides: Slide[] = [
  {
    eyebrow: 'WaysConf 2026 · Roundtable',
    content: (
      <>
        <h1>
          Scaling AI in
          <br />
          <span className="accent">design processes</span>
        </h1>
        <p className="lede">From pro tips to happy teams.</p>
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
        <div className="intro-stack">
          <div className="intro-statement is-light">
            <p>
              I design AI tools.
              <br />
              I design with AI, too.
            </p>
          </div>
          <div className="intro-statement">
            <p>
              I mostly taught writing.
              <br />
              <strong>Now I mostly teach AI.</strong>
            </p>
          </div>
        </div>
      </div>
    ),
    className: 'intro-slide',
  },
  {
    eyebrow: 'Wrong direction',
    content: (
      <figure className="media-frame tweet-frame">
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
            <span className="coral">The human takes the blame.</span>
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
              fixing what ships.
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
          <span className="prompt-line">
            We all know how to <span className="coral">write a prompt.</span>
          </span>
          <br />
          But what about:
        </h2>
        <div className="bounce-words" aria-label="Claude skills, Figma skills, markdown files, automations, workflows, evals, and many more">
          {bouncingTerms.map(({ word, lane, drift, dx, dy, offsetX, offsetY, white }) => (
            <span
              className={white ? 'bounce-word is-white' : 'bounce-word'}
              key={word}
              style={
                {
                  '--x-end': `calc(100% - ${word.length + 1}ch)`,
                  '--y-start': `calc((100% - 1em) * ${lane})`,
                  '--y-end': `calc((100% - 1em) * ${Math.min(Math.max(lane + drift, 0), 1)})`,
                  '--dx': `${dx}s`,
                  '--dy': `${dy}s`,
                  animationDelay: `${offsetX}s, ${offsetY}s`,
                } as CSSProperties
              }
            >
              {word}
            </span>
          ))}
        </div>
      </>
    ),
    className: 'statement-slide',
  },
  {
    eyebrow: 'Content design · a placeholder story',
    content: (
      <>
        <h2 className="slide-title wide-title">From personal prompts to team capabilities</h2>
        <div className="comparison">
          <article>
            <span className="card-label">Personal habit</span>
            <h3>“Give me 3 versions of this tooltip”</h3>
            <ul>
              <li>I explore options</li>
              <li>I know what’s good</li>
              <li className="emphasis">I make the final decision</li>
            </ul>
          </article>
          <div className="arrow">→</div>
          <article className="featured-card">
            <span className="card-label">Shared pattern</span>
            <h3>Validate against standards</h3>
            <ul>
              <li>Universal context</li>
              <li>Tool-agnostic workflows</li>
              <li className="emphasis">Good work happens when you’re not in the room</li>
            </ul>
          </article>
        </div>
      </>
    ),
  },
  {
    eyebrow: 'The real tool',
    builds: 2,
    content: (build) => (
      <FavoriteToolSlide revealed={build >= 1} dropping={build >= 2} />
    ),
    className: 'statement-slide',
  },
  {
    eyebrow: 'From solitary to shared',
    content: (
      <>
        <h2 className="slide-title wide-title">From solitary work with AI to AI-powered team work</h2>
        <div className="comparison">
          <article>
            <span className="card-label">Personal habit</span>
            <h3>Prototype and share link</h3>
            <ul>
              <li>I work together with AI</li>
              <li>No way to add contextual comments</li>
              <li className="emphasis">Work is fast – and isolated</li>
            </ul>
          </article>
          <div className="arrow">→</div>
          <article className="featured-card">
            <span className="card-label">Shared ritual</span>
            <h3>Share a prototype, ask for comments</h3>
            <ul>
              <li>Use tools to add comments on AI prototypes</li>
              <li>Collaborate with engineering, PMs…</li>
              <li className="emphasis">Keep the teamwork alive</li>
            </ul>
          </article>
        </div>
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
          <div><span>03</span><strong>System</strong><p>Rituals + rules + feedback</p></div>
        </div>
      </>
    ),
  },
  {
    eyebrow: '1–2–4–All',
    content: <ExerciseOverview />,
  },
  {
    eyebrow: '1–2–4–All · Facilitation',
    content: <ExerciseTimer questions={questionSets[0]} />,
    className: 'timer-slide',
  },
  {
    eyebrow: '1–2–4–All · Facilitation',
    content: <ExerciseTimer questions={questionSets[1]} />,
    className: 'timer-slide',
  },
  {
    eyebrow: '1–2–4–All · Facilitation',
    content: <ExerciseTimer questions={questionSets[2]} stages={harvestStages} />,
    className: 'timer-slide',
  },
  {
    eyebrow: 'Continue the conversation',
    content: (
      <div className="qr-layout">
        <div>
          <h2>Keep talking<br />after the room.</h2>
          <p className="coral thank-you">Thank you!</p>
        </div>
        <div className="qr-card">
          <img
            src={followUpQr}
            alt="QR code for roundtable follow-up notes"
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
  const [build, setBuild] = useState(0)
  const slide = slides[current]
  const maxBuild = slide.builds ?? 0
  const content = typeof slide.content === 'function' ? slide.content(build) : slide.content

  const goTo = useCallback((index: number) => {
    const next = Math.min(Math.max(index, 0), slides.length - 1)
    setCurrent(next)
    setBuild(0)
    window.history.replaceState(null, '', `#${next + 1}`)
  }, [])

  const advance = useCallback(() => {
    if (build < maxBuild) {
      setBuild((value) => value + 1)
      return
    }
    goTo(current + 1)
  }, [build, maxBuild, current, goTo])

  const retreat = useCallback(() => {
    if (build > 0) {
      setBuild((value) => value - 1)
      return
    }
    const previous = Math.max(current - 1, 0)
    setBuild(slides[previous].builds ?? 0)
    setCurrent(previous)
    window.history.replaceState(null, '', `#${previous + 1}`)
  }, [build, current])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'BUTTON') return
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(event.key)) {
        event.preventDefault()
        advance()
      }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        retreat()
      }
      if (event.key === 'Home') goTo(0)
      if (event.key === 'End') goTo(slides.length - 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [advance, retreat, goTo])

  return (
    <main className="deck">
      <section
        className={`slide ${slide.className ?? ''}`}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('button, a')) return
          advance()
        }}
      >
        <div className="ambient-shape shape-one" />
        <div className="ambient-shape shape-two" />
        <header className="slide-header">
          <span className="wordmark">WaysConf 2026</span>
          <span>Roundtable</span>
        </header>
        <div className="slide-content">{content}</div>
        <footer className="slide-footer">
          <span>Kalina Tyrkiel-Szymańska</span>
          <div className="slide-nav">
            <button type="button" onClick={() => retreat()} disabled={current === 0 && build === 0} aria-label="Previous slide">←</button>
            <span>{String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => advance()} disabled={current === slides.length - 1 && build >= maxBuild} aria-label="Next slide">→</button>
          </div>
        </footer>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
        </div>
      </section>
    </main>
  )
}

export default App
