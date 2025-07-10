(function () {
  emailjs.init("5Fu2RhS8HXgydjmgM"); // 🔁 Replace with your actual public key from EmailJS
})();

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

document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const reportContent = document.getElementById("reportContent");
  const schoolLogo = document.getElementById("schoolLogo").files[0];
  let logoImgHTML = "";

  if (schoolLogo) {
    const logoURL = URL.createObjectURL(schoolLogo);
    logoImgHTML = `<img src="${logoURL}" class="mx-auto mb-4 h-20" alt="Logo" />`;
  }

  const schoolName = document.getElementById("schoolName").value;
  const session = document.getElementById("session").value;
  const term = document.getElementById("term").value;
  const studentName = document.getElementById("studentName").value;
  const studentClass = document.getElementById("studentClass").value;
  const age = document.getElementById("age").value;
  const behavior = document.getElementById("behavior").value;
  const headComment = document.getElementById("headComment").value;
  const driveLink = document.getElementById("pdfLink").value;

  const table = document.getElementById("subjectTable");
  let subjectsHTML = `<table class="w-full border text-sm mb-4">
    <thead><tr>
      <th>Subject</th><th>CA1</th><th>CA2</th><th>Exam</th><th>Total</th><th>Grade</th>
    </tr></thead><tbody>`;

  let totalScoreSum = 0;
  let subjectCount = 0;

  for (let i = 0; i < table.rows.length; i++) {
    const cells = table.rows[i].cells;
    const subject = cells[0].querySelector("input").value;
    const ca1 = Number(cells[1].querySelector("input").value);
    const ca2 = Number(cells[2].querySelector("input").value);
    const exam = Number(cells[3].querySelector("input").value);
    const total = ca1 + ca2 + exam;

    let grade = "", color = "";
    if (total >= 70) { grade = "A"; color = "text-green-600 font-bold"; }
    else if (total >= 60) { grade = "B"; color = "text-blue-600 font-bold"; }
    else if (total >= 50) { grade = "C"; color = "text-yellow-600 font-bold"; }
    else if (total >= 45) { grade = "D"; color = "text-orange-600 font-bold"; }
    else { grade = "F"; color = "text-red-600 font-bold"; }

    totalScoreSum += total;
    subjectCount++;

    subjectsHTML += `<tr>
      <td>${subject}</td><td>${ca1}</td><td>${ca2}</td><td>${exam}</td><td>${total}</td>
      <td class="${color}">${grade}</td>
    </tr>`;
  }

  const averageScore = (totalScoreSum / subjectCount).toFixed(1);

  let autoComment = "";
  if (averageScore >= 85) autoComment = "Excellent performance. Keep it up!";
  else if (averageScore >= 70) autoComment = "Very good. Shows great understanding.";
  else if (averageScore >= 50) autoComment = "Fair effort. Can do better with guidance.";
  else if (averageScore >= 40) autoComment = "Needs to improve in key areas.";
  else autoComment = "Serious improvement is required.";

  // Pre-fill the teacher comment box
  document.getElementById("teacherComment").value = autoComment;
  const teacherComment = document.getElementById("teacherComment").value;

  subjectsHTML += `</tbody></table>
    <p><strong>Overall Average:</strong> ${averageScore}%</p>
    <p><strong>Suggested Teacher's Comment:</strong> ${autoComment}</p>`;

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

function printReport() {
  const content = document.getElementById("reportContent");
  html2canvas(content, { scale: 2, useCORS: true }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("p", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("report_card.pdf");
  });
}

function sendEmail() {
  const parentEmail = document.getElementById("parentEmail").value;
  const studentName = document.getElementById("studentName").value;
  const schoolName = document.getElementById("schoolName").value;
  const driveLink = document.getElementById("pdfLink").value;

  if (!driveLink.startsWith("http")) {
    alert("Please paste a valid Google Drive link.");
    return;
  }

  emailjs.send("service_cb7w64g", "template_wy53mpx", {
    to_email: parentEmail,
    student_name: studentName,
    school_name: schoolName,
    report_link: driveLink
  }).then(() => {
    alert("Email sent to parent!");
  }).catch((error) => {
    console.error("Email error:", error);
    alert("Failed to send email.");
  });
}
