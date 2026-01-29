/**
 * 余额监控系统 - 类型定义
 * 用于监控国产 LLM 厂商的 API 余额,并在模型选择时进行过滤
 */

/**
 * 余额状态枚举
 */
export type BalanceStatus = "ok" | "low" | "depleted" | "error" | "unknown";

/**
 * 余额信息接口
 */
export interface BalanceInfo {
  /** 提供商 ID */
  provider: string;
  /** 余额(元) */
  balance?: number;
  /** 已使用额度(元) */
  usage?: number;
  /** 总额度(元) */
  quota?: number;
  /** 额度过期时间 */
  expiresAt?: Date;
  /** 最后检查时间 */
  lastChecked: Date;
  /** 余额状态 */
  status: BalanceStatus;
  /** 错误信息(如果有) */
  error?: string;
}

/**
 * 余额检查器接口
 * 每个 LLM 提供商需要实现这个接口
 */
export interface BalanceChecker {
  /** 提供商 ID */
  readonly providerId: string;
  
  /** 检查余额 */
  checkBalance(config: BalanceCheckConfig): Promise<BalanceInfo>;
}

/**
 * 余额检查配置
 */
export interface BalanceCheckConfig {
  /** API 密钥 */
  apiKey: string;
  /** API 基础 URL */
  baseUrl?: string;
  /** 自定义余额查询 URL */
  balanceCheckUrl?: string;
  /** 请求方法 */
  balanceCheckMethod?: "GET" | "POST";
  /** 自定义用量查询 URL */
  usageApi?: string;
  /** 超时时间(毫秒) */
  timeout?: number;
}

/**
 * 余额缓存接口
 */
export interface BalanceCache {
  /** 获取缓存的余额信息 */
  get(provider: string): Promise<BalanceInfo | null>;
  
  /** 设置余额信息 */
  set(provider: string, balance: BalanceInfo): Promise<void>;
  
  /** 清除特定提供商的缓存 */
  clear(provider: string): Promise<void>;
  
  /** 清除所有缓存 */
  clearAll(): Promise<void>;
  
  /** 获取所有提供商的余额信息 */
  getAll(): Promise<Map<string, BalanceInfo>>;
}

/**
 * 余额监控服务接口
 */
export interface BalanceMonitorService {
  /** 启动监控服务 */
  start(): Promise<void>;
  
  /** 停止监控服务 */
  stop(): Promise<void>;
  
  /** 立即检查特定提供商的余额 */
  checkNow(provider: string): Promise<BalanceInfo>;
  
  /** 立即检查所有提供商的余额 */
  checkAll(): Promise<Map<string, BalanceInfo>>;
  
  /** 获取缓存的余额信息 */
  getBalance(provider: string): Promise<BalanceInfo | null>;
  
  /** 获取所有提供商的余额信息 */
  getAllBalances(): Promise<Map<string, BalanceInfo>>;
  
  /** 检查提供商是否可用(余额充足) */
  isProviderAvailable(provider: string): Promise<boolean>;
  
  /** 获取所有可用的提供商列表 */
  getAvailableProviders(): Promise<string[]>;
}

/**
 * 余额告警配置
 */
export interface BalanceAlertConfig {
  /** 是否启用告警 */
  enabled: boolean;
  /** 告警渠道(email, webhook, log 等) */
  channels: string[];
  /** 告警阈值(元) */
  threshold: number;
  /** 告警冷却时间(秒),避免频繁告警 */
  cooldownSeconds?: number;
}

/**
 * 余额监控配置
 */
export interface BalanceMonitorConfig {
  /** 是否启用余额监控 */
  enabled: boolean;
  
  /** 检查间隔(秒) */
  checkInterval: number;
  
  /** 缓存过期时间(秒) */
  cacheExpiry: number;
  
  /** 各提供商的配置 */
  providers: {
    [providerId: string]: {
      /** 是否启用该提供商的余额监控 */
      enabled: boolean;
      /** 余额阈值(元),低于此值视为不可用 */
      balanceThreshold: number;
      /** 余额查询 URL */
      balanceCheckUrl?: string;
      /** 请求方法 */
      balanceCheckMethod?: "GET" | "POST";
      /** 用量查询 API */
      usageApi?: string;
      /** 超时时间(毫秒) */
      timeout?: number;
    };
  };
  
  /** 告警配置 */
  alerting: BalanceAlertConfig;
}

/**
 * 提供商余额状态事件
 */
export interface BalanceStatusEvent {
  provider: string;
  balance: BalanceInfo;
  previousStatus?: BalanceStatus;
  timestamp: Date;
}

/**
 * 余额监控事件监听器
 */
export interface BalanceMonitorEventListener {
  /** 余额更新事件 */
  onBalanceUpdated?: (event: BalanceStatusEvent) => void;
  
  /** 余额低于阈值事件 */
  onBalanceLow?: (event: BalanceStatusEvent) => void;
  
  /** 余额耗尽事件 */
  onBalanceDepleted?: (event: BalanceStatusEvent) => void;
  
  /** 余额检查错误事件 */
  onBalanceCheckError?: (provider: string, error: Error) => void;
}
