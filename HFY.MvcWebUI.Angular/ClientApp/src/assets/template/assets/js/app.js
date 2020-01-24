var APP = {};
APP.jQueryLoaded = !!window.jQuery;

// Unique Random ID
APP.guid = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
}();

// Assets Path
APP.ASSETS_PATH = './assets/';

// Theme Colors
APP.COLORS = {
  primary: '#2949EF',
  secondary: '#6c757d',
  success: '#06b5b6',
  info: '#00bcd4',
  warning: '#fd7e14',
  danger: '#FE4D2E',
  light: '#dee2e6',
  purple: '#6f42c1',
  indigo: '#6610f2',
  pink: '#e83e8c',
  yellow: '#FDA424',
  teal: '#20c997',
};

// PAGE PRELOADING ANIMATION
$(window).on('load', function () {
  setTimeout(function () {
    $('.preloader-backdrop').fadeOut(200);
  }, 0);
});

$(function () {

  // Custom scrollbars
  var custom_scrolls = document.querySelectorAll('.custom-scroll');
  for (var i = 0; i < custom_scrolls.length; i++) {
    new PerfectScrollbar(custom_scrolls[i]);
  }

  // Activate Tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // Activate Popovers
  $('[data-toggle="popover"]').popover();

  // Backdrop functional
  $.fn.backdrop = function () {
    $(this).toggleClass('shined');
    $('body').toggleClass('has-backdrop');
    return $(this);
  };

  $('.backdrop').on('click', closeShined);


  // CARD ACTIONS
  // ======================

  $('.card-collapse').on('click', function () {
    var card = $(this).closest('.card');
    card.toggleClass('collapsed-mode').children('.card-body').slideToggle(200);
  });
  $('.card-remove').on('click', function () {
    $(this).closest('.card').remove();
  });
  $('.fullscreen-link').click(function () {
    if ($('body').hasClass('fullscreen-mode')) {
      $('body').removeClass('fullscreen-mode');
      $(this).closest('.card').removeClass('card-fullscreen');
      $(window).off('keydown', toggleFullscreen);
    } else {
      $('body').addClass('fullscreen-mode');
      $(this).closest('.card').addClass('card-fullscreen');
      $(window).on('keydown', toggleFullscreen);
    }
  });
  function toggleFullscreen(e) {
    // pressing the ESC key - KEY_ESC = 27 
    if (e.which == 27) {
      $('body').removeClass('fullscreen-mode');
      $('.card-fullscreen').removeClass('card-fullscreen');
      $(window).off('keydown', toggleFullscreen);
    }
  }

});

// Helper functions

function theme_color(name) {
  return (name in APP.COLORS) ? APP.COLORS[name] : false;
}

function closeShined() {
  $('body').removeClass('has-backdrop');
  $('.shined').removeClass('shined');
}
// Layout options
APP.layout = {
  sidebarAlwaysDrawerMode: false
};

var nav_menu_width = $('.header-menu').outerWidth();

$(window).on('load resize scroll', function () {
  if ($(this).width() <= nav_menu_width) {

    if (!$('body').hasClass('drawer-menu')) {
      $('body').addClass('drawer-menu');
    }
  } else {
    $('body').removeClass('drawer-menu');
    if ($('#header-nav').hasClass('shined')) {
      closeShined();
    }
  }
});

$(function () {

  // SIDEBAR ACTIVATE METISMENU
  if ($(".metismenu").length) {
    $(".metismenu").metisMenu();
  }

  // NAVBAR TOGGLE
  $('#header-nav-toggler').click(function () {
    if ($('body').hasClass('drawer-menu')) {
      $('body').addClass("has-backdrop")
       //$('#header-nav').backdrop();
    } else {
      if ($('body').hasClass('header-nav-hidden')) {
        $('body').addClass('header-nav-hidden');
      }
      else {
        $('body').removeClass('header-nav-hidden');
      }
    }
  });

  // QUICK SIDEBAR TOGGLE
  $('.quick-sidebar-toggler').on('click', function (e) {
    e.preventDefault();
    $('#quick-sidebar').backdrop();
  });

});



