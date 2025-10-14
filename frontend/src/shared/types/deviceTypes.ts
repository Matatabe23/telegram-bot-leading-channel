export interface IBrowserInfo {
    name: string;
    version: string;
}

export interface IOSInfo {
    name: string;
    version: string;
}

export interface ILocationInfo {
    country: string | null;
    countryCode: string | null;
    region: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    timezone: string | null;
    isp: string | null;
    asn: string | null;
}

export interface IDeviceMetadata {
    screenWidth?: number;
    screenHeight?: number;
    colorDepth?: number;
    pixelRatio?: number;
    timezoneOffset?: number;
    online?: boolean;
    cookieEnabled?: boolean;
    doNotTrack?: string | null;
    hardwareConcurrency?: number;
    maxTouchPoints?: number;
    vendor?: string;
    vendorSub?: string;
    productSub?: string;
    appName?: string;
    appVersion?: string;
    appCodeName?: string;
}

export interface IDeviceInfo {
    deviceName: string;
    deviceType: 'mobile' | 'desktop' | 'unknown';
    userAgent: string;
    ipAddress: string;
    timezone: string;
    language: string;
    platform: string;
    screenResolution: string;
    browserInfo: IBrowserInfo;
    osInfo: IOSInfo;
    locationInfo: ILocationInfo | null;
    metadata: IDeviceMetadata;
}
