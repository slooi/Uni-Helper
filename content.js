(function () {
	// ###################
	// 	CONSTANTS
	// ###################

	const location = window.location.href;
	const startDate = new Date("03-1-2021"); //!@#!@#!@# CHANGE THIS WHENEVER YOU START A NEW SEMESTER!!!

	// ###################
	//	When extension button pressed
	// ###################
	chrome.runtime.onMessage.addListener((req) => {
		const startLength = location.match("courses/").index + 8;
		const linkNumber = location.substr(startLength, 5);
		const videoPageHref = location
			.replace("canvas", "learningtools")
			.replace(/courses(.*)/, `ltr/home/index/${linkNumber}`);
		window.location = videoPageHref;
	});

	// ######################
	//		RECORDINGS PAGE  (external site)
	// ######################
	window.addEventListener("load", (e) => {
		if (location.includes("ltr")) {
			onRecordingPage();
		}
	});

	function onRecordingPage() {
		modiySite(createTable());
	}

	function modiySite(newContent) {
		let recordings_wrapper = document.getElementById("recordings_wrapper");
		recordings_wrapper.innerHTML =
			newContent + recordings_wrapper.innerHTML;
	}

	function createTable() {
		const allLectureData = new Array(getWeek(0))
			.fill(0)
			.map((e) => new Array(7).fill(0).map((e) => new Array()));
		const length = recordings.children[1].children.length;
		for (let i = length - 1; i >= 0; i--) {
			const lectureData = getLectureData(i);
			const week = lectureData[2] - 1;
			const day = lectureData[1];
			allLectureData[week][day].push(lectureData);
		}
		var table = `
			<h1>${getClass(0)}</h1>
			<table style="border:1px solid black;border-collapse:collapse;width:100%;">
				<tbody>

				<tr>
					<td style="border:1px solid black;"><b></b></td>
					<td style="border:1px solid black;"><b>Monday</b></td>
					<td style="border:1px solid black;"><b>Tuesday</b></td>
					<td style="border:1px solid black;"><b>Wednesday</b></td>
					<td style="border:1px solid black;"><b>Thursday</b></td>
					<td style="border:1px solid black;"><b>Friday</b></td>
					<td style="border:1px solid black;"><b>Saturday</b></td>
					<td style="border:1px solid black;"><b>Sunday</b></td>
				</tr>
				`;
		for (let i = allLectureData.length - 1; i >= 0; i--) {
			table += `<tr><td style="border: 1px solid black;width:3%">Week ${
				i + 1
			}</td>`;
			for (let j = 1; j < 7; j++) {
				table += createDayBlock(allLectureData[i][j], j);
			}
			table += createDayBlock(allLectureData[i][0], 0);
			table += `</tr>`;
		}
		table += `
				</tbody>
			</table>
		`;
		return table;
	}

	function createDayBlock(lectureDataList, day) {
		// 0 - Sunday, 1 - monday, 6 - saturday
		var dayBlock = `<td style="border: 1px solid black;width:`;
		if (day === 0 || day === 6) {
			dayBlock += `1%;">`;
		} else {
			dayBlock += `14%;">`;
		}

		for (let i = 0; i < lectureDataList.length; i++) {
			dayBlock += createLectureBlock(lectureDataList[i]);
		}
		dayBlock += `</td>`;

		return dayBlock;
	}

	function createLectureBlock(lectureData) {
		return `<div style="display:inline-block">
		<p style="margin:0"><a href="${lectureData[4]}">${lectureData[0]}</a></p>
		<p style="margin:0"><b>W</b> ${lectureData[2]} <b>D</b> ${lectureData[1]}</p>
		<p style="margin:0">${lectureData[5]}</p>
		<p style="margin:0">download | <a href="${lectureData[3]}"> watch</a></p>
		<p style="margin:0">_________</p>
		</div>`;
	}

	// ######################
	// DATA FETCHING

	function getLectureData(i) {
		// name
		return [
			getName(i),
			getDay(i),
			getWeek(i),
			getWatch(i),
			getDownload(i),
			getTime(i),
		];
	}

	function getName(i) {
		return recordings.children[1].children[i].children[0].children[1]
			.innerText;
		// return recordings.children[1].children[i].children[1].innerText;
	}
	function getDate(i) {
		const rawDate = recordings.children[1].children[
			i
		].children[1].innerText.split(" ")[0];
		const realDate = new Date(
			rawDate.substr(3, 2) +
				-+rawDate.substr(0, 2) +
				-+rawDate.substr(6, 4)
		);
		return realDate;
	}
	function getTime(i) {
		// return recordings.children[1].children[i].children[2].innerText.split(
		// 	" "
		// )[1];
		return recordings.children[1].children[i].children[1].innerText;
	}
	function getDay(i) {
		// return: 0 - sunday, 1 - monday, 6 - saturday
		return getDate(i).getDay();
	}
	function getClass(i) {
		return recordings.children[1].children[i].children[4].innerText.replace(
			/Lecture(.*)/,
			""
		);
	}
	function getWeek(i) {
		// return: 1 - for the first week, 2 - for the second week. NOT zero indexed
		const diff = getDate(i) - startDate;
		const days = diff / 1000 / 60 / 60 / 24;
		const adjustmentOnNonMondays = startDate.getDay() - 1; // Eg: If classes start on a wednesday
		return Math.floor((days + adjustmentOnNonMondays) / 7) + 1;
	}
	function getWatch(i) {
		// This is the preview video href
		// Example: https://mediastore.auckland.ac.nz/2021/1210/COMPSCI130L01C/1581611/1b0d6a/202101081000.LT347592.REV1.preview
		return recordings.children[1].children[i].children[0].children[0].href;
	}
	function getDownload(i) {
		// This is the download href
		// Example: https://mediastore.auckland.ac.nz/2021/1210/COMPSCI130L01C/1581611/1b0d6a/202101081000.LT347592.REV1-slides.m4v
		return recordings.children[1].children[i].children[4].children[1].href;
	}
})();
