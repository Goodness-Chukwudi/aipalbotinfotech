const submitBtn = document.querySelector("#submitMail");
const senderName = document.querySelector("#senderName");
const senderEmail = document.querySelector("#senderEmail");
const title = document.querySelector("#title");
const message = document.querySelector("#message");

submitBtn.addEventListener("click", sendMail);

function sendMail(e) {
	axios
		.post("https://aipalbotinfotech.herokuapp.com/contact", {
			sender: senderName.value,
			email: senderEmail.value,
			title: title.value,
			message: message.value,
		})
		.then((response) => {
			clearField();
			const parentEl = document.querySelector("#mail-fieldset");
			alert(response.data, "success", parentEl, submitBtn.parentElement);
		})
		.catch((error) => {
			if (error.response) {
				const parentEl = document.querySelector("#mail-fieldset");
				alert(
					error.response.data,
					"warning",
					parentEl,
					submitBtn.parentElement
				);
			} else if (error.request) {
				const parentEl = document.querySelector("#mail-fieldset");
				alert(
					error.message,
					"warning",
					parentEl,
					submitBtn.parentElement
				);
			} else {
				console.log("Error", error.message);
			}
		});
	e.preventDefault();
}

function alert(msg, type, parentEl, RefChild) {
	const color = type == "warning" ? "danger" : "success";
	const alertDiv = document.createElement("div");
	alertDiv.classList += `alert-${color} text-center h5 py-2 alertDiv`;
	alertDiv.textContent = msg;
	parentEl.insertBefore(alertDiv, RefChild);

	setTimeout(removeAlert, 5000);
}

function removeAlert() {
	const alertDiv = document.querySelector(".alertDiv");
	if (alertDiv) {
		alertDiv.remove();
	}
}

function clearField() {
	senderName.value = "";
	senderEmail.value = "";
	title.value = "";
	message.value = "";
}