//
// Forms
//

(function ($) {

  APP.updateTextFields = function () {
    var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=nuAPPer], input[type=search], textarea';
    $(input_selector).each(function (index, element) {
      var $this = $(this);
      if ($(element).val().length > 0 || $(element).is(':focus') || element.autofocus || $this.attr('placeholder') !== undefined) {
        $this.siblings('label').addClass('active');
      } else if ($(element)[0].validity) {
        $this.siblings('label').toggleClass('active', $(element)[0].validity.badInput === true);
      } else {
        $this.siblings('label').removeClass('active');
      }
    });
  };

  APP.validate_field = function (object) {
    var hasLength = object.attr('data-length') !== undefined;
    var lenAttr = parseInt(object.attr('data-length'));
    var len = object.val().length;

    if (len === 0 && object[0].validity.badInput === false && !object.is(':required')) {
      if (object.hasClass('validate')) {
        object.removeClass('valid');
        object.removeClass('invalid');
      }
    }
    else {
      if (object.hasClass('validate')) {
        // Check for character counter attributes
        if ((object.is(':valid') && hasLength && (len <= lenAttr)) || (object.is(':valid') && !hasLength)) {
          object.removeClass('invalid');
          object.addClass('valid');
        }
        else {
          object.removeClass('valid');
          object.addClass('invalid');
        }
      }
    }
  };

  APP.textareaAutoResize = function ($textarea) {
    // Textarea Auto Resize
    var hiddenDiv = $('.hiddendiv').first();
    if (!hiddenDiv.length) {
      hiddenDiv = $('<div class="hiddendiv common"></div>');
      $('body').append(hiddenDiv);
    }

    // Set font properties of hiddenDiv
    var fontFamily = $textarea.css('font-family');
    var fontSize = $textarea.css('font-size');
    var lineHeight = $textarea.css('line-height');
    var padding = $textarea.css('padding');

    if (fontSize) { hiddenDiv.css('font-size', fontSize); }
    if (fontFamily) { hiddenDiv.css('font-family', fontFamily); }
    if (lineHeight) { hiddenDiv.css('line-height', lineHeight); }
    if (padding) { hiddenDiv.css('padding', padding); }

    // Set original-height, if none
    if (!$textarea.data('original-height')) {
      $textarea.data('original-height', $textarea.outerHeight());
    }

    if ($textarea.attr('wrap') === 'off') {
      hiddenDiv.css('overflow-wrap', 'normal')
        .css('white-space', 'pre');
    }

    hiddenDiv.text($textarea.val() + '\n');
    var content = hiddenDiv.html().replace(/\n/g, '<br>');
    hiddenDiv.html(content);


    // When textarea is hidden, width goes crazy.
    // Approximate with half of window size

    if ($textarea.is(':visible')) {
      hiddenDiv.css('width', $textarea.width());
    }
    else {
      hiddenDiv.css('width', $(window).width() / 2);
    }


    /**
     * Resize if the new height is greater than the
     * original height of the textarea
     */
    if ($textarea.data('original-height') <= hiddenDiv.outerHeight()) {
      $textarea.css('height', hiddenDiv.outerHeight());
    } else if ($textarea.val().length < $textarea.data('previous-length')) {
      /**
       * In case the new height is less than original height, it
       * means the textarea has less text than before
       * So we set the height to the original one
       */
      $textarea.css('height', $textarea.data('original-height'));
    }
    $textarea.data('previous-length', $textarea.val().length);
  };

  $(document).ready(function () {

    // Text based inputs
    var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=nuAPPer], input[type=search], textarea';

    // Add active if form auto compvare
    $(document).on('change', input_selector, function () {
      if ($(this).val().length !== 0 || $(this).attr('placeholder') !== undefined) {
        $(this).siblings('label').addClass('active');
      }
      APP.validate_field($(this));
    });

    // Add active if input element has been pre-populated on document ready
    APP.updateTextFields();

    // Add active when element has focus
    $(document).on('focus', input_selector, function () {
      $(this).siblings('label, .prefix').addClass('active');
    });

    $(document).on('blur', input_selector, function () {
      var $inputElement = $(this);
      var selector = ".prefix";

      if ($inputElement.val().length === 0 && $inputElement[0].validity.badInput !== true && $inputElement.attr('placeholder') === undefined) {
        selector += ", label";
      }
      $inputElement.siblings(selector).removeClass('active');
      APP.validate_field($inputElement);
    });


    var text_area_selector = 'textarea.md-form-control.auto-resize'; //'.materialize-textarea';

    $(text_area_selector).each(function () {
      var $textarea = $(this);
      /**
       * Resize textarea on document load after storing
       * the original height and the original length
       */
      $textarea.data('original-height', $textarea.outerHeight());
      $textarea.data('previous-length', $textarea.val().length);
      APP.textareaAutoResize($textarea);
    });

    $(document).on('keyup keydown', text_area_selector, function () {
      APP.textareaAutoResize($(this));
    });

  }); // End of $(document).ready


  /**************************
   * Auto complete plugin  *
   *************************/
  $.fn.autocomplete = function (options) {
    // Defaults
    var defaults = {
      data: {},
      limit: Infinity,
      onAutocomplete: null,
      minLength: 1
    };

    options = $.extend(defaults, options);

    return this.each(function () {
      var $input = $(this);
      var data = options.data,
        count = 0,
        activeIndex = -1,
        oldVal,
        $inputDiv = $input.closest('.md-form'); // Div to append on

      // Check if data isn't empty
      if (!$.isEmptyObject(data)) {
        var $autocomplete = $('<ul class="autocomplete-content dropdown-content"></ul>');
        var $oldAutocomplete;

        // Append autocomplete element.
        // Prevent double structure init.
        if ($inputDiv.length) {
          $oldAutocomplete = $inputDiv.children('.autocomplete-content.dropdown-content').first();
          if (!$oldAutocomplete.length) {
            $inputDiv.append($autocomplete); // Set ul in body
          }
        } else {
          $oldAutocomplete = $input.next('.autocomplete-content.dropdown-content');
          if (!$oldAutocomplete.length) {
            $input.after($autocomplete);
          }
        }
        if ($oldAutocomplete.length) {
          $autocomplete = $oldAutocomplete;
        }

        // Highlight partial match.
        var highlight = function (string, $el) {
          var img = $el.find('img');
          var matchStart = $el.text().toLowerCase().indexOf("" + string.toLowerCase() + ""),
            matchEnd = matchStart + string.length - 1,
            beforeMatch = $el.text().slice(0, matchStart),
            matchText = $el.text().slice(matchStart, matchEnd + 1),
            afterMatch = $el.text().slice(matchEnd + 1);
          $el.html("<span>" + beforeMatch + "<span class='highlight'>" + matchText + "</span>" + afterMatch + "</span>");
          if (img.length) {
            $el.prepend(img);
          }
        };

        // Reset current element position
        var resetCurrentElement = function () {
          activeIndex = -1;
          $autocomplete.find('.active').removeClass('active');
        };

        // Remove autocomplete elements
        var removeAutocomplete = function () {
          $autocomplete.empty();
          resetCurrentElement();
          oldVal = undefined;
        };

        $input.off('blur.autocomplete').on('blur.autocomplete', function () {
          removeAutocomplete();
        });

        // Perform search
        $input.off('keyup.autocomplete focus.autocomplete').on('keyup.autocomplete focus.autocomplete', function (e) {
          // Reset count.
          count = 0;
          var val = $input.val().toLowerCase();

          // Don't capture enter or arrow key usage.
          if (e.which === 13 ||
            e.which === 38 ||
            e.which === 40) {
            return;
          }


          // Check if the input isn't empty
          if (oldVal !== val) {
            removeAutocomplete();

            if (val.length >= options.minLength) {
              for (var key in data) {
                if (data.hasOwnProperty(key) &&
                  key.toLowerCase().indexOf(val) !== -1) {
                  // Break if past limit
                  if (count >= options.limit) {
                    break;
                  }

                  var autocompleteOption = $('<li></li>');
                  if (!!data[key]) {
                    autocompleteOption.append('<img src="' + data[key] + '" class="right circle"><span>' + key + '</span>');
                  } else {
                    autocompleteOption.append('<span>' + key + '</span>');
                  }

                  $autocomplete.append(autocompleteOption);
                  highlight(val, autocompleteOption);
                  count++;
                }
              }
            }
          }

          // Update oldVal
          oldVal = val;
        });

        $input.off('keydown.autocomplete').on('keydown.autocomplete', function (e) {
          // Arrow keys and enter key usage
          var keyCode = e.which,
            liElement,
            numItems = $autocomplete.children('li').length,
            $active = $autocomplete.children('.active').first();

          // select element on Enter
          if (keyCode === 13 && activeIndex >= 0) {
            liElement = $autocomplete.children('li').eq(activeIndex);
            if (liElement.length) {
              liElement.trigger('mousedown.autocomplete');
              e.preventDefault();
            }
            return;
          }

          // Capture up and down key
          if (keyCode === 38 || keyCode === 40) {
            e.preventDefault();

            if (keyCode === 38 &&
              activeIndex > 0) {
              activeIndex--;
            }

            if (keyCode === 40 &&
              activeIndex < (numItems - 1)) {
              activeIndex++;
            }

            $active.removeClass('active');
            if (activeIndex >= 0) {
              $autocomplete.children('li').eq(activeIndex).addClass('active');
            }
          }
        });

        // Set input value
        $autocomplete.off('mousedown.autocomplete touchstart.autocomplete').on('mousedown.autocomplete touchstart.autocomplete', 'li', function () {
          var text = $(this).text().trim();
          $input.val(text);
          $input.trigger('change');
          removeAutocomplete();

          // Handle onAutocomplete callback.
          if (typeof (options.onAutocomplete) === "function") {
            options.onAutocomplete.call(this, text);
          }
        });

        // Empty data
      } else {
        $input.off('keyup.autocomplete focus.autocomplete');
      }
    });
  };


  /*******************
   *  Select Plugin  *
   ******************/

  $.fn.formSelect = function (callback) {
    $(this).each(function () {
      var $select = $(this);

      if ($select.hasClass('browser-default')) {
        return; // Continue to next (return false breaks out of entire loop)
      }

      var multiple = $select.attr('multiple') ? true : false,
        lastID = $select.attr('data-select-id'); // Tear down structure if Select needs to be rebuilt

      if (lastID) {
        $select.parent().find('span.caret').remove();
        $select.parent().find('input').remove();

        $select.unwrap();
        $('ul#select-options-' + lastID).remove();
      }

      // If destroying the select, remove the selelct-id and reset it to it's uninitialized state.
      if (callback === 'destroy') {
        $select.removeAttr('data-select-id').removeClass('initialized');
        $(window).off('click.select');
        return;
      }

      var uniqueID = APP.guid();
      $select.attr('data-select-id', uniqueID);
      var wrapper = $('<div class="select-wrapper"></div>');
      wrapper.addClass($select.attr('class'));
      if ($select.is(':disabled'))
        wrapper.addClass('disabled');
      var options = $('<ul id="select-options-' + uniqueID + '" class="dropdown-content select-dropdown ' + (multiple ? 'multiple-select-dropdown' : '') + '"></ul>'),
        selectChildren = $select.children('option, optgroup'),
        valuesSelected = [],
        optionsHover = false;

      var label = $select.find('option:selected').html() || $select.find('option:first').html() || "";

      // Function that renders and appends the option taking into
      // account type and possible image icon.
      var appendOptionWithIcon = function (select, option, type) {
        // Add disabled attr if disabled
        var disabledClass = (option.is(':disabled')) ? 'disabled ' : '';
        var optgroupClass = (type === 'optgroup-option') ? 'optgroup-option ' : '';
        var optionContent = multiple ? '<label class="checkbox checkbox-primary"><input type="checkbox"' + disabledClass + '/><span>' + option.html() + '</span></label>' : option.html();

        // add icons
        var icon_url = option.data('icon');
        var classes = option.attr('class');
        if (!!icon_url) {
          var classString = '';
          if (!!classes) classString = ' class="' + classes + '"';

          // Check for multiple type.
          options.append($('<li class="' + disabledClass + optgroupClass + '"><img alt="" src="' + icon_url + '"' + classString + '><span>' + optionContent + '</span></li>'));
          return true;
        }

        // Check for multiple type.
        options.append($('<li class="' + disabledClass + optgroupClass + '"><span>' + optionContent + '</span></li>'));
      };

      /* Create dropdown structure. */
      if (selectChildren.length) {
        selectChildren.each(function () {
          if ($(this).is('option')) {
            // Direct descendant option.
            if (multiple) {
              appendOptionWithIcon($select, $(this), 'multiple');

            } else {
              appendOptionWithIcon($select, $(this));
            }
          } else if ($(this).is('optgroup')) {
            // Optgroup.
            var selectOptions = $(this).children('option');
            options.append($('<li class="optgroup"><span>' + $(this).attr('label') + '</span></li>'));

            selectOptions.each(function () {
              appendOptionWithIcon($select, $(this), 'optgroup-option');
            });
          }
        });
      }

      options.find('li:not(.optgroup)').each(function (i) {
        $(this).click(function (e) {
          // Check if option element is disabled
          if (!$(this).hasClass('disabled') && !$(this).hasClass('optgroup')) {
            var selected = true;

            if (multiple) {
              $('input[type="checkbox"]', this).prop('checked', function (i, v) { return !v; });
              selected = toggleEntryFromArray(valuesSelected, i, $select);
              $newSelect.trigger('focus');
            } else {
              options.find('li').removeClass('active');
              $(this).toggleClass('active');
              $newSelect.val($(this).text());
            }

            activateOption(options, $(this));
            $select.find('option').eq(i).prop('selected', selected);
            // Trigger onchange() event
            $select.trigger('change');
            if (typeof callback !== 'undefined') callback();
          }

          e.stopPropagation();
        });
      });

      // Wrap Elements
      $select.wrap(wrapper);
      // Add Select Display Element
      var dropdownIcon = $('<span class="caret">&#9660;</span>');

      // escape double quotes
      var sanitizedLabelHtml = label.replace(/"/g, '&quot;');

      var $newSelect = $('<input type="text" class="select-dropdown" readonly="true" ' + (($select.is(':disabled')) ? 'disabled' : '') + ' data-activates="select-options-' + uniqueID + '" value="' + sanitizedLabelHtml + '"/>');
      $select.before($newSelect);
      $newSelect.before(dropdownIcon);

      $newSelect.after(options);
      // Check if section element is disabled
      if (!$select.is(':disabled')) {
        $newSelect.dropdown({ 'hover': false });
      }

      // Copy tabindex
      if ($select.attr('tabindex')) {
        $($newSelect[0]).attr('tabindex', $select.attr('tabindex'));
      }

      $select.addClass('initialized');

      $newSelect.on({
        'focus': function () {
          if ($('ul.select-dropdown').not(options[0]).is(':visible')) {
            $('input.select-dropdown').trigger('close');
            $(window).off('click.select');
          }
          if (!options.is(':visible')) {
            $(this).trigger('open', ['focus']);
            var label = $(this).val();
            if (multiple && label.indexOf(',') >= 0) {
              label = label.split(',')[0];
            }

            var selectedOption = options.find('li').filter(function () {
              return $(this).text().toLowerCase() === label.toLowerCase();
            })[0];
            activateOption(options, selectedOption, true);

            $(window).off('click.select').on('click.select', function () {
              multiple && (optionsHover || $newSelect.trigger('close'));
              $(window).off('click.select');
            });
          }
        },
        'click': function (e) {
          e.stopPropagation();
        }
      });

      $newSelect.on('blur', function () {
        if (!multiple) {
          $(this).trigger('close');
          $(window).off('click.select');
        }
        options.find('li.selected').removeClass('selected');
      });

      options.hover(function () {
        optionsHover = true;
      }, function () {
        optionsHover = false;
      });

      // Add initial multiple selections.
      if (multiple) {
        $select.find("option:selected:not(:disabled)").each(function () {
          var index = this.index;

          toggleEntryFromArray(valuesSelected, index, $select);
          options.find("li:not(.optgroup)").eq(index).find(":checkbox").prop("checked", true);
        });
      }

      /**
       * Make option as selected and scroll to selected position
       * @param {jQuery} collection  Select options jQuery element
       * @param {Element} newOption  element of the new option
       * @param {Boolean} firstActivation  If on first activation of select
       */
      var activateOption = function (collection, newOption, firstActivation) {
        if (newOption) {
          collection.find('li.selected').removeClass('selected');
          var option = $(newOption);
          option.addClass('selected');
          if (!multiple || !!firstActivation) {
            options.scrollTo(option);
          }
        }
      };

      // Allow user to search by typing
      // this array is cleared after 1 second
      var filterQuery = [],
        onKeyDown = function (e) {
          // TAB - switch to another input
          if (e.which == 9) {
            $newSelect.trigger('close');
            return;
          }

          // ARROW DOWN WHEN SELECT IS CLOSED - open select options
          if (e.which == 40 && !options.is(':visible')) {
            $newSelect.trigger('open');
            return;
          }

          // ENTER WHEN SELECT IS CLOSED - submit form
          if (e.which == 13 && !options.is(':visible')) {
            return;
          }

          e.preventDefault();

          // CASE WHEN USER TYPE varTERS
          var varter = String.fromCharCode(e.which).toLowerCase(),
            nonvarters = [9, 13, 27, 38, 40];
          if (varter && (nonvarters.indexOf(e.which) === -1)) {
            filterQuery.push(varter);

            var string = filterQuery.join(''),
              newOption = options.find('li').filter(function () {
                return $(this).text().toLowerCase().indexOf(string) === 0;
              })[0];

            if (newOption) {
              activateOption(options, newOption);
            }
          }

          // ENTER - select option and close when select options are opened
          if (e.which == 13) {
            var activeOption = options.find('li.selected:not(.disabled)')[0];
            if (activeOption) {
              $(activeOption).trigger('click');
              if (!multiple) {
                $newSelect.trigger('close');
              }
            }
          }

          // ARROW DOWN - move to next not disabled option
          if (e.which == 40) {
            if (options.find('li.selected').length) {
              newOption = options.find('li.selected').next('li:not(.disabled)')[0];
            } else {
              newOption = options.find('li:not(.disabled)')[0];
            }
            activateOption(options, newOption);
          }

          // ESC - close options
          if (e.which == 27) {
            $newSelect.trigger('close');
          }

          // ARROW UP - move to previous not disabled option
          if (e.which == 38) {
            newOption = options.find('li.selected').prev('li:not(.disabled)')[0];
            if (newOption)
              activateOption(options, newOption);
          }

          // Automaticaly clean filter query so user can search again by starting varters
          setTimeout(function () { filterQuery = []; }, 1000);
        };

      $newSelect.on('keydown', onKeyDown);
    });

    function toggleEntryFromArray(entriesArray, entryIndex, select) {
      var index = entriesArray.indexOf(entryIndex),
        notAdded = index === -1;

      if (notAdded) {
        entriesArray.push(entryIndex);
      } else {
        entriesArray.splice(index, 1);
      }

      select.siblings('ul.dropdown-content').find('li:not(.optgroup)').eq(entryIndex).toggleClass('active');

      // use notAdded instead of true (to detect if the option is selected or not)
      select.find('option').eq(entryIndex).prop('selected', notAdded);
      setValueToInput(entriesArray, select);

      return notAdded;
    }

    function setValueToInput(entriesArray, select) {
      var value = '';

      for (var i = 0, count = entriesArray.length; i < count; i++) {
        var text = select.find('option').eq(entriesArray[i]).text();

        i === 0 ? value += text : value += ', ' + text;
      }

      if (value === '') {
        value = select.find('option:disabled').eq(0).text();
      }

      select.siblings('input.select-dropdown').val(value);
    }
  };

}(jQuery));
