import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = resolve(root, 'src/wordBank.js')
const cacheDir = resolve(root, 'data/source-cache')

const sources = {
  tsl: {
    name: 'TOEIC Service List',
    license: 'CC BY-SA 4.0',
    url: 'https://www.newgeneralservicelist.com/s/TSL_12_stats.csv',
  },
  bsl: {
    name: 'Business Service List',
    license: 'CC BY-SA 4.0',
    url: 'https://www.newgeneralservicelist.com/s/BSL_120_stats.csv',
  },
  ngsl: {
    name: 'New General Service List',
    license: 'CC BY-SA 4.0',
    url: 'https://www.newgeneralservicelist.com/s/NGSL_12_stats.csv',
  },
  ecdict: {
    name: 'ECDICT mini',
    license: 'MIT',
    url: 'https://cdn.jsdelivr.net/gh/skywind3000/ECDICT@master/ecdict.mini.csv',
  },
}

const techWords = [
  'deploy',
  'deployment',
  'repository',
  'database',
  'backup',
  'restore',
  'server',
  'client',
  'interface',
  'integration',
  'automation',
  'configuration',
  'authentication',
  'authorization',
  'permission',
  'encryption',
  'latency',
  'bandwidth',
  'scalable',
  'scalability',
  'outage',
  'incident',
  'monitor',
  'dashboard',
  'analytics',
  'conversion',
  'subscription',
  'migration',
  'compatibility',
  'prototype',
  'iteration',
  'release',
  'feature',
  'bug',
  'documentation',
  'platform',
  'storage',
  'capacity',
  'security',
  'privacy',
  'cloud',
  'network',
  'application',
  'version',
  'update',
  'workflow',
  'automation',
  'token',
  'credential',
  'sync',
  'cache',
  'endpoint',
  'traffic',
  'session',
]

const manualPriorityWords = [
  'goods',
  'equity',
  'dividend',
  'corporation',
  'firm',
  'commerce',
  'retail',
  'wholesale',
  'manufacturer',
  'distribution',
  'logistics',
  'warehouse',
  'purchase',
  'merchandise',
  'discount',
  'receipt',
  'balance',
  'deposit',
  'withdrawal',
  'loan',
  'interest',
  'profit',
  'loss',
  'asset',
  'liability',
  'shareholder',
  'insurance',
  'premium',
  'claim',
  'coverage',
  'lease',
  'rent',
  'tenant',
  'property',
  'appointment',
  'conference',
  'seminar',
  'workshop',
  'presentation',
  'negotiation',
  'schedule',
  'calendar',
  'memo',
  'announcement',
  'recruit',
  'hire',
  'supervisor',
  'colleague',
  'staff',
  'shift',
  'overtime',
  'salary',
  'wage',
  'payroll',
  'training',
  'evaluation',
  'qualification',
  'certificate',
  'license',
  'regulation',
  'requirement',
  'standard',
  'quality',
  'inspection',
  'survey',
  'questionnaire',
  'customer',
  'complaint',
  'satisfaction',
  'service',
  'support',
  'issue',
  'solution',
  'repair',
  'replacement',
  'delivery',
  'delay',
  'customs',
  'freight',
  'destination',
  'passenger',
  'boarding',
  'departure',
  'arrival',
  'accommodation',
  'reservation',
  'cancellation',
  'menu',
  'catering',
  'venue',
  'exhibition',
  'registration',
  'membership',
  'renewal',
  'donation',
  'fundraising',
  'executive',
  'director',
  'strategy',
  'objective',
  'target',
  'forecast',
  'trend',
  'growth',
  'decline',
  'competition',
  'competitor',
  'brand',
  'advertising',
  'promotion',
  'publicity',
  'platform',
  'software',
  'hardware',
  'device',
  'mobile',
  'browser',
  'website',
  'online',
  'digital',
  'data',
  'system',
  'account',
  'password',
  'login',
  'download',
  'upload',
  'install',
  'upgrade',
  'access',
  'admin',
]

