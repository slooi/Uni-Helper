

(function(){

	// ###################
	// 	CONSTANTS
	// ###################
	
	const location = window.location.href
	const startDate = new Date('03-2-2020')
	const allLectureData = []
	
	// ###################
	// 
	// ###################
	chrome.runtime.onMessage.addListener(req=>{
		const startLength = location.match('courses/').index+8
		const linkNumber = location.substr(startLength,5)
		const videoPageHref = location.replace('canvas','learningtools').replace(/courses(.*)/,`ltr/home/index/${linkNumber}`)
		window.location=videoPageHref
	})
	
	
	// ######################
	//		RECORDING PAGE  (external site)
	// ######################
	onRecordingPage()
	function onRecordingPage(){
		if(location.includes('ltr')){
			modiySite(createTable())
		}
	}
	
	
	function modiySite(newContent){
		let recordings_wrapper = document.getElementById('recordings_wrapper')
		recordings_wrapper.innerHTML = newContent + recordings_wrapper.innerHTML
	}
	
	function createTable(){
		const length = recordings.children[1].children.length
		for(let i=length-1;i>=0;i--){
			allLectureData[i] = getLectureData(i)
		}
		var table = `
			<h1>${getClass(0)}</h1>
			<table style="border:1px solid black;border-collapse:collapse;width:100%;">
				<tbody>

				<tr>
					<td style="border:1px solid black;"><b>Monday</b></td>
					<td style="border:1px solid black;"><b>Tuesday</b></td>
					<td style="border:1px solid black;"><b>Wednesday</b></td>
					<td style="border:1px solid black;"><b>Thursday</b></td>
					<td style="border:1px solid black;"><b>Friday</b></td>
					<td style="border:1px solid black;"><b>Saturday</b></td>
					<td style="border:1px solid black;"><b>Sunday</b></td>
				</tr>
				`
				for(let i=0;i<length;i++){
					table+=`
					<tr>
						${createDayBlock(1,i)}
						${createDayBlock(2,i)}
						${createDayBlock(3,i)}
						${createDayBlock(4,i)}
						${createDayBlock(5,i)}
						${createDayBlock(6,i)}
						${createDayBlock(0,i)}
					</tr>
					`
				}
				table+=	`
				</tbody>
			</table>
		`    
		return table
	}
	
	function createDayBlock(day,i){
		// 0 - Sunday, 1 - monday, 6 - saturday
		var dayBlock = `<td style="border: 1px solid black;width:14%;">`
		if(allLectureData[i][1]===day){
			dayBlock+=createLectureBlock(allLectureData[i])
		}
		dayBlock+=`</td>`
		
		return dayBlock
	}
	
	function createLectureBlock(lectureData){
		return `<div style="display:inline-block">
		<p style="margin:0">${lectureData[0]}</p>
		<p style="margin:0"><b>W</b> ${lectureData[2]}</p>
		<p style="margin:0">${lectureData[5]}</p>
		</div>`
	}
	
	// ######################
	// DATA FETCHING
	
	function getLectureData(i){
		// name 
		return [getName(i),getDay(i),getWeek(i),getWatch(i),getDownload(i),getTime(i)]
	}
	
	function getName(i){
		return recordings.children[1].children[i].children[1].innerText
	}
	function getDate(i){
		const rawDate = recordings.children[1].children[i].children[2].innerText.split(" ")[0]
		const realDate = new Date(rawDate.substr(3,2)+-+rawDate.substr(0,2)+-+rawDate.substr(6,4))
		return realDate
	}
	function getTime(i){
		return recordings.children[1].children[i].children[2].innerText.split(" ")[1]
	}
	function getDay(i){
		return getDate(i).getDay()
	}
	function getClass(i){
		return recordings.children[1].children[i].children[4].innerText.replace(/Lecture(.*)/,'')
	}
	function getWeek(i){
		const diff = getDate(i) - startDate
		const days = diff/1000/60/60/24
		return Math.floor(days/7) + 1
	}
	function getWatch(i){
		return recordings.children[1].children[i].children[5].children[0].href
	}
	function getDownload(i){
		return recordings.children[1].children[i].children[5].children[3].children[0].href
	}
	
	})()
