const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_not_configured_yet');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
router.use(protect);
router.post('/create-checkout-session', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const host = req.headers.origin || 'http://localhost:5173';
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_dummy')) {
      console.log('Using Mock Checkout Session as Stripe secret is not configured.');
      return res.json({
        id: `mock_session_${Date.now()}`,
        url: `${host}/success?session_id=mock_session_${Date.now()}`
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Plan Upgrade',
              description: 'Access premium task manager features including high priorities and custom tags.',
            },
            unit_amount: 1999, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${host}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
      },
    });
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: 'Payment gateway error', error: error.message });
  }
});
router.post('/verify-session', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    if (sessionId.startsWith('mock_session_')) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.isPro = true;
        await user.save();
        return res.json({ success: true, isPro: true, message: 'Mock payment verified successfully' });
      }
      return res.status(404).json({ message: 'User not found' });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'paid') {
      const userId = session.metadata.userId;
      const user = await User.findById(userId);
      if (user) {
        user.isPro = true;
        await user.save();
        return res.json({ success: true, isPro: true });
      }
    }
    res.status(400).json({ success: false, message: 'Payment not completed or verified' });
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({ message: 'Verification error', error: error.message });
  }
});
module.exports = router;