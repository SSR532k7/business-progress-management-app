requireLogin();

let currentUser = getCurrentUser();

let urlParams = new URLSearchParams(window.location.search);
let workflowId = urlParams.get("id");

let workflows = getWorkflows();
let workflow = workflows.find(function (wf) {
  return wf.id === workflowId;
});

function renderStepTrail() {
  let container = document.getElementById("step-trail");
  let html = "";

  for (let i = 0; i < workflow.steps.length; i++) {
    let step = workflow.steps[i];
    let badgeClass = "badge-pending";
    if (step.status === "completed") badgeClass = "badge-completed";
    if (i === workflow.currentStepIndex) badgeClass = "badge-progress";

    html += '<span class="badge ' + badgeClass + '">Step ' + (i + 1) + ': ' + step.assignedTo + '</span> ';
  }

  container.innerHTML = html;
}

function renderCurrentStep() {

   if (workflow.currentStepIndex >= workflow.steps.length) {
    document.getElementById("current-step-card").innerHTML = '<div class="empty-state">This workflow is complete.</div>';
    return;
  }

  let currentStep = workflow.steps[workflow.currentStepIndex];

  document.getElementById("workflow-title").textContent = workflow.title;
  document.getElementById("current-step-label").textContent = "Step " + (workflow.currentStepIndex + 1);
  document.getElementById("current-step-assignee").textContent = "Assigned to: " + currentStep.assignedTo;
  document.getElementById("step-data").value = currentStep.data;

  let isMyStep = currentStep.assignedTo === currentUser.username;

  if (isMyStep) {
    document.getElementById("step-data").disabled = false;
    document.getElementById("step-actions").style.display = "flex";
    document.getElementById("readonly-note").style.display = "none";
  } else {
    document.getElementById("step-data").disabled = true;
    document.getElementById("step-actions").style.display = "none";
    document.getElementById("readonly-note").style.display = "block";
  }
}


function advanceWorkflow(newData) {
  let currentStep = workflow.steps[workflow.currentStepIndex];
  currentStep.data = newData;
  currentStep.status = "completed";

  workflow.currentStepIndex = workflow.currentStepIndex + 1;

  let nextStep = workflow.steps[workflow.currentStepIndex];
  if (nextStep) {
    nextStep.data = newData;
  }

  let allWorkflows = getWorkflows();
  let index = allWorkflows.findIndex(function (wf) {
    return wf.id === workflow.id;
  });
  allWorkflows[index] = workflow;
  saveWorkflows(allWorkflows);

  renderStepTrail();
  renderCurrentStep();
}

document.getElementById("send-next-btn").addEventListener("click", function () {
  let newText = document.getElementById("step-data").value;
  advanceWorkflow(newText);
});

document.getElementById("keep-same-btn").addEventListener("click", function () {
  let currentStep = workflow.steps[workflow.currentStepIndex];
  advanceWorkflow(currentStep.data);
});

renderStepTrail();
renderCurrentStep();