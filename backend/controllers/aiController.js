import { clerkClient } from "@clerk/express";
import OpenAI from "openai";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import sql from "../configs/db.js";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// FUNCTION TO GENERATE ARTICLES
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;
    const tokenEstimate = Math.round(length * 1.8); // ~1.8 tokens per word

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(400).json({
        success: false,
        message: "You have reached your free usage limit.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: tokenEstimate,
    });

    const content = response.choices[0].message.content;
    await sql`INSERT INTO creations (user_id, prompt, content, type) 
    VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// FUNCTION TO GENERATE BLOG TITLES
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(400).json({
        success: false,
        message: "You have reached your free usage limit.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    await sql`INSERT INTO creations (user_id, prompt, content, type) 
    VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// FUNCTION TO GENERATE IMAGES
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(400).json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish) 
    VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// FUNCTION TO REMOVE IMAGE BACKGROUND
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(400).json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type) 
    VALUES (${userId}, 'Remove image background', ${secure_url}, 'image')`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// FUNCTION TO REMOVE OBJECTS FROM IMAGES
export const removeObjectsFromImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(400).json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);
    const imageURL = cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
      resource_type: "image",
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type) 
    VALUES (${userId}, ${`Removed ${object} from image`}, ${imageURL}, 'image')`;

    res.json({ success: true, content: imageURL });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// HELPER FUNCTION TO EXTRACT TEXT
const extractResumeText = async (resume) => {
  const ext = path.extname(resume.originalname).toLowerCase();
  const dataBuffer = fs.readFileSync(resume.path);

  try {
    if (ext === ".pdf") {
      const pdfDoc = await pdf(dataBuffer);
      return pdfDoc.text;
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: resume.path });
      return result.value;
    } else if (ext === ".txt") {
      return dataBuffer.toString("utf8");
    } else {
      throw new Error(
        "Unsupported file format. Please upload PDF, DOCX, or TXT."
      );
    }
  } catch (err) {
    throw new Error(
      "Failed to read the uploaded file. Make sure it's a valid resume file and not corrupted."
    );
  }
};

// MAIN FUNCTION TO REVIEW RESUME
export const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(400).json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Resume file size should be less than 5MB.",
      });
    }

    // Extract resume text depending on file type
    const resumeText = await extractResumeText(resume);

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message: "The uploaded file does not appear to be a valid resume.",
      });
    }

    //  Step 1: Classification before full review
    const classifierPrompt = `Is the following text a resume/CV that contains personal work experience, education, and skills?
    Answer only "yes" or "no".

    Text:
    ${resumeText.slice(0, 1200)}  // only the first 1200 chars for speed
    `;

    const classifierResponse = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: classifierPrompt }],
      temperature: 0,
      max_tokens: 5,
    });

    const verdict = classifierResponse.choices[0].message.content
      .trim()
      .toLowerCase();

    if (verdict !== "yes") {
      return res.status(400).json({
        success: false,
        message:
          "The uploaded file does not appear to be a resume. Please upload a valid CV.",
      });
    }

    //  Step 2: Actual resume review
    const prompt = `Review the following resume and provide feedback on its strengths, weaknesses, and areas for improvement.
    Resume Content:\n\n${resumeText}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type) 
      VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
