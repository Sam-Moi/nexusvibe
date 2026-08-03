import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import Stripe from "stripe";
import nodemailer from 'nodemailer';
import axios from 'axios';
import { Server } from 'socket.io';
import http from 'http';
import TelegramBot from 'node-telegram-bot-api';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const app = express();
app.set('trust proxy', 1);
// Security Headers Middleware
app.use(helmet());

// Rate Limiter to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);
// Temporary usre storage array
const users: any[] = [];

// --- ADD THIS HERE ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Make sure all these socket handlers are INSIDE io.on('connection', (socket) => { ... })

io.on('connection', (socket) => {
  console.log('User connected to signaling:', socket.id);

  // 1. Join room
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    
    const clients = io.sockets.adapter.rooms.get(roomId);
    const numClients = clients ? clients.size : 0;
    console.log(`Socket ${socket.id} joined room ${roomId}. Total: ${numClients}`);

    if (numClients === 2) {
      io.in(roomId).emit('ready');
    }
  });

  // 2. Ringing & Call setup
  socket.on('call-user', ({ userToCall, signalData, from, name }: { userToCall: string; signalData: any; from: string; name: string }) => {
    socket.to(userToCall).emit('incoming-call', { signal: signalData, from, name });
  });

  socket.on('accept-call', ({ to, signal }: { to: string; signal: any }) => {
    socket.to(to).emit('call-accepted', signal);
  });

  socket.on('reject-call', ({ to }: { to: string }) => {
    socket.to(to).emit('call-rejected');
  });

  // 3. WebRTC Negotiation
  socket.on('offer', ({ roomId, offer }: { roomId: string; offer: any }) => {
    socket.to(roomId).emit('offer', { offer });
  });

  socket.on('answer', ({ roomId, answer }: { roomId: string; answer: any }) => {
    socket.to(roomId).emit('answer', { answer });
  });

  socket.on('ice-candidate', ({ roomId, candidate }: { roomId: string; candidate: any }) => {
    socket.to(roomId).emit('ice-candidate', { candidate });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
}); // <--- Make sure this closing brace and parenthesis are at the end!

// Initialize Telegram Bot with polling enabled
const TELEGRAM_BOT_TOKEN = '8616263729:AAG7Fxbp4qzaB_RdPLIaONPsfBG_rrzlvwA';
const TELEGRAM_CHAT_ID = '8914663236';
const BotConstructor = (TelegramBot as any).default || TelegramBot;
const bot = new BotConstructor(TELEGRAM_BOT_TOKEN, { polling: true });

io.on('connection', (socket) => {
  console.log('User connected to support chat:', socket.id);
});
const PORT = 3000;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
// Temporary verification code store (email -> code)
const pendingVerifications = new Map<string, string>();

// Email Transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nexusvibe539@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
});

// Initialize server-side Gemini API Client securely
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Full-stack health route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Interactive AI Wingman companion API endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  try {
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const systemPrompt = `You are 'Nexus', the premium AI dating wingman and social discovery companion for 'NexusVibe'. 
Your purpose is to help users optimize their matching aura, digital bio, icebreakers, and visual portfolios to find their tribe. 
Your tone should be witty, aesthetic-savvy, stylish, and highly supportive. You are deeply knowledgeable about internet subcultures, brutalist architecture, vaporwave, analog synthesis, and fine art. 
Provide concise responses (under 80 words). If the user asks for help with icebreakers, supply a highly engaging opening line in the 'quote' property. If the user asks to improve their bio, provide the improved version in the 'newBio' property. Always suggest three logical, interactive next action buttons/option chips in the 'options' property (e.g. 'Improve my Bio', 'Try another vibe').`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { 
              type: Type.STRING, 
              description: "The primary conversational reply from Nexus AI." 
            },
            quote: { 
              type: Type.STRING, 
              description: "An optional customized icebreaker or aesthetic quote matching the request." 
            },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Three engaging recommendation buttons or option chips for the user." 
            },
            newBio: { 
              type: Type.STRING, 
              description: "A shortened, ultra-aesthetic social bio if the user requests a bio revamp." 
            }
          },
          required: ["reply", "options"]
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      reply: "My neural link is momentarily calibrating in the background. What specific aspect of your social presence should we explore?",
      options: ["Improve my Bio", "Generate Icebreaker", "Compatibility Report"] 
    });
  }
});

