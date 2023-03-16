import { ElementData } from './interfaces';

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

export type EventType = {
  saver1: string;
  saver2: string;
  eventType: string;
  onTarget1: string;
  onTarget2: string;
  goalScorer1: string;
  goalScorer2: string;
  assistProvider1: string;
  assistProvider2: string;
  timeStamp: number;
};

export type SquadDataType = ElementData | undefined;
