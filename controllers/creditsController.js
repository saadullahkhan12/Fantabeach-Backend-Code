// controllers/creditsController.js
const User = require('../models/User');

/**
 * Package definitions
 * keys: 'starter', 'medium', 'premium'
 */
const PACKAGES = {
  starter: { credits: 14, freePlayers: 5, price: 4.99 },
  medium: { credits: 35, freePlayers: 10, price: 9.99 },
  premium: { credits: 80, freePlayers: 20, price: 19.99 }
};

// ===============================
// GET /api/credits/packages
// ===============================
exports.getPackages = async (req, res) => {
  try {
    const packages = Object.entries(PACKAGES).map(([key, value]) => ({
      id: key,
      credits: value.credits,
      freePlayers: value.freePlayers,
      price: value.price
    }));
    res.json({ success: true, packages });
  } catch (err) {
    console.error('Get packages error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===============================
// Simulate payment processing
// ===============================
const simulatePayment = async (user, pkgKey, method) => {
  return {
    success: true,
    transactionId: `tx_${Date.now()}`,
    gateway: method,
    package: pkgKey
  };
};

// ===============================
// POST /api/credits/buy
// body: { package: 'starter'|'medium'|'premium', method: 'google'|'apple' }
// ===============================
exports.buyCredits = async (req, res) => {
  try {
    const { package: pkgKey, method } = req.body;
    const userId = req.user.id;

    if (!pkgKey || !PACKAGES[pkgKey]) {
      return res.status(400).json({ success: false, message: 'Invalid package selected' });
    }
    if (!['google', 'apple'].includes(method)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Simulate payment
    const paymentResult = await simulatePayment(user, pkgKey, method);

    if (!paymentResult.success) {
      return res.status(400).json({ success: false, message: 'Payment failed' });
    }

    const pkg = PACKAGES[pkgKey];
    user.credits = (user.credits || 0) + pkg.credits;

    // Add a freePlayers field if not in schema
    if (user.freePlayers === undefined) user.freePlayers = 0;
    user.freePlayers += pkg.freePlayers;

    await user.save();

    res.json({
      success: true,
      message: 'Purchase successful',
      transactionId: paymentResult.transactionId,
      credits: user.credits,
      freePlayers: user.freePlayers,
      package: pkgKey
    });
  } catch (err) {
    console.error('Buy credits error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
