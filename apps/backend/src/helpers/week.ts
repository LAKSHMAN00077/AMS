import { getValues } from "../services/sheets.js";

const TAB_NAME: Record<string, string> = {
  CSE01: "CSE 01",
  CSE02: "CSE 02",
  CSE03: "CSE 03",
  CSE04: "CSE 04",
  CSE05: "CSE 05",
  CSE06: "CSE 06",
};

export function classTab(className: string): string | null {
  return TAB_NAME[className] ?? null;
}

function serialToISODate(serial: number): string {
  const epoch = Date.UTC(1899, 11, 30); // Google Sheets date epoch
  const d = new Date(epoch + serial * 86400000);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function columnIndexToLetter(index: number): string {
  let n = index, letter = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
}

// Reads the actual date row + period row from the sheet and finds the
// real column for this date+period — no fixed-position guessing.
export async function findColumnForDate(
  year:string,
  tab: string,
  date: string,
  period: string
): Promise<string | null> {
  const periodNum = Number(period.replace("P", ""));
  const rows = await getValues(
    year,
    `${tab}!D2:3`,
    true
  ); // raw values, columns D onward
  const dateRow = rows[0] || [];
  const periodRow = rows[1] || [];

  let currentDate: string | null = null;
  for (let i = 0; i < periodRow.length; i++) {
    const rawDate = dateRow[i];
    if (rawDate !== undefined && rawDate !== "") {
      currentDate = serialToISODate(Number(rawDate));
    }
    if (currentDate !== date) continue;

    const label = String(periodRow[i] || "");
    const match = label.match(/^P(\d+)/);
    if (match && Number(match[1]) === periodNum) {
      return columnIndexToLetter(4 + i); // D = column 4
    }
  }
  return null; // date/period combo not found in the sheet
}