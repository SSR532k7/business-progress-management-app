requireLogin();
let steps = [];



let currentUser = getCurrentUser();
if (currentUser.role !== "admin" && currentUser.role !== "manager") {
  window.location.href = "dashboard.html";
}

function renderSteps() {
  let container = document.getElementById("steps-list");

  if (steps.length === 0) {
    container.innerHTML = '<div class="empty-state">No steps yet. Add the first one below.</div>';
    return;
  }

  let html = "";
  for (let i = 0; i < steps.length; i++) {
    html += '<div class="step-row">';
    html += '<span class="step-index">' + (i + 1) + '</span>';
    html += '<input type="text" class="step-assignee" placeholder="username" value="' + steps[i].assignedTo + '" data-index="' + i + '">';
    html += '<div class="step-actions">';
    html += '<button class="btn btn-danger btn-icon" data-action="remove" data-index="' + i + '">✕</button>';
    html += '</div></div>';
  }

  container.innerHTML = html;
}

document.getElementById("steps-list").addEventListener("input", function (e) {
  if (e.target.classList.contains("step-assignee")) {
    let index = parseInt(e.target.dataset.index);
    steps[index].assignedTo = e.target.value;
  }
});


document.getElementById("add-step-btn").addEventListener("click", function () {
  steps.push({ assignedTo: "", data: "", status: "pending" });
  renderSteps(); // we'll write this function next
});

document.getElementById("steps-list").addEventListener("click", function (e) {
  if (e.target.dataset.action === "remove") {
    let index = parseInt(e.target.dataset.index);
    steps.splice(index, 1);
    renderSteps();
  }
});

document.getElementById("save-workflow-btn").addEventListener("click", function () {
  let title = document.getElementById("workflow-title").value;

  let newWorkflow = {
    id: crypto.randomUUID(),
    title: title,
    currentStepIndex: 0,
    steps: steps
  };

  let allWorkflows = getWorkflows();
  allWorkflows.push(newWorkflow);
  saveWorkflows(allWorkflows);

  window.location.href = "dashboard.html";
});



renderSteps();