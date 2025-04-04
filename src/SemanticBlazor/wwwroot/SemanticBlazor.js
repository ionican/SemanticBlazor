﻿window.setTitle = (title) => {
  document.title = title;
};
window.getLanguage = () => {
  if (navigator.languages !== undefined)
    return navigator.languages[0];
  else
    return navigator.language;
};
window.getMonth = (indx, locale) => {
  var objDate = new Date();
  objDate.setDate(1);
  objDate.setMonth(indx);
  month = objDate.toLocaleString(locale, {month: "long"});
  return toCapitalCase(month);
};
window.getDayName = (indx, locale) => {
  var objDate = new Date(2020, 5, 1);
  objDate.setDate(objDate.getDate() + indx - 2);
  day = objDate.toLocaleString(locale, {weekday: 'short'});
  return toCapitalCase(day);
};
window.toCapitalCase = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

window.SemanticLists = {
  ScrollTop: function (id) {
    if ($("#" + id).length > 0) {
      $("html, body").animate({scrollTop: $('#' + id).offset().top - 70}, 250);
    }
  }
};

window.SemanticDropdown = {
  Init: function (id, settings) {
    $('#' + id).dropdown(settings);
  },
  InitRef: function (id, reference, settings) {
    $('#' + id).dropdown({
          fullTextSearch: settings.fullTextSearch,
          clearable: settings.clearable,
          allowAdditions: settings.allowAdditions,
          useLabels: settings.useLabels,
          maxSelections: settings.maxSelections,
          onChange: function (value) {
            reference.invokeMethodAsync('OnValueChanged', value);
          }
        }
    )
  },
  GetValue: function (id) {
    return $('#' + id).dropdown('get value');
  },
  SetValue: function (id, value) {
    $('#' + id).dropdown('set selected', value);
  },
  SetExactlyValue: function (id, value) {
    /*console.log("Set value: " + value);*/
    $('#' + id).dropdown('set exactly', value.split(','));
  },
  Clear: function (id) {
    $('#' + id).dropdown('clear');
    $('#' + id).find('.item').removeClass('filtered selected active');
  }
};

window.SemanticAccordion = {
  Init: function (id) {
    $('#' + id).accordion();
  }
};

window.SemanticDropdownMenu = {
  Init: function (id, on, action) {
    $('#' + id).dropdown({
      action: action,
      on: on
    });
  }
};

window.SemanticTabularMenu = {
  Init: function (id) {
    $('#' + id + ' .item').tab();
  }
};

window.SemanticModal = {
    Show: function (id, multiple, closable) {
        const modal = $('#' + id);
        modal
            .css('position', 'absolute')
            .modal({ allowMultiple: multiple, closable: closable })
            .modal('show');

        if (modal.hasClass('draggable')) {
            // Store state variables on the modal element
            modal.data('isDown', false);
            modal.data('offset', { x: 0, y: 0 });

            const header = modal.find('.header');

            // Remove any existing handlers first
            header.off('mousedown.dragModal');
            $(document).off('mouseup.dragModal-' + id);
            $(document).off('mousemove.dragModal-' + id);

            // Add namespaced event handlers for this specific modal
            header.on('mousedown.dragModal', function (e) {
                e.stopPropagation(); // Prevent event from reaching parent modals

                modal.data('isDown', true);
                const offset = {
                    x: e.clientX - parseInt(modal.css('left')) || 0,
                    y: e.clientY - parseInt(modal.css('top')) || 0
                };
                modal.data('offset', offset);

                // Bring this modal to the front
                modal.css('z-index', 1050 + $('.modal.visible').length);
            });

            $(document).on('mouseup.dragModal-' + id, function () {
                modal.data('isDown', false);
            });

            $(document).on('mousemove.dragModal-' + id, function (e) {
                if (modal.data('isDown')) {
                    const offset = modal.data('offset');
                    modal.css({
                        top: (e.clientY - offset.y) + 'px',
                        left: (e.clientX - offset.x) + 'px'
                    });
                }
            });
        }
    },
    Hide: function (id) {
        // Clean up event handlers
        $(document).off('mouseup.dragModal-' + id);
        $(document).off('mousemove.dragModal-' + id);
        $('#' + id).modal('hide');
    },
    SubmitForm: function (id) {
        $('#' + id).find("input[type='submit']").click();
    }
};

