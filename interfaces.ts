import {
  ChipName,
  GameweekType,
  FormationType,
  ElementStatus,
  EventDataType,
  StatIdentifier,
} from './types';

interface EventChipPlay {
  chip_name: ChipName;
  num_played: number;
}

interface FixtureStatMap {
  value: number;
  element: number;
}

interface FixtureStat {
  identifier: StatIdentifier;
  a: FixtureStatMap[];
  h: FixtureStatMap[];
}

interface ElementStats {
  label: string;
  name: string;
}

interface Phase {
  id: number;
  name: string;
  start_event: number;
  stop_event: number;
}

interface TopElementInfo {
  id: number;
  points: number;
}

interface GameSettings {
  league_join_private_max: number;
  league_join_public_max: number;
  league_max_size_public_classic: number;
  league_max_size_public_h2h: number;
  league_max_size_private_h2h: number;
  league_max_ko_rounds_private_h2h: number;
  league_prefix_public: string;
  league_points_h2h_win: number;
  league_points_h2h_lose: number;
  league_points_h2h_draw: number;
  league_ko_first_instead_of_random: boolean;
  cup_start_event_id: number | null;
  cup_stop_event_id: number | null;
  cup_qualifying_method: any;
  cup_type: any;
  squad_squadplay: number;
  squad_squadsize: number;
  squad_team_limit: number;
  squad_total_spend: number;
  ui_currency_multiplier: number;
  ui_use_special_shirts: boolean;
  ui_special_shirt_exclusions: any[];
  stats_form_days: number;
  sys_vice_captain_enabled: boolean;
  transfers_cap: number;
  transfers_sell_on_fee: number;
  league_h2h_tiebreak_stats: ['+goals_scored', '-goals_conceded'];
  timezone: string;
}

export interface EventData {
  saver1: string;
  saver2: string;
  eventType: EventDataType;
  onTarget1: string;
  onTarget2: string;
  goalScorer1: string;
  goalScorer2: string;
  assistProvider1: string;
  assistProvider2: string;
  timeStamp: number;
}

export interface TeamEvent {
  saver: string;
  onTarget: string;
  eventType: EventDataType;
  goalScorer: string;
  assistProvider: string;
}

export interface Element {
  chance_of_playing_next_round: number | null;
  chance_of_playing_this_round: number | null;
  code: number;
  cost_change_event: number;
  cost_change_event_fall: number;
  cost_change_start: number;
  cost_change_start_fall: number;
  dreamteam_count: number;
  element_type: number;
  ep_next: string | null;
  ep_this: string | null;
  event_points: number;
  first_name: string;
  form: string;
  id: number;
  in_dreamteam: boolean;
  news: string;
  news_added: string | null;
  now_cost: number;
  photo: string;
  points_per_game: string;
  second_name: string;
  selected_by_percent: string;
  special: boolean;
  squad_number: number | null;
  status: ElementStatus;
  team: number;
  team_code: number;
  total_points: number;
  transfers_in: number;
  transfers_in_event: number;
  transfers_out: number;
  transfers_out_event: number;
  value_form: string;
  value_season: string;
  web_name: string;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  own_goals: number;
  penalties_saved: number;
  penalties_missed: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
  bonus: number;
  bps: number;
  influence: string;
  creativity: string;
  threat: string;
  ict_index: string;
  starts: number;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals_conceded: string;
  influence_rank: number | null;
  influence_rank_type: number | null;
  creativity_rank: number | null;
  creativity_rank_type: number | null;
  threat_rank: number | null;
  threat_rank_type: number | null;
  ict_index_rank: number | null;
  ict_index_rank_type: number | null;
  corners_and_indirect_freekicks_order: number | null;
  corners_and_indirect_freekicks_text: string;
  direct_freekicks_order: number | null;
  direct_freekicks_text: string;
  penalties_order: number | null;
  penalties_text: string;
  expected_goals_per_90: number;
  saves_per_90: number;
  expected_assists_per_90: number;
  expected_goal_involvements_per_90: number;
  expected_goals_conceded_per_90: number;
  goals_conceded_per_90: number;
  now_cost_rank: number;
  now_cost_rank_type: number;
  form_rank: number;
  form_rank_type: number;
  points_per_game_rank: number;
  points_per_game_rank_type: number;
  selected_rank: number;
  selected_rank_type: number;
  starts_per_90: number;
  clean_sheets_per_90: number;
}

