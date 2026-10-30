/* =========================================================
   All Nine Services: downloadable PDFs
   ---------------------------------------------------------
   TO ADD A NEW PDF:
     1. Put the PDF file in  assets/pdfs/
     2. Copy one block below, paste it at the top of the list
        and change the details.
     3. Re-upload the site (Netlify: drag & drop the folder).

   category must be one of:
     "Consulting" | "Tax" | "Strategy & Finance" | "General"
   The first PDF of each category is also used for the
   "Download free guide" buttons on that service page.
   ========================================================= */
window.ALLNINE_RESOURCES = [
  {
    id: "annual-compliance-checklist",
    title: "Annual Compliance Checklist for Private Limited Companies (India)",
    category: "Consulting",
    description: "A practical, month-by-month checklist of the core ROC, tax and statutory filings every Indian private limited company should track.",
    file: "assets/pdfs/annual-compliance-checklist-india.pdf"
  },
  {
    id: "gst-health-check",
    title: "GST Health-Check: 10 Questions Every Finance Team Should Ask",
    category: "Tax",
    description: "A quick self-assessment to spot input-tax-credit leakage, reconciliation gaps and notice risks before the department does.",
    file: "assets/pdfs/gst-health-check.pdf"
  },
  {
    id: "virtual-cfo-playbook",
    title: "The Virtual CFO Playbook for Growing Businesses",
    category: "Strategy & Finance",
    description: "What a virtual CFO actually does, when you need one, and the monthly reporting pack every founder should receive.",
    file: "assets/pdfs/virtual-cfo-playbook.pdf"
  },
  {
    id: "startup-cfo-idea-to-exit",
    title: "From Idea to Exit: Your CFO Partner at Every Stage",
    category: "Consulting",
    description: "CFO services for start-ups, stage by stage. Includes the value creation map plus compliance and strategic priorities from incorporation to post-funding governance.",
    file: "assets/pdfs/startup-cfo-idea-to-exit.pdf"
  },
  {
    id: "cashflow-case-study",
    title: "Case Study: Cash Flow Visibility & Working Capital Transformation",
    category: "Strategy & Finance",
    description: "How a 13-week rolling forecast and working capital discipline unlocked ₹85 lakh and cut the cash conversion cycle by 28 days for a ₹300 Cr food manufacturer.",
    file: "assets/pdfs/cashflow-working-capital-case-study.pdf"
  }
];
