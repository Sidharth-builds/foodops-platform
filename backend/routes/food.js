const express = require("express");
const Food = require("../models/food");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * POST FOOD (Provider only)
 * POST /api/food
 */
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "provider") {
    return res.status(403).json({ message: "Only providers can post food" });
  }

  try {
    const { title, quantity, location } = req.body;

    if (!title || !quantity || !location) {
      return res.status(400).json({ message: "All fields required" });
    }

    const food = new Food({
      title,
      quantity,
      location,
      provider: req.user.id
    });

    await food.save();
    res.status(201).json({ message: "Food posted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET PROVIDER'S FOOD
 * GET /api/food/mine
 */
router.get("/mine", auth, async (req, res) => {
  try {
    const foods = await Food.find({ provider: req.user.id });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET AVAILABLE FOOD (NGO)
 * GET /api/food/available
 */
router.get("/available", auth, async (req, res) => {
  if (req.user.role !== "ngo") {
    return res.status(403).json({ message: "Only NGOs can view food" });
  }

  const foods = await Food.find({ status: "posted" })
    .populate("provider", "email");

  res.json(foods);
});

/**
 * CLAIM FOOD (NGO)
 * PUT /api/food/claim/:id
 */
router.put("/claim/:id", auth, async (req, res) => {
  if (req.user.role !== "ngo") {
    return res.status(403).json({ message: "Only NGOs can claim food" });
  }

  const food = await Food.findById(req.params.id);

  if (!food || food.status !== "posted") {
    return res.status(400).json({ message: "Food not available" });
  }

  food.status = "claimed";
  await food.save();

  res.json({ message: "Food claimed successfully" });
});

/**
 * MARK DELIVERED (Provider)
 * PUT /api/food/deliver/:id
 */
router.put("/deliver/:id", auth, async (req, res) => {
  if (req.user.role !== "provider") {
    return res.status(403).json({ message: "Only providers can deliver" });
  }

  const food = await Food.findById(req.params.id);

  if (!food || food.status !== "claimed") {
    return res.status(400).json({ message: "Food not ready for delivery" });
  }

  food.status = "delivered";
  await food.save();

  res.json({ message: "Food marked as delivered" });
});

module.exports = router;