/**
 * @jest-environment node
 */
import request from "supertest";
import { app } from "../netlify/functions/api.js"; // <- notice `app`, not `handler`

describe("POST /upload", () => {
  it("should return 400 if imageBase64 is missing", async () => {
    const res = await request(app).post("/upload").send({
      upperText: "Top Text",
      lowerText: "Bottom Text",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("missing required field: imageBase64");
  });

  it("should return 400 if both text fields are missing", async () => {
    const res = await request(app).post("/upload").send({
      imageBase64: "base64encodedimage",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      "At least one text field upperText or lowerText is required"
    );
  });
});
