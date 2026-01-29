import type { TranslationDict } from './types.js';

export const zh: TranslationDict = {
  // 导航
  nav: {
    chat: '聊天',
    control: '控制',
    agent: '代理',
    settings: '设置',
    overview: '概览',
    channels: '渠道',
    instances: '实例',
    sessions: '会话',
    cron: '定时任务',
    skills: '技能',
    nodes: '节点',
    config: '配置',
    debug: '调试',
    logs: '日志',
  },
  
  navDesc: {
    overview: 'Gateway 状态、入口点和快速健康检查。',
    channels: '管理渠道和设置。',
    instances: '已连接客户端和节点的存在信标。',
    sessions: '查看活动会话并调整每个会话的默认值。',
    cron: '计划唤醒和定期代理运行。',
    skills: '管理技能可用性和 API 密钥注入。',
    nodes: '配对设备、功能和命令暴露。',
    chat: '直接 Gateway 聊天会话用于快速干预。',
    config: '安全编辑 ~/.panda/panda.json。',
    debug: 'Gateway 快照、事件和手动 RPC 调用。',
    logs: 'Gateway 文件日志的实时尾部。',
  },

  // 品牌
  brand: {
    title: 'PANDABOT',
    subtitle: 'Gateway 控制面板',
    docs: '文档',
    resources: '资源',
  },

  // 通用按钮和操作
  common: {
    connect: '连接',
    refresh: '刷新',
    refreshing: '刷新中…',
    loading: '加载中…',
    save: '保存',
    saving: '保存中…',
    saved: '已保存',
    delete: '删除',
    cancel: '取消',
    confirm: '确认',
    enable: '启用',
    disable: '禁用',
    enabled: '已启用',
    disabled: '已禁用',
    stop: '停止',
    run: '运行',
    send: '发送',
    queue: '队列',
    yes: '是',
    no: '否',
    na: '不适用',
    ok: '正常',
    offline: '离线',
    connected: '已连接',
    disconnected: '未连接',
    active: '活跃',
    configured: '已配置',
    running: '运行中',
    health: '健康',
    expandSidebar: '展开侧边栏',
    collapseSidebar: '折叠侧边栏',
    closeSidebar: '关闭侧边栏',
    filter: '过滤',
    search: '搜索',
    add: '添加',
    remove: '移除',
    edit: '编辑',
    view: '查看',
    close: '关闭',
  },

  // 状态和消息
  status: {
    linked: '已链接',
    paired: '已配对',
    unpaired: '未配对',
    online: '在线',
    revoked: '已撤销',
    eligible: '符合条件',
    blocked: '已阻止',
    valid: '有效',
    invalid: '无效',
    unknown: '未知',
  },

  // 概览页面
  overview: {
    title: 'Gateway 访问',
    subtitle: '控制面板连接位置及认证方式。',
    snapshotTitle: '快照',
    snapshotSubtitle: '最新的 Gateway 握手信息。',
    notesTitle: '备注',
    notesSubtitle: '远程控制设置的快速提醒。',
    
    websocketUrl: 'WebSocket URL',
    websocketPlaceholder: 'ws://100.x.y.z:18789',
    gatewayToken: 'Gateway Token',
    tokenPlaceholder: 'PANDA_GATEWAY_TOKEN',
    password: '密码（不存储）',
    passwordPlaceholder: '系统或共享密码',
    defaultSession: '默认会话密钥',
    
    clickConnectToApply: '点击连接以应用连接更改。',
    statusLabel: '状态',
    uptime: '运行时间',
    tickInterval: '心跳间隔',
    lastChannelsRefresh: '最后渠道刷新',
    
    instancesLabel: '实例',
    instancesHelp: '最近 5 分钟内的存在信标。',
    sessionsLabel: '会话',
    sessionsHelp: 'Gateway 追踪的最近会话密钥。',
    cronLabel: '定时任务',
    nextWake: '下次唤醒',
    
    channelsNote: '使用渠道链接 WhatsApp、Telegram、Discord、Signal 或 iMessage。',
    tailscaleServeNote: '推荐使用 serve 模式保持 Gateway 在环回地址，使用 tailnet 认证。',
    sessionHygieneTitle: '会话清理',
    sessionHygieneNote: '使用 /new 或 sessions.patch 重置上下文。',
    cronRemindersTitle: 'Cron 提醒',
    cronRemindersNote: '对于定期运行使用隔离会话。',
    
    authFailed: '认证失败。重新复制带 token 的 URL...',
    authRequired: '此 Gateway 需要认证。添加 token 或密码，然后点击连接。',
    tokenizedUrl: '带 token 的 URL',
    setToken: '设置 token',
    httpWarning: '此页面是 HTTP，浏览器会阻止设备标识...',
    insecureContextHint: '此页面为 HTTP，浏览器阻止设备身份认证。请使用 HTTPS（Tailscale Serve）或在 Gateway 主机上打开',
    insecureContextConfig: '如果必须使用 HTTP，请设置',
    controlUiAuthDocs: '控制面板认证文档（新标签页打开）',
    docsTailscaleServe: '文档：Tailscale Serve',
    docsInsecureHttp: '文档：不安全的 HTTP',
    tailscaleServeDocs: 'Tailscale Serve 文档（新标签页打开）',
    insecureHttpDocs: '不安全 HTTP 文档（新标签页打开）',
    disconnectedFromGateway: '已断开 Gateway 连接。',
  },

  // 聊天页面
  chat: {
    loadingChat: '加载聊天中…',
    compacting: '压缩上下文中...',
    compacted: '上下文已压缩',
    queued: '已排队',
    removeQueued: '移除排队的消息',
    removeAttachment: '移除附件',
    attachmentPreview: '附件预览',
    
    messagePlaceholder: '消息（回车发送，Shift+回车换行，粘贴图片）',
    messagePlaceholderMore: '添加消息或粘贴更多图片...',
    connectToStart: '连接到 Gateway 开始聊天…',
    
    newSession: '新会话',
    showingLast: '显示最后',
    messagesHidden: '条消息',
    hidden: '已隐藏',
    
    exitFocusMode: '退出专注模式',
    refreshChatData: '刷新聊天数据',
    toggleThinking: '切换助手思考/工作输出',
    toggleFocusMode: '切换专注模式（隐藏侧边栏+页面标题）',
    disabledDuringOnboarding: '引导期间已禁用',
  },

  // 会话页面
  sessions: {
    title: '会话',
    subtitle: '活动会话密钥和每个会话的覆盖设置。',
    noSessionsFound: '未找到会话。',
    storeLabel: '存储：',
    
    activeWithin: '活跃时间（分钟）',
    limit: '限制',
    includeGlobal: '包括全局',
    includeUnknown: '包括未知',
    
    keyColumn: '密钥',
    labelColumn: '标签',
    kindColumn: '类型',
    updatedColumn: '更新时间',
    tokensColumn: 'Tokens',
    thinkingColumn: '思考',
    verboseColumn: '详细',
    reasoningColumn: '推理',
    actionsColumn: '操作',
    
    inherit: '继承',
    optional: '（可选）',
  },

  // 配置页面
  config: {
    title: '设置',
    subtitle: '链接 WhatsApp Web 并监控连接健康状况。',
    allSettings: '所有设置',
    searchSettings: '搜索设置…',
    
    sections: {
      env: '环境',
      update: '更新',
      agents: '代理',
      auth: '认证',
      channels: '渠道',
      messages: '消息',
      commands: '命令',
      hooks: '钩子',
      skills: '技能',
      tools: '工具',
      gateway: 'Gateway',
      wizard: '设置向导',
    },
    
    all: '全部',
    defaults: '默认值',
    form: '表单',
    raw: '原始',
    rawJson: '原始 JSON5',
    
    noChanges: '无变更',
    unsavedChanges: '未保存的变更',
    unsavedCount: '个未保存的变更',
    viewPending: '查看待处理的变更',
    loadingSchema: '加载架构中…',
    
    formViewWarning: '表单视图无法安全编辑某些字段。使用原始模式以避免丢失配置条目。',
  },

  // 技能页面
  skills: {
    title: '技能',
    subtitle: '内置、托管和工作区技能。',
    noSkillsFound: '未找到技能。',
    searchSkills: '搜索技能',
    shown: '已显示',
    
    apiKey: 'API 密钥',
    saveKey: '保存密钥',
  },

  // 节点页面
  nodes: {
    title: '节点',
    subtitle: '配对设备和实时链接。',
    devicesTitle: '设备',
    devicesSubtitle: '配对请求 + 角色令牌。',
    noNodesFound: '未找到节点。',
    noPairedDevices: '没有配对设备。',
    
    execBindingTitle: 'Exec 节点绑定',
    execBindingSubtitle: '使用 exec host=node 时将代理固定到特定节点。',
    execApprovalsTitle: 'Exec 审批',
    execApprovalsSubtitle: 'exec host=gateway/node 的允许列表和审批策略。',
    
    roles: '角色：',
    requested: '已请求',
    tokens: '令牌',
    tokensNone: '令牌：无',
    
    approve: '批准',
    reject: '拒绝',
    rotate: '轮换',
    revoke: '撤销',
    
    defaultBinding: '默认绑定',
    defaultBindingHelp: '当代理不覆盖节点绑定时使用。',
    loadConfigToEdit: '加载配置以编辑绑定。',
    switchToFormMode: '切换配置标签到表单模式以在此处编辑绑定。',
    
    target: '目标',
    targetHelp: 'Gateway 编辑本地审批；node 编辑所选节点。',
    scope: '范围',
    security: '安全',
    securityHelp: '默认安全模式。',
    securityDefault: '默认：',
    ask: '询问',
    askHelp: '默认提示策略。',
    askFallback: '询问回退',
    askFallbackHelp: '在 UI 提示不可用时应用。',
    autoAllowSkillClis: '自动允许技能 CLI',
    autoAllowHelp: '允许 Gateway 列出的技能可执行文件。',
    usingDefault: '使用默认值',
    override: '覆盖',
    allowlist: '允许列表',
    allowlistHelp: '不区分大小写的 glob 模式。',
    noAllowlistEntries: '尚无允许列表条目。',
    lastUsed: '最后使用：',
    noAgents: '未找到代理。',
    selectNode: '选择节点',
    noNodesWithExec: '没有具有 system.run 可用的节点。',
    noNodesWithApprovals: '没有节点发布 exec 审批。',
    loadExecApprovalsToEdit: '加载 exec 审批以编辑允许列表。',
    useDefault: '使用默认值',
    uses: '使用默认值',
  },

  // 渠道页面
  channels: {
    title: '渠道健康',
    subtitle: 'Gateway 的渠道状态快照。',
    noSnapshot: '尚无快照。',
    
    whatsappTitle: 'WhatsApp',
    whatsappSubtitle: '链接 WhatsApp Web 并监控连接健康状况。',
    showQr: '显示二维码',
    working: '处理中…',
    relink: '重新链接',
    waitForScan: '等待扫描',
    logout: '登出',
    
    channelStatusTitle: '渠道状态和配置。',
    reload: '重新加载',
  },

  // 定时任务页面
  cron: {
    schedulerTitle: '调度器',
    schedulerSubtitle: 'Gateway 拥有的 cron 调度器状态。',
    newJobTitle: '新任务',
    newJobSubtitle: '创建计划的唤醒或代理运行。',
    jobsTitle: '任务',
    jobsSubtitle: 'Gateway 中存储的所有计划任务。',
    runHistoryTitle: '运行历史',
    runHistorySubtitle: '最新运行记录',
    
    name: '名称',
    description: '描述',
    agentId: '代理 ID',
    default: '默认',
    schedule: '计划',
    session: '会话',
    wakeMode: '唤醒模式',
    payload: '负载',
    systemText: '系统文本',
    agentMessage: '代理消息',
    deliver: '投递',
    channel: '渠道',
    to: '接收者',
    toPlaceholder: '+1555… 或聊天 ID',
    timeout: '超时（秒）',
    postToMainPrefix: '发布到主前缀',
    
    addJob: '添加任务',
    runs: '运行记录',
    
    noJobsYet: '尚无任务。',
    noRunsYet: '尚无运行记录。',
    selectJobToInspect: '选择任务以查看运行历史。',
    
    runAt: '运行时间',
    every: '每',
    unit: '单位',
    expression: '表达式',
    timezone: '时区（可选）',
    
    nextHeartbeat: '下次心跳',
    now: '立即',
    systemEvent: '系统事件',
    agentTurn: '代理轮次',
    at: '在',
    cronExpr: 'Cron',
    minutes: '分钟',
    hours: '小时',
    days: '天',
  },

  // 日志页面
  logs: {
    title: '日志',
    subtitle: 'Gateway 文件日志（JSONL）。',
    noLogEntries: '无日志条目。',
    searchLogs: '搜索日志',
    fileLabel: '文件：',
    logTruncated: '日志输出已截断；显示最新部分。',
  },

  // 调试页面
  debug: {
    snapshotsTitle: '快照',
    snapshotsSubtitle: '状态、健康和心跳数据。',
    manualRpcTitle: '手动 RPC',
    manualRpcSubtitle: '发送原始 Gateway 方法和 JSON 参数。',
    modelsTitle: '模型',
    modelsSubtitle: 'models.list 中的目录。',
    eventLogTitle: '事件日志',
    eventLogSubtitle: '最新的 Gateway 事件。',
    
    securityAudit: '安全审计：',
    runAuditCommand: '运行 panda security audit --deep 查看详情。',
    
    method: '方法',
    methodPlaceholder: 'system-presence',
    params: '参数（JSON）',
    
    noEventsYet: '尚无事件。',
  },

  // 实例页面
  instances: {
    title: '已连接实例',
    subtitle: 'Gateway 和客户端的存在信标。',
    noInstancesYet: '尚无实例报告。',
    
    lastInput: '最后输入',
    ago: '前',
    reason: '原因',
    scopes: '范围：',
  },

  // Exec 审批页面
  execApproval: {
    title: '需要 Exec 审批',
    expiresIn: '过期时间',
    expired: '已过期',
    pending: '待处理',
    
    host: '主机',
    agent: '代理',
    session: '会话',
    cwd: '工作目录',
    resolved: '已解析',
    security: '安全',
    ask: '询问',
    
    allowOnce: '允许一次',
    alwaysAllow: '始终允许',
    deny: '拒绝',
    
    failed: 'Exec 审批失败：',
  },

  // Gateway URL 确认
  gatewayUrl: {
    title: '更改 Gateway URL',
    message: '这将重新连接到不同的 Gateway 服务器',
    warning: '仅在信任此 URL 时确认。恶意 URL 可能会危害您的系统。',
  },

  // Markdown 侧边栏
  markdown: {
    title: '工具输出',
    viewRawText: '查看原始文本',
    noContentAvailable: '无可用内容',
  },

  // 格式化辅助
  format: {
    inherit: '继承',
    off: '关闭',
    on: '开启',
    minimal: '最小',
    low: '低',
    medium: '中',
    high: '高',
    stream: '流式',
    main: '主',
    isolated: '隔离',
    offExplicit: '关闭（显式）',
    deny: '拒绝',
    allowlist: '允许列表',
    full: '完全',
    onMiss: '未命中时',
    always: '始终',
    system: '系统',
    light: '浅色',
    dark: '深色',
  },
};
