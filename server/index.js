import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Create email transporter with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // Only for development
  }
});

// Verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('Email server error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.TO_EMAIL,
      subject: `Portfolio Contact from ${name}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #333;">New Contact Message</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Projects API endpoint
app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: "Project One",
      description: "A modern web application built with React and Node.js",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      tags: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      title: "Project Two",
      description: "E-commerce platform with real-time inventory management",
      image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80",
      tags: ["TypeScript", "Next.js", "Stripe"]
    }
  ];

  res.json(projects);
});

// Skills API endpoint
app.get('/api/skills', (req, res) => {
  const skills = [
    {
      id: 1,
      category: "Programming Languages",
      skills: ["Java", "Python", "JavaScript"]
    },
    {
      id: 2,
      category: "Frontend Development",
      skills: ["React", "HTML", "CSS", "Bootstrap"]
    },
    {
      id: 3,
      category: "Tools & Technologies",
      skills: ["Git", "VS Code", "Postman"]
    }
  ];

  res.json(skills);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});