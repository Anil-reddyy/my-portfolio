
document.addEventListener('DOMContentLoaded', ()=>{
  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
  // animate skill meters if any (not in this version)
});
// contact form AJAX handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();              // <--- stops normal navigation (no 404)

    status.textContent = 'Sending…';

    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    try {
      const res = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(()=>null);

      if (res.ok) {
        status.textContent = 'Message sent — thank you!';
        form.reset();
      } else {
        status.textContent = data && data.error ? `Error: ${data.error}` : `Send failed (${res.status})`;
        console.error('Send failed:', res.status, data);
      }
    } catch (err) {
      status.textContent = 'Network error — try again later';
      console.error('Network error sending email:', err);
    }
  });
});