const businessKeywords = new Set([
  'account',
  'agenda',
  'agreement',
  'approval',
  'audit',
  'authorize',
  'benefit',
  'branch',
  'budget',
  'campaign',
  'candidate',
  'client',
  'collaborate',
  'compliance',
  'confirm',
  'contract',
  'coordinate',
  'deadline',
  'delegate',
  'deliver',
  'deliverable',
  'department',
  'employee',
  'estimate',
  'expense',
  'feedback',
  'finance',
  'inventory',
  'invoice',
  'itinerary',
  'launch',
  'maintenance',
  'manager',
  'market',
  'meeting',
  'milestone',
  'negotiate',
  'notify',
  'onboarding',
  'order',
  'payment',
  'performance',
  'policy',
  'priority',
  'procedure',
  'process',
  'procurement',
  'product',
  'project',
  'promotion',
  'proposal',
  'quotation',
  'refund',
  'reimburse',
  'relocate',
  'request',
  'reservation',
  'reschedule',
  'resume',
  'revenue',
  'shipment',
  'stakeholder',
  'strategy',
  'supplier',
  'training',
  'vendor',
  'warranty',
])

const translations = {
  implement: '实施，执行',
  allocate: '分配，拨出',
  estimate: '估算，预估',
  invoice: '发票，账单',
  vendor: '供应商，卖方',
  agenda: '议程',
  proposal: '提案，建议书',
  contract: '合同',
  deadline: '截止日期',
  revenue: '收入，营收',
  expense: '费用，开支',
  inventory: '库存',
  shipment: '货运，发货',
  refund: '退款',
  warranty: '保修，质保',
  branch: '分店，分支机构',
  candidate: '候选人',
  resume: '简历',
  onboarding: '入职培训，导入流程',
  benefit: '福利，好处',
  promotion: '晋升，促销',
  performance: '绩效，表现',
  attendance: '出勤，参加人数',
  policy: '政策，制度',
  procedure: '流程，程序',
  compliance: '合规，遵守',
  audit: '审计，审核',
  negotiate: '谈判，协商',
  coordinate: '协调',
  prioritize: '优先处理',
  collaborate: '协作',
  delegate: '委派，授权',
  briefing: '简报，情况说明会',
  stakeholder: '利益相关者',
  milestone: '里程碑，阶段目标',
  deliverable: '交付物',
  feedback: '反馈',
  approval: '批准，许可',
  authorize: '授权，批准',
  reimburse: '报销，偿还',
  commute: '通勤',
  relocate: '搬迁，调动',
  renovate: '翻新，整修',
  facility: '设施，场所',
  equipment: '设备',
  maintenance: '维护，保养',
  subscription: '订阅',
  dashboard: '仪表盘，数据面板',
  deploy: '部署，发布',
  deployment: '部署，发布',
  scalable: '可扩展的',
  scalability: '可扩展性',
  outage: '中断，停机',
  backup: '备份',
  database: '数据库',
  encryption: '加密',
  authentication: '身份验证',
  authorization: '授权',
  permission: '权限，许可',
  integration: '集成，整合',
  automation: '自动化',
  interface: '界面，接口',
  prototype: '原型',
  iteration: '迭代',
  latency: '延迟',
  bandwidth: '带宽',
  storage: '存储',
  migration: '迁移',
  compatibility: '兼容性',
  configuration: '配置',
  documentation: '文档',
  repository: '代码仓库，资料库',
  version: '版本',
  feature: '功能，特性',
  bug: '缺陷，错误',
  release: '发布',
  monitor: '监控',
  incident: '事件，事故',
  capacity: '容量，能力',
  analytics: '数据分析',
  conversion: '转化，转换',
  campaign: '营销活动',
  quotation: '报价单',
  reservation: '预订，预约',
  itinerary: '行程',
  accommodation: '住宿',
  confirm: '确认',
  postpone: '推迟',
  reschedule: '重新安排',
  attach: '附上，附加',
  notify: '通知',
  launch: '发布，推出',
  retain: '保留，留住',
  resolve: '解决',
  escalate: '升级处理',
  subscribe: '订阅',
}

