var LG_TV = {

	// Constants
	JOINSTART:		0,

	// Startup calls this function, defined by last line in the script
	setup: function() {
		try {
			LG_TV.log("Object Created");
			CF.watch(CF.FeedbackMatchedEvent, "LG_TV", "LG_Feedback", LG_TV.ProcessLGFeedback);
			CF.watch(CF.ConnectionStatusChangeEvent, "LG_TV", LG_TV.onConnectionChange, false);

			CF.getJoin(CF.GlobalTokensJoin, function(j, v, t) {
				if (t.LGTV_JOIN === undefined) {
				   LG_TV.log("The LGTV_JOIN global token is not defined");
				} else {
				   LG_TV.JOINSTART = parseInt(t.LGTV_JOIN);
				   LG_TV.log("JOIN START = " + LG_TV.JOINSTART);
				}
			});
		} catch (e) {
			LG_TV.log("Exception caught during init: " + e);
		}
	},

	// ======================================================================
	//  Handle Connections/Disconnections
	// ======================================================================
	onConnectionChange: function (system, connected, remote) {
		if (connected) {
			// Connection established
			LG_TV.log("Connected!");
			LG_TV.Initialize();
		} else {
			// Connection lost
			LG_TV.log("Disconnected!!");
		}
	},


	//////////////////////////////
	// INFRARED COMMAND SECTION //
	//////////////////////////////

	// INFRARED COMMANDS:
	// EXAMPLE LG_TV.sendIR("Channel Up");
	// INFRARED COMMAND HAS THE FOLLOWING FORMAT:
	// [MC] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [C] [00] [OK] [XX]x WHERE XX IS THE COMMAND CODE SENT
	// RS232 ACK FAILURE RESPONSE FORMAT: [C] [00] [NG] [XX]x WHERE XX IS THE COMMAND CODE SENT
	// UNFORTUNATELY THE HIGH BIT OF THE COMMAND CODE SENT IS NOT RETURNED IN THE ACK RESPONSE
	// ONLY THE LOW BIT IS IS SENT.  THIS MAKES IR ACK RESPONSES LOOK THE SAME AS RS232 RATIO
	// COMMAND ACK RESPONSES.
	IR: {
		'channel up' : "00",
		'channel down' : "01",
		'volume up' : "02",
		'volume down' : "03",
		'power toggle' : "08",
		'mute/delete' : "09",
		'input toggle' : "0B",
		'tv' : "0F",
		'0' : "10",
		'1' : "11",
   		'2' : "12",
   		'3' : "13",
   		'4' : "14",
   		'5' : "15",
   		'6' : "16",
   		'7' : "17",
   		'8' : "18",
   		'9' : "19",
   		'flashback' : "1A",
   		'favorite/mark' : "1E",
   		'back' : "28",
   		'av mode' : "30",
   		'up' : "40",
   		'down' : "41",
   		'right' : "06",
   		'left' : "07",
   		'menu' : "43",
   		'enter' : "44",
   		'q menu' : "45",
   		'-' : "4C",
   		'list' : "53",
   		'exit' : "5B",
   		'widgets' : "58",
   		'netcast' : "59",
   		'blue' : "61",
   		'yellow' : "63",
   		'green' : "71",
   		'red' : "72",
   		'ratio toggle' : "79",
   		'simplink' : "7E",
   		'forward' : "8E",
   		'rewind' : "8F",
   		'energy saving' : "95",
   		'info' : "AA",
   		'play' : "B0",
   		'stop' : "B1",
   		'pause' : "BA",
   		'input tv' : "D6",
   		'power on' : "C4",
   		'power off' : "C5",
   		'input av1' : "5A",
   		'input av2' : "D0",
   		'input component1' : "BF",
   		'input component2' : "D4",
   		'input rgbpc' : "D5",
   		'input hdmi1' : "CE",
   		'input hdmi2' : "CC",
   		'input hdmi3' : "E9",
   		'input hdmi4' : "DA",
   		'ratio 4:3' : "76",
   		'ratio 16:9' : "77",
   		'zoom' : "AF",
   		'3d' : "DC",
   		'guide' : "AB",
   		'text' : "20",
   		'toption' : "21",
   		'subtitle' : "39"
	},

	sendIR: function(infrared) {
		LG_TV.sendCommand('mc 00 ' + LG_TV.IR[infrared.toLowerCase()]);
		// WE HAVE TO GET THE STATUS OF THE RATIO WITH THE RS232 COMMAND
		// AFTER CALLING THE SENDIR COMMAND BECAUSE OF THE OVERLAP OF THE LOW
		// BIT OF THE COMMAND BEING THE SAME.  IT'S A KLUDGE FIX
		//LG_TV.getRatio();
	},
	/////////////////////////////////////////////////


	////////////////////////////
	// RS232 COMMANDS SECTION //
	////////////////////////////

	// SCREEN RATIO
	// EXAMPLE LG_TV.setRatio("4:3");
	// RS232 COMMAND HAS THE FOLLOWING FORMAT:
	// [KC] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [C] [00] [OK] [XX]x WHERE XX IS THE CURRENT STATUS
	// RS232 ACK FAILURE RESPONSE FORMAT: [C] [00] [NG] [XX]x WHERE XX IS THE CODE SENT
	// UNFORTUNATELY THE HIGH BIT OF THE COMMAND CODE SENT IS NOT RETURNED IN THE ACK RESPONSE
	// ONLY THE LOW BIT IS IS SENT.  THIS MAKES RS232 RATIO ACK RESPONSES LOOK THE SAME AS IR
	// COMMAND ACK RESPONSES.
	Ratio: {
		'4:3' : "01",
		'16:9' : "02",
		'zoom' : "04",
		'program' : "06",
		'14:9' : "07",
		'scan' : "09",
		'full wide' : "0B",
		'cinema zoom 1' : "10",
		'cinema zoom 2' : "11",
		'cinema zoom 3' : "12",
		'cinema zoom 4' : "13",
		'cinema zoom 5' : "14",
		'cinema zoom 6' : "15",
		'cinema zoom 7' : "16",
		'cinema zoom 8' : "17",
		'cinema zoom 9' : "18",
		'cinema zoom 10' : "19",
		'cinema zoom 11' : "1A",
		'cinema zoom 12' : "1B",
		'cinema zoom 13' : "1C",
		'cinema zoom 14' : "1D",
		'cinema zoom 15' : "1E",
		'cinema zoom 16' : "1F"
	},
	setRatio: function(rat) {
		LG_TV.sendCommand('kc 00 ' + LG_TV.Ratio[rat.toLowerCase()]);
	},
	getRatio: function() {
		LG_TV.sendCommand('kc 00 ff');
	},
	/////////////////////////////////////////////////


	// POWER
	// EXAMPLE LG_TV.setPower("on");
	// RS232 COMMAND HAS THE FOLLOWING FORMAT:
	// [KA] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [A] [00] [OK] [XX]x WHERE XX IS PRESENT STATUS
	// RS232 ACK FAILURE RESPONSE FORMAT: [A] [00] [NG] [XX]x WHERE XX IS THE CODE SENT
	// UNFORTUNATELY THE HIGH BIT OF THE COMMAND CODE SENT IS NOT RETURNED IN THE ACK RESPONSE
	// ONLY THE LOW BIT IS IS SENT.  THIS MAKES RS232 POWER ACK RESPONSES LOOK THE SAME AS
	// TUNE COMMAND ACK RESPONSES.
	Power: {
		'off' : "00",
		'on' : "01"
	},
	setPower: function(pwr) {
		LG_TV.sendCommand('ka 00 ' + LG_TV.Power[pwr.toLowerCase()]);
	},
	getPower: function() {
		LG_TV.sendCommand('ka 00 ff');
	},
	/////////////////////////////////////////////////


	// INPUT SELECTION
	// EXAMPLE LG_TV.setInput("HDMI 1");
	// RS232 COMMAND HAS THE FOLLOWING FORMAT:
	// [xb] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [b] [00] [OK] [XX]x WHERE XX IS PRESENT STATUS
	// RS232 ACK FAILURE RESPONSE FORMAT: [b] [00] [NG] [XX]x WHERE XX IS THE CODE SENT
	// UNFORTUNATELY THE HIGH BIT OF THE COMMAND CODE SENT IS NOT RETURNED IN THE ACK RESPONSE
	// ONLY THE LOW BIT IS IS SENT.  THIS MAKES RS232 INPUT ACK RESPONSES LOOK THE SAME AS
	// PROGRAM ADD/SKIP COMMAND ACK RESPONSES.
	Input: {
		'dtv antenna' : "00",
		'dtv cable' : "01",
		'analog antenna' : "10",
		'analog cable' : "11",
		'av 1' : "20",
		'av 2' : "21",
		'component 1' : "40",
		'component 2' : "41",
		'rgb pc' : "60",
		'hdmi 1' : "90",
		'hdmi 2' : "91",
		'hdmi 3' : "92",
		'hdmi 4' : "93"
	},
	setInput: function(source) {
		if (LG_TV.Input[source.toLowerCase()] !== undefined) {
			LG_TV.sendCommand('xb 00 ' + LG_TV.Input[source.toLowerCase()]);
		} else {
			LG_TV.log("Invalid Input Source");
		}
	},
	getInput: function() {
		LG_TV.sendCommand('xb 00 ff');
	},
	/////////////////////////////////////////////////


	// POWER SAVING MODE
	// EXAMPLE LG_TV.setPowerSave("min");
	// RS232 COMMAND HAS THE FOLLOWING FORMAT:
	// [jq] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [q] [00] [OK] [XX]x WHERE XX IS PRESENT STATUS
	// RS232 ACK FAILURE RESPONSE FORMAT: [q] [00] [NG] [XX]x WHERE XX IS THE CODE SENT
	PowerSave: {
		'off' : "00",
		'min' : "01",
		'mid' : "02",
		'max' : "03",
		'auto' : "04",
		'screenoff' : "05"
	},
	setPowerSave: function(pwrsave) {
		LG_TV.sendCommand('jq 00 ' + LG_TV.PowerSave[pwrsave.toLowerCase()]);
	},
	getPowerSave: function() {
		LG_TV.sendCommand('jq 00 ff');
	},
	/////////////////////////////////////////////////


	// CHANNEL MEMORY
	// EXAMPLE LG_TV.setMemory("add");
	// RS232 COMMAND HAS THE FOLLOWING FORMAT:
	// [mb] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [b] [00] [OK] [XX]x WHERE XX IS PRESENT STATUS
	// RS232 ACK FAILURE RESPONSE FORMAT: [b] [00] [NG] [XX]x WHERE XX IS THE CODE SENT
	// UNFORTUNATELY THE HIGH BIT OF THE COMMAND CODE SENT IS NOT RETURNED IN THE ACK RESPONSE
	// ONLY THE LOW BIT IS IS SENT.  THIS MAKES RS232 INPUT ACK RESPONSES LOOK THE SAME AS
	// INPUT SELECT ACK RESPONSES.
	Memory: {
		'add' : "01",
		'delete' : "00"
	},
	setMemory: function(mem) {
		LG_TV.sendCommand('mb 00 ' + LG_TV.Memory[mem.toLowerCase()]);
	   // WE HAVE TO GET THE STATUS OF THE INPUT WITH THE RS232 COMMAND
	   // AFTER CALLING THE MEMORY COMMAND BECAUSE OF THE OVERLAP OF THE LOW
	   // BIT OF THE COMMAND BEING THE SAME.  IT'S A KLUDGE FIX
		LG_TV.getInput();
	},
	/////////////////////////////////////////////////


	// AUDIO MUTE
	// EXAMPLE LG_TV.setMute("on");
	// RS232 COMMAND HAS THE FOLLOWING FORMAT:
	// [ke] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [e] [00] [OK] [XX]x WHERE XX IS PRESENT STATUS
	// RS232 ACK FAILURE RESPONSE FORMAT: [e] [00] [NG] [XX]x WHERE XX IS THE CODE SENT
	Mute: {
		'on' : "00",
		'off': "01"
	},
	setMute: function(mte) {
		LG_TV.sendCommand('ke 00 ' + LG_TV.Mute[mte.toLowerCase()]);
	},
	getMute: function() {
		LG_TV.sendCommand('ke 00 ff');
	},
	/////////////////////////////////////////////////


	// IR REMOTE LOCK
	// EXAMPLE LG_TV.setRemoteLock("on");
	// RS232 COMMAND HAS THE FOLLOWING FORMAT:
	// [km] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [m] [00] [OK] [XX]x WHERE XX IS PRESENT STATUS
	// RS232 ACK FAILURE RESPONSE FORMAT: [m] [00] [NG] [XX]x WHERE XX IS THE CODE SENT
	RemoteLock: {
		'on' : "01",
		'off' : "00"
	},
	setRemoteLock: function(lock) {
		LG_TV.sendCommand('km 00 ' + LG_TV.RemoteLock[lock.toLowerCase()]);
	},
	getRemoteLock: function() {
		LG_TV.sendCommand('km 00 ff');
	},
	/////////////////////////////////////////////////


	// SCREEN VIDEO MUTE
	// EXAMPLE LG_TV.setScreenMute("on");
	// RS232 COMMAND HAS THE FOLLOWING FORMAT:
	// [kd] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [d] [00] [OK] [XX]x WHERE XX IS PRESENT STATUS
	// RS232 ACK FAILURE RESPONSE FORMAT: [d] [00] [NG] [XX]x WHERE XX IS THE CODE SENT
	ScreenMute: {
		'on' : "01",
		'off' : "00",
		'video' : "10"
	},
	setScreenMute: function(mte) {
		LG_TV.sendCommand('kd 00 ' + LG_TV.ScreenMute[mte.toLowerCase()]);
	},
	getScreenMute: function() {
		LG_TV.sendCommand('kd 00 ff');
	},
	/////////////////////////////////////////////////


	// OSD SELECTION
	// EXAMPLE LG_TV.OSDSelect("on");
	// RS232 COMMAND HAS THE FOLLOWING FORMAT:
	// [kl] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [l] [00] [OK] [XX]x WHERE XX IS PRESENT STATUS
	// RS232 ACK FAILURE RESPONSE FORMAT: [l] [00] [NG] [XX]x WHERE XX IS THE CODE SENT
	OSDSelect: {
		'on' : "01",
		'off' : "00"
	},
	setOSDSelect: function(osd) {
		LG_TV.sendcommand('kl 00 ' + LG_TV.OSDSelect[osd.toLowerCase()]);
	},
	getOSDSelect: function() {
		LG_TV.sendCommand('kl 00 ff');
	},
	/////////////////////////////////////////////////


	// ISM METHOD - PLASMA TV'S ONLY
	// EXAMPLE LG_TV.ISMMethod("Normal");
	// RS232 COMMAND HAS THE FOLLOWING FORMAT:
	// [jp] [00] [XX]\n (WHERE 00 IS THE TELEVISION SET NUMBER, 00 IS ALL TELEVISION SETS)
	// THE SET NUMBER CAN BE CONFIGURED IN THE LG TELEVISIONS SETUP MENUS
	// RS232 ACK SUCCESS RESPONSE FORMAT: [p] [00] [OK] [XX]x WHERE XX IS PRESENT STATUS
	// RS232 ACK FAILURE RESPONSE FORMAT: [p] [00] [NG] [XX]x WHERE XX IS THE CODE SENT
	ISMMethod: {
		'orbiter' : "02",
		'normal' : "08",
		'white' : "04",
		'color' : "20"
	},
	setISMMethod: function(ism) {
		LG_TV.sendCommand('jp 00 ' + LG_TV.ISMMethod[ism.toLowerCase]);
	},
	getISMMethod: function() {
		LG_TV.sendCommand('jp 00 ff');
	},
	/////////////////////////////////////////////////


	// AUTO PICTURE CONFIGURATON
	// EXAMPLE LG_TV.setAutoPicture();
	setAutoPicture: function() {
		LG_TV.sendCommand('ju 00 00');
	},
	/////////////////////////////////////////////////


	////////////////////////////////////////
	// COMMANDS THAT SET A VALUE DIRECTLY //
	////////////////////////////////////////
	getVolume: function() {
		LG_TV.sendCommand('kf 00 ff');
	},
	setVolume: function(level) {
	   LG_TV.log( "Set Volume " + LG_TV.toHex(parseInt(level)));
	   LG_TV.sendCommand( 'kf 00 ' + LG_TV.toHex(parseInt(level)))
	},
	getContrast: function() {
		LG_TV.sendCommand('kg 00 ff');
	},
	setContrast: function(level) {
	   LG_TV.log( "Set Contrast " + LG_TV.toHex(parseInt(level)));
	   LG_TV.sendCommand( 'kg 00 ' + LG_TV.toHex(parseInt(level)))
	},
	getBrightness: function() {
		LG_TV.sendCommand('kh 00 ff');
	},
	setBrightness: function(level) {
	   LG_TV.log( "Set Brightness " + LG_TV.toHex(parseInt(level)));
	   LG_TV.sendCommand( 'kh 00 ' + LG_TV.toHex(parseInt(level)))
	},
	getColor: function() {
		LG_TV.sendCommand('ki 00 ff');
	},
	setColor: function(level) {
	   LG_TV.log( "Set Color " + LG_TV.toHex(parseInt(level)));
	   LG_TV.sendCommand( 'ki 00 ' + LG_TV.toHex(parseInt(level)))
	},
	getTint: function() {
		this.sendCommand('kj 00 ff');
	},
	setTint: function(level) {
	   LG_TV.log( "Set Tint " + LG_TV.toHex(parseInt(level)));
	   LG_TV.sendCommand( 'kj 00 ' + LG_TV.toHex(parseInt(level)))
	},
	getSharpness: function() {
		LG_TV.sendCommand('kk 00 ff');
	},
	setSharpness: function(level) {
	   LG_TV.log( "Set Sharpness " + LG_TV.toHex(parseInt(level)));
	   LG_TV.sendCommand( 'kk 00 ' + LG_TV.toHex(parseInt(level)))
	},
	getTreble: function() {
		LG_TV.sendCommand('kr 00 ff');
	},
	setTreble: function(level) {
		LG_TV.log( "Set Treble " + LG_TV.toHex(parseInt(level)));
		LG_TV.sendCommand( 'kr 00 ' + LG_TV.toHex(parseInt(level)))
	},
	getBass: function() {
		LG_TV.sendCommand('ks 00 ff');
	},
	setBass: function(level) {
	   LG_TV.log( "Set Bass " + LG_TV.toHex(parseInt(level)));
	   LG_TV.sendCommand( 'ks 00 ' + LG_TV.toHex(parseInt(level)))
	},
	getBalance: function() {
		LG_TV.sendCommand('kt 00 ff');
	},
	setBalance: function(level) {
	   LG_TV.log( "Set Balance " + LG_TV.toHex(parseInt(level)));
	   LG_TV.sendCommand( 'kt 00 ' + LG_TV.toHex(parseInt(level)))
	},
	getTemperature: function() {
		LG_TV.sendCommand('xu 00 ff');
	},
	setTemperature: function(level) {
	   LG_TV.log( "Set Temperature " + LG_TV.toHex(parseInt(level)));
	   LG_TV.sendCommand( 'xu 00 ' + LG_TV.toHex(parseInt(level)))
	},
	getBacklight: function() {
		LG_TV.sendCommand('mg 00 ff');
	},
	setBacklight: function(level) {
	   LG_TV.log( "Set Backlight " + LG_TV.toHex(parseInt(level)));
	   LG_TV.sendCommand( 'mg 00 ' + LG_TV.toHex(parseInt(level)))
	},
	/////////////////////////////////////////////////


	/////////////////////////////
	// INITIALIZE ONKYO OBJECT //
	/////////////////////////////
	Initialize: function() {
		LG_TV.log("Initializing LG Object");
		LG_TV.getPower();
		LG_TV.getPowerSave();
		LG_TV.getScreenMute();
		LG_TV.getRemoteLock();
		LG_TV.getInput();
		LG_TV.getMute();
		LG_TV.getVolume();
		LG_TV.getContrast();
		LG_TV.getBrightness();
		LG_TV.getColor();
		LG_TV.getTint();
		LG_TV.getSharpness();
		LG_TV.getTreble();
		LG_TV.getBass();
		LG_TV.getBalance();
		LG_TV.getTemperature();
	   /* this.getRatio();
		this.getBacklight();
		this.getOSDSelect();
		this.getISMMethod();
		this.getBacklight();*/
	},
	/////////////////////////////////////////////////


	///////////////////////////////
	// INTERNAL HELPER FUNCTIONS //
	///////////////////////////////
	sendCommand: function (command) {
		LG_TV.log("Send Command " + command);
		CF.send("LG_TV", command + "\n", CF.BINARY);
	},
	toHex: function (str) {
		str = str + '';
		return Number(str).toString(16).toUpperCase();
	},
	fromHex: function (hex) {
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	},
	
	/////////////////////////////////////////////////


	////////////////////
	// PARSE FEEDBACK //
	////////////////////
	ProcessFeedback: function(feedbackname, feedbackstring) {
		LG_TV.log("Feedback Name " + feedbackname + " Feedback String " + feedbackstring);

		var command = feedbackstring.substring(0,1);
		var setid   = feedbackstring.substring(2,4);
		var state   = feedbackstring.substring(5,7);
		var value   = feedbackstring.substring(7,9);

		LG_TV.log( "Command: " + command + " TVID: " + setid + " Status: " + state + " Value: " + value);

		// IF STATUS = NG, THE COMMAND FAILED, CATCH AND EXIT FUNCTION
		if ( state == "NG" ) {
		   LG_TV.log("Command Failed");
		   return;
		}

		switch (command) {
			// POWER
			case "a":
				LG_TV.log("Power: " + LG_TV.Power[value] + " " + value);
				switch ( value ) {
					case "01":
						CF.setJoin("d" + (LG_TV.JOINSTART + 80), 1);
						CF.setJoin("d" + (LG_TV.JOINSTART + 81), 0);
						break;
					case "00":
					CF.setJoin("d" + (LG_TV.JOINSTART + 80), 0);
					CF.setJoin("d" + (LG_TV.JOINSTART + 81), 1);
					break;
				}
				break;
			// END POWER PARSING

			// POWER SAVER
			case "q":
				LG_TV.log("PowerSave: " + LG_TV.PowerSave[value] + " " + value);
				CF.setJoin("d" + (LG_TV.JOINSTART + 82), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 83), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 84), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 85), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 86), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 87), 0);

				switch (value) {
					case "00":
						CF.setJoin("d" + (LG_TV.JOINSTART + 82), 1);
						break;
					case "01":
						CF.setJoin("d" + (LG_TV.JOINSTART + 83), 1);
						break;
					case "02":
						CF.setJoin("d" + (LG_TV.JOINSTART + 84), 1);
						break;
					case "03":
						CF.setJoin("d" + (LG_TV.JOINSTART + 85), 1);
						break;
					case "04":
						CF.setJoin("d" + (LG_TV.JOINSTART + 86), 1);
						break;
					case "05":
						CF.setJoin("d" + (LG_TV.JOINSTART + 87), 1);
						break;
				}
				break;
			// END POWER SAVE PARSING

			// REMOTE LOCK
			case "m":
				LG_TV.log("Remote Lock: " + LG_TV.RemoteLock[value] + " " + value);
				CF.setJoin("d" + (LG_TV.JOINSTART + 88), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 89), 0);
				switch (value) {
					case "00":
						CF.setJoin("d" + (LG_TV.JOINSTART + 89), 1);
						break;
					case "01":
						CF.setJoin("d" + (LG_TV.JOINSTART + 88), 1);
						break;
				}
				break;
			// END REMOTE LOCK PARSING

			// SCREEN MUTE
			case "d":
				LG_TV.log("Screen Mute: " + LG_TV.ScreenMute[value] + " " + value);
				CF.setJoin("d" + (LG_TV.JOINSTART + 90), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 91), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 92), 0);
				switch(value) {
					case "10":
						CF.setJoin("d" + (LG_TV.JOINSTART + 90), 1);
						break;
					case "00":
						CF.setJoin("d" + (LG_TV.JOINSTART + 92), 1);
						break;
					case "01":
						CF.setJoin("d" + (LG_TV.JOINSTART + 91), 1);
						break;
				}
				break;
			// END SCREEN MUTE PARSING

			// SOURCE INPUT
			case "b":
				LG_TV.log("Input:" + LG_TV.Input[value] + " " + value);
				CF.setJoin("d" + (LG_TV.JOINSTART + 67), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 68), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 69), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 70), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 71), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 72), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 73), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 74), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 75), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 76), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 77), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 78), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 79), 0);
				switch (value) {
					case "00":
						CF.setJoin("d" + (LG_TV.JOINSTART + 67), 1);
						break;
					case "01":
						CF.setJoin("d" + (LG_TV.JOINSTART + 68), 1);
						break;
					case "10":
						CF.setJoin("d" + (LG_TV.JOINSTART + 69), 1);
						break;
					case "11":
						CF.setJoin("d" + (LG_TV.JOINSTART + 70), 1);
						break;
					case "20":
						CF.setJoin("d" + (LG_TV.JOINSTART + 71), 1);
						break;
					case "21":
						CF.setJoin("d" + (LG_TV.JOINSTART + 72), 1);
						break;
					case "40":
						CF.setJoin("d" + (LG_TV.JOINSTART + 73), 1);
						break;
					case "41":
						CF.setJoin("d" + (LG_TV.JOINSTART + 74), 1);
						break;
					case "60":
						CF.setJoin("d" + (LG_TV.JOINSTART + 75), 1);
						break;
					case "90":
						CF.setJoin("d" + (LG_TV.JOINSTART + 76), 1);
						break;
					case "91":
						CF.setJoin("d" + (LG_TV.JOINSTART + 77), 1);
						break;
					case "92":
						CF.setJoin("d" + (LG_TV.JOINSTART + 78), 1);
						break;
					case "93":
						CF.setJoin("d" + (LG_TV.JOINSTART + 79), 1);
						break;
				}
				break;
			// END SOURCE INPUT PARSING



			// AUDIO MUTE
			case "e":
				LG_TV.log("Audio Mute: " + LG_TV.Mute[value] + " " + value);
				CF.setJoin("d" + (LG_TV.JOINSTART + 93), 0);
				CF.setJoin("d" + (LG_TV.JOINSTART + 94), 0);
				switch (value) {
					case "01":
						CF.setJoin("d" + (LG_TV.JOINSTART + 93), 1);
						break;
					case "00":
						CF.setJoin("d" + (LG_TV.JOINSTART + 94), 1);
						break;
				}
				break;
			// END MUTE PARSING


			// VOLUME (TEMP)
			case "f":
				LG_TV.log("Volume: " + parseInt(value,16));
				CF.setJoin("a" + (LG_TV.JOINSTART), parseInt(value,16) * 655 );
				break;
			// END VOLUME PARSING

			// CONTRAST
			case "g":
				LG_TV.log("Contrast: " + parseInt(value,16));
				CF.setJoin("a" + (LG_TV.JOINSTART + 1), parseInt(value,16) * 655 );
				break;
			// END CONTRAST PARSING

			// BRIGHTNESS
			case "h":
				LG_TV.log("Brightness: " + parseInt(value,16));
				CF.setJoin("a141416", parseInt(value,16) * 655 );
				break;
			// END BRIGHTNESS PARSING

			// COLOR
			case "i":
				LG_TV.log("Color: " + parseInt(value,16));
				CF.setJoin("a141417", parseInt(value,16) * 655 );
				break;
			// END COLOR PARSING

			// TINT
			case "j":
				LG_TV.log("Tint: " + parseInt(value,16));
				CF.setJoin("a141418", parseInt(value,16) * 655 );
				break;
			// END TINT PARSING

			// SHARPNESS
			case "k":
				LG_TV.log("Sharpness: " + parseInt(value,16));
				CF.setJoin("a141419", parseInt(value,16) * 655 );
				break;
			// END SHARPNESS PARSING

			// TREBLE
			case "r":
				LG_TV.log("Treble: " + parseInt(value,16));
				CF.setJoin("a141420", parseInt(value,16) * 655 );
				break;
			// END TREBLE PARSING

			// BASS
			case "s":
				LG_TV.log("Bass: " + parseInt(value,16));
				CF.setJoin("a141421", parseInt(value,16) * 655 );
				break;
			// END BASS PARSING

			// TEMPERATURE
			case "u":
				LG_TV.log("Temperature: " + parseInt(value,16));
				CF.setJoin("a141422", parseInt(value,16) * 655 );
				break;
			// END TEMPERATURE PARSING

			// BALANCE
			case "t":
				LG_TV.log("Balance: " + parseInt(value,16));
				CF.setJoin("a141423", parseInt(value,16) * 655 );
				break;
			// END BALANCE PARSING

			/* // BACKLIGHT
			case "g":
			if (this.debug) LG_TV.log("Backlight: " + parseInt(value,16));
			CF.setJoin("a141424", parseInt(value,16) * 655 );
			break;
			// END BACKLIGHT PARSING

			// SCREEN RATIO
			case "c":
			for ( var i = 271; i <= 293; i++ ) {
			   CF.setJoin("d"+i, 0);
			}
			value = parseInt(value,16) + 270;
			CF.setJoin("d"+value, 1);
			break;
			// END SCREEN RATIO PARSING

			// OSD SELECT
			case "l":
			LG_TV.log("OSD Select: " + this.OSDSelect[value]);
			break;
			// ISM METHOD
			case "p":
			LG_TV.log("ISM Method: " + this.ISMMethod[value]);
			break;
			// RESPONSE FROM A KEYPRESS WE ARE ONLY INTERESTED IN THOSE THAT WILL CHANGE THE STATUS OF THE TV
			case "c":
			switch (value) {
			  // MUTE
			  case "09":
			  this.getMute();
			  this.getVolume();
			  break;
			  // VOLUME UP
			  case "02":
			  this.getVolume();
			  break;
			  // VOLUME DOWN
			  case "03":
			  this.getVolume();
			  // POWER
			  case "08":
			  this.getPower();
			  break;
			}
			break;*/
			default:
				LG_TV.log("Uncaught Return " + feedbackstring);
				break;
		}
	},
	/////////////////////////////////////////////////

	// Only allow logging calls when CF is in debug mode - better performance in release mode this way
	log: function(msg) {
		if (CF.debug) {
			CF.log("LGTV: " + msg);
		}
	}
}

CF.modules.push({name:"LG_TV", setup:LG_TV.setup});