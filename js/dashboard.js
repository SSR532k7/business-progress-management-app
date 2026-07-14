requireLogin();

let currentUser = getCurrentUser();  
if (currentUser.role !== "admin" && currentUser.role !== "manager") {
  document.getElementById("nav-builder").style.display = "none";
}

let workflows = getWorkflows();

let myTurn = workflows.filter(function (wf) {
  let currentStep = wf.steps[wf.currentStepIndex];
  return currentStep && currentStep.assignedTo === currentUser.username;
});

let notMyTurn = workflows.filter(function (wf) {
  let currentStep = wf.steps[wf.currentStepIndex];
  return !currentStep || currentStep.assignedTo !== currentUser.username;
});
function renderList(containerId, workflowList, emptyMessage) {
  let container = document.getElementById(containerId);

  if (workflowList.length === 0) {
    container.innerHTML = '<div class="empty-state">' + emptyMessage + '</div>';
    return;
  }

  let canDelete = currentUser.role === "admin" || currentUser.role === "manager";

  let html = "";
  for (let i = 0; i < workflowList.length; i++) {
    let wf = workflowList[i];
    let currentStep = wf.steps[wf.currentStepIndex];
    let statusText = currentStep ? currentStep.status : "completed";

    let progressText = wf.currentStepIndex < wf.steps.length
      ? "Step " + (wf.currentStepIndex + 1) + " of " + wf.steps.length
      : "Finished";

    html += '<div class="card">';
    html += '<div class="card-title-row"><h3>' + wf.title + '</h3>';
    html += '<span class="badge badge-progress">' + statusText + '</span></div>';
    html += '<p class="card-meta">' + progressText + '</p>';
    html += '<a href="workflow.html?id=' + wf.id + '" class="btn btn-secondary">Open</a>';

    if (canDelete) {
      html += ' <button class="btn btn-danger" data-action="delete-workflow" data-id="' + wf.id + '">Delete</button>';
    }

    html += '</div>';
  }

  container.innerHTML = html;
}

document.body.addEventListener("click", function (e) {
  if (e.target.dataset.action === "delete-workflow") {
    let idToDelete = e.target.dataset.id;
    let allWorkflows = getWorkflows();
    let updated = allWorkflows.filter(function (wf) {
      return wf.id !== idToDelete;
    });
    saveWorkflows(updated);
    location.reload();
  }
});

renderList("my-turn-list", myTurn, "Nothing needs your action right now.");
renderList("all-workflows-list", notMyTurn, "No other workflows yet.");
