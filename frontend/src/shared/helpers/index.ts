import { useAppStore } from '@/app/app.store';
import { useSettings } from '../store';
import { IDeviceInfo } from '../types/deviceTypes';

export const bodyLock = (boolean: boolean) => {
    if (boolean) {
        document.body.classList.remove('overflow-hidden');
        document.body.classList.add('overflow-y-scroll');
        document.body.style.paddingRight = '';
    } else {
        document.body.classList.add('overflow-hidden');
        document.body.classList.remove('overflow-y-scroll');
        document.body.style.paddingRight = `5px`;
    }
};

export const checkPermissions = (permission: string): boolean => {
    const rolePermissions = useSettings().listRoles.find(
        (item) => item.name === useAppStore().userData.role
    );
    return rolePermissions?.permissions?.includes(permission) ?? false;
};

export const getIpAddress = async (): Promise<string> => {
    // Список API для получения IP (пробуем по очереди)
    const apis = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/ip/',
        'https://api.ip.sb/geoip',
        'https://ipinfo.io/ip'
    ];

    for (const apiUrl of apis) {
        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                continue; // Пробуем следующий API
            }

            const data = await response.json();



            // Обработка для ipify.org
            if (apiUrl.includes('ipify.org')) {

                return data.ip;
            }

            // Обработка для ipapi.co/ip/
            if (apiUrl.includes('ipapi.co/ip/')) {
                return data.trim();
            }

            // Обработка для ip.sb
            if (apiUrl.includes('ip.sb')) {
                return data.ip;
            }

            // Обработка для ipinfo.io/ip
            if (apiUrl.includes('ipinfo.io/ip')) {
                return data.trim();
            }

        } catch (error) {
            // Пробуем следующий API
            continue;
        }
    }

    // Если все API недоступны, возвращаем значение по умолчанию
    return 'unknown';
};

// Функция для получения часового пояса
export const getTimezone = (): string => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
        // В случае ошибки возвращаем UTC
        return 'UTC';
    }
};

// Функция для получения всех данных об устройстве
export const getDeviceInfo = async () => {
    try {
        // Получаем IP-адрес
        const ipAddress = await getIpAddress();

        // Получаем часовой пояс
        const timezone = getTimezone();

        // Получаем User Agent
        const userAgent = navigator.userAgent;

        // Определяем тип устройства
        const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop';

        // Получаем разрешение экрана
        const screenResolution = `${screen.width}x${screen.height}`;

        // Получаем язык браузера
        const language = navigator.language || navigator.languages?.[0] || 'unknown';

        // Получаем информацию о платформе
        const platform = navigator.platform || 'unknown';

        // Получаем информацию о браузере
        const browserInfo = getBrowserInfo(userAgent);

        // Получаем информацию о операционной системе
        const osInfo = getOSInfo(userAgent);

        // Получаем информацию о геолокации (если доступна)
        const locationInfo = await getLocationInfo(ipAddress);



        return {
            deviceName: `${osInfo.name} ${osInfo.version}`,
            deviceType,
            userAgent,
            ipAddress,
            timezone,
            language,
            platform,
            screenResolution,
            browserInfo,
            osInfo,
            locationInfo,
            metadata: {
                screenWidth: screen.width,
                screenHeight: screen.height,
                colorDepth: screen.colorDepth,
                pixelRatio: window.devicePixelRatio,
                timezoneOffset: new Date().getTimezoneOffset(),
                online: navigator.onLine,
                cookieEnabled: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack,
                hardwareConcurrency: navigator.hardwareConcurrency,
                maxTouchPoints: navigator.maxTouchPoints,
                vendor: navigator.vendor,
                vendorSub: navigator.vendorSub,
                productSub: navigator.productSub,
                appName: navigator.appName,
                appVersion: navigator.appVersion,
                appCodeName: navigator.appCodeName
            }
        };
    } catch (error) {
        console.log(error)
        // В случае ошибки возвращаем базовую информацию
        return {
            deviceName: 'unknown',
            deviceType: 'unknown',
            userAgent: navigator.userAgent || 'unknown',
            ipAddress: 'unknown',
            timezone: 'UTC',
            language: 'unknown',
            platform: 'unknown',
            screenResolution: 'unknown',
            browserInfo: { name: 'unknown', version: 'unknown' },
            osInfo: { name: 'unknown', version: 'unknown' },
            locationInfo: null,
            metadata: {}
        };
    }
};

