const identityService = require("../services/identity.service");

class IdentityController {
  async identify(req, res) {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({
        error: "Either email or phoneNumber must be provided.",
      });
    }

    try {
      const response = await identityService.identify({
        email: email || null,
        phoneNumber: phoneNumber || null,
      });
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in identity service:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new IdentityController();
