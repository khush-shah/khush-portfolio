export type OsPhase = 'boot' | 'login' | 'desktop';

export type AppId =
  | 'about' | 'projects' | 'skills' | 'experience'
  | 'metrics' | 'terminal' | 'contact' | 'sysmon';

export interface WindowState {
  id: AppId;
  x: number; y: number;
  w: number; h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prevRect?: { x: number; y: number; w: number; h: number };
}

export interface Notification {
  id: string; icon: string; title: string; msg: string;
}

export interface MetricModalData {
  big: string; title: string;
  before: { val: string; bar: number };
  after: { val: string; bar: number };
  techniques: { h: string; b: string }[];
}