// Функция для определения браузера
const getBrowserInfo = (userAgent: string) => {
    const browsers = [
        { name: 'Chrome', regex: /Chrome\/(\d+\.\d+)/ },
        { name: 'Firefox', regex: /Firefox\/(\d+\.\d+)/ },
        { name: 'Safari', regex: /Safari\/(\d+\.\d+)/ },
        { name: 'Edge', regex: /Edg\/(\d+\.\d+)/ },
        { name: 'Opera', regex: /Opera\/(\d+\.\d+)/ },
        { name: 'Internet Explorer', regex: /MSIE (\d+\.\d+)/ }
    ];

    for (const browser of browsers) {
        const match = userAgent.match(browser.regex);
        if (match) {
            return { name: browser.name, version: match[1] };
        }
    }

    return { name: 'unknown', version: 'unknown' };
};

// Функция для определения операционной системы
const getOSInfo = (userAgent: string) => {
    const osList = [
        { name: 'Windows', regex: /Windows NT (\d+\.\d+)/ },
        { name: 'macOS', regex: /Mac OS X (\d+[._]\d+)/ },
        { name: 'Linux', regex: /Linux/ },
        { name: 'Android', regex: /Android (\d+\.\d+)/ },
        { name: 'iOS', regex: /OS (\d+[._]\d+)/ }
    ];

    for (const os of osList) {
        const match = userAgent.match(os.regex);
        if (match) {
            return { name: os.name, version: match[1] ? match[1].replace(/_/g, '.') : 'unknown' };
        }
    }

    return { name: 'unknown', version: 'unknown' };
};



// Функция для получения информации о местоположении по IP
const getLocationInfo = async (ipAddress: string) => {
    if (ipAddress === 'unknown') return null;

    // Список API для получения геолокации (пробуем по очереди)
    const apis = [
        `https://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,as,query`,
        `https://ipapi.co/${ipAddress}/json/`,
        `https://ipinfo.io/${ipAddress}/json`
    ];

    for (const apiUrl of apis) {
        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                continue; // Пробуем следующий API
            }

            const data = await response.json();

            // Обработка для ip-api.com
            if (apiUrl.includes('ip-api.com')) {
                if (data.status === 'success') {
                    return {
                        country: data.country || null,
                        countryCode: data.countryCode || null,
                        region: data.regionName || null,
                        city: data.city || null,
                        latitude: data.lat || null,
                        longitude: data.lon || null,
                        timezone: data.timezone || null,
                        isp: data.isp || null,
                        asn: data.as || null
                    };
                }
            }

            // Обработка для ipapi.co
            if (apiUrl.includes('ipapi.co')) {
                return {
                    country: data.country_name || null,
                    countryCode: data.country_code || null,
                    region: data.region || null,
                    city: data.city || null,
                    latitude: data.latitude || null,
                    longitude: data.longitude || null,
                    timezone: data.timezone || null,
                    isp: data.org || null,
                    asn: data.asn || null
                };
            }

            // Обработка для ipinfo.io
            if (apiUrl.includes('ipinfo.io')) {
                const [lat, lon] = data.loc ? data.loc.split(',') : [null, null];
                return {
                    country: data.country || null,
                    countryCode: data.country || null,
                    region: data.region || null,
                    city: data.city || null,
                    latitude: lat ? parseFloat(lat) : null,
                    longitude: lon ? parseFloat(lon) : null,
                    timezone: data.timezone || null,
                    isp: data.org || null,
                    asn: null
                };
            }

        } catch (error) {
            // Пробуем следующий API
            continue;
        }
    }

    // Если все API недоступны, возвращаем null
    return null;
};