import { useEffect, useMemo, useState } from 'react'
import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Headphones,
  RotateCcw,
  Search,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react'
import './App.css'

const STORAGE_KEY = 'workword-progress-v1'

const words = [
  {
    id: 'implement',
    word: 'implement',
    phonetic: '/ˈɪmplɪment/',
    part: 'v.',
    cn: '实施，执行',
    group: 'TOEIC',
    level: '核心',
    tags: ['项目', '管理'],
    collocation: 'implement a policy',
    sentence: 'The team will implement the new security policy next Monday.',
    translation: '团队将在下周一实施新的安全政策。',
    blank: 'The team will ____ the new security policy next Monday.',
    options: ['implement', 'invoice', 'relocate', 'estimate'],
    note: 'TOEIC 常出现在公司制度、项目计划、流程上线的语境。',
  },
  {
    id: 'deploy',
    word: 'deploy',
    phonetic: '/dɪˈplɔɪ/',
    part: 'v.',
    cn: '部署，调配',
    group: '科技',
    level: '高频',
    tags: ['软件', '运维'],
    collocation: 'deploy an update',
    sentence: 'The engineer deployed the update after the final test passed.',
    translation: '最终测试通过后，工程师部署了更新。',
    blank: 'The engineer ____ the update after the final test passed.',
    options: ['deployed', 'reserved', 'attached', 'audited'],
    note: '科技工作场景里常和 update、server、application 搭配。',
  },
  {
    id: 'compliance',
    word: 'compliance',
    phonetic: '/kəmˈplaɪəns/',
    part: 'n.',
    cn: '合规，遵守',
    group: '工作',
    level: '核心',
    tags: ['制度', '审计'],
    collocation: 'ensure compliance',
    sentence: 'The audit team checks whether each branch is in compliance with the rules.',
    translation: '审计团队检查每个分支机构是否遵守规定。',
    blank: 'The audit team checks whether each branch is in ____ with the rules.',
    options: ['compliance', 'capacity', 'agenda', 'outage'],
    note: '工作邮件和报告里常见 in compliance with。',
  },
  {
    id: 'allocate',
    word: 'allocate',
    phonetic: '/ˈæləkeɪt/',
    part: 'v.',
    cn: '分配，拨出',
    group: 'TOEIC',
    level: '高频',
    tags: ['预算', '资源'],
    collocation: 'allocate resources',
    sentence: 'The manager allocated extra resources to the urgent project.',
    translation: '经理给紧急项目分配了额外资源。',
    blank: 'The manager ____ extra resources to the urgent project.',
    options: ['allocated', 'installed', 'negotiated', 'merged'],
    note: '常与 budget、resources、time 搭配。',
  },
  {
    id: 'scalable',
    word: 'scalable',
    phonetic: '/ˈskeɪləbl/',
    part: 'adj.',
    cn: '可扩展的',
    group: '科技',
    level: '进阶',
    tags: ['产品', '架构'],
    collocation: 'a scalable platform',
    sentence: 'A scalable platform can support more users without a full redesign.',
    translation: '可扩展平台无需整体重做也能支持更多用户。',
    blank: 'A ____ platform can support more users without a full redesign.',
    options: ['scalable', 'temporary', 'manual', 'overdue'],
    note: '技术、SaaS、产品介绍里很常见。',
  },
  {
    id: 'prioritize',
    word: 'prioritize',
    phonetic: '/praɪˈɔːrətaɪz/',
    part: 'v.',
    cn: '优先处理',
    group: '工作',
    level: '核心',
    tags: ['任务', '沟通'],
    collocation: 'prioritize requests',
    sentence: 'Please prioritize customer requests that affect payment processing.',
    translation: '请优先处理影响付款流程的客户请求。',
    blank: 'Please ____ customer requests that affect payment processing.',
    options: ['prioritize', 'decorate', 'postpone', 'subscribe'],
    note: '适合用于会议、邮件、项目协作。',
  },
  {
    id: 'outage',
    word: 'outage',
    phonetic: '/ˈaʊtɪdʒ/',
    part: 'n.',
    cn: '中断，停机',
    group: '科技',
    level: '进阶',
    tags: ['运维', '服务'],
    collocation: 'service outage',
    sentence: 'The service outage lasted twenty minutes and affected online orders.',
    translation: '服务中断持续了二十分钟，并影响了线上订单。',
    blank: 'The service ____ lasted twenty minutes and affected online orders.',
    options: ['outage', 'invoice', 'agenda', 'benefit'],
    note: 'IT 服务、云平台、客服通知里高频。',
  },
  {
    id: 'invoice',
    word: 'invoice',
    phonetic: '/ˈɪnvɔɪs/',
    part: 'n.',
    cn: '发票，账单',
    group: 'TOEIC',
    level: '核心',
    tags: ['财务', '采购'],
    collocation: 'issue an invoice',
    sentence: 'The vendor will issue an invoice after the equipment is delivered.',
    translation: '供应商会在设备交付后开具发票。',
    blank: 'The vendor will issue an ____ after the equipment is delivered.',
    options: ['invoice', 'outage', 'estimate', 'agenda'],
    note: '商务英语、采购、付款流程里常见。',
  },
  {
    id: 'onboarding',
    word: 'onboarding',
    phonetic: '/ˈɑːnbɔːrdɪŋ/',
    part: 'n.',
    cn: '入职培训，导入流程',
    group: '工作',
    level: '高频',
    tags: ['HR', '流程'],
    collocation: 'employee onboarding',
    sentence: 'The onboarding process helps new employees understand internal tools.',
    translation: '入职流程帮助新员工了解内部工具。',
    blank: 'The ____ process helps new employees understand internal tools.',
    options: ['onboarding', 'shipment', 'refund', 'capacity'],
    note: 'HR、SaaS 客户导入都可用 onboarding。',
  },
  {
    id: 'estimate',
    word: 'estimate',
    phonetic: '/ˈestɪmət/',
    part: 'n./v.',
    cn: '估算，预估',
    group: 'TOEIC',
    level: '核心',
    tags: ['报价', '计划'],
    collocation: 'provide an estimate',
    sentence: 'Could you provide an estimate before we approve the budget?',
    translation: '在我们批准预算前，你能提供一份估算吗？',
    blank: 'Could you provide an ____ before we approve the budget?',
    options: ['estimate', 'outage', 'agenda', 'prototype'],
    note: '报价、工期、预算、交付时间都常用。',
  },
]

