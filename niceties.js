_private = {};

function getSectionNumber() {
	if (!_private.sectionNumber) {
		_private.sectionNumber = getComputedStyle(document.documentElement)?.getPropertyValue('--section-number')?.trim()?.replace(/"/g, '');
	}

	return _private.sectionNumber;
}

function getDetailsKey(detailsItem) {
	if (detailsItem.hasAttribute('id')) {
		return `${getSectionNumber()}-${detailsItem.getAttribute('id')}`;
	}

	let summary = detailsItem.querySelector('summary');
	if (!summary) {
		return null;
	}

	return `${getSectionNumber()}-${summary.textContent}`;
}

function onToggleDetails(event) {
	let detailsItem = event.target;

	let key = getDetailsKey(detailsItem);
	if (!key) {
		return;
	}

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
		let key = getDetailsKey(detailsItem);
		if (!key) {
			continue;
		}
		
		if (localStorage[key]) {
			detailsItem.setAttribute('open', 'open');
		}

		detailsItem.addEventListener('toggle', onToggleDetails);
	}

	let readingExercises = document.querySelectorAll('.reading-exercise');
	for (let i = 0; i < readingExercises.length; ++i) {
		readingExercises[i].style.setProperty('--reading-exercise-number', `" ${sectionNumber}.${i + 1}"`);
	}
});