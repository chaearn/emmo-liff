// types.ts

export type LineProfile = {
    userId: string;
    displayName: string;
    pictureUrl: string | undefined;
};

export type UserProfile = {
    line_id: string;
    name: string;
    avatar: string | undefined;
};