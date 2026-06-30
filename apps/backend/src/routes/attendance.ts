import { Router, Request, Response } from "express";
import { getValues, setColumn } from "../services/sheets.js";
import { classTab, findColumnForDate} from "../helpers/week.js";

const attendanceRouter = Router();
const PERIODS = ["P1","P2","P3","P4","P5","P6","P7"];

attendanceRouter.post("/attendance", async (req: Request, res: Response) => {
  try {
    const { year, class: cls, date, period, absentRolls } = req.body;

    if (!year || !cls || !date || !period || !Array.isArray(absentRolls)) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    if (!PERIODS.includes(period)) {
      return res.status(400).json({ success: false, error: "Invalid period" });
    }
    // const today = new Date(); today.setHours(0,0,0,0);
    // if (new Date(date + "T00:00:00") > today) {
    //   return res.status(400).json({ success: false, error: "Date cannot be in the future" });
    // }

    const tab = classTab(cls);
    if (!tab) return res.status(400).json({ success: false, error: `Unknown class ${cls}` });

    const col = await findColumnForDate(year,tab, date, period);
if (!col) return res.status(400).json({ success: false, error: "Date/period not found in sheet — week may not be set up yet" });

    const rolls = await getValues(year, `${tab}!B4:B200`);
    const existing = await getValues(year, `${tab}!${col}4:${col}200`);

    const validRolls = new Set(rolls.map((r: any) => Number(r[0])).filter(Boolean));
    const uniqueAbsent = [...new Set(absentRolls.map(Number))];

    for (const roll of uniqueAbsent) {
      if (!validRolls.has(roll)) {
        return res.status(400).json({ success: false, error: `Roll ${roll} not in master list` });
      }
    }
    if (existing.some((row: any) => row[0] === "P" || row[0] === "A")) {
      return res.status(409).json({ success: false, error: `${period} already marked for ${date}` });
    }

    const marks = rolls.map((r: any) => {
      const roll = Number(r[0]);
      if (!roll) return "";
      return uniqueAbsent.includes(roll) ? "A" : "P";
    });
    await setColumn(year, `${tab}!${col}4:${col}${rolls.length + 3}`, marks);

    res.json({ success: true, absentCount: uniqueAbsent.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error, please retry" });
  }
});

export default attendanceRouter;