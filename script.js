// ✅ Initialize EmailJS with your public key
emailjs.init("5Fu2RhS8HXgydjmgM"); // Replace with your public key

// ✅ Handle form submission
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const logoInput = document.getElementById("schoolLogo");
  const logoFile = logoInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const logoDataUrl = e.target.result;
    generateReport(logoDataUrl);
  };

  if (logoFile) {
    reader.readAsDataURL(logoFile);
  } else {
    generateReport(null); // No logo uploaded
  }
});

// ✅ Build the report card HTML
function generateReport(logoUrl) {
  const school = document.getElementById("schoolName").value;
  const session = document.getElementById("session").value;
  const term = document.getElementById("term").value;
  const name = document.getElementById("studentName").value;
  const sClass = document.getElementById("studentClass").value;
  const age = document.getElementById("age").value;
  const behavior = document.getElementById("behavior").value;
  const teacherComment = document.getElementById("teacherComment").value;
  const headComment = document.getElementById("headComment").value;

  const rows = document.querySelectorAll("#subjectTable tr");
  let totalScore = 0;
  let subjectCount = 0;

  let tableRows = "";

  rows.forEach((row) => {
    const subject = row.children[0].firstElementChild.value;
    const ca1 = parseInt(row.children[1].firstElementChild.value) || 0;
    const ca2 = parseInt(row.children[2].firstElementChild.value) || 0;
    const exam = parseInt(row.children[3].firstElementChild.value) || 0;
    const total = ca1 + ca2 + exam;
    const grade = getGrade(total);
    const comment = getComment(grade);

    totalScore += total;
    subjectCount++;

    tableRows += `
      <tr>
        <td>${subject}</td><td>${ca1}</td><td>${ca2}</td><td>${exam}</td>
        <td>${total}</td><td>${grade}</td><td>${comment}</td>
      </tr>`;
  });

  const avg = (totalScore / subjectCount).toFixed(2);

  const logoImg = logoUrl
    ? `<img src="${logoUrl}" alt="School Logo" class="w-16 h-16 mb-2 mx-auto" />`
    : "";

  const report = `
    <div class="text-center mb-4">
      ${logoImg}
      <h2 class="text-lg font-bold">${school}</h2>
      <p><strong>Session:</strong> ${session} | <strong>Term:</strong> ${term}</p>
      <p><strong>Name:</strong> ${name} | <strong>Class:</strong> ${sClass} | <strong>Age:</strong> ${age}</p>
    </div>

    <table class="w-full border text-center mb-4 text-xs sm:text-sm">
      <thead class="bg-gray-300">
        <tr><th>Subject</th><th>CA1</th><th>CA2</th><th>Exam</th><th>Total</th><th>Grade</th><th>Comment</th></tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>

    <p><strong>Total Score:</strong> ${totalScore}</p>
    <p><strong>Average:</strong> ${avg}</p>
    <p><strong>Behavior Ratings:</strong> ${behavior}</p>
    <p><strong>Teacher’s Comment:</strong> ${teacherComment}</p>
    <p><strong>Headteacher’s Comment:</strong> ${headComment}</p>
  `;

  document.getElementById("reportContent").innerHTML = report;
  document.getElementById("reportCard").classList.remove("hidden");
}

// ✅ Grade logic
function getGrade(score) {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}

function getComment(grade) {
  return {
    A: "Excellent",
    B: "Very Good",
    C: "Good",
    D: "Needs Support",
    F: "Poor",
  }[grade];
}

// ✅ Add more subjects
function addSubjectRow() {
  const table = document.getElementById("subjectTable");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input class="w-full p-1 border" value="" /></td>
    <td><input class="w-full p-1 border" type="number" /></td>
    <td><input class="w-full p-1 border" type="number" /></td>
    <td><input class="w-full p-1 border" type="number" /></td>`;
  table.appendChild(row);
}

// ✅ Save as PDF
function printReport() {
  const report = document.getElementById("reportContent");
  const opt = {
    margin: 0.5,
    filename: 'report_card.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {},
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(report).set(opt).save();
}
function sendEmail() {
  const email = document.getElementById("parentEmail").value;
  const school = document.getElementById("schoolName").value;
  const name = document.getElementById("studentName").value;
  const sClass = document.getElementById("studentClass").value;
  const avgScore = document.querySelector("#reportContent").innerHTML.match(/Average:<\/strong>\s*(\d+\.?\d*)/);
  const avg = avgScore ? avgScore[1] : "N/A";
  const teacherComment = document.getElementById("teacherComment").value;
  const pdfLink = document.getElementById("pdfLink").value;

  const summaryHTML = `
    <p><strong>Student:</strong> ${name}</p>
    <p><strong>Class:</strong> ${sClass}</p>
    <p><strong>Average:</strong> ${avg}</p>
    <p><strong>Teacher's Comment:</strong> ${teacherComment}</p>
    ${pdfLink ? `<p><strong>Download Report:</strong> <a href="${pdfLink}" target="_blank">Click here</a></p>` : ""}
  `;

  emailjs.send("service_cb7w64g", "template_wy53mpx", {
    report_card_html: summaryHTML,
    school_name: school,
    to_email: email,
  })
  .then(() => alert("Email sent successfully!"))
  .catch((err) => {
    console.error("Email error:", err);
    alert("Failed to send summary. Please try again.");
  });
}

  