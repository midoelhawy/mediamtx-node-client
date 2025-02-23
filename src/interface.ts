export interface MediamtxConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  auth?: {
    username: string;
    password: string;
  };
  playbackServerBaseURL?: string;
  playbackAuth?: {
    username: string;
    password: string;
  };
}

export interface StreamSource {
  type: string;
  id: string;
}

export interface StreamReader {
  type: string;
  id: string;
}

export interface RecordingItem {
  name: string;
  segments: {
    start: string; // 2025-02-08T19:39:11.768623Z
  }[];
}

export interface StreamItem {
  name: string;
  confName: string;
  source: StreamSource;
  ready: boolean;
  readyTime: string;
  tracks: string[];
  bytesReceived: number;
  bytesSent: number;
  readers: StreamReader[];
}

export interface MediamtxBaseResponseWithPagination<T = any> {
  pageCount: number;
  itemCount: number;
  items: T[];
}

export interface MediamtxGlobalConfig {
  logLevel?: string;
  logDestinations?: string[];
  logFile?: string;
  readTimeout?: string;
  writeTimeout?: string;
  writeQueueSize?: number;
  udpMaxPayloadSize?: number;
  runOnConnect?: string;
  runOnConnectRestart?: boolean;
  runOnDisconnect?: string;
  authMethod?: string;
  authInternalUsers?: {
    user: string;
    pass: string;
    ips: string[];
    permissions: {
      action: string;
      path: string;
    }[];
  }[];
  authHTTPAddress?: string;
  authHTTPExclude?: {
    action: string;
    path: string;
  }[];
  authJWTJWKS?: string;
  authJWTClaimKey?: string;
  api?: boolean;
  apiAddress?: string;
  apiEncryption?: boolean;
  apiServerKey?: string;
  apiServerCert?: string;
  apiAllowOrigin?: string;
  apiTrustedProxies?: string[];
  metrics?: boolean;
  metricsAddress?: string;
  metricsEncryption?: boolean;
  metricsServerKey?: string;
  metricsServerCert?: string;
  metricsAllowOrigin?: string;
  metricsTrustedProxies?: string[];
  pprof?: boolean;
  pprofAddress?: string;
  pprofEncryption?: boolean;
  pprofServerKey?: string;
  pprofServerCert?: string;
  pprofAllowOrigin?: string;
  pprofTrustedProxies?: string[];
  playback?: boolean;
  playbackAddress?: string;
  playbackEncryption?: boolean;
  playbackServerKey?: string;
  playbackServerCert?: string;
  playbackAllowOrigin?: string;
  playbackTrustedProxies?: string[];
  rtsp?: boolean;
  rtspTransports?: string[];
  rtspEncryption?: string;
  rtspAddress?: string;
  rtspsAddress?: string;
  rtpAddress?: string;
  rtcpAddress?: string;
  multicastIPRange?: string;
  multicastRTPPort?: number;
  multicastRTCPPort?: number;
  rtspServerKey?: string;
  rtspServerCert?: string;
  rtspAuthMethods?: string[];
  rtmp?: boolean;
  rtmpAddress?: string;
  rtmpEncryption?: string;
  rtmpsAddress?: string;
  rtmpServerKey?: string;
  rtmpServerCert?: string;
  hls?: boolean;
  hlsAddress?: string;
  hlsEncryption?: boolean;
  hlsServerKey?: string;
  hlsServerCert?: string;
  hlsAllowOrigin?: string;
  hlsTrustedProxies?: string[];
  hlsAlwaysRemux?: boolean;
  hlsVariant?: string;
  hlsSegmentCount?: number;
  hlsSegmentDuration?: string;
  hlsPartDuration?: string;
  hlsSegmentMaxSize?: string;
  hlsDirectory?: string;
  hlsMuxerCloseAfter?: string;
  webrtc?: boolean;
  webrtcAddress?: string;
  webrtcEncryption?: boolean;
  webrtcServerKey?: string;
  webrtcServerCert?: string;
  webrtcAllowOrigin?: string;
  webrtcTrustedProxies?: string[];
  webrtcLocalUDPAddress?: string;
  webrtcLocalTCPAddress?: string;
  webrtcIPsFromInterfaces?: boolean;
  webrtcIPsFromInterfacesList?: string[];
  webrtcAdditionalHosts?: string[];
  webrtcICEServers2?: {
    url: string;
    username: string;
    password: string;
    clientOnly: boolean;
  }[];
  webrtcHandshakeTimeout?: string;
  webrtcTrackGatherTimeout?: string;
  webrtcSTUNGatherTimeout?: string;
  srt?: boolean;
  srtAddress?: string;
}

export interface StreamPathConfig {
  name?: string;
  source?: string;
  sourceFingerprint?: string;
  sourceOnDemand?: boolean;
  sourceOnDemandStartTimeout?: string;
  sourceOnDemandCloseAfter?: string;
  maxReaders?: number;
  srtReadPassphrase?: string;
  fallback?: string;
  record?: boolean;
  recordPath?: string;
  recordFormat?: string;
  recordPartDuration?: string;
  recordSegmentDuration?: string;
  recordDeleteAfter?: string;
  overridePublisher?: boolean;
  srtPublishPassphrase?: string;
  rtspTransport?: string;
  rtspAnyPort?: boolean;
  rtspRangeType?: string;
  rtspRangeStart?: string;
  sourceRedirect?: string;
  rpiCameraCamID?: number;
  rpiCameraWidth?: number;
  rpiCameraHeight?: number;
  rpiCameraHFlip?: boolean;
  rpiCameraVFlip?: boolean;
  rpiCameraBrightness?: number;
  rpiCameraContrast?: number;
  rpiCameraSaturation?: number;
  rpiCameraSharpness?: number;
  rpiCameraExposure?: string;
  rpiCameraAWB?: string;
  rpiCameraAWBGains?: number[];
  rpiCameraDenoise?: string;
  rpiCameraShutter?: number;
  rpiCameraMetering?: string;
  rpiCameraGain?: number;
  rpiCameraEV?: number;
  rpiCameraROI?: string;
  rpiCameraHDR?: boolean;
  rpiCameraTuningFile?: string;
  rpiCameraMode?: string;
  rpiCameraFPS?: number;
  rpiCameraAfMode?: string;
  rpiCameraAfRange?: string;
  rpiCameraAfSpeed?: string;
  rpiCameraLensPosition?: number;
  rpiCameraAfWindow?: string;
  rpiCameraFlickerPeriod?: number;
  rpiCameraTextOverlayEnable?: boolean;
  rpiCameraTextOverlay?: string;
  rpiCameraCodec?: string;
  rpiCameraIDRPeriod?: number;
  rpiCameraBitrate?: number;
  rpiCameraProfile?: string;
  rpiCameraLevel?: string;
  runOnInit?: string;
  runOnInitRestart?: boolean;
  runOnDemand?: string;
  runOnDemandRestart?: boolean;
  runOnDemandStartTimeout?: string;
  runOnDemandCloseAfter?: string;
  runOnUnDemand?: string;
  runOnReady?: string;
  runOnReadyRestart?: boolean;
  runOnNotReady?: string;
  runOnRead?: string;
  runOnReadRestart?: boolean;
  runOnUnread?: string;
  runOnRecordSegmentCreate?: string;
  runOnRecordSegmentComplete?: string;
}

export interface PlaybackItem {
  start: string;
  duration: number;
  url: string;
}