// window.SemanticModal = {
//   Show: function (id, multiple, closable) {
//     $('#' + id)
//         .modal(
//             {
//               allowMultiple: multiple,
//               closable: closable
//             })
//         .modal('show');
//   },
//   Hide: function (id) {
//     $('#' + id).modal('hide');
//   },
//   SubmitForm: function (id) {
//     $('#' + id).find("input[type='submit']").click();
//   }
// };

window.SemanticForm =
    {
      Submit: function (id) {
        $('#' + id).find("input[type='submit']").click();
      }
    };

window.NotifcationPanel = {
  HideNotificaion: function (id) {
    $('#' + id).slideUp(500, function () {
      $(this).remove();
    });
  },
  SetHidingTimeout: function (id) {
    setTimeout(function () {
      window.NotifcationPanel.HideNotificaion(id);
    }, 3000);
  }
};

window.SemanticDateTimeInput = {
  InitDateCalendar: function (id, locale, todayText, startCal, endCal) {
    if (locale === "" || locale === null) {
      locale = getLanguage();
    }
    if ((todayText === "" || todayText === null) && locale.indexOf('cs') !== -1) todayText = "Dnes";
    else todayText = "Today";
    $("#" + id).closest('.calendar').calendar(
        {
          type: "date",
          firstDayOfWeek: 1,
          ampm: false,
          monthFirst: false,
          today: true,
          endCalendar: endCal !== null ? $("#" + endCal).parent() : "",
          startCalendar: startCal !== null ? $("#" + startCal).parent() : "",
          formatter: {
            date: function (date, settings) {
              if (!date) return '';
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getFullYear();

              day = day < 10 ? "0" + day : day;
              month = month < 10 ? "0" + month : month;
              return day + '.' + month + '.' + year;
            }
          },
          onHidden: function () {
            var element = document.getElementById("inpt_" + id);
              if (element) {
                  var event = new Event('change');
                  element.dispatchEvent(event);
              }
          },
          text: {
            days: [getDayName(1, locale), getDayName(2, locale), getDayName(3, locale), getDayName(4, locale), getDayName(5, locale), getDayName(6, locale), getDayName(7, locale)],
            months: [getMonth(0, locale), getMonth(1, locale), getMonth(2, locale), getMonth(3, locale), getMonth(4, locale), getMonth(5, locale), getMonth(6, locale), getMonth(7, locale), getMonth(8, locale), getMonth(9, locale), getMonth(10, locale), getMonth(11, locale)],
            monthsShort: [getMonth(0, locale), getMonth(1, locale), getMonth(2, locale), getMonth(3, locale), getMonth(4, locale), getMonth(5, locale), getMonth(6, locale), getMonth(7, locale), getMonth(8, locale), getMonth(9, locale), getMonth(10, locale), getMonth(11, locale)],
            today: todayText
          }
        });
  },
  InitTimeCalendar: function (id, minutesEnabled, ampm) {
    $("#" + id).closest('.calendar').calendar(
        {
          type: "time",
          ampm: ampm,
          disableMinute: !minutesEnabled,
          formatter: {
            date: function (date, settings) {
              if (!date) return '';
              var hour = date.getHour();
              var minute = date.getMinute();
              return hour + ":" + minute;
            }
          },
          onHidden: function () {
            var element = document.getElementById("inpt_" + id);
              if (element) {
                  var event = new Event('change');
                  element.dispatchEvent(event);
              }
          },
          text: {
            now: 'Teď'
          }
        });
  },
  GetValue: function (id) {
    return $("#" + id).val();
  },
  SetDate: function (id, date) {
    $("#" + id).closest('.calendar').calendar("set date", date);
  }
};

window.Validation = {
  RefreshFieldsValidity: function () {
    setTimeout(function () {
      // Clear errors
      $(".field.error").each(function () {
        $(this).removeClass("error");
      });
      $(".form.error").each(function () {
        $(this).removeClass("error");
      });

      // Set errors
      $(".invalid").each(function () {
        $(this).closest(".field").addClass("error");
        $(this).closest("form").addClass("error");
      });

      $(".form.error").each(function () {
        $(this).find('.validation-message').show();
      });
    }, 250);
  }
};

window.Notification = {
  IncrementProgress: function () {
    $(".notifications .progress").each(function () {
      $(this).progress('update progress', parseInt($(this).attr("data-value")) + 1);
    });
  }
}

window.SemanticPopup = {
    Init: function (element) {
        $(element).popup();
    },
    Destroy: function (element) {
        $(element).popup('destroy');
    }
};