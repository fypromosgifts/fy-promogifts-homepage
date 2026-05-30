const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const formJs = `const quoteForm = document.getElementById('quoteForm');
const submitInquiry = document.getElementById('submitInquiry');
const formStatus = document.getElementById('formStatus');
if (quoteForm && submitInquiry) {
  quoteForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) {
      return;
    }

    const defaultText = submitInquiry.textContent;
    submitInquiry.disabled = true;
    submitInquiry.textContent = 'Submitting...';
    if (formStatus) {
      formStatus.textContent = '';
      formStatus.classList.remove('is-error');
    }

    try {
      const response = await fetch(quoteForm.action, {
        method: 'POST',
        body: new FormData(quoteForm),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      quoteForm.reset();
      if (logoUpload) {
        logoUpload.dispatchEvent(new Event('change'));
      }
      if (formStatus) {
        formStatus.textContent = 'Thanks, your inquiry has been sent. We will reply within 12 hours.';
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = 'Sorry, the form could not be sent. Please email sira@fypromogifts.com or chat on WhatsApp.';
        formStatus.classList.add('is-error');
      }
    } finally {
      submitInquiry.disabled = false;
      submitInquiry.textContent = defaultText;
    }
  });
}`;

html = html.replace(
  '<form class="form-grid" data-form-status="static-html-preview">',
  '<form class="form-grid" id="quoteForm" action="https://formspree.io/f/xgoqqrno" method="POST" enctype="multipart/form-data" data-form-status="formspree-live">\n<input type="hidden" name="_subject" value="New Custom Gift Kit Inquiry - FY PromoGifts"/>'
);
html = html.replace('<input id="inqName" name="name" placeholder="Your name" autocomplete="name"/>', '<input id="inqName" name="name" placeholder="Your name" autocomplete="name" required/>');
html = html.replace('<input id="inqEmail" name="email" placeholder="name@company.com" type="email" autocomplete="email"/>', '<input id="inqEmail" name="email" placeholder="name@company.com" type="email" autocomplete="email" required/>');
html = html.replace('<input id="inqWhatsapp" name="whatsapp" placeholder="Your WhatsApp number" autocomplete="tel"/>', '<input id="inqWhatsapp" name="whatsapp" placeholder="Your WhatsApp number" autocomplete="tel" required/>');
html = html.replace('<input id="inqCompany" name="company" placeholder="Your company name" autocomplete="organization"/>', '<input id="inqCompany" name="company" placeholder="Your company name" autocomplete="organization" required/>');
html = html.replace('<select id="inqUseCase" name="use_case"><option>Select gift use case</option>', '<select id="inqUseCase" name="use_case" required><option value="" disabled selected>Select gift use case</option>');
html = html.replace('<input id="inqQuantity" name="quantity" placeholder="Enter quantity"/>', '<input id="inqQuantity" name="quantity" placeholder="Enter quantity" required/>');
html = html.replace('<input id="inqDate" name="need_by_date" placeholder="Need-by date" type="text"/>', '<input id="inqDate" name="need_by_date" placeholder="Need-by date" type="text" required/>');
html = html.replace('<button class="btn btn-gold" id="submitInquiry" type="button">Submit Inquiry</button>', '<button class="btn btn-gold" id="submitInquiry" type="submit">Submit Inquiry</button>');
html = html.replace('</a></div>\n</form>', '</a></div>\n<div class="form-status" id="formStatus" aria-live="polite"></div>\n</form>');
html = html.replace('<a href="mailto:sirazheng@gmail.com">Email: sirazheng@gmail.com</a>', '<a href="mailto:sira@fypromogifts.com">Email: sira@fypromogifts.com</a>');
html = html.replace('.wide,.actions{grid-column:span 1}', '.wide,.actions,.form-status{grid-column:span 1}');
html = html.replace(
  '.file-upload.has-file .file-button{\n  background:#e6edf2;\n}',
  '.file-upload.has-file .file-button{\n  background:#e6edf2;\n}\n\n.form-status{\n  grid-column:span 2;\n  min-height:20px;\n  color:#178246;\n  font-size:14px;\n  font-weight:800;\n}\n.form-status.is-error{\n  color:#b42318;\n}'
);
html = html.replace(/const submitInquiry = document\.getElementById\('submitInquiry'\);[\s\S]*?\n\}\n\n<\/script>/, formJs + '\n\n</script>');

fs.writeFileSync('index.html', html);
