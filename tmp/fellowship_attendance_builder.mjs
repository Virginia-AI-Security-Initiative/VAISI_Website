import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/sethlifland/dev/VAISI_Website/outputs/2026-09-21_fellowship_attendance";
const previewDir = "/private/tmp/vaisi_fellowship_attendance_previews";
const outputPath = `${outputDir}/VAISI_Fellowship_Attendance_Tracker.xlsx`;

const cohorts = [
  {
    name: "Intro AI Safety Mon",
    tabColor: "#2F855A",
    fellows: [
      ["Aarav Lodha", "xzu6qh@virginia.edu"],
      ["Abhinav", "apg5pn@virginia.edu"],
      ["Lavanya Joshi", "dgc6xd@virginia.edu"],
      ["Liam Baird", "liambaird@virginia.edu"],
      ["Matthew Janicki", "mzd4uk@virginia.edu"],
      ["Prajwalla Sinha", "ps3frx@virginia.edu"],
      ["Razvan Nicolae", "gtd6em@virginia.edu"],
      ["Ryan Chan", "gdq4qz@virginia.edu"],
      ["Shorya Malani", "cqe4cf@virginia.edu"],
      ["Thanay sisir Anabathula", "qdf7ea@virginia.edu"],
    ],
  },
  {
    name: "Intro Tues",
    tabColor: "#D69E2E",
    fellows: [
      ["Anna Apkarian", "fvh7tf@virginia.edu"],
      ["Brianna Gutierrez", "euh4ba@virginia.edu"],
      ["Daryna Lyalko", "cbk3ym@virginia.edu"],
      ["Joshua Yoo", "yst5yy@virginia.edu"],
      ["Kaisa Tursun", "tkj3nf@virginia.edu"],
      ["Kemal Cortuk", "edv4hb@virginia.edu"],
      ["Raha Montazeri", "txu4tn@virginia.edu"],
      ["Raj Nanda", "tvr6hf@virginia.edu"],
      ["Sanjeev Subramanian", "ueq7zr@virginia.edu"],
    ],
  },
  {
    name: "Intro Wed",
    tabColor: "#DD6B20",
    fellows: [
      ["Aaron Alex", "tmz7vc@virginia.edu"],
      ["Aran Jothi", "ndy9ga@virginia.edu"],
      ["Catherine Gettens", "vfg2zy@virginia.edu"],
      ["Eliza", "xuj8nt@virginia.edu"],
      ["Karen", "sae3gg@virginia.edu"],
      ["Marcus Southerland", ""],
      ["Nathaniel Pegg", "zpz2dm@virginia.edu"],
      ["Urav Tanna", "jnk3hc@virginia.edu"],
    ],
  },
  {
    name: "Policy Cohort Mon",
    tabColor: "#2B6CB0",
    fellows: [
      ["Aaryav Walter", "tqj3as@virginia.edu"],
      ["Amairah Islam", "qte3jk@virginia.edu"],
      ["Guy Cardwell", "xjx5yc@virginia.edu"],
      ["Kiwakibt Melaku", "qfh6hg@virginia.edu"],
      ["Meneja Gautam", "kan2bf@virginia.edu"],
      ["Nikhil Misra", "hgm4vz@virginia.edu"],
      ["Owen Hunter", "npw6zh@virginia.edu"],
      ["Paolo Mascola", "tas8vw@virginia.edu"],
      ["Rory McGuire", "qsu4uh@virginia.edu"],
      ["Will Niermann", "bmp4wg@virginia.edu"],
    ],
  },
  {
    name: "Policy Cohort Tues",
    tabColor: "#319795",
    fellows: [
      ["Aimen Leja", "dkz4fe@virginia.edu"],
      ["Andrew Stearn", "cxj2jt@virginia.edu"],
      ["Arjan Singh", "thu3ek@virginia.edu"],
      ["Brianna Gutierrez", "euh4ba@virginia.edu"],
      ["Imre Huss", "ekw2wd@virginia.edu"],
      ["Jude Roggen", "pcr8zs@virginia.edu"],
      ["Kasia-Esmeralda Wasiak", "axb4va@virginia.edu"],
      ["Shreyas Muppaneni", "bde2wu@virginia.edu"],
    ],
  },
];

const workbook = Workbook.create();
const fontFamily = "Arial";
const statusOptions = ["uncomm. absence", "comm. absence", "present"];

