
const stripe = require('../config/stripe');
const { pool } = require('../config/db');

const handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).send('Stripe webhook secret is not configured.');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error('[Stripe webhook] Signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        if (session.payment_status !== 'paid') break;

        const orderId = Number(session.metadata?.orderId);
        const paymentId = Number(session.metadata?.paymentId);

        if (!orderId || !paymentId) {
          console.error('[Stripe webhook] Missing order/payment metadata.');
          return res.status(400).send('Missing order/payment metadata.');
        }

        const connection = await pool.getConnection();

        try {
          await connection.beginTransaction();

          const [payments] = await connection.execute(
            `SELECT id, order_id, stripe_session_id, status
             FROM payments
             WHERE id = ? AND order_id = ?
             FOR UPDATE`,
            [paymentId, orderId]
          );

          if (!payments.length) {
            await connection.rollback();
            return res.status(404).send('Payment record not found.');
          }

          const payment = payments[0];

          if (
            payment.stripe_session_id &&
            payment.stripe_session_id !== session.id
          ) {
            await connection.rollback();
            return res.status(400).send('Checkout session mismatch.');
          }

          if (payment.status !== 'paid') {
            await connection.execute(
              `UPDATE payments
               SET status = 'paid', stripe_session_id = ?,
                   stripe_payment_intent_id = ?
               WHERE id = ?`,
              [
                session.id,
                typeof session.payment_intent === 'string'
                  ? session.payment_intent
                  : null,
                paymentId,
              ]
            );

            await connection.execute(
              `UPDATE orders
               SET payment_status = 'paid'
               WHERE id = ?`,
              [orderId]
            );
          }

          await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }

        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;
        if (session.payment_status !== 'paid') break;

        const orderId = Number(session.metadata?.orderId);
        const paymentId = Number(session.metadata?.paymentId);

        if (!orderId || !paymentId) break;

        const connection = await pool.getConnection();

        try {
          await connection.beginTransaction();

          const [payments] = await connection.execute(
            `SELECT id, order_id, stripe_session_id, status
             FROM payments WHERE id = ? AND order_id = ? FOR UPDATE`,
            [paymentId, orderId]
          );

          if (
            payments.length &&
            (!payments[0].stripe_session_id ||
              payments[0].stripe_session_id === session.id)
          ) {
            await connection.execute(
              `UPDATE payments
               SET status = 'paid', stripe_session_id = ?,
                   stripe_payment_intent_id = ?
               WHERE id = ?`,
              [
                session.id,
                typeof session.payment_intent === 'string'
                  ? session.payment_intent
                  : null,
                paymentId,
              ]
            );

            await connection.execute(
              `UPDATE orders SET payment_status = 'paid' WHERE id = ?`,
              [orderId]
            );
          }

          await connection.commit();
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }

        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object;
        const orderId = Number(session.metadata?.orderId);
        const paymentId = Number(session.metadata?.paymentId);

        if (!orderId || !paymentId) break;

        await pool.execute(
          `UPDATE payments
           SET status = 'failed'
           WHERE id = ? AND order_id = ? AND stripe_session_id = ?
             AND status = 'pending'`,
          [paymentId, orderId, session.id]
        );

        await pool.execute(
          `UPDATE orders
           SET payment_status = 'failed'
           WHERE id = ? AND payment_status = 'pending'`,
          [orderId]
        );

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const orderId = Number(session.metadata?.orderId);
        const paymentId = Number(session.metadata?.paymentId);

        if (!orderId || !paymentId) break;

        await pool.execute(
          `UPDATE payments
           SET status = 'failed'
           WHERE id = ? AND order_id = ? AND stripe_session_id = ?
             AND status = 'pending'`,
          [paymentId, orderId, session.id]
        );

        await pool.execute(
          `UPDATE orders
           SET payment_status = 'failed'
           WHERE id = ? AND payment_status = 'pending'`,
          [orderId]
        );

        break;
      }

      default:
        break;
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('[Stripe webhook] Processing failed:', error.message);
    return res.status(500).send('Webhook processing failed.');
  }
};

module.exports = { handleStripeWebhook };
