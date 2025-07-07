
// Initialize EmailJS
(function () {
  emailjs.init("5Fu2RhS8HXgydjmgM"); // Replace with your actual Public Key
})();

// Add a new subject row
function addSubjectRow() {
  const table = document.getElementById("subjectTable");
  const row = table.insertRow();
  for (let i = 0; i < 4; i++) {
    const cell = row.insertCell(i);
    const input = document.createElement("input");
    input.className = "w-full p-1 border";
    if (i === 0) input.placeholder = "Subject";
    else input.type = "number";
    cell.appendChild(input);
  }
}

// Generate Report Card Preview
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const reportContent = document.getElementById("reportContent");
  const schoolLogo = document.getElementById("schoolLogo").files[0];

  let logoImgHTML = "";
  if (schoolLogo) {
    const logoURL = URL.createObjectURL(schoolLogo);
    logoImgHTML = `<img src="${logoURL}" alt="School Logo" class="mx-auto mb-4 h-20" />`;
  }

  const schoolName = document.getElementById("schoolName").value;
  const session = document.getElementById("session").value;
  const term = document.getElementById("term").value;
  const studentName = document.getElementById("studentName").value;
  const studentClass = document.getElementById("studentClass").value;
  const age = document.getElementById("age").value;
  const behavior = document.getElementById("behavior").value;
  const teacherComment = document.getElementById("teacherComment").value;
  const headComment = document.getElementById("headComment").value;

  // Build subject table
  const table = document.getElementById("subjectTable");
  let subjectsHTML = `<table class="w-full border text-sm mb-4">
    <thead><tr><th>Subject</th><th>CA1</th><th>CA2</th><th>Exam</th><th>Total</th></tr></thead>
    <tbody>`;
  for (let i = 0; i < table.rows.length; i++) {
    const cells = table.rows[i].cells;
    const subject = cells[0].querySelector("input").value;
    const ca1 = Number(cells[1].querySelector("input").value);
    const ca2 = Number(cells[2].querySelector("input").value);
    const exam = Number(cells[3].querySelector("input").value);
    const total = ca1 + ca2 + exam;
    subjectsHTML += `<tr>
      <td>${subject}</td>
      <td>${ca1}</td>
      <td>${ca2}</td>
      <td>${exam}</td>
      <td>${total}</td>
    </tr>`;
  }
  subjectsHTML += `</tbody></table>`;

  reportContent.innerHTML = `
    ${logoImgHTML}
    <h2 class="text-xl font-bold text-center mb-2">${schoolName}</h2>
    <p class="text-center mb-4">Session: ${session} | Term: ${term}</p>
    <p><strong>Name:</strong> ${studentName}</p>
    <p><strong>Class:</strong> ${studentClass}</p>
    <p><strong>Age:</strong> ${age}</p>
    <p><strong>Behavior:</strong> ${behavior}</p>
    <hr class="my-2" />
    ${subjectsHTML}
    <p><strong>Teacher's Comment:</strong> ${teacherComment}</p>
    <p><strong>Headteacher's Comment:</strong> ${headComment}</p>
  `;

  document.getElementById("reportCard").classList.remove("hidden");
});

// Save as PDF (manual)
function printReport() {
  const content = document.getElementById("reportContent");
  content.style.background = "white";
  content.style.padding = "20px";
  content.style.width = "800px";

  html2canvas(content, { scale: 2, useCORS: true }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("report_card.pdf");
  });
}

// Send email with PDF link
function sendEmail() {
  const studentName = document.getElementById("studentName").value;
  const parentEmail = document.getElementById("parentEmail").value;
  const schoolName = document.getElementById("schoolName").value;
  const pdfLink = document.getElementById("pdfLink").value;

  if (!pdfLink || !parentEmail) {
    alert("Please enter both parent email and paste the PDF link.");
    return;
  }

  emailjs.send("service_cb7w64g", "template_wy53mpx", {
    to_email: parentEmail,
    student_name: studentName,
    school_name: schoolName,
    pdf_link: pdfLink,
  }, "5Fu2RhS8HXgydjmgM")
  .then(() => {
    alert("Email sent to parent successfully!");
  })
  .catch((err) => {
    console.error("Email error:", err);
    alert("Failed to send email.");
  });
}