for (const cohort of cohorts) {
  const sheet = workbook.worksheets.add(cohort.name);
  const firstDataRow = 6;
  const lastDataRow = firstDataRow + cohort.fellows.length - 1;
  const usedRange = `A2:L${lastDataRow}`;
  const attendanceRange = `C${firstDataRow}:L${lastDataRow}`;

  sheet.showGridLines = false;
  sheet.tabColor = cohort.tabColor;

  sheet.getRange("A2").values = [[`${cohort.name} attendance tracker`]];
  sheet.getRange("A2").format.font = { name: fontFamily, size: 14, bold: true, color: "#102A43" };
  sheet.getRange("A3:L3").format.borders = {
    bottom: { style: "thin", color: "#9FB3C8" },
  };
  sheet.getRange("A4").values = [["Source: Airtable, Fellowship Applications → Assigned Cohort (retrieved September 21, 2026)"]];
  sheet.getRange("A4").format.font = { name: fontFamily, size: 9, italic: true, color: "#627D98" };

  const headers = ["Fellow", "Email", ...Array.from({ length: 10 }, (_, index) => `Week ${index + 1}`)];
  sheet.getRange("A5:L5").values = [headers];
  sheet.getRange("A5:L5").format = {
    fill: "#243B53",
    font: { name: fontFamily, size: 10, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: {
      insideVertical: { style: "thin", color: "#FFFFFF" },
      bottom: { style: "medium", color: "#102A43" },
    },
  };
  sheet.getRange("A5:B5").format.horizontalAlignment = "left";

  const rows = cohort.fellows.map(([name, email]) => [name, email, ...Array(10).fill(null)]);
  sheet.getRange(`A${firstDataRow}:L${lastDataRow}`).values = rows;
  sheet.getRange(`A${firstDataRow}:L${lastDataRow}`).format.font = { name: fontFamily, size: 10, color: "#243B53" };
  sheet.getRange(`A${firstDataRow}:L${lastDataRow}`).format.verticalAlignment = "center";
  sheet.getRange(`A${firstDataRow}:B${lastDataRow}`).format.horizontalAlignment = "left";
  sheet.getRange(attendanceRange).format = {
    fill: "#FFF8E1",
    font: { name: fontFamily, size: 10, color: "#243B53" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
  };
  sheet.getRange(`A${firstDataRow}:L${lastDataRow}`).format.borders = {
    insideHorizontal: { style: "thin", color: "#D9E2EC" },
    bottom: { style: "thin", color: "#BCCCDC" },
  };

  sheet.getRange(attendanceRange).dataValidation = {
    rule: { type: "list", values: statusOptions },
  };
  sheet.getRange(attendanceRange).conditionalFormats.add("containsText", {
    text: "present",
    format: { fill: "#DCFCE7", font: { color: "#166534", bold: true } },
  });
  sheet.getRange(attendanceRange).conditionalFormats.add("beginsWith", {
    text: "comm.",
    format: { fill: "#FEF3C7", font: { color: "#92400E", bold: true } },
  });
  sheet.getRange(attendanceRange).conditionalFormats.add("beginsWith", {
    text: "uncomm.",
    format: { fill: "#FEE2E2", font: { color: "#991B1B", bold: true } },
  });

  sheet.getRange("A:A").format.columnWidth = 25;
  sheet.getRange("B:B").format.columnWidth = 28;
  sheet.getRange("C:L").format.columnWidth = 16;
  sheet.getRange("2:2").format.rowHeight = 23;
  sheet.getRange("4:4").format.rowHeight = 18;
  sheet.getRange("5:5").format.rowHeight = 25;
  sheet.getRange(`${firstDataRow}:${lastDataRow}`).format.rowHeight = 22;

  sheet.freezePanes.freezeRows(5);
  sheet.freezePanes.freezeColumns(2);
}

workbook.recalculate();

for (const cohort of cohorts) {
  const lastDataRow = 5 + cohort.fellows.length;
  const check = await workbook.inspect({
    kind: "table",
    range: `${cohort.name}!A2:L${lastDataRow}`,
    include: "values,formulas",
    tableMaxRows: 20,
    tableMaxCols: 12,
  });
  console.log(`CHECK ${cohort.name}\n${check.ndjson}`);
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(`ERROR_SCAN\n${errors.ndjson}`);

await fs.mkdir(previewDir, { recursive: true });
for (const cohort of cohorts) {
  const preview = await workbook.render({
    sheetName: cohort.name,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  const safeName = cohort.name.replace(/[^A-Za-z0-9]+/g, "_");
  await fs.writeFile(`${previewDir}/${safeName}.png`, new Uint8Array(await preview.arrayBuffer()));
}

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`OUTPUT ${outputPath}`);