// ==========================================
// PAYPAL INTEGRATION
// ==========================================

// Helper function to get PayPal Access Token
const getPayPalToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
};

// 1. Create PayPal Order
app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const token = await getPayPalToken();

    const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "8.00",
            },
            description: "NexusVibe Pro Membership",
          },
        ],
      }),
    });

    const order = await response.json();
    res.json(order);
  } catch (error) {
    console.error("PayPal Create Order Error:", error);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

// 2. Capture PayPal Payment
app.post("/api/paypal/capture-order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const token = await getPayPalToken();

    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await response.json();
    res.json(captureData);
  } catch (error) {
    console.error("PayPal Capture Error:", error);
    res.status(500).json({ error: "Failed to capture PayPal payment" });
  }
});

// --- M-PESA INTEGRATION ---

// Helper function to get Daraja Access Token
const getMpesaToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const data = await response.json();
  return data.access_token;
};

// Route to trigger STK Push
app.post("/api/mpesa/stkpush", async (req, res) => {
  try {
    const { phone, amount } = req.body; // e.g., phone: "254712345678", amount: 100

    const token = await getMpesaToken();
    const shortCode = process.env.MPESA_SHORTCODE || "174379";
    const passkey = process.env.MPESA_PASSKEY || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

    // Format Timestamp: YYYYMMDDHHmmss
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    // Generate Password
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

    const stkPayload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount || 1, // Defaulting to KES 1 for testing
      PartyA: phone, // Phone sending money
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: `${process.env.APP_URL || 'http://localhost:3000'}/api/mpesa/callback`,
      AccountReference: "NexusVibe Premium",
      TransactionDesc: "Payment for Premium Feature Access",
    };

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPayload),
      }
    );

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("M-Pesa STK Push Error:", error);
    res.status(500).json({ error: "Failed to initiate M-Pesa payment" });
  }
});

// M-Pesa Callback Route
app.post("/api/mpesa/callback", (req, res) => {
  console.log("M-Pesa Callback Data Received:", JSON.stringify(req.body));
  res.status(200).send("OK");
});

// Paste it ABOVE startServer() or with your other API routes:


app.post('/api/support/send', async (req, res) => {
  const { name, email, message, socketId } = req.body;

  const text = `🚨 *New Support Request*\n\n` +
               `*Name:* ${name || 'Guest'}\n` +
               `*Email:* ${email || 'N/A'}\n` +
               `*Socket ID:* \`${socketId}\`\n\n` +
               `*Message:*\n${message}`;

  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, text, { parse_mode: 'Markdown' });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram forwarding error:', error);
    res.status(500).json({ success: false, error: 'Failed to send alert' });
  }
});

