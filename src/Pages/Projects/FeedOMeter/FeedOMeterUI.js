import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';
import './FeedOMeter.css';

const IDEA_TOPIC = 'Services for carbon neutrality';

const DESIGN_GOALS = [
  { label: 'Innovation', description: 'Surface playful moments while still guiding toward actionable critique.' },
  { label: 'Elaboration', description: 'Show how feedback evolves the idea with concrete updates.' },
  { label: 'Usability', description: 'Keep controls minimal so mentees can focus on conversation.' },
  { label: 'Value', description: 'Make it obvious how practicing here benefits the studio course.' },
  { label: 'Social Responsibility', description: 'Encourage respectful, bias-aware language in every exchange.' }
];

const IDEA_DETAILS = {
  title: 'Map services to encourage low-carbon transportation',
  problem:
    'Many people are aware of the importance of low carbon and are trying to use low carbon transportation (buses, subways). However, the hassle of waiting to board low-carbon transportation, riding with a large number of people, and being crowded together cause discomfort and irritation. These negative experiences build up and build up, leading to less and less use of low-carbon transportation and more and more use of private transportation (car, motorcycle).',
  idea: `A direct comparison between the carbon footprint of taking low-carbon transportation to a destination and the carbon footprint of taking private transportation to that destination would further emphasize the environmental benefits of low-carbon transportation. Currently, the public transportation tab in the Maps service shows the route, duration, and fare of the bus or subway to get to a destination. In addition to this information, it would be useful to show the amount of carbon saved by taking low-carbon transportation to encourage people to use low-carbon transportation.`
};

const SAMPLE_CHAT = [
  {
    speaker: 'mentee',
    content: 'Hi! My name is Alex. I appreciate any feedback on my idea.'
  },
  {
    speaker: 'mentor',
    content:
      "I think we need to think of more ways to engage people in reducing their carbon footprint, for example, not only in terms of the amount of carbon saved, but also in terms of what it's worth in the future, or how it relates to things in our lives."
  },
  {
    speaker: 'mentee',
    content:
      "In addition to information about the amount of carbon saved, I'll also consider providing a visual analogy that makes it easier to understand, such as a comparison to planting a tree, or emphasizing the long-term benefits."
  },
  {
    speaker: 'mentor',
    content:
      'And there’s the other problem, which is that waiting to get on low-carbon transportation can be painful. How do we turn that waiting time into something enjoyable?'
  },
  {
    speaker: 'mentee',
    content:
      'To make the wait more enjoyable, I think we could use something like customized entertainment or an AR feature that reduces the wait time in real time. What do you think?'
  }
];

const FEEDBACK_METRICS = [
  { label: 'Specificity', value: 0.42 },
  { label: 'Justification', value: 0.66 },
  { label: 'Action', value: 0.38 },
  { label: 'Timeliness', value: 0.72 },
  { label: 'Goal Relevance', value: 0.81 },
  { label: 'Level', value: 0.55 }
];
const DEFAULT_METRIC_LEVELS = FEEDBACK_METRICS.map(metric =>
  Math.max(1, Math.min(7, Math.round(metric.value * 7)))
);

const GAUGE_PAIRS = [
  { id: 'thinking', left: 'Divergent', right: 'Convergent', value: 0.62 },
  { id: 'tone', left: 'Statement', right: 'Question', value: 0.35 }
];

const DEFAULT_GAUGE_ANGLES = GAUGE_PAIRS.map(pair => 10 + pair.value * 160);

const assets = {
  send: `${process.env.PUBLIC_URL}/projects/feed-o-meter/chatBtn.svg`,
  sendDark: `${process.env.PUBLIC_URL}/projects/feed-o-meter/chatBtn_dark.svg`,
  mentor: `${process.env.PUBLIC_URL}/projects/feed-o-meter/character1.png`,
  logo: `${process.env.PUBLIC_URL}/projects/feed-o-meter/logo.png`,
  logoDark: `${process.env.PUBLIC_URL}/projects/feed-o-meter/logo_dark.png`,
  pointer: `${process.env.PUBLIC_URL}/projects/feed-o-meter/pointer.svg`,
  pointerDark: `${process.env.PUBLIC_URL}/projects/feed-o-meter/pointer_dark.svg`
};

