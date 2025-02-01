export interface IAdvertisement {
    deleteMessageInfo: string;
    id: number;
    messageId: number;
    moderationStatus: string;
    schedule: string;
    sourceChatId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: number
        name: string
        avatarUrl: string
        coin: number
        isTeamMember: boolean
        role: string
        telegramId: string
        createdAt: string
        updatedAt: string
    }
}