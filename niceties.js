_private = {};

function getSectionNumber() {
	if (!_private.sectionNumber) {
		_private.sectionNumber = getComputedStyle(document.documentElement).getPropertyValue('--section-number');
	}

	return _private.sectionNumber;
}

function onToggleDetails(event) {
	let detailsItem = event.target;
	let summary = detailsItem.querySelector('summary');
	if (!summary) {
		return;
	}

	let key = `${getSectionNumber()}-${summary.textContent}`;
	if (detailsItem.hasAttribute('open')) {
		localStorage[key] = true;
	} else {
		delete localStorage[key];
	}
}

document.addEventListener('DOMContentLoaded', function () {
	let sectionNumber = getSectionNumber();

	let detailsList = document.querySelectorAll('details');
	for (let detailsItem of detailsList) {
		let summary = detailsItem.querySelector('summary');
		if (!summary) {
			continue;
		}

		let key = `${sectionNumber}-${summary.textContent}`;
		if (localStorage[key]) {
			detailsItem.setAttribute('open', 'open');
		}

		detailsItem.addEventListener('toggle', onToggleDetails);
	}



});