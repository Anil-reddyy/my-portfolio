const sgMail = require('@sendgrid/mail');

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');
    const name = body.name || 'No name';
    const email = body.email || '';
    const message = body.message || '';

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const TO_EMAIL = process.env.TO_EMAIL;

    if (!SENDGRID_API_KEY || !TO_EMAIL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing SENDGRID_API_KEY or TO_EMAIL in Netlify environment variables.' })
      };
    }

    sgMail.setApiKey(SENDGRID_API_KEY);

    const msg = {
      to: TO_EMAIL,
      from: TO_EMAIL,
      subject: `Portfolio Contact — Message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g,'<br>')}</p>`
    };

    await sgMail.send(msg);

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || String(err) }) };
  }
};
