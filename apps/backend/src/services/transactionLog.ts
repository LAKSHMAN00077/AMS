import dotenv from "dotenv";
import { sheets } from "./sheets.js";

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }

  return value;
}

function generateTxnId(): string {
  return Math.random().toString(36).substring(2, 8);
}

function getTimestamp(): string {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

export interface TransactionLogData {
  year: string;
  className: string;
  date: string;
  period: string;
  absentRolls: number[];
  status: "SUCCESS" | "REJECTED";
  message: string;
}

export async function appendTransactionLog(
  data: TransactionLogData
) {
  const spreadsheetId = getRequiredEnv(
    "TRANSACTION_LOG_SPREADSHEET_ID"
  );

  const row = [
    generateTxnId(),
    getTimestamp(),
    data.year,
    data.className,
    data.date,
    data.period,
    data.absentRolls.join(","),
    data.absentRolls.length,
    data.status,
    data.message,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "TransactionLog!A:J",

    valueInputOption: "RAW",

    insertDataOption: "INSERT_ROWS",

    requestBody: {
      values: [row],
    },
  });
}