const tabs = [
  { key: 'study', label: '学习', icon: BookOpen },
  { key: 'review', label: '复习', icon: RotateCcw },
  { key: 'library', label: '词库', icon: BriefcaseBusiness },
  { key: 'stats', label: '进度', icon: BarChart3 },
]

const filters = ['全部', 'TOEIC', '工作', '科技']

function createProgress() {
  return Object.fromEntries(
    words.map((item) => [
      item.id,
      { mastered: false, streak: 0, attempts: 0, misses: 0, due: '今天' },
    ]),
  )
}

function App() {
  const [tab, setTab] = useState('study')
  const [filter, setFilter] = useState('全部')
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(words[0].id)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [progress, setProgress] = useState(() => {
    try {
      return { ...createProgress(), ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }
    } catch {
      return createProgress()
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const visibleWords = useMemo(() => {
    const text = query.trim().toLowerCase()
    return words.filter((item) => {
      const matchesFilter = filter === '全部' || item.group === filter
      const haystack = `${item.word} ${item.cn} ${item.tags.join(' ')} ${item.sentence}`.toLowerCase()
      return matchesFilter && (!text || haystack.includes(text))
    })
  }, [filter, query])

  const activeWord = words.find((item) => item.id === activeId) ?? visibleWords[0] ?? words[0]
  const activeState = progress[activeWord.id] ?? createProgress()[activeWord.id]
  const masteredCount = Object.values(progress).filter((item) => item.mastered).length
  const reviewCount = Object.values(progress).filter((item) => item.misses > 0 && !item.mastered).length
  const accuracy = Object.values(progress).reduce(
    (acc, item) => {
      acc.total += item.attempts
      acc.correct += Math.max(0, item.attempts - item.misses)
      return acc
    },
    { total: 0, correct: 0 },
  )
  const accuracyRate = accuracy.total ? Math.round((accuracy.correct / accuracy.total) * 100) : 0

  function pickWord(id) {
    setActiveId(id)
    setAnswer('')
    setFeedback(null)
    setTab('study')
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.88
    window.speechSynthesis.speak(utterance)
  }

  function submit(value = answer) {
    const normalized = value.trim().toLowerCase()
    const correct = normalized === activeWord.options[0].toLowerCase()
    setFeedback(correct ? 'correct' : 'wrong')
    setAnswer(value)
    setProgress((current) => {
      const item = current[activeWord.id] ?? { mastered: false, streak: 0, attempts: 0, misses: 0, due: '今天' }
      const streak = correct ? item.streak + 1 : 0
      return {
        ...current,
        [activeWord.id]: {
          ...item,
          streak,
          attempts: item.attempts + 1,
          misses: correct ? item.misses : item.misses + 1,
          mastered: streak >= 2 || item.mastered,
          due: correct ? (streak >= 2 ? '3天后' : '明天') : '今天',
        },
      }
    })
  }

  function nextWord() {
    const list = visibleWords.length ? visibleWords : words
    const index = list.findIndex((item) => item.id === activeWord.id)
    pickWord(list[(index + 1) % list.length].id)
  }

  function reset() {
    setProgress(createProgress())
    setAnswer('')
    setFeedback(null)
  }

  return (
    <main className="stage">
      <section className="phone" aria-label="WorkWord mobile app preview">
        <div className="status-bar">
          <span>9:41</span>
          <span className="status-dot" />
        </div>

        <div className="app">
          <header className="top">
            <div>
              <p>WorkWord</p>
              <h1>工作英语记忆</h1>
            </div>
            <button className="round-button" onClick={() => speak(activeWord.word)} aria-label="播放当前单词">
              <Headphones size={20} />
            </button>
          </header>

          <div className="search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索单词 / 中文 / 场景"
            />
          </div>

          <div className="chips">
            {filters.map((item) => (
              <button
                className={filter === item ? 'chip active' : 'chip'}
                key={item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="content">
            {tab === 'study' && (
              <StudyView
                activeWord={activeWord}
                activeState={activeState}
                answer={answer}
                feedback={feedback}
                setAnswer={setAnswer}
                submit={submit}
                nextWord={nextWord}
                speak={speak}
              />
            )}

            {tab === 'review' && <ReviewView progress={progress} pickWord={pickWord} />}

            {tab === 'library' && <LibraryView visibleWords={visibleWords} pickWord={pickWord} />}

            {tab === 'stats' && (
              <StatsView
                accuracyRate={accuracyRate}
                masteredCount={masteredCount}
                reviewCount={reviewCount}
                reset={reset}
              />
            )}
          </div>
        </div>

        <nav className="tabs" aria-label="主导航">
          {tabs.map((item) => {
            const Icon = item.icon
            return (
              <button className={tab === item.key ? 'tab active' : 'tab'} key={item.key} onClick={() => setTab(item.key)}>
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </section>
    </main>
  )
}

function StudyView({ activeWord, activeState, answer, feedback, setAnswer, submit, nextWord, speak }) {
  return (
    <section className="screen study-screen">
      <div className="today-card">
        <div className="card-head">
          <span>{activeWord.group}</span>
          <span>{activeWord.level}</span>
        </div>
        <div className="word-line">
          <div>
            <h2>{activeWord.word}</h2>
            <p>
              {activeWord.phonetic} · {activeWord.part} {activeWord.cn}
            </p>
          </div>
          <button className="round-button light" onClick={() => speak(activeWord.word)} aria-label="播放单词">
            <Volume2 size={19} />
          </button>
        </div>
        <p className="sentence">{activeWord.sentence}</p>
        <p className="translation">{activeWord.translation}</p>
      </div>

      <div className="quiz-card">
        <div className="quiz-title">
          <Sparkles size={18} />
          <span>{activeWord.blank}</span>
        </div>
        <div className="answer-row">
          <input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="输入缺失单词" />
          <button className="primary-icon" onClick={() => submit()} aria-label="提交答案">
            <Check size={18} />
          </button>
        </div>
        <div className="options">
          {activeWord.options.map((item) => (
            <button key={item} onClick={() => submit(item)}>
              {item}
            </button>
          ))}
        </div>
        {feedback && (
          <div className={feedback === 'correct' ? 'feedback good' : 'feedback bad'}>
            {feedback === 'correct' ? <Check size={17} /> : <X size={17} />}
            <span>{feedback === 'correct' ? '记住了，进入下一轮间隔复习。' : `答案是 ${activeWord.options[0]}，再看一遍例句。`}</span>
          </div>
        )}
      </div>

      <div className="mini-grid">
        <InfoTile label="搭配" value={activeWord.collocation} />
        <InfoTile label="复习" value={`${activeState.streak} 连对 · ${activeState.due}`} />
      </div>

      <button className="next-button" onClick={nextWord}>
        下一个单词
        <ChevronRight size={18} />
      </button>
    </section>
  )
}

function ReviewView({ progress, pickWord }) {
  const reviewWords = words.filter((item) => progress[item.id]?.misses > 0 || !progress[item.id]?.mastered)
  return (
    <section className="screen">
      <div className="section-title">
        <h2>今日复习</h2>
        <p>{reviewWords.length} 个待巩固词</p>
      </div>
      <div className="word-list">
        {reviewWords.map((item) => (
          <button className="word-item" key={item.id} onClick={() => pickWord(item.id)}>
            <div>
              <strong>{item.word}</strong>
              <span>{item.cn}</span>
            </div>
            <small>{progress[item.id]?.due ?? '今天'}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

function LibraryView({ visibleWords, pickWord }) {
  return (
    <section className="screen">
      <div className="section-title">
        <h2>场景词库</h2>
        <p>{visibleWords.length} 个单词</p>
      </div>
      <div className="word-list">
        {visibleWords.map((item) => (
          <button className="word-item" key={item.id} onClick={() => pickWord(item.id)}>
            <div>
              <strong>{item.word}</strong>
              <span>{item.group} · {item.tags.join(' / ')}</span>
            </div>
            <small>{item.cn}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

function StatsView({ accuracyRate, masteredCount, reviewCount, reset }) {
  return (
    <section className="screen">
      <div className="section-title">
        <h2>学习进度</h2>
        <p>本地保存，不需要登录</p>
      </div>
      <div className="stats-grid">
        <InfoTile label="掌握" value={`${masteredCount}/${words.length}`} />
        <InfoTile label="正确率" value={`${accuracyRate}%`} />
        <InfoTile label="待复习" value={`${reviewCount}`} />
        <InfoTile label="词库" value="商务/科技" />
      </div>
      <div className="insight-card">
        <BadgeCheck size={20} />
        <div>
          <strong>初版记忆策略</strong>
          <p>答错立即回到今日复习，连续两次正确标记为掌握，后续可替换成完整 SRS 间隔算法。</p>
        </div>
      </div>
      <button className="danger-button" onClick={reset}>重置本机进度</button>
    </section>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className="info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default App