// Listen for your Telegram replies and send back to the web user
bot.on('message', (msg: any) => {
  if (msg.reply_to_message && msg.text) {
    const originalText = msg.reply_to_message.text || '';
    const match = originalText.match(/Socket ID:\s*([a-zA-Z0-9_-]+)/);
    
    if (match && match[1]) {
      const targetSocketId = match[1];
      io.to(targetSocketId).emit('support_reply', {
        text: msg.text,
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      console.log(`Reply forwarded to Socket ID: ${targetSocketId}`);
    }
  }
});

// Vite Middleware & SPA serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
app.post("/api/stripe/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 800, // Amount in cents (e.g. $8.00 = 800)
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send clientSecret back to the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
// Endpoint 1: Send Verification Code
app.post('/api/auth/send-code', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  pendingVerifications.set(email, code);

  try {
    await transporter.sendMail({
      from: '"NexusVibe" <no-reply@nexusvibe.com>',
      to: email,
      subject: 'Your NexusVibe Verification Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #fff;">
          <h2 style="color: #ec4899;">Welcome to NexusVibe!</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #ec4899; letter-spacing: 4px;">${code}</h1>
        </div>
      `,
    });
    res.json({ success: true, message: 'Verification code sent to email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

// Endpoint 2: Verify Code
app.post('/api/auth/verify-code', (req, res) => {
  const { email, code, name } = req.body;
  const storedCode = pendingVerifications.get(email);

  if (!storedCode || storedCode !== code) {
    return res.status(400).json({ error: 'Invalid or expired verification code' });
  }

  pendingVerifications.delete(email);

  res.json({
    success: true,
    user: { email, name },
  });
});
// Paystack Payment Route
app.post('/api/paystack/initialize', async (req, res) => {
  const { email, amount } = req.body;

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Converts KES to cents/sub-units
        currency: 'KES',
        callback_url: 'http://localhost:3000', // Redirects user back to your app after payment
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY || 'sk_test_46340706237030ef13d4cbec2cd9c86f52553f42'}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference,
    });
  } catch (error: any) {
    console.error('Paystack error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Payment initialization failed' });
  }
});
// Paystack Webhook Handler (Confirms successful payments)
app.post('/api/paystack/webhook', (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || 'sk_test_46340706237030ef13d4cbec2cd9c86f52553f42')
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    const event = req.body;

    if (event.event === 'charge.success') {
      const userEmail = event.data.customer.email;
      const amountPaid = event.data.amount / 100;

      console.log(`Payment confirmed for ${userEmail}: KES ${amountPaid}`);
      // TODO: Grant premium access or save transaction to your database here
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
  app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

 // 1. SECURE LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user in our array
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Securely compare the entered password with the hashed password stored in user.password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login successful
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});
// 2. FORGOT PASSWORD - SEND CODE ROUTE
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find the user by the email they registered with
    const user = users.find(u => u.email === email);

    if (!user) {
      // Return success anyway to prevent email enumeration/hacking
      return res.status(200).json({ message: 'If that email exists, a reset code has been sent.' });
    }

    // Generate 6-digit code valid for 60 seconds
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 60 * 1000; // 60 seconds

    // Send the code to their registered email via Nodemailer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'NexusVibe Password Reset Code',
      text: `Your password reset code is: ${resetCode}. It expires in 60 seconds.`
    });

    res.status(200).json({ message: 'Password reset code sent to email.' });
  } catch (error) {
    console.error('Error sending reset code:', error);
    res.status(500).json({ error: 'Error sending reset code' });
  }
});

// 3. RESET PASSWORD WITH CODE ROUTE
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Find user and verify the code hasn't expired (60 seconds limit)
    const user = users.find(u => 
      u.email === email && 
      u.resetPasswordCode === code && 
      u.resetPasswordExpires > Date.now()
    );

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset code.' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    // Hash the new password securely with bcrypt
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear the reset code tokens so they can't be reused
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;

    res.status(200).json({ message: 'Password successfully reset.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
});

// 1. Apply Helmet to secure HTTP headers
app.use(helmet());

// 2. Apply Rate Limiting to prevent brute-force attacks on API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', apiLimiter);

// 3. Stricter rate limit specifically for login/auth routes to block hackers
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Max 10 login/register attempts per 15 minutes
  message: { error: 'Too many authentication attempts, please try again later.' }
});
app.use('/api/auth/', authLimiter);

// 4. Global Error Handler with Email Threat/Error Notification
app.use(async (err: any, req: any, res: any, next: any) => {
  console.error('Security/Server Error Caught:', err);

  // Send an email notification to yourself upon critical errors or potential attacks
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send alert to your own admin email
      subject: '🚨 SECURITY ALERT: Server Error / Threat Detected',
      text: `An error occurred on your server:\n\nRoute: ${req.method} ${req.originalUrl}\nIP: ${req.ip}\nError: ${err.message}`
    });
  } catch (emailError) {
    console.error('Failed to send error notification email:', emailError);
  }

  res.status(500).json({ error: 'An internal security error occurred.' });
});

  server.listen(3000, () => {
    console.log(`Server running on port:3000`);
  });
}

startServer();