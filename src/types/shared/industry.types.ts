export interface Industry {
  id: string | number;
  name: string;
}

export interface IndustryCategory {
  id: string | number;
  name: string;
  industry_id: string | number;
}

export interface IndustryType {
  id: string | number;
  name: string;
  industry_id: string | number;
}
