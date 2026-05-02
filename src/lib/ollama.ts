import { Ollama } from "ollama";
import Parser, { type Language } from "tree-sitter";
import JavaScript from "tree-sitter-javascript";

export const ollama = new Ollama();
export const javascriptObject = JavaScript as any as Language;
export const parser = new Parser();
parser.setLanguage(javascriptObject);
