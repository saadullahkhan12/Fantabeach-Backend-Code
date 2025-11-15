// controllers/paymentsController.js
const Stripe = require('stripe');
const User = require('../models/User');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PACKAGES = {
  starter: { credits: 14, freePlayers: 5, price: 4.99 },
  medium:  { credits: 35, freePlayers: 10, price: 9.99 },
  premium: { credits: 80, freePlayers: 20, price: 19.99 }
};

// 1️⃣ Create PaymentIntent (called from frontend)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { package: pkgKey } = req.body;
    const user = req.user;

    if (!PACKAGES[pkgKey]) {
      return res.status(400).json({ success: false, message: 'Invalid package' });
    }

    const pkg = PACKAGES[pkgKey];

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(pkg.price * 100), // in cents
      currency: 'usd',
      metadata: {
        userId: user._id.toString(),
        package: pkgKey
      },
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (err) {
    console.error('Stripe create intent error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2️⃣ Stripe Webhook — called by Stripe automatically
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event types
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { userId, package: pkgKey } = paymentIntent.metadata;
    const pkg = PACKAGES[pkgKey];

    try {
      const user = await User.findById(userId);
      if (user && pkg) {
        user.credits += pkg.credits;
        user.freePlayers = (user.freePlayers || 0) + pkg.freePlayers;
        await user.save();
        console.log(`✅ Credits added to user ${user.email}`);
      }
    } catch (err) {
      console.error('Error updating user credits:', err);
    }
  }

  res.json({ received: true });
};