export interface Team {
  code: number;
  draw: number;
  form: string | null;
  id: number;
  loss: number;
  name: string;
  played: number;
  points: number;
  position: number;
  short_name: string;
  strength: number;
  team_division: any;
  unavailable: boolean;
  win: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
  pulse_id: number;
}

export interface ElementType {
  id: number;
  plural_name: string;
  plural_name_short: string;
  singular_name: string;
  singular_name_short: string;
  squad_select: number;
  squad_min_play: number;
  squad_max_play: number;
  ui_shirt_specific: boolean;
  sub_positions_locked: number[];
  element_count: number;
}

export interface Opponent {
  team: number;
  status: string;
  difficulty: number;
}

export interface OpponentData {
  team: number;
  opponents: Opponent[];
}

export interface Fixture {
  code: number;
  event: number;
  finished: boolean;
  finished_provisional: boolean;
  id: number;
  kickoff_time: string;
  minutes: number;
  provisional_start_time: boolean;
  started: boolean;
  team_a: number;
  team_a_score: number | null;
  team_h: number;
  team_h_score: number | null;
  stats: FixtureStat[];
  team_h_difficulty: number;
  team_a_difficulty: number;
  pulse_id: number;
}

export interface Event {
  id: number;
  name: string;
  deadline_time: string;
  average_entry_score: number;
  finished: boolean;
  data_checked: boolean;
  highest_scoring_entry: number;
  deadline_time_epoch: number;
  deadline_time_game_offset: number;
  highest_score: number | null;
  is_previous: boolean;
  is_current: boolean;
  is_next: boolean;
  cup_leagues_created: boolean;
  h2h_ko_matches_created: boolean;
  chip_plays: EventChipPlay[];
  most_selected: number | null;
  most_transferred_in: number | null;
  top_element: number | null;
  top_element_info: TopElementInfo | null;
  transfers_made: number;
  most_captained: number | null;
  most_vice_captained: number | null;
}

export interface PlayerInfoData {
  index: number;
  playerID: number;
  playerName: string;
  isCaptain: boolean;
  playerContent: string;
  shirtImage: any;
}

export interface AlertButton {
  text: string;
  onPress: () => void;
}

export interface AlertData {
  title: string;
  message: string;
  buttons: AlertButton[];
  onCloseAlert: () => void;
}

export interface logData {
  version: string;
  info: string[][];
}

export interface GeneralInfo {
  events?: Event[];
  game_settings?: GameSettings;
  phases?: Phase[];
  teams?: Team[];
  total_players?: number;
  elements?: Element[];
  element_stats?: ElementStats[];
  element_types?: ElementType[];
}

export interface SelectionData {
  id: string;
  playerIDs: number[];
  captainIndex: number;
  formation: FormationType;
}

export interface KitData {
  [key: string]: string;
}

export interface UpdateData {
  id: string;
  info: string;
  btcAddress: string;
  dogeAddress: string;
  ethAddress: string;
  trxAddress: string;
  xrpAddress: string;
  rateUsUrl: string;
  updateLink: string;
  currentVersion: string;
  forceCurrentVersion: boolean;
}

export interface AppContextData {
  teams?: string[];
  fieldImage?: any;
  teamsData?: Team[];
  currentGW?: number;
  appVersion?: string;
  update?: UpdateData;
  playerKit?: KitData;
  goalieKit?: KitData;
  playerData?: Element[];
  alertVisible?: boolean;
  fixturesData?: Fixture[];
  selections?: SelectionData;
  positionData?: ElementType[];
  currentGWType?: GameweekType;
  nextOpponent?: OpponentData[];
  setAlertVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertComponents?: React.Dispatch<React.SetStateAction<AlertData>>;
}