export const FeedOMeterUI = ({ fadeRef }) => {
  const { isDark } = useTheme();
  const meterAnimationDuration = 500;
  const [tab, setTab] = useState('topic');
  const [chatLog, setChatLog] = useState(SAMPLE_CHAT);
  const [chatInput, setChatInput] = useState('');
  const [menteeLevel, setMenteeLevel] = useState(3);
  const [menteeExperience, setMenteeExperience] = useState(71);
  const [meterProgress, setMeterProgress] = useState(71);
  const [gaugeAngles, setGaugeAngles] = useState(DEFAULT_GAUGE_ANGLES);
  const [metricLevels, setMetricLevels] = useState(DEFAULT_METRIC_LEVELS);
  const [menteeAvatarKey, setMenteeAvatarKey] = useState({ row: 3, col: 3 });
  const chatWindowRef = useRef(null);
  const chatInputRef = useRef(null);
  const levelUpTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);
  const pendingXpRef = useRef(0);
  const isLevelingRef = useRef(false);
  const isSendingRef = useRef(false);

  function finalizeLevelAnimation() {
    isLevelingRef.current = false;
    if (pendingXpRef.current > 0) {
      const queued = pendingXpRef.current;
      pendingXpRef.current = 0;
      applyExperienceGain(queued);
    }
  }

  function beginLevelUpSequence(overflow) {
    isLevelingRef.current = true;
    setMeterProgress(100);
    setMenteeExperience(100);
    window.clearTimeout(levelUpTimeoutRef.current);
    levelUpTimeoutRef.current = window.setTimeout(() => {
      setMenteeLevel(prev => prev + 1);
      setMenteeExperience(0);
      setMeterProgress(0);
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = window.setTimeout(() => {
        if (overflow > 0) {
          setMenteeExperience(overflow);
          setMeterProgress(overflow);
        }
        finalizeLevelAnimation();
      }, meterAnimationDuration);
    }, meterAnimationDuration);
  }

  function applyExperienceGain(gained) {
    if (!gained) return;
    if (isLevelingRef.current) {
      pendingXpRef.current += gained;
      return;
    }

    setMenteeExperience(prevExp => {
      const updated = prevExp + gained;
      if (updated < 100) {
        setMeterProgress(updated);
        return updated;
      }

      const overflow = Math.min(updated - 100, 100);
      beginLevelUpSequence(overflow);
      return 100;
    });
  }

  const awardExperience = () => {
    const gained = Math.floor(Math.random() * 41) + 10;
    applyExperienceGain(gained);
  };

  const randomAngle = () => Math.floor(Math.random() * 161) + 10;
  const randomizeGaugeAngles = () => {
    setGaugeAngles(GAUGE_PAIRS.map(() => randomAngle()));
  };

  const randomizeMetricLevels = () => {
    setMetricLevels(FEEDBACK_METRICS.map(() => Math.floor(Math.random() * 7) + 1));
  };