const collocations = {
  default: ['review a {word}', 'update the {word}', 'prepare a {word}', 'confirm the {word}'],
  TOEIC: ['process a {word}', 'submit a {word}', 'review the {word}', 'confirm the {word}'],
  工作: ['discuss the {word}', 'prioritize the {word}', 'coordinate the {word}', 'improve the {word}'],
  科技: ['configure the {word}', 'monitor the {word}', 'deploy the {word}', 'update the {word}'],
}

const distractors = [
  'invoice',
  'agenda',
  'budget',
  'vendor',
  'policy',
  'shipment',
  'deadline',
  'contract',
  'platform',
  'outage',
  'refund',
  'proposal',
  'database',
  'deployment',
  'analytics',
  'approval',
]

function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let quoted = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"' && quoted && next === '"') {
      value += '"'
      i += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === ',' && !quoted) {
      row.push(value)
      value = ''
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1
      row.push(value)
      if (row.some((item) => item.trim())) rows.push(row)
      row = []
      value = ''
    } else {
      value += char
    }
  }

  if (value || row.length) {
    row.push(value)
    rows.push(row)
  }

  const [headers, ...body] = rows
  return body.map((items) => Object.fromEntries(headers.map((header, index) => [header.trim(), items[index]?.trim() ?? ''])))
}

async function fetchText(url, cacheName) {
  const cachePath = resolve(cacheDir, cacheName)
  await mkdir(cacheDir, { recursive: true })

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(90000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const text = await response.text()
      await writeFile(cachePath, text, 'utf8')
      return text
    } catch (error) {
      if (attempt === 3) {
        try {
          return await readFile(cachePath, 'utf8')
        } catch {
          throw new Error(`Failed to fetch ${url} and no cache is available: ${error.message}`)
        }
      }
    }
  }
}

function cleanWord(word) {
  return word.toLowerCase().replace(/[^a-z-]/g, '')
}

function getWord(row) {
  return cleanWord(row.Word || row.Lemma || row.word || '')
}

function rank(row, key) {
  return Number(row[key] || row['SFI Rank'] || 9999)
}

function sourceEntry(word, group, source, rankValue) {
  return { word, group, source, rank: rankValue }
}

function addCandidate(map, entry) {
  if (!entry.word || entry.word.length < 3 || entry.word.includes('-')) return
  const current = map.get(entry.word)
  if (current && !current.source.startsWith('manual') && entry.source.startsWith('manual')) return
  if (!current || entry.rank < current.rank) map.set(entry.word, entry)
}

function cleanTranslation(text) {
  if (!text) return ''
  return text
    .replace(/\\n/g, '；')
    .replace(/\s+/g, ' ')
    .split(/[；;]/)
    .map((item) => item.replace(/^[a-z]+\.\s*/i, '').trim())
    .find((item) => /[\u4e00-\u9fff]/.test(item))
    ?.slice(0, 32) ?? ''
}

function posFromDict(text) {
  const match = text?.match(/\b(n|v|adj|adv|prep|conj|pron)\./i)
  return match ? `${match[1].toLowerCase()}.` : 'n./v.'
}

function classify(word, source) {
  if (techWords.includes(word)) return '科技'
  if (source === 'TSL') return 'TOEIC'
  if (source === 'BSL') return '工作'
  return businessKeywords.has(word) ? '工作' : 'TOEIC'
}

function levelByRank(rankValue) {
  if (rankValue <= 80) return '核心'
  if (rankValue <= 260) return '高频'
  return '进阶'
}

function tagsFor(word, group) {
  if (group === '科技') {
    if (/auth|encrypt|permission|privacy|security|credential|token/.test(word)) return ['安全', '系统']
    if (/database|storage|analytics|migration|backup/.test(word)) return ['数据', '平台']
    if (/deploy|release|repository|configuration|version/.test(word)) return ['开发', '运维']
    return ['科技', '产品']
  }
  if (/invoice|budget|revenue|expense|payment|refund|reimburse|equity|dividend/.test(word)) return ['财务', '商务']
  if (/candidate|resume|employee|training|benefit|performance|attendance/.test(word)) return ['HR', '管理']
  if (/shipment|inventory|vendor|supplier|quotation|warranty|order/.test(word)) return ['采购', '运营']
  return group === '工作' ? ['工作', '沟通'] : ['TOEIC', '商务']
}

