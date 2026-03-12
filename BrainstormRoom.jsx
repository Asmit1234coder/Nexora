import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './BrainstormRoom.module.css';

/* ── Icons ── */
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#4F46E5"/>
    <path d="M8 16l5 5 11-10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const ZoomInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);

const SparkIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="#4F46E5" fillOpacity="0.15" stroke="#4F46E5" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 6l1.5 4.5H18l-3.8 2.8 1.5 4.5L12 15l-3.7 2.8 1.5-4.5L6 10.5h4.5L12 6z" fill="#4F46E5"/>
  </svg>
);

const AttachIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);

const NoteIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IdeaIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

const UpvoteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const ExitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

/* ── Sample generated ideas ── */
const SAMPLE_IDEAS = [
  { id: 1, title: 'Initial Hook', desc: 'Mobile-first checkout experience with 1-tap payments.', votes: 12, score: 87, tag: 'FINTECH', tagColor: '#F59E0B', x: 60, y: 110, avatars: ['#4F46E5', '#06B6D4'] },
  { id: 2, title: 'Growth Strategy', desc: 'Referral loops within the product to increase viral coefficient.', votes: 8, score: 74, tag: 'PRIORITY', tagColor: '#EF4444', x: 520, y: 340, avatars: ['#8B5CF6'] },
  { id: 3, title: 'AI Content Engine', desc: 'Auto-generate pitch decks from a 3-sentence idea brief.', votes: 21, score: 93, tag: 'AI', tagColor: '#4F46E5', x: 820, y: 130, avatars: ['#10B981', '#4F46E5', '#F59E0B'] },
];

const SUGGESTIONS = [
  { label: '⚡ Brainstorm Ideas', prompt: 'Brainstorm 5 startup ideas in the fintech space' },
  { label: '🗺 Generate Roadmap', prompt: 'Generate a startup roadmap for my idea' },
  { label: '📋 Business Plan', prompt: 'Create a business plan outline' },
  { label: '🎯 Startup Pitch', prompt: 'Generate a startup pitch deck structure' },
  { label: '🔍 Market Research', prompt: 'Explore market research for this idea' },
];

const COLLABORATORS = [
  { initials: 'AS', color: '#4F46E5', name: 'Asmit' },
  { initials: 'JE', color: '#06B6D4', name: 'Jenny' },
  { initials: 'ML', color: '#10B981', name: 'Marcus' },
];

