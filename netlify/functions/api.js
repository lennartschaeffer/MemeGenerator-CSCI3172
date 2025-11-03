import express from "express";
import serverless from "serverless-http";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

router.post("/upload", async (req, res) => {
  try {
    const { imageBase64, upperText, lowerText } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: "missing required field: imageBase64",
      });
    }

    if (!upperText && !lowerText) {
      return res.status(400).json({
        error: "At least one text field upperText or lowerText is required",
      });
    }

    //make sure api key is working
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error("IMGBB_API_KEY not configured");
      return res.status(500).json({
        error: "Server config error: missing API key",
      });
    }

    const imgbbURL = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    let imgBBImageUrl = "";

    // upload image to imagebb first since it needs to be hosted somewhere for memegen to work
    try {
      const formData = new FormData();
      formData.append("image", imageBase64);

      const imgBBResponse = await fetch(imgbbURL, {
        method: "POST",
        body: formData,
      });

      if (!imgBBResponse.ok) {
        const errorText = await imgBBResponse.text();
        console.error("ImgBB API error:", errorText);
        return res.status(imgBBResponse.status).json({
          error: "Failed to upload image to imgbb",
          details: imgBBResponse.statusText,
        });
      }

      const imgBBData = await imgBBResponse.json();

      if (!imgBBData.success || !imgBBData.data || !imgBBData.data.url) {
        console.error("Imgbb response missing expected data:", imgBBData);
        return res.status(500).json({
          error: "Invalid response from image upload service",
        });
      }

      imgBBImageUrl = imgBBData.data.url;
    } catch (error) {
      console.error("Error uploading to imgbb:", error.message);
      return res.status(500).json({
        error: "Failed to upload image to imgbb",
        details: error.message,
      });
    }

    //generate meme using memegen
    try {
      const memeImageResponse = await fetch(
        "https://api.memegen.link/templates/custom",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            background: imgBBImageUrl,
            text: [upperText || "", lowerText || ""],
            extension: "png",
            redirect: false,
          }),
        }
      );

      if (!memeImageResponse.ok) {
        const errorText = await memeImageResponse.text();
        console.error("MemeGen API error:", errorText);
        return res.status(memeImageResponse.status).json({
          error: "Failed to generate meme",
          details: memeImageResponse.statusText,
        });
      }

      const memeImageData = await memeImageResponse.json();

      if (!memeImageData.url) {
        console.error("MemeGen response missing URL:", memeImageData);
        return res.status(500).json({
          error: "Invalid response from meme generation service",
        });
      }

      const memeImageUrl = memeImageData.url;
      console.log("Meme generated successfully:", memeImageUrl);

      return res.status(200).json({ memeImageUrl });
    } catch (error) {
      console.error("Error generating meme:", error.message);
      return res.status(500).json({
        error: "Failed to generate meme",
        details: error.message,
      });
    }
  } catch (error) {
    console.error("error in /upload endpoint:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

app.use("/", router);
export { app };
// Export handler for serverless
export const handler = serverless(app);
