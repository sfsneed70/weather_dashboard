import { Router, type Request, type Response } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// TODO: GET search history
router.get("/history", async (_req: Request, res: Response) => {
  try {
    const savedCitiies = await HistoryService.getCities();
    res.json(savedCitiies);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// TODO: POST Request with city name to retrieve weather data
router.get("/:city", async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  try {
    const cityName = req.params.city;
    const weather = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);
    res.json(weather);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {
  if (!req.params.id) {
    res.status(400).json({ msg: 'City ID is required' });
  }
  await HistoryService.removeCity(req.params.id);
  res.json({ success: 'City removed from history' });
});

export default router;
