export interface Industry {
  id: string;
  name: string;
}

export interface IndustryCategory {
  id: string;
  name: string;
  industry_id: string;
}

export interface IndustryType {
  id: string;
  name: string;
  industry_id: string;
}
