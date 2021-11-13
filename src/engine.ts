// Node Imports
import { readFile, readdir, writeFile } from "fs/promises";
import { join, basename } from "path";

// External Imports
import Mustache from "mustache";

const PUBLIC_DIR = join(__dirname, "..", "public");
const DATA_DIR = join(__dirname, "data");

const INDEX_FILE = join(PUBLIC_DIR, "index.html");
const TEMPLATE = join(__dirname, "template.mustache");

const DATA: Record<string, unknown> = {
  start_year: "2021",
  end_year: "2022",
  current_year: new Date().getFullYear(),
};

const getTemplate = () => readFile(TEMPLATE, "utf-8");

const getData = async () => {
  const dataFiles = await readdir(DATA_DIR);

  for await (const file of dataFiles) {
    const filePath = join(DATA_DIR, file);
    const data = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);
    const id = basename(file, ".json");
    DATA[id] = parsed;
  }
};

const generate = async () => {
  const [template] = await Promise.all([getTemplate(), getData()]);
  const rendered = Mustache.render(template, DATA);
  await writeFile(INDEX_FILE, rendered, "utf-8");
};

generate();
