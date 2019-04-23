window.onload = window.onclick = window.onhashchange = function(){roll();}

demo = [
	['2', 'Coin', false, '[Heads,Tails]'],
	['3', 'D3', false, '3'],
	['4', 'D4', false, '4'],
	['6', 'D6', false, '6'],
	['8', 'D8', false, '8'],
	['10', 'D10', false, '0-9'],
	['12', 'D12', false, '12'],
	['20', 'D20', false, '20'],
	['6x2', 'D6x2', true, '6x2'],
	['20,10', '20,10', true, '20,10'],
	['20|10', '20|10', true, '20|10'],
	['1-100', '1-100', true, '1-100'],
	['A-Z', 'Alphabet', true, 'A-Z'],
	['[5,10,15]', '[5,10,15]', true, '[5,10,15]'],
	['⚅', '⚅', true, '[⚀,⚁,⚂,⚃,⚄,⚅]'],
	['Boggle', 'Boggle', true, '[A,A,E,E,G,N],[A,B,B,J,O,O],[A,C,H,O,P,S],[A,F,F,K,P,S],[A,O,O,T,T,W],[C,I,M,O,T,U],[D,E,I,L,R,X],[D,E,L,R,V,Y],[D,I,S,T,T,Y],[E,E,G,H,N,W],[E,E,I,N,S,U],[E,H,R,T,V,W],[E,I,O,S,S,T],[E,L,R,T,T,Y],[H,I,M,N,U,Qu],[H,L,N,N,R,Z]'],
	['Twister', 'Twister', true, '[Right,Left],[Hand ✋,Foot 🦶],[<span style="color:Green">Green</span>,<span style="color:Gold">Yellow</span>,<span style="color:Blue">Blue</span>,<span style="color:Red">Red</span>]'],
	['Dreidel', 'Dreidel', true, '[נ,ג,ה,ש]']
];

function rand(min, max) {
	return Math.round(Math.random() * (max - min)) + min;
}

function createTray(w) {
	trayElement = document.createElement("div");
	trayElement.className = 'tray';
	trayElement.style.width = w;
	contElement = document.createElement("div");
	contElement.className = 'cont';
	dieElement = document.createElement("div");
	dieElement.className = 'total';
	trayElement.appendChild(dieElement);
	document.body.appendChild(trayElement);
}

function createDie(text, title, alt, link) {
	dieElement = document.createElement("div");
	dieElement.className = 'die' + (alt ? ' alt' : '');
	dieElement.title = title;
	if (link) {
		dieElement.onclick = function(e){window.location = '#' + link;};
	} else {
		dieElement.onclick = function(e){e.stopPropagation();};
	}
	contElement = document.createElement("div");
	contElement.className = 'cont';
	numberElement = document.createElement("div");
	numberElement.className = 'number';
	contElement.appendChild(numberElement);
	dieElement.appendChild(contElement);
	trayElement.appendChild(dieElement);
	numberElement.innerHTML = text;
	numberElement.style.fontSize = 100 / ((numberElement.textContent.length + 1) / 2) + '%';
}

function roll() {
	while (document.body.firstChild) {
		document.body.removeChild(document.body.firstChild);
	}
	if (!document.location.hash) {
		createTray('100%');
		for (i = 0; i < demo.length; i++) {
			createDie(demo[i][0], demo[i][1], demo[i][2], demo[i][3]);
		}
		numberElement = document.createElement("span");
		numberElement.innerHTML += 'Dice';
		numberElement.onclick = function(e){e.stopPropagation();};
		trayElement.firstChild.appendChild(numberElement);
		document.title = 'Dice';
	} else {
		trays = decodeURI(document.location.hash).substr(1).split('|');
		for (t = 0; t < trays.length; t++) {
			createTray(Math.floor(100 / trays.length) + '%');
			if (trays[t] !== '=') {
				dice = trays[t].split(/,(?![^\[]*\])/);
			}
			trayTotal = 0;
			trayMin = 0;
			trayMax = 0;
			trayString = '';
			for (d = 0; d < dice.length; d++) {
				result = 0;
				if (/^.+x\d+$/.test(dice[d])) {
					mult = dice[d].replace(/^.+x(\d+)$/,'$1');
					die = dice[d].replace(/^(.+)x\d+$/,'$1');
				} else {
					mult = 1;
					die = dice[d];
				}
				for (m = 0; m < mult; m++) {
					if(/^\[.+\]$/.test(die)) {
						split = die.replace(/\[(.+)\]/,'$1').split(',');
						min = 1;
						max = split.length;
						result = split[rand(min-1, max-1)];
						if(split.every(function(e){return !isNaN(parseInt(e));})) {
							min = Math.min(...split);
							max = Math.max(...split);
							trayTotal += parseInt(result);
						} else {
							trayString += (trayString ? ' ' : '') + result;
						}
						displayMin = min;
						displayMax = max;
						trayMin += min;
						trayMax += max;
					}
					else if(/.+-.+$/.test(die)) {
						split = die.match(/(.+?)-(.+)/);
						if (/^-?\d+--?\d+$/.test(die)) {
							min = Math.min(split[1], split[2]);
							max = Math.max(split[1], split[2]);
							console.log(min,max);
							displayMin = min;
							displayMax = max;
							result = rand(min, max);
							trayTotal += result;
							trayMin += min;
							trayMax += max;
						}
						else if(/^.-.$/.test(die)) {
							min = Math.min(split[1].charCodeAt(0), split[2].charCodeAt(0));
							max = Math.max(split[1].charCodeAt(0), split[2].charCodeAt(0));
							displayMin = 1;
							displayMax = max - min + 1;
							result = String.fromCharCode(rand(min, max));
							if (!isNaN(result)) {
								trayTotal += parseInt(result);
							} else {
								trayString += (trayString ? ' ' : '') + result;
							}
							trayMin += parseInt(displayMin);
							trayMax += parseInt(displayMax);
						}
					}
					else if(/^-?\d+$/.test(die)) {
						min = Math.min(1 * die/Math.abs(die),die);
						max = Math.max(1 * die/Math.abs(die),die);
						displayMin = min;
						displayMax = max;
						result = rand(min, max);
						trayTotal += result;
						trayMin += parseInt(min);
						trayMax += parseInt(max);
					}
					createDie(
						result,
						displayMin + "-" + displayMax,
						d%2 ? true : false,
						false
					);
				}
			}
			numberElement = document.createElement("span");
			numberElement.onclick = function(e){e.stopPropagation();};
			trayElement.firstChild.appendChild(numberElement);
			if (trayString) {
				if (trayTotal) {
					numberElement.innerHTML += trayTotal;
					numberElement.innerHTML += ' ';
				}
				numberElement.innerHTML += trayString;
			} else {
				numberElement.innerHTML += trayTotal;
			}
			numberElement.title = trayMin + '-' + trayMax;
		}
		document.title = 'Dice ' + decodeURI(document.location.hash.substr(1));
	}
}
