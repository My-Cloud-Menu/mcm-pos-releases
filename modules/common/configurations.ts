export const ECR_LOCAL_STORAGE_KEY = "ECR_LOCAL_STORAGE";
export const GLOBAL_LOCAL_STORAGE_KEY = "GLOBAL_LOCAL_STORAGE";
export const AUTH_LOCAL_STORAGE_KEY = "AUTH_LOCAL_STORAGE";
export interface EcrSetup {
  session_id?: string;
  reference: number;
  last_reference?: number;
  terminal_id: string;
  cashier_id: string;
  station_number: string;
  api_key: string;
  ip: string;
  port: string;
  ipDev: string;
  force_duplicate: string;
  receipt_output: string;
  manual_entry_indicator: string;
  receipt_email: string;
  process_cashback: string;
  batch_number?: string;
}

export interface GlobalSetup {
  password_length: number;
  showErrors: boolean;
  siteId: string;
  locationId: string;
  url: string;
  showTableSelector: boolean;
  employeesShouldSeeJustTheirTables: boolean;
  masterPassword: string;
  devPassword: string;
  apiKey: string;
  timeout: number;
  timeOffSet: number;
}

export const initialECRSetupConfiguration: EcrSetup = {
  session_id: undefined,
  last_reference: undefined,
  batch_number: undefined,
  reference: 0,
  terminal_id: "30DR3477",
  station_number: "1234",
  cashier_id: "4321",
  ipDev: "https://564c961b-1f3a-41a1-a37d-a2b0b620645b.mock.pstmn.io",
  ip: "http://10.0.0.28",
  port: "2030",
  api_key: "f6196298e20d41ada45de8dc4d1963c5",
  force_duplicate: "no",
  receipt_output: "BOTH",
  manual_entry_indicator: "no",
  receipt_email: "no",
  process_cashback: "no",
};

export const initialGlobalSetupConfiguration: GlobalSetup = {
  password_length: 4,
  showErrors: false,
  siteId: "809819161",
  locationId: "",
  url: "https://api.v3.mycloudmenu.com",
  showTableSelector: true,
  employeesShouldSeeJustTheirTables: true,
  masterPassword: "0000",
  devPassword: "0101",
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjpbIkFMTF9BQ0NFU1MiXSwiaWF0IjoxNjc0ODI5MDIzfQ.x1b5y2-Jy6jJSgVY0fce5aVWMHa2PbSpvpHrUSerpEU",
  timeout: 240000,
  timeOffSet: -240,
};
