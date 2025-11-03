/**
 * @jest-environment jsdom
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(
  path.resolve(__dirname, "../frontend/index.html"),
  "utf8"
);

describe("Meme Generator UI", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
  });

  it("should have a file input field", () => {
    const input = document.querySelector("#formFile");
    expect(input).not.toBeNull();
  });

  it("should have upper text input field", () => {
    const input = document.querySelector("#upperText");
    expect(input).not.toBeNull();
    expect(input.placeholder).toBe("Enter your upper text here");
  });

  it("should have lower text input field", () => {
    const input = document.querySelector("#lowerText");
    expect(input).not.toBeNull();
    expect(input.placeholder).toBe("Enter your lower text here");
  });

  it("should have a grayscale switch", () => {
    const checkbox = document.querySelector("#grayscaleSwitch");
    expect(checkbox).not.toBeNull();
    expect(checkbox.type).toBe("checkbox");
  });

  it("should have a generate button", () => {
    const button = document.querySelector("#generateMemeButton");
    expect(button.textContent.trim()).toBe("Generate Meme");
  });

  it("should have a meme image element", () => {
    const image = document.querySelector("#memeImage");
    expect(image).not.toBeNull();
    expect(image.classList.contains("d-none")).toBe(true);
  });
});
