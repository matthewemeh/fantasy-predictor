import { Element } from './interfaces';

export type GameweekType = 'GW' | 'DGW' | 'TGW' | 'BGW';

export type FormationType =
  | '3-5-2'
  | '3-4-3'
  | '4-4-2'
  | '4-3-3'
  | '4-5-1'
  | '5-3-2'
  | '5-2-3'
  | '5-4-1';

export type ElementStatus = 'a' | 'u' | 'i' | 's' | 'n' | 'd';

export type ChipName = 'bboost' | '3xc' | 'freehit' | 'wildcard';

export type EventDataType = 'goal' | 'onTarget' | '';

export type StatIdentifier =
  | 'minutes'
  | 'goals_scored'
  | 'assists'
  | 'clean_sheets'
  | 'goals_conceded'
  | 'own_goals'
  | 'penalties_saved'
  | 'penalties_missed'
  | 'yellow_cards'
  | 'red_cards'
  | 'saves'
  | 'bonus'
  | 'bps';

export type SquadDataType = Element | undefined;

export type MoreScreenButton = {
  title: string;
  iconName: string;
  onPress: () => void;
  expandable: boolean;
  expandedHeight?: number;
  expandedContent: JSX.Element | null;
};

export type EventIndex = 0 | 1;
