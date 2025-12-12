// const sgMail = require('@sendgrid/mail');

// exports.handler = async function(event, context) {
//   try {
//     const body = JSON.parse(event.body || '{}');
//     const name = body.name || 'No name';
//     const email = body.email || '';
//     const message = body.message || '';

//     const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
//     const TO_EMAIL = process.env.TO_EMAIL;

//     if (!SENDGRID_API_KEY || !TO_EMAIL) {
//       return {
//         statusCode: 500,
//         body: JSON.stringify({ error: 'Missing SENDGRID_API_KEY or TO_EMAIL in Netlify environment variables.' })
//       };
//     }

//     sgMail.setApiKey(SENDGRID_API_KEY);

//     const msg = {
//       to: TO_EMAIL,
//       from: TO_EMAIL,
//       subject: `Portfolio Contact — Message from ${name}`,
//       text: `From: ${name} <${email}>\n\n${message}`,
//       html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g,'<br>')}</p>`
//     };

//     await sgMail.send(msg);

//     return { statusCode: 200, body: JSON.stringify({ success: true }) };

//   } catch (err) {
//     return { statusCode: 500, body: JSON.stringify({ error: err.message || String(err) }) };
//   }
// };

// netlify/functions/send-email.js
const sgMail = require('@sendgrid/mail');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS, POST'
};

exports.handler = async (event) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 403,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Forbidden' })
    };
  }

  // ensure env vars
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const TO_EMAIL = process.env.TO_EMAIL;
  if (!SENDGRID_API_KEY || !TO_EMAIL) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Missing server configuration' })
    };
  }

  sgMail.setApiKey(SENDGRID_API_KEY);

  // parse JSON body
  let payload;
  try {
    payload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (err) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Invalid JSON body' })
    };
  }

  const { name, email, message } = payload || {};

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Missing name, email or message' })
    };
  }

  const msg = {
    to: TO_EMAIL,
    from: TO_EMAIL, // use your verified sender or the same TO_EMAIL if verified
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`
  };

  try {
    await sgMail.send(msg);
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error('SendGrid error:', err);
    // try to show SendGrid error message if present
    const errorMessage = err?.response?.body || err.message || 'Send failed';
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};