function makeSentence(word, group) {
  const target = word.toLowerCase()
  if (group === '科技') return `The team will review the ${target} before the next product release.`
  if (group === '工作') return `The manager discussed the ${target} during the weekly meeting.`
  return `Please confirm the ${target} before you send the final email.`
}

function translateSentence(group, cn) {
  if (group === '科技') return `团队会在下一次产品发布前检查这个${cn}相关事项。`
  if (group === '工作') return `经理在每周会议上讨论了这个${cn}相关事项。`
  return `发送最终邮件前，请确认这个${cn}相关事项。`
}

function makeOptions(word, index) {
  const options = [word]
  for (const item of distractors.slice(index % distractors.length).concat(distractors)) {
    if (options.length === 4) break
    if (item !== word && !options.includes(item)) options.push(item)
  }
  return options
}

async function main() {
  const [tsl, bsl, ngsl, ecdict] = await Promise.all([
    fetchText(sources.tsl.url, 'tsl.csv').then(parseCsv),
    fetchText(sources.bsl.url, 'bsl.csv').then(parseCsv),
    fetchText(sources.ngsl.url, 'ngsl.csv').then(parseCsv),
    fetchText(sources.ecdict.url, 'ecdict-mini.csv').then(parseCsv),
  ])

  const dict = new Map(
    ecdict.map((row) => [
      cleanWord(row.word),
      {
        phonetic: row.phonetic,
        translation: cleanTranslation(row.translation),
        pos: posFromDict(row.translation),
      },
    ]),
  )

  const candidates = new Map()
  for (const row of tsl.slice(0, 520)) addCandidate(candidates, sourceEntry(getWord(row), 'TOEIC', 'TSL', rank(row, 'TSL Rank')))
  for (const row of bsl.slice(0, 520)) addCandidate(candidates, sourceEntry(getWord(row), '工作', 'BSL', rank(row, 'BSL Rank')))
  for (const row of ngsl.slice(0, 1200)) {
    const word = getWord(row)
    if (businessKeywords.has(word)) addCandidate(candidates, sourceEntry(word, '工作', 'NGSL', rank(row, 'SFI Rank')))
  }
  for (const [index, word] of techWords.entries()) addCandidate(candidates, sourceEntry(word, '科技', 'manual-tech', index + 1))
  for (const [index, word] of [...Object.keys(translations), ...manualPriorityWords].entries()) {
    addCandidate(candidates, sourceEntry(cleanWord(word), techWords.includes(word) ? '科技' : '工作', 'manual-priority', index + 1))
  }

  const words = [...candidates.values()]
    .filter((item) => dict.has(item.word) || translations[item.word] || item.source.startsWith('manual'))
    .sort((a, b) => a.group.localeCompare(b.group) || a.rank - b.rank)
    .slice(0, 620)
    .map((item, index) => {
      const group = classify(item.word, item.source)
      const dictionary = dict.get(item.word) ?? {}
      const cn = translations[item.word] || dictionary.translation || '公开词表导入词'
      const sentence = makeSentence(item.word, group)
      const collocation = collocations[group][index % collocations[group].length].replace('{word}', item.word)
      return {
        id: item.word,
        word: item.word,
        phonetic: dictionary.phonetic || '',
        part: dictionary.pos || 'n./v.',
        cn,
        group,
        level: levelByRank(item.rank),
        tags: tagsFor(item.word, group),
        collocation,
        sentence,
        translation: translateSentence(group, cn),
        blank: sentence.replace(new RegExp(`\\b${item.word}\\b`, 'i'), '____'),
        options: makeOptions(item.word, index),
        note: `来源：${item.source}。重点记住搭配 "${collocation}"，再放回例句理解。`,
        source: item.source,
      }
    })

  const output = `// Generated by scripts/importPublicWordBank.mjs.
// Sources:
// - TOEIC Service List / Business Service List / NGSL: CC BY-SA 4.0
// - ECDICT mini: MIT

export const words = ${JSON.stringify(words, null, 2)}

export const filters = ['全部', 'TOEIC', '工作', '科技']
`

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, output, 'utf8')
  console.log(`Generated ${words.length} words at ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
