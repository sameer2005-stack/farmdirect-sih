import { Request, Response } from "express";
import { MANDISAARTHI_URL } from "../config/env.js";

export async function getRecommendation(
  req: Request,
  res: Response,
) {
  try {
    const {
      crop,
      quantity_kg,
      transport_rate_per_km = 25,
      other_cost_per_kg = 0.5,
    } = req.body;

    if (!crop || !quantity_kg) {
      return res.status(400).json({
        success: false,
        message: "Crop and quantity_kg are required",
      });
    }

    const response = await fetch(
      `${MANDISAARTHI_URL}/recommend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crop,
          quantity_kg,
          transport_rate_per_km,
          other_cost_per_kg,
        }),
      },
    );

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "MandiSaarthi recommendation service unavailable",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("AI RECOMMENDATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get market recommendation",
    });
  }
}
export async function chatWithMandiSaarthi(
  req: Request,
  res: Response,
) {
  try {
    const {
      message,
      language = "auto",
      session_id = "default",
    } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response = await fetch(
      `${MANDISAARTHI_URL}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          language,
          session_id,
        }),
      },
    );

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "MandiSaarthi chat service unavailable",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("AI CHAT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to connect to MandiSaarthi",
    });
  }
}