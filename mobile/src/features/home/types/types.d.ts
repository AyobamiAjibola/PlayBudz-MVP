export type SectionHeadingType = {
    title: string;
    onPress?: ()=>void;
}

type CreatedBy = { 
    name: string;
    profileImage: string;
}

export interface EventType {
    id?: string;
    image: string;
    createdBy: CreatedBy;
    sport: string;
    title: string;
    date: string;
    time: string;
    location: string;
}

export interface PlayerType {
    id?: string;
    fullname: string;
    interests: string;
    chatId: string;
    photo: string;
}

export type InterestType = {
    interest: string;
    skill_level: string;
}
