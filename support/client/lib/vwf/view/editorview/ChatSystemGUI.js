define(
{
	initialize: function ()
	{
		$(document.body).append('<div id="ChatWindow" >' + '<div id="ChatBodyInner" class="text ui-widget-content ui-corner-all" >' + '	<table id="ChatLog" >' + '	</table>' + '</div>' + '<input type="text" name="ChatInput" id="ChatInput" class="text ui-widget-content ui-corner-all"/>		' + '</div>');

		
		function SendChatMessage()
		{
			if (document.PlayerNumber == null)
			{
				_Notifier.notify('You must log in to participate');
				return;
			}
			var parms = new Array();
			parms.push(JSON.stringify(
			{
				sender: document.PlayerNumber,
				text: $('#ChatInput').val()
			}));
			vwf_view.kernel.callMethod('index-vwf', 'receiveChat', parms);
			$('#ChatInput').val('');
		}

		function SendPM(text, receiver)
		{
			if (document.PlayerNumber == null)
			{
				_Notifier.notify('You must log in to participate');
				return;
			}
			var parms = new Array();
			parms.push(JSON.stringify(
			{
				sender: document.PlayerNumber,
				text: text,
				receiver: receiver
			}));
			vwf_view.kernel.callMethod('index-vwf', 'PM', parms);
		}

		function ToSafeID(value)
		{
			return value.replace(/[^A-Za-z0-9]/g, "");
		}

		function setupPmWindow(e)
		{
			var s = e;
			e = ToSafeID(e);
			if ($('#PM' + e).length == 1)
			{
				$('#PM' + e).dialog("open");
			}
			else
			{
				$(document.body).prepend("<div id='" + 'PM' + e + "' class='PrivateMessageWindow'/>");
				$('#PM' + e).dialog(
				{
					title: "Chat with " + s,
					autoOpen: true,
					height: 180
				});
				$('#PM' + e).attr('receiver', s);
				var setup = 
'<div class="text ui-widget-content ui-corner-all PrivateMessageWindowText">' + 
'	<div class="PrivateMessageTable" id="ChatLog' + e + '">' + 
'	</div>' + 
'</div>' + 
'<input type="text" name="ChatInput" id="ChatInput' + e + '" class="text ui-widget-content ui-corner-all" '+
	'/>'
				;
				$('#PM' + e).append(setup);
				$('#ChatInput' + e).attr('receiver', s);
				$('#ChatInput' + e).keypress(function (e)
				{
					var text = $(this).val();
					var rec = $(this).attr('receiver');
					var key;
					if (window.event) key = window.event.keyCode; //IE
					else key = e.which; //firefox
					if (key == 13)
					{
						SendPM(text, rec);
						$(this).val('');
					}
					//e.preventDefault();
					e.stopImmediatePropagation();
				});
				$('#ChatInput' + e).keydown(function (e)
				{
					e.stopImmediatePropagation();
				});
				$('#ChatInput' + e).keyup(function (e)
				{
					e.stopImmediatePropagation();
				});
				$('#ChatInput' + e).change(function (e)
				{
					e.stopImmediatePropagation();
				});

				// set up the dialog buttons
				$('#PM'+e).dialog('option', 'buttons', {
					'Close': function(evt,ui){
						$(this).dialog('close');
					},
					'Video Call': function(evt,ui){
						vwf.callMethod('index-vwf', 'rtcVideoCall', {'target': $('#ChatInput'+e).attr('receiver')});
					},
					'Call': function(evt,ui){
						vwf.callMethod('index-vwf', 'rtcCall', {'target': $('#ChatInput'+e).attr('receiver')});
					},
					'Send': function(evt,ui){
						var input = $('#ChatInput'+e);
						var text = input.val();
						var rec = input.attr('receiver');
						SendPM(text,rec);
						input.val('');
					}
				});
			}
		}

		function replaceURLWithHTMLLinks(text) {
		    var exp = /([(\b(https?|ftp|file):\/\/)(www\.)][-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		    return text.replace(exp,"<a href='$1'>$1</a>"); 
		}

		function PMReceived(e)
		{
			e = JSON.parse(e);
			if (e.sender != document.PlayerNumber && e.receiver != document.PlayerNumber) return;
			if (e.sender != document.PlayerNumber && e.receiver == document.PlayerNumber) setupPmWindow(e.sender);
			var color = 'darkred';
			if (e.sender == document.PlayerNumber) color = 'darkblue';
			
			var text = replaceURLWithHTMLLinks(e.text);

			if (e.sender != document.PlayerNumber) $('#ChatLog' + ToSafeID(e.sender)).append('<div class="ChatFromOther"><div class="ChatFromOtherLabel">' + e.sender + '</div><div class="ChatFromOtherText">' + text + '</div></div>');
			else $('#ChatLog' + ToSafeID(e.receiver)).append('<div class="ChatFromMe"><div class="ChatFromMeLabel">' + e.sender + '</div><div class="ChatFromMeText">' + text + '</div></div>');
			
			$('#ChatLog' + ToSafeID(e.receiver)).parent().animate({ scrollTop: $('#ChatLog' + ToSafeID(e.receiver)).height() }, "slow");
			$('#ChatLog' + ToSafeID(e.sender)).parent().animate({ scrollTop: $('#ChatLog' + ToSafeID(e.sender)).height() }, "slow");
		}

		function ChatMessageReceived(e)
		{
			var message = JSON.parse(e);
			var color = 'darkred';
			if (message.sender == document.PlayerNumber) color = 'darkblue';
			$('#ChatLog').append('<tr><td class="GlobalChatLabel">' + message.sender + '</td><td class="GlobalChatText">' + message.text + '</td></tr>');
			_Notifier.notify(message.sender + ": " + message.text);
			$('#ChatLog').parent().animate({ scrollTop: $('#ChatLog').height() }, "slow");
		}

		function disableEnterKey(e)
		{
			var key;
			if (window.event) key = window.event.keyCode; //IE
			else key = e.which; //firefox
			if (key == 13) return false;
			else return true;
		}
		$('#ChatInput').keyup(ChatKeypress);
		function ChatKeypress(e)
		{
			var key;
			if (window.event) key = window.event.keyCode; //IE
			else key = e.which; //firefox
			if (key == 13)
			{
				SendChatMessage();
				return false;
			}
			return true;
		}

		function PMKeypress(event, to)
		{
			var key;
			if (window.event) key = window.event.keyCode; //IE
			else key = e.which; //firefox
			if (key == 13)
			{
				SendPMMessage('test', to);
				return false;
			}
			return true;
		}
		$('#ChatWindow').dialog(
		{
			position: ['left', 'top'],
			width: 300,
			height: 400,
			title: "Chat Window",
			buttons: {
				"Close": function ()
				{
					$(this).dialog("close");
				},
				"Send": function ()
				{
					SendChatMessage();
				}
			},
			autoOpen: false
		});
		window.SendChatMessage = SendChatMessage;
		window.ChatMessageReceived = ChatMessageReceived;
		window.PMReceived = PMReceived;
		window.SendPM = SendPM;
		window.ToSafeID = ToSafeID;
		window.setupPmWindow = setupPmWindow;
	}
});
