
emailjs.init("5Fu2RhS8HXgydjmgM"); // Replace with your user ID

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

document.getElementById("reportForm").addEventListener("submit", function(e) {
  e.preventDefault();
  generateReport();
});

function generateReport() {
  const name = document.getElementById("studentName").value;
  const sClass = document.getElementById("studentClass").value;
  const age = document.getElementById("age").value;
  const behavior = document.getElementById("behavior").value;
  const term = document.getElementById("term").value;
  const session = document.getElementById("session").value;
  const school = document.getElementById("schoolName").value;
  const teacherComment = document.getElementById("teacherComment").value;
  const headComment = document.getElementById("headComment").value;

  const table = document.getElementById("subjectTable");
  let rows = "";
  let total = 0;
  let count = 0;

  for (let i = 0; i < table.rows.length; i++) {
    const cells = table.rows[i].cells;
    const subject = cells[0].querySelector("input").value;
    const ca1 = parseFloat(cells[1].querySelector("input").value) || 0;
    const ca2 = parseFloat(cells[2].querySelector("input").value) || 0;
    const exam = parseFloat(cells[3].querySelector("input").value) || 0;
    const totalScore = ca1 + ca2 + exam;
    const grade = totalScore >= 70 ? "A" : totalScore >= 60 ? "B" : totalScore >= 50 ? "C" : "F";
    total += totalScore;
    count++;
    rows += `<tr><td>${subject}</td><td>${ca1}</td><td>${ca2}</td><td>${exam}</td><td>${totalScore}</td><td>${grade}</td></tr>`;
  }

  const avg = (total / count).toFixed(2);
  const reportHTML = `
    <h2 class="text-center font-bold text-lg">${school} - Report Card</h2>
    <p><strong>Student Name:</strong> ${name}</p>
    <p><strong>Class:</strong> ${sClass}</p>
    <p><strong>Age:</strong> ${age}</p>
    <p><strong>Term:</strong> ${term}</p>
    <p><strong>Session:</strong> ${session}</p>
    <table border="1" class="w-full text-sm mt-2">
      <tr><th>Subject</th><th>CA1</th><th>CA2</th><th>Exam</th><th>Total</th><th>Grade</th></tr>
      ${rows}
    </table>
    <p><strong>Average:</strong> ${avg}</p>
    <p><strong>Behavior:</strong> ${behavior}</p>
    <p><strong>Teacher's Comment:</strong> ${teacherComment}</p>
    <p><strong>Headteacher's Comment:</strong> ${headComment}</p>
  `;

  document.getElementById("reportCard").classList.remove("hidden");
  document.getElementById("reportContent").innerHTML = reportHTML;
}
function printReport() {
  const content = document.getElementById("reportContent");

  // Temporarily apply fixed width & background to ensure it renders properly in canvas
  const originalStyle = content.getAttribute("style") || "";
  content.setAttribute("style", originalStyle + " background: white; padding: 20px; width: 800px;");

  // Give the browser a moment to render styles
  setTimeout(() => {
    html2canvas(content, {
      scale: 2,
      useCORS: true,
      allowTaint: false
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'pt', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("report_card.pdf");

      // Reset style
      content.setAttribute("style", originalStyle);
    });
  }, 500);
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