/* ── Draggable Card ── */
function IdeaCard({ card, onVote, onDrag }) {
  const dragRef = useRef(null);
  const startPos = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('button')) return;
    startPos.current = { mx: e.clientX, my: e.clientY, cx: card.x, cy: card.y };
    const onMove = (me) => {
      onDrag(card.id, startPos.current.cx + me.clientX - startPos.current.mx, startPos.current.cy + me.clientY - startPos.current.my);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [card, onDrag]);

  return (
    <div
      ref={dragRef}
      className={styles.ideaCard}
      style={{ left: card.x, top: card.y }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardTag} style={{ background: card.tagColor + '20', color: card.tagColor }}>
          {card.tag}
        </span>
        <div className={styles.cardScore}>{card.score}</div>
      </div>
      <h3 className={styles.cardTitle}>{card.title}</h3>
      <p className={styles.cardDesc}>{card.desc}</p>
      <div className={styles.cardFooter}>
        <div className={styles.cardAvatars}>
          {card.avatars.map((c, i) => (
            <div key={i} className={styles.cardAvatar} style={{ background: c, zIndex: card.avatars.length - i }} />
          ))}
        </div>
        <button className={styles.voteBtn} onClick={() => onVote(card.id)}>
          <UpvoteIcon /> {card.votes}
        </button>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function BrainstormRoom({ onNavigate, room }) {
  const [ideas, setIdeas] = useState(SAMPLE_IDEAS);
  const [input, setInput] = useState('');
  const [zoom, setZoom] = useState(100);
  const [isTyping, setIsTyping] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleVote = useCallback((id) => {
    setIdeas(prev => prev.map(c => c.id === id ? { ...c, votes: c.votes + 1 } : c));
  }, []);

  const handleDrag = useCallback((id, x, y) => {
    setIdeas(prev => prev.map(c => c.id === id ? { ...c, x, y } : c));
  }, []);

  const handleSuggestion = (prompt) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const newCard = {
      id: Date.now(),
      title: input.length > 30 ? input.slice(0, 30) + '...' : input,
      desc: 'AI-generated idea card. Expand to explore further.',
      votes: 0,
      score: Math.floor(Math.random() * 30) + 65,
      tag: 'NEW',
      tagColor: '#8B5CF6',
      x: 200 + Math.random() * 300,
      y: 200 + Math.random() * 200,
      avatars: ['#4F46E5'],
    };
    setIdeas(prev => [...prev, newCard]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit();
  };

  useEffect(() => {
    if (input.length > 0) {
      setIsTyping(true);
      const t = setTimeout(() => setIsTyping(false), 800);
      return () => clearTimeout(t);
    }
  }, [input]);

  return (
    <div className={styles.workspace}>

      {/* ── TOP NAV ── */}
      <nav className={styles.topNav}>
        <div className={styles.navLeft}>
          <Logo />
          <span className={styles.navBrand}>IdeaForge</span>
          <div className={styles.navDivider} />
          <span className={styles.navRoom}>BRAINSTORM ROOM</span>
        </div>

        <ul className={styles.navCenter}>
          <li><a className={styles.navLink} onClick={() => onNavigate("home")} style={{cursor:"pointer"}}>Home</a></li>
          <li><a href="#" className={styles.navLink}>My Brainstorm Rooms</a></li>
          <li><a href="#" className={styles.navLink}>Latest Business News</a></li>
          <li><a href="#" className={styles.navLink}>My Profile</a></li>
        </ul>

        <div className={styles.navRight}>
          <div className={styles.collabPills}>
            <span className={styles.collabDot} />
            <span className={styles.collabCount}>{COLLABORATORS.length} Active</span>
            <div className={styles.collabAvatars}>
              {COLLABORATORS.map((c, i) => (
                <div key={i} className={styles.collabAvatar} style={{ background: c.color }} title={c.name}>
                  {c.initials}
                </div>
              ))}
            </div>
          </div>
          <button className={styles.iconBtn} aria-label="Notifications">
            <BellIcon />
            <span className={styles.notifDot} />
          </button>
          <div className={styles.userAvatar}>AS</div>
          <button className={styles.exitBtn} onClick={() => onNavigate("home")}>
  <ExitIcon /> Exit Room
</button>
        </div>
      </nav>

      {/* ── CANVAS ── */}
      <div className={styles.canvas}>
        <div className={styles.canvasGrid} style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}>

          {/* Idea Cards */}
          {ideas.map(card => (
            <IdeaCard key={card.id} card={card} onVote={handleVote} onDrag={handleDrag} />
          ))}

          {/* Center Input Panel */}
          <div className={styles.inputPanel}>
            <div className={styles.panelSparkWrap}>
              <SparkIcon />
            </div>
            <h2 className={styles.panelTitle}>What are we working on today?</h2>
            <p className={styles.panelSub}>Fuel your creativity with AI-powered brainstorming</p>

            <div className={styles.inputLabel}>AI Idea Input</div>
            <div className={`${styles.inputWrap} ${inputFocused ? styles.inputFocused : ''}`}>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                placeholder="Describe your startup idea or problem statement..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                rows={3}
              />
              <div className={styles.inputBottom}>
                <div className={styles.inputActions}>
                  <button className={styles.actionBtn} title="Attach document"><AttachIcon /></button>
                  <button className={styles.actionBtn} title="Add image"><ImageIcon /></button>
                  <button className={styles.actionBtn} title="Add note"><NoteIcon /></button>
                  <button className={styles.actionBtn} title="Add idea card"><IdeaIcon /></button>
                </div>
                <div className={styles.inputMeta}>
                  {input.length > 0 && <span className={styles.shortcut}>⌘ + Enter to send</span>}
                  <button
                    className={`${styles.sendBtn} ${input.trim() ? styles.sendActive : ''}`}
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    aria-label="Send"
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestion chips */}
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button key={s.label} className={styles.chip} onClick={() => handleSuggestion(s.prompt)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM STATUS ── */}
      <div className={styles.statusBar}>
        <div className={styles.collabStatus}>
          <span className={styles.collabLiveDot} />
          <span>{COLLABORATORS.length} Collaborators Active</span>
        </div>
      </div>

      {/* ── ZOOM CONTROLS ── */}
      <div className={styles.zoomControls}>
        <button className={styles.zoomBtn} onClick={() => setZoom(z => Math.min(z + 10, 200))} aria-label="Zoom in"><ZoomInIcon /></button>
        <span className={styles.zoomVal}>{zoom}%</span>
        <button className={styles.zoomBtn} onClick={() => setZoom(z => Math.max(z - 10, 40))} aria-label="Zoom out"><ZoomOutIcon /></button>
        <button className={styles.zoomReset} onClick={() => setZoom(100)}>Reset</button>
      </div>

    </div>
  );
}