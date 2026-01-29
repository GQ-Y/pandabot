import type { TranslationDict } from './types.js';

export const en: TranslationDict = {
  // Navigation
  nav: {
    chat: 'Chat',
    control: 'Control',
    agent: 'Agent',
    settings: 'Settings',
    overview: 'Overview',
    channels: 'Channels',
    instances: 'Instances',
    sessions: 'Sessions',
    cron: 'Cron Jobs',
    skills: 'Skills',
    nodes: 'Nodes',
    config: 'Config',
    debug: 'Debug',
    logs: 'Logs',
  },
  
  navDesc: {
    overview: 'Gateway status, entry points, and a fast health read.',
    channels: 'Manage channels and settings.',
    instances: 'Presence beacons from connected clients and nodes.',
    sessions: 'Inspect active sessions and adjust per-session defaults.',
    cron: 'Schedule wakeups and recurring agent runs.',
    skills: 'Manage skill availability and API key injection.',
    nodes: 'Paired devices, capabilities, and command exposure.',
    chat: 'Direct gateway chat session for quick interventions.',
    config: 'Edit ~/.panda/panda.json safely.',
    debug: 'Gateway snapshots, events, and manual RPC calls.',
    logs: 'Live tail of the gateway file logs.',
  },

  // Brand
  brand: {
    title: 'PANDABOT',
    subtitle: 'Gateway Dashboard',
    docs: 'Docs',
    resources: 'Resources',
  },

  // Common buttons and actions
  common: {
    connect: 'Connect',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    loading: 'Loading…',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    enable: 'Enable',
    disable: 'Disable',
    enabled: 'Enabled',
    disabled: 'Disabled',
    stop: 'Stop',
    run: 'Run',
    send: 'Send',
    queue: 'Queue',
    yes: 'Yes',
    no: 'No',
    na: 'n/a',
    ok: 'OK',
    offline: 'Offline',
    connected: 'Connected',
    disconnected: 'Disconnected',
    active: 'Active',
    configured: 'Configured',
    running: 'Running',
    health: 'Health',
    expandSidebar: 'Expand sidebar',
    collapseSidebar: 'Collapse sidebar',
    closeSidebar: 'Close sidebar',
    filter: 'Filter',
    search: 'Search',
    add: 'Add',
    remove: 'Remove',
    edit: 'Edit',
    view: 'View',
    close: 'Close',
  },

  // Status and messages
  status: {
    linked: 'Linked',
    paired: 'paired',
    unpaired: 'unpaired',
    online: 'connected',
    revoked: 'revoked',
    eligible: 'eligible',
    blocked: 'blocked',
    valid: 'valid',
    invalid: 'invalid',
    unknown: 'unknown',
  },

  // Overview page
  overview: {
    title: 'Gateway Access',
    subtitle: 'Where the dashboard connects and how it authenticates.',
    snapshotTitle: 'Snapshot',
    snapshotSubtitle: 'Latest gateway handshake information.',
    notesTitle: 'Notes',
    notesSubtitle: 'Quick reminders for remote control setups.',
    
    websocketUrl: 'WebSocket URL',
    websocketPlaceholder: 'ws://100.x.y.z:18789',
    gatewayToken: 'Gateway Token',
    tokenPlaceholder: 'PANDA_GATEWAY_TOKEN',
    password: 'Password (not stored)',
    passwordPlaceholder: 'system or shared password',
    defaultSession: 'Default Session Key',
    
    clickConnectToApply: 'Click Connect to apply connection changes.',
    statusLabel: 'Status',
    uptime: 'Uptime',
    tickInterval: 'Tick Interval',
    lastChannelsRefresh: 'Last Channels Refresh',
    
    instancesLabel: 'Instances',
    instancesHelp: 'Presence beacons in the last 5 minutes.',
    sessionsLabel: 'Sessions',
    sessionsHelp: 'Recent session keys tracked by the gateway.',
    cronLabel: 'Cron',
    nextWake: 'Next wake',
    
    channelsNote: 'Use Channels to link WhatsApp, Telegram, Discord, Signal, or iMessage.',
    tailscaleServeNote: 'Prefer serve mode to keep the gateway on loopback with tailnet auth.',
    sessionHygieneTitle: 'Session hygiene',
    sessionHygieneNote: 'Use /new or sessions.patch to reset context.',
    cronRemindersTitle: 'Cron reminders',
    cronRemindersNote: 'Use isolated sessions for recurring runs.',
    
    authFailed: 'Auth failed. Re-copy a tokenized URL...',
    authRequired: 'This gateway requires auth. Add a token or password, then click Connect.',
    tokenizedUrl: 'tokenized URL',
    setToken: 'set token',
    httpWarning: 'This page is HTTP, so the browser blocks device identity...',
    insecureContextHint: 'This page is HTTP, so the browser blocks device identity. Use HTTPS (Tailscale Serve) or open',
    insecureContextConfig: 'If you must stay on HTTP, set',
    controlUiAuthDocs: 'Control UI auth docs (opens in new tab)',
    docsTailscaleServe: 'Docs: Tailscale Serve',
    docsInsecureHttp: 'Docs: Insecure HTTP',
    tailscaleServeDocs: 'Tailscale Serve docs (opens in new tab)',
    insecureHttpDocs: 'Insecure HTTP docs (opens in new tab)',
    disconnectedFromGateway: 'Disconnected from gateway.',
  },

  // Chat page
  chat: {
    loadingChat: 'Loading chat…',
    compacting: 'Compacting context...',
    compacted: 'Context compacted',
    queued: 'Queued',
    removeQueued: 'Remove queued message',
    removeAttachment: 'Remove attachment',
    attachmentPreview: 'Attachment preview',
    
    messagePlaceholder: 'Message (↩ to send, Shift+↩ for line breaks, paste images)',
    messagePlaceholderMore: 'Add a message or paste more images...',
    connectToStart: 'Connect to the gateway to start chatting…',
    
    newSession: 'New session',
    showingLast: 'Showing last',
    messagesHidden: 'messages',
    hidden: 'hidden',
    
    exitFocusMode: 'Exit focus mode',
    refreshChatData: 'Refresh chat data',
    toggleThinking: 'Toggle assistant thinking/working output',
    toggleFocusMode: 'Toggle focus mode (hide sidebar + page header)',
    disabledDuringOnboarding: 'Disabled during onboarding',
  },

  // Sessions page
  sessions: {
    title: 'Sessions',
    subtitle: 'Active session keys and per-session overrides.',
    noSessionsFound: 'No sessions found.',
    storeLabel: 'Store:',
    
    activeWithin: 'Active within (minutes)',
    limit: 'Limit',
    includeGlobal: 'Include global',
    includeUnknown: 'Include unknown',
    
    keyColumn: 'Key',
    labelColumn: 'Label',
    kindColumn: 'Kind',
    updatedColumn: 'Updated',
    tokensColumn: 'Tokens',
    thinkingColumn: 'Thinking',
    verboseColumn: 'Verbose',
    reasoningColumn: 'Reasoning',
    actionsColumn: 'Actions',
    
    inherit: 'inherit',
    optional: '(optional)',
  },

  // Config page
  config: {
    title: 'Settings',
    subtitle: 'Link WhatsApp Web and monitor connection health.',
    allSettings: 'All Settings',
    searchSettings: 'Search settings…',
    
    sections: {
      env: 'Environment',
      update: 'Updates',
      agents: 'Agents',
      auth: 'Authentication',
      channels: 'Channels',
      messages: 'Messages',
      commands: 'Commands',
      hooks: 'Hooks',
      skills: 'Skills',
      tools: 'Tools',
      gateway: 'Gateway',
      wizard: 'Setup Wizard',
    },
    
    all: 'All',
    defaults: 'Defaults',
    form: 'Form',
    raw: 'Raw',
    rawJson: 'Raw JSON5',
    
    noChanges: 'No changes',
    unsavedChanges: 'Unsaved changes',
    unsavedCount: 'unsaved change(s)',
    viewPending: 'View pending change(s)',
    loadingSchema: 'Loading schema…',
    
    formViewWarning: "Form view can't safely edit some fields. Use Raw to avoid losing config entries.",
  },

  // Skills page
  skills: {
    title: 'Skills',
    subtitle: 'Bundled, managed, and workspace skills.',
    noSkillsFound: 'No skills found.',
    searchSkills: 'Search skills',
    shown: 'shown',
    
    apiKey: 'API key',
    saveKey: 'Save key',
  },

  // Nodes page
  nodes: {
    title: 'Nodes',
    subtitle: 'Paired devices and live links.',
    devicesTitle: 'Devices',
    devicesSubtitle: 'Pairing requests + role tokens.',
    noNodesFound: 'No nodes found.',
    noPairedDevices: 'No paired devices.',
    
    execBindingTitle: 'Exec node binding',
    execBindingSubtitle: 'Pin agents to a specific node when using exec host=node.',
    execApprovalsTitle: 'Exec approvals',
    execApprovalsSubtitle: 'Allowlist and approval policy for exec host=gateway/node.',
    
    roles: 'roles:',
    requested: 'requested',
    tokens: 'Tokens',
    tokensNone: 'Tokens: none',
    
    approve: 'Approve',
    reject: 'Reject',
    rotate: 'Rotate',
    revoke: 'Revoke',
    
    defaultBinding: 'Default binding',
    defaultBindingHelp: 'Used when agents do not override a node binding.',
    loadConfigToEdit: 'Load config to edit bindings.',
    switchToFormMode: 'Switch the Config tab to Form mode to edit bindings here.',
    
    target: 'Target',
    targetHelp: 'Gateway edits local approvals; node edits the selected node.',
    scope: 'Scope',
    security: 'Security',
    securityHelp: 'Default security mode.',
    securityDefault: 'Default:',
    ask: 'Ask',
    askHelp: 'Default prompt policy.',
    askFallback: 'Ask fallback',
    askFallbackHelp: 'Applied when the UI prompt is unavailable.',
    autoAllowSkillClis: 'Auto-allow skill CLIs',
    autoAllowHelp: 'Allow skill executables listed by the Gateway.',
    usingDefault: 'Using default',
    override: 'Override',
    allowlist: 'Allowlist',
    allowlistHelp: 'Case-insensitive glob patterns.',
    noAllowlistEntries: 'No allowlist entries yet.',
    lastUsed: 'Last used:',
    noAgents: 'No agents found.',
    selectNode: 'Select node',
    noNodesWithExec: 'No nodes with system.run available.',
    noNodesWithApprovals: 'No nodes advertise exec approvals yet.',
    loadExecApprovalsToEdit: 'Load exec approvals to edit allowlists.',
    useDefault: 'Use default',
    uses: 'uses default',
  },

  // Channels page
  channels: {
    title: 'Channel health',
    subtitle: 'Channel status snapshots from the gateway.',
    noSnapshot: 'No snapshot yet.',
    
    whatsappTitle: 'WhatsApp',
    whatsappSubtitle: 'Link WhatsApp Web and monitor connection health.',
    showQr: 'Show QR',
    working: 'Working…',
    relink: 'Relink',
    waitForScan: 'Wait for scan',
    logout: 'Logout',
    
    channelStatusTitle: 'Channel status and configuration.',
    reload: 'Reload',
  },

  // Cron page
  cron: {
    schedulerTitle: 'Scheduler',
    schedulerSubtitle: 'Gateway-owned cron scheduler status.',
    newJobTitle: 'New Job',
    newJobSubtitle: 'Create a scheduled wakeup or agent run.',
    jobsTitle: 'Jobs',
    jobsSubtitle: 'All scheduled jobs stored in the gateway.',
    runHistoryTitle: 'Run history',
    runHistorySubtitle: 'Latest runs for',
    
    name: 'Name',
    description: 'Description',
    agentId: 'Agent ID',
    default: 'default',
    schedule: 'Schedule',
    session: 'Session',
    wakeMode: 'Wake mode',
    payload: 'Payload',
    systemText: 'System text',
    agentMessage: 'Agent message',
    deliver: 'Deliver',
    channel: 'Channel',
    to: 'To',
    toPlaceholder: '+1555… or chat id',
    timeout: 'Timeout (seconds)',
    postToMainPrefix: 'Post to main prefix',
    
    addJob: 'Add job',
    runs: 'Runs',
    
    noJobsYet: 'No jobs yet.',
    noRunsYet: 'No runs yet.',
    selectJobToInspect: 'Select a job to inspect run history.',
    
    runAt: 'Run at',
    every: 'Every',
    unit: 'Unit',
    expression: 'Expression',
    timezone: 'Timezone (optional)',
    
    nextHeartbeat: 'Next heartbeat',
    now: 'Now',
    systemEvent: 'System event',
    agentTurn: 'Agent turn',
    at: 'At',
    cronExpr: 'Cron',
    minutes: 'Minutes',
    hours: 'Hours',
    days: 'Days',
  },

  // Logs page
  logs: {
    title: 'Logs',
    subtitle: 'Gateway file logs (JSONL).',
    noLogEntries: 'No log entries.',
    searchLogs: 'Search logs',
    fileLabel: 'File:',
    logTruncated: 'Log output truncated; showing latest chunk.',
  },

  // Debug page
  debug: {
    snapshotsTitle: 'Snapshots',
    snapshotsSubtitle: 'Status, health, and heartbeat data.',
    manualRpcTitle: 'Manual RPC',
    manualRpcSubtitle: 'Send a raw gateway method with JSON params.',
    modelsTitle: 'Models',
    modelsSubtitle: 'Catalog from models.list.',
    eventLogTitle: 'Event Log',
    eventLogSubtitle: 'Latest gateway events.',
    
    securityAudit: 'Security audit:',
    runAuditCommand: 'Run panda security audit --deep for details.',
    
    method: 'Method',
    methodPlaceholder: 'system-presence',
    params: 'Params (JSON)',
    
    noEventsYet: 'No events yet.',
  },

  // Instances page
  instances: {
    title: 'Connected Instances',
    subtitle: 'Presence beacons from the gateway and clients.',
    noInstancesYet: 'No instances reported yet.',
    
    lastInput: 'Last input',
    ago: 'ago',
    reason: 'Reason',
    scopes: 'scopes:',
  },

  // Exec approval page
  execApproval: {
    title: 'Exec approval needed',
    expiresIn: 'expires in',
    expired: 'expired',
    pending: 'pending',
    
    host: 'Host',
    agent: 'Agent',
    session: 'Session',
    cwd: 'CWD',
    resolved: 'Resolved',
    security: 'Security',
    ask: 'Ask',
    
    allowOnce: 'Allow once',
    alwaysAllow: 'Always allow',
    deny: 'Deny',
    
    failed: 'Exec approval failed:',
  },

  // Gateway URL confirmation
  gatewayUrl: {
    title: 'Change Gateway URL',
    message: 'This will reconnect to a different gateway server',
    warning: 'Only confirm if you trust this URL. Malicious URLs can compromise your system.',
  },

  // Markdown sidebar
  markdown: {
    title: 'Tool Output',
    viewRawText: 'View Raw Text',
    noContentAvailable: 'No content available',
  },

  // Format helpers
  format: {
    inherit: 'inherit',
    off: 'off',
    on: 'on',
    minimal: 'minimal',
    low: 'low',
    medium: 'medium',
    high: 'high',
    stream: 'stream',
    main: 'Main',
    isolated: 'Isolated',
    offExplicit: 'off (explicit)',
    deny: 'Deny',
    allowlist: 'Allowlist',
    full: 'Full',
    onMiss: 'On miss',
    always: 'Always',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  },
};