const randomizeMenteeAvatar = direction => {
  setMenteeAvatarKey(prev => {
    const { row, col } = prev;
    const candidates = [];
    if (direction === 'downgrade') {
      if (row > 1) candidates.push({ row: row - 1, col });
      if (col > 1) candidates.push({ row, col: col - 1 });
      if (!candidates.length) return prev;
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    if (direction === 'upgrade') {
      if (row < 5) candidates.push({ row: row + 1, col });
      if (col < 5) candidates.push({ row, col: col + 1 });
      if (!candidates.length) return prev;
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    candidates.push({ row, col });
    if (row > 1) candidates.push({ row: row - 1, col });
    if (row < 5) candidates.push({ row: row + 1, col });
    if (col > 1) candidates.push({ row, col: col - 1 });
    if (col < 5) candidates.push({ row, col: col + 1 });

    return candidates[Math.floor(Math.random() * candidates.length)];
  });
};

  const handleSend = () => {
    if (isSendingRef.current) return;
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    isSendingRef.current = true;
    const userMessage = { speaker: 'mentor', content: trimmed };
    const menteeReplies = [
      { text: 'Thanks for the feedback!' },
      { text: 'That’s a great point—let me note that down.' },
      { text: 'I’ll explore that direction next.' },
      { text: 'Interesting! I hadn’t thought about it that way.' },
      { text: 'Appreciate the perspective—let me iterate on that.', direction: 'upgrade' },
      { text: 'I didn\'t understand, please explain again.', direction: 'downgrade' }
    ];
    const selectedReply = menteeReplies[Math.floor(Math.random() * menteeReplies.length)];
    const reply = {
      speaker: 'mentee',
      content: selectedReply.text
    };
    setChatLog(prev => [...prev, userMessage, reply]);
    setChatInput('');
    adjustTextareaHeight();
    randomizeGaugeAngles();
    randomizeMetricLevels();
    randomizeMenteeAvatar(selectedReply.direction);
    awardExperience();
    const releaseSendLock =
      (typeof window !== 'undefined' && window.requestAnimationFrame) ||
      ((callback) => window.setTimeout(callback, 0));
    releaseSendLock(() => {
      isSendingRef.current = false;
    });
  };

  useEffect(() => {
    if (!chatWindowRef.current) return;
    chatWindowRef.current.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatLog]);

  const adjustTextareaHeight = () => {
    if (!chatInputRef.current) return;
    const element = chatInputRef.current;
    element.style.height = 'auto';
    const maxHeight = 120;
    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [chatInput]);

  useEffect(() => {
    return () => {
      window.clearTimeout(levelUpTimeoutRef.current);
      window.clearTimeout(resetTimeoutRef.current);
    };
  }, []);
  const menteeAvatarSrc = `${process.env.PUBLIC_URL}/projects/feed-o-meter/students/student${menteeAvatarKey.row}${menteeAvatarKey.col}.png`;
  return (
    <section className="feedometer-ui project-fade-block" ref={fadeRef}>
      <div className="feedometer-ui__frame">
        <header className="feedometer-ui__topbar">
          <div className="feedometer-ui__brand">
            <img src={isDark ? assets.logoDark : assets.logo} alt="Feed-O-Meter logotype" loading="lazy" />
            <div className="feedometer-ui__brand-text">
              <span>Feed-O-Meter</span>
            </div>
          </div>
        </header>

        <div className="feedometer-ui__columns">
          <section className="feedometer-panel feedometer-panel--idea">
            <div className="feedometer-idea-header">
              <div className="feedometer-idea-tabs">
                <button
                  type="button"
                  className={tab === 'topic' ? 'is-active' : ''}
                  onClick={() => setTab('topic')}
                >
                  Topic
                </button>
                <button
                  type="button"
                  data-tab="goals"
                  className={tab === 'goals' ? 'is-active' : ''}
                  onClick={() => setTab('goals')}
                >
                  Design Goals
                </button>
              </div>
              <div className="feedometer-idea-description">
                {tab === 'topic' ? (
                  <p className="feedometer-idea-topic">{IDEA_TOPIC}</p>
                ) : (
                  <div className="feedometer-idea-goals">
                    {DESIGN_GOALS.map(goal => (
                      <div key={goal.label} className="feedometer-idea-goals__item">
                        <span className="feedometer-idea-goals__label">{goal.label}</span>
                        <p className="feedometer-idea-goals__description">{goal.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="feedometer-idea-card">
              <div className="feedometer-idea-card__header">
                <h3>{IDEA_DETAILS.title}</h3>
                <button type="button" className="feedometer-idea-card__button">
                  Update
                </button>
              </div>
              <div className="feedometer-idea-card__section">
                <h4>Target Problem</h4>
                <p>{IDEA_DETAILS.problem}</p>
              </div>
              <div className="feedometer-idea-card__section">
                <h4>Idea</h4>
                <p>{IDEA_DETAILS.idea}</p>
              </div>
            </div>
          </section>

          <section className="feedometer-panel feedometer-panel--chat">
            <div className="feedometer-chat-window" ref={chatWindowRef}>
              {chatLog.map((message, index) => {
                return (
                  <div
                    key={`${message.speaker}-${index}`}
                    className={`feedometer-chat-bubble ${
                      message.speaker === 'mentee' ? 'is-mentee' : 'is-mentor'
                    }`}
                  >
                    <div className="feedometer-chat-bubble__avatar">
                      <img
                        src={message.speaker === 'mentee' ? menteeAvatarSrc : assets.mentor}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    <div className="feedometer-chat-bubble__content">
                      <div className="feedometer-chat-bubble__speaker">
                        {message.speaker === 'mentee' ? 'Mentee' : 'You'}
                      </div>
                      <div className="feedometer-chat-bubble__body">
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="feedometer-chat-input">
              <textarea
                ref={chatInputRef}
                value={chatInput}
                onChange={event => {
                  setChatInput(event.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Write your feedback here..."
                rows={1}
              />
              <button type="button" className="feedometer-chat-send" aria-label="Send message" onClick={handleSend}>
                <img src={isDark ? assets.sendDark : assets.send} alt="" loading="lazy" />
              </button>
            </div>
          </section>

          <section
            className={`feedometer-panel feedometer-panel--student${tab === 'goals' ? ' is-condensed' : ''}`}
          >
            <div className="feedometer-mentee-card">
              <h4 className="feedometer-mentee-card__title">Mentee (Alex) Profile</h4>
              <div className="feedometer-mentee-thought">
                <p>
                  I need to explore different ways to increase user engagement. Considering additional value or
                  benefits beyond key metrics can increase the appeal of my design.
                </p>
              </div>
              <div className="feedometer-mentee-avatar">
                <img src={menteeAvatarSrc} alt="Mentee avatar" loading="lazy" />
              </div>
              <div className="feedometer-mentee-card__meter">
                <div className="feedometer-mentee-card__meter-track">
                  <div
                    className="feedometer-mentee-card__meter-fill"
                    style={{ width: `${Math.min(meterProgress, 100)}%` }}
                  />
                </div>
                <div className="feedometer-mentee-card__level">
                  <strong>Level {menteeLevel}</strong>
                  <span>{menteeExperience} exp points</span>
                </div>
              </div>
            </div>
            <div className="feedometer-feedback-panel">
              <h4>User Feedback</h4>
              <div className="feedometer-gauge-grid">
                {GAUGE_PAIRS.map((pair, index) => {
                  const angle = (gaugeAngles[index] ?? DEFAULT_GAUGE_ANGLES[index]) - 90;
                  return (
                    <div key={pair.id} className="feedometer-gauge">
                      <div className="feedometer-gauge__dial">
                        <img
                          src={isDark ? assets.pointerDark : assets.pointer}
                          alt=""
                          className="feedometer-gauge__needle"
                          style={{ transform: `rotate(${angle}deg)` }}
                          loading="lazy"
                        />
                      </div>
                      <div className="feedometer-gauge__labels">
                        <span>{pair.left}</span>
                        <span>{pair.right}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="feedometer-metric-bars">
                {FEEDBACK_METRICS.map((metric, index) => {
                  const level = metricLevels[index] ?? DEFAULT_METRIC_LEVELS[index];
                  const heightPercent = (level / 7) * 100;
                  return (
                    <div key={metric.label} className="feedometer-metric-bars__item">
                      <div className="feedometer-metric-bars__bar">
                        <span style={{ height: `${heightPercent}%` }} />
                      </div>
                      <p>{metric.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
      <p className="feedometer-ui__note">
        This interaction is randomly simulated and not powered by the LLM pipeline.
      </p>
      <div className="feedometer-ui__fallback">
        <img
          src={`${process.env.PUBLIC_URL}/projects/feed-o-meter/feed-o-meterUI.png`}
          alt="Feed-O-Meter interface preview"
          loading="lazy"
        />
      </div>
    </section>
  );
};

FeedOMeterUI.propTypes = {
  fadeRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })])
};
