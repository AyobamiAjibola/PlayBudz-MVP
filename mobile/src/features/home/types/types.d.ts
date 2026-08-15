export type SectionHeadingType = {
    title: string;
    onPress?: ()=>void;
}

type CreatedBy = { 
    name: string;
    profileImage: string;
}

export interface GameCreator {
  id: string;
  firebaseUid: string;
  fullName: string | null;
  email: string;
  dob: string | null;
  gender: string | null;
  biography: string | null;
  image: string | null;
  provider: string | null;
  password: string | null;
  refreshToken: string | null;
  pushToken: string | null;
  notificationEnabled: boolean;
  registrationComplete: boolean | null;
  createdAt: string;
  updatedAt: string;
  interest: Interest
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  gameId: string;
}

export interface Player {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: string | null;
  biography: string | null;
  dob: string | null;
  gender: string | null;
  image: string | null;

  provider: string | null;
  password: string | null;
  refreshToken: string | null;
  pushToken: string | null;

  notificationEnabled: boolean;
  registrationComplete: boolean;
  interests: Interest[];

  createdAt: string;
  updatedAt: string;
}

export interface Interest {
  id: string;
  interest: string;
  skill_level: string;
  userId: string;
}

export interface Participant {
  id: string;
  userId: string;
  gameId: string;
  user: Player
}

export type Sport = {
  id: string;
  sport: string;
  createdAt: string;
}

export interface Game {
  id: string;
  image: string | null;
  title: string;
  description: string | null;
  sport: string;
  creatorId: string;
  gameDateTime: string;
  createdAt: string;
  players: string;
  skill_level: string;
  creator: Player;
  location: Location;
  participants: Participant[];
  cancelled: boolean;
  closed: boolean;
}

export interface PlayerType {
    id?: string;
    fullname: string;
    interests: string;
    chatId: string;
    photo: string;
}
