
function Header(calendar, options) {
	var t = this;
	
	
	// exports
	t.render = render;
	t.destroy = destroy;
	t.updateTitle = updateTitle;
	t.activateButton = activateButton;
	t.deactivateButton = deactivateButton;
	t.disableButton = disableButton;
	t.enableButton = enableButton;
	t.menu = menu;
	
	
	// locals
	var element = $([]);
	var tm;
	var menuShown
	


	function render() {
		tm = options.theme ? 'ui' : 'fc';
		var sections = options.header;
		if (sections) {
			element = $("<table class='fc-header' style='width:100%'/>")
			//element.append(renderResourseList())
			element.append(
					$("<tr class='header-buttons' />")
						.append(renderSection('left'))
						.append(renderSection('center'))
						.append(renderSection('right'))
				);
			element.append("<tr><td colspan='3'/></tr>")
			return element;
		}
	}
	
	
	function destroy() {
		element.remove();
	}
	
	
	function renderSection(position) {
		var e = $("<td class='fc-header-" + position + "'/>");
		var buttonStr = options.header[position];
		if (buttonStr) {
			$.each(buttonStr.split(' '), function(i) {
				if (i > 0) {
					e.append("<span class='fc-header-space'/>");
				}
				var prevButton;
				$.each(this.split(','), function(j, buttonName) {
					if (buttonName == 'title') {
						e.append("<span class='fc-header-title'><h2>&nbsp;</h2></span>");
						if (prevButton) {
							prevButton.addClass(tm + '-corner-right');
						}
						prevButton = null;
					}else{
						var buttonClick;
						if (calendar[buttonName]) {
							buttonClick = calendar[buttonName]; // calendar method
						}
						else if (fcViews[buttonName]) {
							buttonClick = function() {
								button.removeClass(tm + '-state-hover'); // forget why
								calendar.changeView(buttonName);
							};
						}
						else if (t[buttonName]) {
								buttonClick = t[buttonName]; // header method
							}
						if (buttonClick) {

							// smartProperty allows different text per view button (ex: "Agenda Week" vs "Basic Week")
							var themeIcon = smartProperty(options.themeButtonIcons, buttonName);
							var normalIcon = smartProperty(options.buttonIcons, buttonName);
							var defaultText = smartProperty(options.defaultButtonText, buttonName);
							var customText = smartProperty(options.buttonText, buttonName);
							var html;

							if (customText) {
								html = htmlEscape(customText);
							}
							else if (themeIcon && options.theme) {
								html = "<span class='ui-icon ui-icon-" + themeIcon + "'></span>";
							}
							else if (normalIcon && !options.theme) {
								html = "<span class='fc-icon fc-icon-" + normalIcon + "'></span>";
							}
							else {
								html = htmlEscape(defaultText || buttonName);
							}

							var button = $(
								"<span class='fc-button fc-button-" + buttonName + " " + tm + "-state-default'>" +
									html +
								"</span>"
								)
								.click(function() {
									if (!button.hasClass(tm + '-state-disabled')) {
										buttonClick();
									}
								})
								.mousedown(function() {
									button
										.not('.' + tm + '-state-active')
										.not('.' + tm + '-state-disabled')
										.addClass(tm + '-state-down');
								})
								.mouseup(function() {
									button.removeClass(tm + '-state-down');
								})
								.hover(
									function() {
										button
											.not('.' + tm + '-state-active')
											.not('.' + tm + '-state-disabled')
											.addClass(tm + '-state-hover');
									},
									function() {
										button
											.removeClass(tm + '-state-hover')
											.removeClass(tm + '-state-down');
									}
								)
								.appendTo(e);
							disableTextSelection(button);
							if (!prevButton) {
								button.addClass(tm + '-corner-left');
							}
							prevButton = button;
						}
					}
				});
				if (prevButton) {
					prevButton.addClass(tm + '-corner-right');
				}
			});
		}
		return e;
	}

	function menu() {
		if (!menuShown){
      var menuContent = $(renderMenu())
      menuContent.find(".close").click(function() {
      	closeMenu();
      })
			$(".fc-menu-container").append(menuContent)
			setupDatePicker(menuContent)
			menuShown = true
		}
	}

	function renderMenu() {
		var html;
		html = "<div class='fc-menu-content'>";
		html += "<span class='close'>X</span>";
		html += "<div class='fc-date-picker'></div>";
		html += "<span>Calendars</span>";
		if (options.resourceList) {
			html += "<div class='fc-resource-list'>" + renderResourseList() + "</div>";
		}
		html += "</div>";
		return html;
	}

	function closeMenu() {
		$(".fc-menu-container").html("")
		menuShown = false
	}

	function setupDatePicker(menuElement) {
		var datePickerEl = $(menuElement.find('.fc-date-picker'))
		datePickerEl.datepicker({
			dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
			showOtherMonths: true
		})
	}

	function renderResourseList() {
    var resources = "<ul>";
    $.each(options.resourceList, function(index, res){
    	resources += "<li>" + res.name
    	resources += "<input "
    	res.shown ? resources += 'checked': null 
    	resources += " type='checkbox'/>"
    	resources += "</li>";
    })
    resources += "</ul>"
	  return resources;
	}
	
	
	function updateTitle(html) {
		element.find('h2')
			.html(html);
	}
	
	
	function activateButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.addClass(tm + '-state-active');
	}
	
	
	function deactivateButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.removeClass(tm + '-state-active');
	}
	
	
	function disableButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.addClass(tm + '-state-disabled');
	}
	
	
	function enableButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.removeClass(tm + '-state-disabled');
	}


}
