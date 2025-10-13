// import express from "express";
// import cors from "cors";
// import nodemailer from "nodemailer";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Create test email account (Ethereal)
// let testAccount;
// let transporter;

// (async () => {
//   try {
//     testAccount = await nodemailer.createTestAccount();

//     transporter = nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       auth: {
//         user: testAccount.user,
//         pass: testAccount.pass
//       }
//     });

//     console.log(`✅ Test email account created: ${testAccount.user}`);
//     console.log("📩 You can preview sent emails at https://ethereal.email/");

//   } catch (error) {
//     console.error("❌ Failed to create test email account:", error);
//   }
// })();

// // Example API route
// app.post("/api/checkout", async (req, res) => {
//   try {
//     const { name, email, amount, product } = req.body;

//     if (!name || !email || !amount) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Send email confirmation (simulated)
//     const info = await transporter.sendMail({
//       from: '"SellPal Escrow" <muhatilionard@gmail.com>',
//       to: email,
//       subject: "Payment Confirmation",
//       text: `Hello ${name}, we received your payment of $${amount} for ${product}.`,
//     });

//     console.log("✅ Email sent:", nodemailer.getTestMessageUrl(info));

//     res.json({
//       message: "Checkout processed successfully!",
//       previewURL: nodemailer.getTestMessageUrl(info),
//     });
//   } catch (err) {
//     console.error("❌ Checkout error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 SellPal Escrow backend running on http://localhost:${PORT}`);
// });






import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Configure Brevo transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
   user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

// 🔹 Example API route
app.post("/api/checkout", async (req, res) => {
  try {
    const { name, email, amount, product } = req.body;

    if (!name || !email || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Send email confirmation using Brevo
    const info = await transporter.sendMail({
      from: '"SellPal Escrow" <muhatilionard@gmail.com>',
      to: email,
      subject: "Payment Confirmation",
      text: `Hello ${name}, we received your payment of $${amount} for ${product}.`,
    });

    console.log("✅ Email sent:", info.messageId);

    res.json({
      message: "Checkout processed successfully!",
      messageId: info.messageId
    });
  } catch (err) {
    console.error("❌ Checkout error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 SellPal Escrow backend running on http://localhost:${PORT}`);
});
