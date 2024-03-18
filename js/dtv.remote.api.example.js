$(document).ready(function() {
    var MAXTVS=13;
    var dtvRemote;
    var remotes=[];
    var config;
    var internal=false;
	var errors={};
	var numbersTimeout;
	var version="";
	var musicStatus="";
	var musicStations="";
	var tvschannels=[];
	var guideFiltered="";
	var guidePrograms={};
	var trenchersStatus="";
	var todayMatches="";
	var devicesStatus="";
	var internetStatus=true;
	var todayPrograms={};
	function isMobile(){
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
			return true;
		}
		return false;
	}
	function isNumeric(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}
	$(document).keypress(function(event){
			key = event.originalEvent.key;
			if (isNumeric(key))
			    pressNumber(event.originalEvent.key);
	        //alert('You pressed a key:' + event.originalEvent.key);    
	});
	function ts(){
		return Math.floor(Date.now());
	}
	function checkVersion(){
		var jqxhr = $.getJSON( "./version.json?ts=" + ts(), function(result) {
				
				if (version=="")
					version=result.version;
				$("#version").html("VERSION: " + version);
				if (version!=result.version)
					location.reload();
            })
              .done(function() {
	              
              })
              .fail(function() {
                console.log( "error" );
              })
              .always(function() {
                //console.log( "complete" );
              });
             
            // Perform other work here ...
             
            // Set another completion function for the request above
            jqxhr.always(function() {
              //console.log( "second complete" );
            });
		setTimeout(function () { checkVersion() },60000);
		
	}
	
    var processTVs = function(){
        //console.log(config.tvs[0]);
		internal=false;
		return;
        var url ='http://' + config.tvs[0].local + ':8080/'; 
        $.ajax({
          type: "GET",
          url: url,
          success: function(data){
            internal=true;
          },
			error:function (xhr, ajaxOptions, thrownError){
			    if (xhr.status == 403) {
			        internal=true;
			    }else
					internal=false;
			} 
        });

    }
    var refreshTrenchersStatus = function(){
		if (config.trenchersUrl == "")
			return;
		var jqxhr = $.getJSON( config.trenchersUrl + "command=status", function(result) {
              trenchersStatus = result;
			renderTrenchersStatus();
			internetStatus=true;
            })
             .fail(function(jqXHR, textStatus, errorThrown) {
					console.log("error Trenchers Status" + textStatus);
					console.log("incoming Text " + jqXHR.responseText);
				 internetStatus=false;
				})
              .always(function() {
               // console.log( "complete" );
              });

            jqxhr.always(function() {
				renderInternet();
            });
	}
	var renderInternet = function(){
		if (internetStatus==true)
			$('#internetFailures').hide();
		else
			$('#internetFailures').show();
	}
	var renderTrenchersStatus = function(){
		if (trenchersStatus=="") return;
		if (trenchersStatus.open=='1')
			$("#hide-checkbox").prop( "checked", true );
		else
			 $("#hide-checkbox").prop( "checked", false );
	}
    var getConfig = function(){
                    // Assign handlers immediately after making the request,
            // and remember the jqxhr object for this request
            var jqxhr = $.getJSON( "./config.json", function(result) {
              config = result;
                processTVs();
	            refreshAllTVs();
				refreshMusicStatus();
				setInterval(function () { refreshTrenchersStatus() },5000);
				setInterval(function () { refreshDevicesStatus() },10000);
            })
              .done(function() {
              //  console.log( "second success" );
              })
              .fail(function(jqXHR, textStatus, errorThrown) {
					console.log("error " + textStatus);
					console.log("incoming Text " + jqXHR.responseText);
				})
              .always(function() {
               // console.log( "complete" );
              });
             
            // Perform other work here ...
             
            // Set another completion function for the request above
            jqxhr.always(function() {
              //console.log( "second complete" );
            });
    }
    var refreshTvChannel = function(tv){
		tvo = retrieveTV(tv)[0];
		var addr =tvo.local;
		if (errors[tv]==null) errors[tv]=0;
			if (!internal)
				addr= tvo.remote;
		$.ajax({
		     type: 'GET',
		     url: 'http://' + addr + ':8080/tv/getTuned',
		     dataType: 'json',
		     async: true,
		     timeout: 15000,
		     success: function (response) {
		           response.tv = tv
		           updateChannel(response);
					errors[tv]=0;
					if ($("#"+tv).css('background-color') == 'rgb(255, 0, 0)')
						$("#"+tv).css('background-color','');
				 
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        errorOnTV(tv, textStatus, errorThrown);
		    }     
		});
	}
    var refreshAllTVs = function() {
        for (x=0;x<config.tvs.length;x++){
			refreshTvChannel(config.tvs[x].tv);
		}
		setTimeout(function () { refreshAllTVs() },10000);
    };
	var errorOnTV = function (tv, textStatus, errorThrown){
		errors[tv]=errors[tv]+1;
		if (errors[tv]>=3)
			$('#' + tv).css("background-color","red");
		console.log("TV: " + tv + " ERROR: " + textStatus + "-" + errorThrown);
	}
	var updateChannel = function(response){
		//console.log(response); //TODO
		$("#" + response.tv + "ch").html("CH:" + response.major);
		tvschannels[response.tv] = response.major;
	}
	var renderChannels = function(){
		for (x=0;x<config.tvs.length;x++){
			$("#" + config.tvs[x].tv + "ch").html("CH:" + tvschannels[config.tvs[x].tv]);
		}
	}

    function retrieveTV(id){
        var result = config.tvs.filter(obj => {
          return obj.tv === id
        })
        return result;
    }

    
    function validate(remote){
        remote.validate({callback: function(result) {
            if (result.status.code === 200 || result.status.code ===403) 
                return true;
            else
                return false;
        }});
    }
    function getTuned(remote){
        if (remote){
            remote.getTuned({callback: function(result) {
                    if (result.episodeTitle) {
                        $('#program-title').html(result.title + ' <small>' + result.episodeTitle + '</small>');
                    } else {
                        $('#program-title').text(result.title);
                    }
            $('#program-callsign').html(result.callsign + ' <small>' + result.major + '</small>');
                    showButtons();

                    remote.ccJob = setInterval(refreshAllTVs, 5000);
                    
                    //$('#ip-address-dialog').modal('hide');
                }});
        }
    }
    function showButtons(){
                    $('#main-container').empty();
                    $('#main-container').append($('#main-content'));
                    $('#main-content').toggleClass('hide');
                    $('#ip-address-dialog').css("display","none");
    }
    function tuneChannel(remote,channel){
        remote.tune({major: channel, callback: function(result) {
			if (result.status.code == 200){
				//setTimeout(refreshTvChannel(remote.tv),2000);
			}
            if (result.status.code ==404){
                var tv = parseName(result.status.msg);
                $("#" + tv).css("background-color", "red");
            }
            else if (result.status.code !== 200) {
                alert(result.status.msg);
            }

        }});
		
    }
	function pressNumber(n){
		clearTimeout(numbersTimeout);
		$('#channelNumbersDiv').css('display','block');
		var nu = $('#channelNumbersDiv').html() + n;
		$('#channelNumbersDiv').html(nu);
		numbersTimeout = setTimeout(function () { setChannel(nu)}, 1000);
	}
	function pressButtonAllRemotes(keyName){
		for (x=0;x<remotes.length;x++){
            pressButton(remotes[x].obj,keyName);
        }
	}
	function turnAllTvs(on){
		for (x=0;x<remotes.length;x++){
			var tv = remotes[x].device;
			turnDevice(tv,on?1:0);
		}
	}
    function pressButton(remote, keyName){
        remote.processKey({key: keyName, callback: function(result) {
            if (result.status.code ==404){
                var tv = parseName(result.status.msg);
                $("#" + tv).css("background-color", "red");
            }
            else if (result.status.code !== 200) {
                alert(result.status.msg);
            }

        }});

    }
    function parseName(errorMsg){
        var ht="http://"; var po=":";
        var pos1=errorMsg.search(ht)+ht.length;
        var pos2=errorMsg.indexOf(po,pos1+1);
        return errorMsg.substring(pos1,pos2);
    }
    //----------------------------------- MENU
    function selectMenu(menuItem){
        $(".menu").removeClass('active');

        $( ".menu" ).each(function( index ) {
          $(this).parent().removeClass('active');
        });
        
        $(menuItem).parent().toggleClass('active');
        loadPage(menuItem.id + ".html");
    }
    function loadMenu(){
        $("#sidebar").load("nav.html", function (){
            $('#sidebarCollapse').on('click', function () {
                  $('#sidebar').toggleClass('active');
            });

            $(".menu").click(function(e){
                selectMenu(this);
				//TODO HIDE THE MENU FOR MOBILE
				if (isMobile())
					$('#sidebar').toggleClass('active');
            });

            //default page
            loadPage("navHome.html");
            
        });
    }
    //---------------------------------
	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};

    function loadPage(page){
        var rnd = Math.floor(Math.random() * 10000000) + 1;
        if (page.indexOf('?')>=0){
            page = page + '&rnd=' + rnd;
        }else
            page = page + '?rnd=' + rnd;
        $("#content").load(page, function(){
            attachTriggers();
        });
    }
	
	
	function playAudio(fileName, myVolume) {
			myMedia.src = fileName;
			myMedia.setAttribute('loop', 'loop');
    	setVolume(myVolume);
    	myMedia.play();
	}
	
	function setVolume(myVolume) {
        var myMedia = document.getElementById('myMedia');
        myMedia.volume = myVolume;
	}
	function setChannel(ch){
		$('#channelNumbersDiv').html('');
		$('#channelNumbersDiv').css('display','none');
		var response = {};
		response.major = ch;
        for (x=0;x<remotes.length;x++){
			response.tv = remotes[x].obj.tv
			updateChannel(response);
            tuneChannel(remotes[x].obj,ch);
        }
	}
	function renderSoundSource(){
		if (trenchersStatus=="" || typeof trenchersStatus=='undefined') return;
		$('label[name="sourceOptions"]').each(function(){
			if ($($(this)[0].children[0]).val()==trenchersStatus.preset)
				$(this).addClass('btnSelected');
				$(this).addClass('active');
		});
		
	}
	//----------------MUSIC
	function getSession(){
		if (musicStatus=="")
			return "";
		return musicStatus.status.sessionId;
	}
	function getMusicUrl(op){
		var url = config.musicUrl + "&op=" + op;
		var sess = getSession();
		if (sess!="")
			url += "&session=" + sess;
		return url;
	}
	
	function refreshMusicStatus(loop=true){
		var url = getMusicUrl('status');
		$.ajax({
		     type: 'GET',
		     url: url,
		     dataType: 'json',
		     async: true,
		     timeout: 20000,
		     success: function (response) {
		        musicStatus = response;
				if (musicStations=="")
					refreshStations(false);
				renderMusic(); 
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
			     $("#musicTitle").html("Communication error.... retrying.");
				 console.log("ERROR MUSIC STATUS: " + textStatus + " " + errorThrown + " - URL:" + url);
		    }     
		});
		if (loop)
			setTimeout(function (){refreshMusicStatus()},30000);
	}
	function refreshStations(loop=true){
		$.ajax({
		     type: 'GET',
		     url: getMusicUrl('stations'),
		     dataType: 'json',
		     async: true,
		     timeout: 5000,
		     success: function (response) {
				 musicStations = response;
				renderStations(); 
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        console.log("ERROR MUSIC stations: " + textStatus + " " + errorThrown);
				 refreshStations(loop);
		    }     
		});
		if (loop)
			setTimeout(function (){refreshStations()},60000);
	}
	function setStation(station){
		//op=setstation&station=3053657168918640554
		var url = getMusicUrl('setstation') + '&station=' + station;
		$.ajax({
		     type: 'GET',
		     url: url,
		     dataType: 'json',
		     async: true,
		     timeout: 5000,
		     success: function (response) {
				 musicStations = response;
				renderStations(); 
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        console.log("ERROR MUSIC stations: " + textStatus + " " + errorThrown);
				setStation(station)
		    }     
		});
	}
	function renderMusic(){
		if (musicStatus=="")return;
		$("#musicCover").attr("src",musicStatus.data.currentAudioSong.cover);
		$("#musicTitle").html(musicStatus.data.currentAudioSong.title);
		$("#musicArtist").html(musicStatus.data.currentAudioSong.artist);
		$("#musicAlbum").html(musicStatus.data.currentAudioSong.album);

		
	}
	function renderStations(){
		if (musicStations=="" || typeof musicStations.data.styles==='undefined')return;
		const div = $('#stations');
		
		if (musicStations!="" && div.length && musicStations.data.styles.length>0){
			musicStations.data.styles.forEach(station => {
			    div.html(div.html() + '<a class="dropdown-item" href="#" id="' + station.id + '">' + station.name + '</a>');
			});
			if ($(div).length ){
				if (musicStatus.data.currentAudioStyle == null)
					$(div).parent().children()[0].innerHTML = 'Select a station';
				else
					$(div).parent().children()[0].innerHTML = musicStatus.data.currentAudioStyle.name;
			}
		}

	}

	function trenchersCommand(cmd){
		if (config=="" || config.trenchersUrl==""){
			console.log("CONFIG MISSING FOR TRENCHERS trenchersCommand");
			return;
		}
		var url = config.trenchersUrl + "command=" + cmd;
		console.log(url);
		$.ajax({
		     type: 'GET',
		     url: url,
		     dataType: 'json',
		     async: true,
		     timeout: 5000,
		     success: function (response) {
				 console.log("TRenchers command all ok " + response);
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        console.log("ERROR trenchers command: " + textStatus + " " + errorThrown);
		    }     
		});
	}
	function renderMoods(){
		if (config=='' || typeof config.moods==='undefined') return;
		var moods = config.moods;
		var moodB = $("#moodButtons");
		var guideB = $("#guideButtons");
		guideB.append('<label class="btn btn-secondary" name="guideOptions" id="sports"><input type="radio" name="mood" value="sports" autocomplete="off"><span class="fa-solid"></span>All Sports</label>');
		moods.forEach(obj => {
			var cl= 'filter' + obj.id;
			var add = '<label class="' + cl + ' btn btn-secondary" name="moodOptions" id="' + obj.id + '"><input type="radio" name="mood" value="' + obj.id + '" autocomplete="off"><span class="fa-solid '+ obj.icon + '"></span> ' + obj.name + '</label>';
			moodB.append(add);
			if (obj.guide!="")
				guideB.append(add.replace('mood','guide'));			
		});
	}
	function getSports(){
		return config.moods.map(a => a.id);
	}
	function getGuide(cat,live=""){
		var url = config.guideUrl;// + "chfrom=1&chto=500";
		if (cat!='' && typeof cat!== 'undefined')
			url += "&cat=" + cat;
		else
			url += "&cat=" + getSports();
		if (live!="")
			url += "&live";
		$.ajax({
		     type: 'GET',
		     url: url,
		     dataType: 'json',
		     async: true,
		     timeout: 60000,
		     success: function (response) {
				 if (live==""){
					 guideFiltered = response;
					 renderGuide(response,cat);
				 }else{
					 todayMatches = response;
					 renderTodayMatches();
				 }
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        console.log("ERROR Guide command: " + textStatus + " " + errorThrown);
		    }     
		});
	}
	function compareCatProgram(cats, prog){
		if (cats=='') return false;
		if (typeof cats == 'string' || typeof cats =='number'){
			if (cats.toLowerCase()==prog.toLowerCase())
				return cats;
			else
				return '';
		}
		for (var x=0;x<cats.length;x++){
			if (compareCatProgram(cats[x],prog))
				return cats[x];
		}
		return '';
	}
	function colorProgram(prog, cat){
		if (prog == null || prog.subcategoryList == null) return '';
		if (cat=='' || typeof cat==='undefined')
			cat = config.moods.map(a => a.id);
		for (x=0;x<prog.subcategoryList.length;x++){
			var f=compareCatProgram(cat,prog.subcategoryList[x]);
			if (f!='')
				return 'filter' + f;
		}
		return '';
	}
	function renderProgModal(prog){
		$('#guideModalTitle').html(prog.title);
		var img = prog.primaryImageUrl;
		$('#guideAlbum').attr("src",img);
		
		$('#guideDuration').html('<b>Duration:</b> ' + prog.duration + ' minutes');
		//$('#guideStartTime').html('<b>Starts:</b> ' + convertDate(prog.airTime));
		$('#guideChannel').html('<b>Channel #:</b> ' + prog.chNum);
		$('#guideRepeat').html('<br><b>Repetition:</b> ' + (prog.repeat?'Yes':'No'));
		$('#guideChannelNum').val(prog.chNum);
		$('#modalGuide').modal('show');
	}
	function renderTodayMatches(){
		if (todayMatches==""){
		//	$('#todaymatchescontainer').hide();
			return;
		}
		todayPrograms={};
		$('#todaymatchescontainer').show();
		var t = $('#todaymatches');
		if (typeof t=='undefined' || t.length==0) return;
		var lastDate="";
			var r='';
		t.html('');
		for (var x=0;x<todayMatches.length;x++){
			todayPrograms[todayMatches[x].programID] = todayMatches[x];
			var d = todayMatches[x].airTimeLocal.date;
			
			if (lastDate!=d){
				var r = $("<div class='row rowGuide'><div>").appendTo(t);
				$("<div class='matchesTime'>" + todayMatches[x].time + "</div>").appendTo(r)
			}
			var color = colorProgram(todayMatches[x]);
			var ch = todayMatches[x].chNum;

			if (x<(todayMatches.length-1)){
				var origTitle = todayMatches[x].title;
				var y = x+1;
				while (typeof todayMatches[y] != 'undefined' && origTitle==todayMatches[y].title){
					ch += "," + todayMatches[y].chNum;
					y++;
				}
				x=y-1;
			}
			
			var local = todayMatches[x].localteam;
			var localcss = '';
			if (local)
				localcss = ' blink_me';
			$("<div chs='" + ch + "' prog='" + todayMatches[x].programID + "' class='col " + color + localcss + "'>" +  todayMatches[x].title + " (" + ch + ")</div>").appendTo(r);
			
			lastDate=d;
		}
		t.append("</div>");

		$('#todaymatches .row .col').click(function(){
			var chs=this.getAttribute('chs');
			var prog=todayPrograms[this.getAttribute('prog')];
		
			renderProgModal(prog);
			$('#guideAlbum').attr("src",prog.gridViewPrimaryImageUrl);
		
		});	


		
	}
	function formatTime(dt){
		return dt.getHours() + ':' + pad(dt.getMinutes(),2);
	}
	function renderGuide(response,cat=""){
		if ($("#guideBody").length==0)
			return;
		guidePrograms={};
		$("#guideBody").html('');
		if (response.chs==null) return;
		var rows = response.chs.length;
		var cols = Math.round((response.max - response.min) / (15*60));
		var htm="<tr><th class='celltopleft'>Today</th>";
		for (var col=0;col<cols;col++){
			htm += "<th colspan=2>" + getD(response.min+col*15*60) + "</th>";
			col++;
		}
		htm += "</tr>";
		for (var row=0;row<rows;row++){
			var ch = response.chs[row];
			htm += "<tr><td class='channelGuide' id='-" + ch.chNum + "'>" + ch.chNum + "-" + ch.chCall + "</td>";
			///airTime"2022-10-22T16:00:00.000+0000"
			if (ch.schedules.length>0){
				d = new Date(ch.schedules[0].airTime);
				d2 = new Date(response.min * 1000);
				diff = Math.abs(d.getTime() - d2.getTime())/1000;
				sp = (diff / 60)/15;
				htm += "<td class='' colspan='" + sp + "' id=''>&nbsp</td>";
			}
			
			
			for (var col=0;col<ch.schedules.length;col++){
				var sch = ch.schedules[col];
				var title = sch.title;
				var id = sch.programID;
				var repeat = sch.repeat;
				var span =  Math.round(sch.duration/15);
				var chars = 4;
				if ((span*chars)<title.length)
					title = title.substring(0, span*chars);
				sch.chNum = ch.chNum;
				guidePrograms[id] = sch;
				var color = colorProgram(sch,cat);
				htm += "<td class='" + color + "' colspan='" + span + "' id='" + id + "'>" + title + "</td>";
			}
			htm += "</tr>";
			
		}
		$("#guideBody").append(htm);
		
		attachGuide();
		window.scrollTo(0, 0);
	}
	function getD(timestamp){
		var d = new Date(timestamp*1000);
		return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
	}
	function convertDate(d){
		var dat = convertTZ(d,"America/Los_Angeles");
		return pad(dat.getHours(),2) + ":" + pad(dat.getMinutes(),2);
		
	}
	function pad(num, size) {
	    num = num.toString();
	    while (num.length < size) num = "0" + num;
	    return num;
	}
	function convertTZ(date, tzString) {
	    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
	}
	function attachGuide(){
		$("#guide td").on('click', function(){

				$('#guideModalTitle').html();
				$('#guideAlbum').attr("src",'');
	
				$('#guideDuration').html('');
				$('#guideStartTime').html('');
				$('#guideChannel').html('');
				$('#guideRepeat').html('');
			$('#modalGuide').modal('show');
			if (this.id.substring(0,1)=='-'){
				var chnum = this.id.substring(1);
				$('#guideModalTitle').html('Channel: ' + chnum);
				$('#guideChannel').html('<b>Channel #:</b> ' + chnum);
				$('#guideChannelNum').val(chnum);
			}else{
				var prog = guidePrograms[this.id];
				 
				$('#guideModalTitle').html(prog.title);
				var img = prog.primaryImageUrl;
				$('#guideAlbum').attr("src",img);
				
				$('#guideDuration').html('<b>Duration:</b> ' + prog.duration + ' minutes');
				//$('#guideStartTime').html('<b>Starts:</b> ' + convertDate(prog.airTime));
				$('#guideChannel').html('<b>Channel #:</b> ' + prog.chNum);
				$('#guideRepeat').html('<br><b>Repetition:</b> ' + (prog.repeat?'Yes':'No'));
				$('#guideChannelNum').val(prog.chNum);
			}
		 });
	}
	function imageExists(image_url){

	    var http = new XMLHttpRequest();
	
	    http.open('HEAD', image_url, false);
	    http.send();
	
	    return http.status != 404;
	
	}
	function smartDevicesPower(open){
		var url = config.iftttUrl;
		url = url.replace('{status}',open?'open':'close');
		$.ajax({
		     type: 'GET',
		     url: url,
		     dataType: 'json',
		     async: true,
		     timeout: 10000,
		     success: function (response) {
				 
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        console.log("ERROR Smart command: " + textStatus + " " + errorThrown);
		    }     
		});
	}

	function turnDevice(device,status){
		var url = config.smartUrl + "operation=turn";
		url += "&device=" + device + "&status=" + status;
		$.ajax({
		     type: 'GET',
		     url: url,
		     dataType: 'json',
		     async: true,
		     timeout: 15000,
		     success: function (response) {
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        console.log("ERROR SmartSET command: " + textStatus + " " + errorThrown);
		    }     
		});
	}

	function refreshDevicesStatus(){
		var url = config.smartUrl + "operation=list";
		$.ajax({
		     type: 'GET',
		     url: url,
		     dataType: 'json',
		     async: true,
		     timeout: 20000,
		     success: function (response) {
				 if (typeof response.payload!="undefined")
					 smartDevices = response.payload;
				 renderDevices();
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        console.log("ERROR SmartGET command: " + textStatus + " " + errorThrown);
		    }     
		});
	}

	function renderDevices(){
		if ($("#contentLights").length==0) return;
		content = $("#contentSwitchs");
		if (typeof smartDevices=="undefined" || smartDevices=="" || typeof smartDevices.devices == 'undefined'){
			//setTimeout(function (){refreshDevicesStatus()},10000); 
			return;
		}
		
		devices = smartDevices.devices;
		content.html('');
		for (x=0;x<devices.length;x++){
			if (devices[x].dev_type != "scene" && devices[x].name.substring(0,2).toLowerCase()!="tv"){
				//content.append('<br><label>' +  + '</label><input class="lightswitch" type="checkbox" checked data-toggle="toggle"></input>');

				data = devices[x].data;
				var checked=data.state?" checked ":"";
				content.append('<br><label>' + devices[x].name + '</label>&nbsp;<label class="switch"><input id="' + devices[x].id +'" ' + checked + ' type="checkbox"><span class="slider round"></span></label>');
			}
			
		}
		$(".switch :input").click(function (){
			turnDevice(this.id,this.checked?1:0);
		});
	}
	function loadDark(dark=false,fromLocal=false){
		if (fromLocal)
			dark = localStorage.getItem('theme')=='dark';
		if (dark){
			document.documentElement.setAttribute('data-theme', 'dark');
			localStorage.setItem('theme', 'dark'); 
		}
		else {
			document.documentElement.setAttribute('data-theme', 'light');
			localStorage.setItem('theme', 'light');
		} 
	}
	
    //----------------******************TRIGGERS------
     function attachTriggers(){
		
   
    //--------------Click handler for TV
	renderChannels();
	$('.btnJoy').click(function(e){
		pressButtonAllRemotes(this.id);
	});	 
    $('.remoteButton').click(function(e) {

		if ($(this).hasClass('num')){
			var n = $(this).html();
			pressNumber(n);
			return;
		}
		if (this.id=="powerOff" || this.id=="powerOn"){
			turnAllTvs(this.id=="powerOn");
			return;
		}
        pressButtonAllRemotes(this.id);
    });
	
    $('.channel').click(function(e){
        var ch = this.id;
		setChannel(ch);
    });

    $('#tvselector button').click(function(e){
        remotes=[];
        for (x=0;x<config.tvs.length;x++){
            var name = config.tvs[x].tv;
			var device = config.tvs[x].device;
            var ip = name;
            if (((this.id != name) && ($('#' + name).hasClass('active'))) || (this.id ==name && !($('#' + this.id).hasClass('active'))))
                {
                tv = retrieveTV(name)[0];
                if (internal)
                   ip = tv.local;
                else
                    ip = tv.remote;
                var remote = new DirecTV.Remote({ipAddress: ip});
				remote.tv = name;
                remotes.push({'tv':x, 'ip':ip, 'obj':remote, 'device': device});
            }

        }
    });

       
     


        //--------------Click handler for the SOUND
	renderSoundSource();
    $('label[name="sourceOptions"]').click(function (e){
		var preset=$(this).children()[0].value;
		$('label[name="sourceOptions"]').removeClass('btnSelected');
		$(this).addClass('btnSelected');
		$.ajax({
		     type: 'GET',
		     url: config.presetUrl + preset,
		     dataType: 'json',
		     async: true,
		     timeout: 15000,
		     success: function (response) {
		           
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        
		    }     
		});
		
    });
	$(".volumeButton").click(function (e){
		var id = this.id;
		var zon = id.substring(0,1);
		var inc = id.substring(1);
		
		$.ajax({
		     type: 'GET',
		     url: config.soundUrl + "zone=" + zon + "&inc=" + inc,
		     dataType: 'json',
		     async: true,
		     timeout: 15000,
		     success: function (response) {
		           
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        console.log(textStatus + " " + errorThrown);
		    }     
		});
		
	});

    $(".volume").slider({
    	min: 0,
    	max: 10,
    	value: 0,
        reversed: true,
    	orientation: 'vertical',
    	tooltip_position:'top'
    });
		//--------------------Click handler MUSIC
		 renderMusic();
		 renderStations();
		 $('#stations a').on('click', function(){
			    $(this).parent().parent().children()[0].innerHTML=$(this).html();
				 var id = this.id;
				 setStation(id);
			});
		 $(".musicButton").click(function (e){
			 id=this.id;
			 if (id=="tup" || id=="tdown"){
				 id="vote&song=" + musicStatus.data.currentAudioSong.id;
				 if (this.id=="tdown")
					 id += "&vote=negative";
			 }
			 $.ajax({
		     type: 'GET',
		     url: getMusicUrl(id),
		     dataType: 'json',
		     async: true,
		     timeout: 5000,
		     success: function (response) {
				refreshMusicStatus(false);
			 },
			 error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        console.log("ERROR MUSIC: " + textStatus + " " + errorThrown);
		    }     
		});
		 });
		//====================SETTINGS
		checkVersion();
		if (internal)
			$("#internal").html("TVs IPs: INTERNAL");
		else
			$("#internal").html("TVs IPs: PUBLIC");


		//===============================HOME
		refreshTrenchersStatus();
		 renderMoods();
		 renderTrenchersStatus();
		const para = $('.p_onoff');

		if (localStorage.getItem('theme')=='dark'){
			$("#themeswitcher").prop( "checked", true );
		}
		 
		$("#themeswitcher").on('click',function(e){
				loadDark(this.checked);
		});
		 
		$(".wrapper_onoff").on('change', function(e){
		  if(e.target.checked) {
		    para.addClass('morning');
			$("#onoffopen").addClass("onoff_selected");
			$("#onoffclose").removeClass("onoff_selected");
		    para.html('Trenchers Status: Open');
			trenchersCommand("open");
			smartDevicesPower(true);
		  } else {
		    para.removeClass('morning');
			  			$("#onoffclose").addClass("onoff_selected");
			$("#onoffopen").removeClass("onoff_selected");
		    para.html('Trenchers Status: Closed');
			  trenchersCommand("close");
			smartDevicesPower(false);
		  }
		  refreshTrenchersStatus();
		});
		 //=======================GUIDE
		 getGuide();
		 getGuide(getSports(),true);
		 $("#guideButtons").children().on('click', function(){
			 if (this.id == "sports")
				 getGuide(getSports());
			 else
				 getGuide(this.id);
		 });
		 $("#tuneGuide").on('click',function(){
			setChannel($('#guideChannelNum').val()); 
			 $('#modalGuide').modal('hide');
			
		 });
		 $('#guideAlbum').on('error',function(){
			 $('#guideAlbum').attr("src",'https://www.directv.com/img/movies.jpg');
		 })
		 attachGuide();

		 //=======================LIGHTS
		 renderDevices();
     }
	
    //******************

    

	fullHeight();
    
    loadMenu();
    showButtons();
    getConfig();

	checkVersion();
	$('#internetFailures').hide()
	loadDark(false,true);
});

