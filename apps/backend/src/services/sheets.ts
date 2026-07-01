import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
}

function normalizePrivateKey(value: string): string {
  const trimmed = value.trim();

  const unquoted =
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  const key = unquoted.replace(/\\n/g, "\n").trim();

  const match = key.match(
    /^-----BEGIN ([A-Z ]*PRIVATE KEY)-----\s*([\s\S]*?)\s*-----END \1-----$/
  );

  if (!match) {
    return key;
  }

  const [, label, body] = match;

  const normalizedBody = body.replace(/\s+/g, "");

  const wrappedBody =
    normalizedBody.match(/.{1,64}/g)?.join("\n") ?? normalizedBody;

  return `-----BEGIN ${label}-----\n${wrappedBody}\n-----END ${label}-----\n`;
}

function getSpreadsheetId(year: string): string {
  switch (year) {
    case "1st Year":
      return getRequiredEnv("E1_ATTENDANCE_SPREADSHEET_ID");

    case "2nd Year":
      return getRequiredEnv("E2_ATTENDANCE_SPREADSHEET_ID");

    case "3rd Year":
      return getRequiredEnv("E3_ATTENDANCE_SPREADSHEET_ID");

    case "4th Year":
      return getRequiredEnv("E4_ATTENDANCE_SPREADSHEET_ID");

    default:
      throw new Error(`No spreadsheet configured for ${year}`);
  }
}

const auth = new google.auth.JWT({
  email: getRequiredEnv("GOOGLE_CLIENT_EMAIL"),
  key: normalizePrivateKey(getRequiredEnv("GOOGLE_PRIVATE_KEY")),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({
  version: "v4",
  auth,
});

export async function getValues(
  year: string,
  range: string,
  raw = false
) {
  const spreadsheetId = getSpreadsheetId(year);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    valueRenderOption: raw
      ? "UNFORMATTED_VALUE"
      : "FORMATTED_VALUE",
  });

  return res.data.values || [];
}

export async function setColumn(
  year: string,
  range: string,
  values: string[]
) {
  const spreadsheetId = getSpreadsheetId(year);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: values.map((v) => [v]),
    },
  });
}