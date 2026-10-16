# All Nine Services — Website

Static website (HTML/CSS/JS). No backend, no database. Designed & Developed by Scaling Socials.

## Pages
index.html (Home) · consulting.html · tax.html · strategy-finance.html · resources.html · contact.html · privacy.html

## Adding / changing a downloadable PDF (done by Scaling Socials under maintenance)
1. Put the PDF in `assets/pdfs/` (use a short file name, no spaces — e.g. `tds-guide-2026.pdf`).
2. Open `assets/js/resources.js`, copy one `{ ... }` block, paste it at the top of the list and edit:
   `id` (unique, no spaces), `title`, `category` ("Consulting" / "Tax" / "Strategy & Finance" / "General"), `description`, `file`.
3. Re-deploy the folder.
To remove a PDF, delete its block (and the file). The first PDF of each category is used by that service page's "Download free guide" buttons.

## Leads (no backend — Netlify Forms)
Host on Netlify and both forms work automatically:
- **pdf-download** — everyone who downloads a PDF (name, email, phone, company, country, which PDF)
- **contact** — contact page enquiries
See them in Netlify → Site → **Forms**. Turn on email alerts in Forms → Form notifications, and export CSV any time.
After the first deploy, check Netlify → Forms that "Form detection" is enabled (re-deploy once if the forms don't appear).
Not hosting on Netlify? Put a Formspree (or similar) endpoint in `assets/js/config.js` → `FORM_ENDPOINT`.

Note: forms only submit on the live/Netlify site, not when opening the files locally. The PDF still downloads locally so you can test the flow.

## To update before launch (2nd edit)
- Replace placeholder images (free Unsplash photos, hot-linked) — search `images.unsplash.com`.
- Real phone, email, WhatsApp, office address — search `00000`, `[Office address]`, `hello@allnineservices.com`.
- Footer social links (`href="#"`).
- Contact details inside the 3 starter PDFs, and review their content + privacy policy with the client.
