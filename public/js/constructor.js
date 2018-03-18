function eventCalendar(url, eventDisplay){

    function monthInformation(year, month) {
        month--; 
        var startDate = new Date(year, month, 1);
        var endDate = new Date(year, month + 1, 0); 
        var startDay = startDate.getDay();
        var currentMonthTotalDays = endDate.getDate();
    
        var prevMonthEndDate = new Date(year, month, 0);
        var prevMonthDay = prevMonthEndDate.getDate() - startDay + 1;
        var nextMonthDay = 1;
        dates = [];
    
        for (var i = 0; i < 6 * 7; i += 1) {
            var date = void 0;
            if (i < startDay) {
                date = new Date(year, month - 1, prevMonthDay);
                prevMonthDay = prevMonthDay + 1;
            } else if (i > currentMonthTotalDays + (startDay - 1)) {
                date = new Date(year, month + 1, nextMonthDay);
                nextMonthDay = nextMonthDay + 1;
            } else {
                date = new Date(year, month, i - startDay + 1);
            }
            dates.push(date);
        }
        return dates;
    };

    function getHtmlDate(fullDate){
        month = fullDate.getMonth() +1;
        date = fullDate.getDate();
        year = fullDate.getFullYear();

        if (month <= 9 ) month = "0"+month;
        if (date <= 9) date = "0"+date;
    
        return year+"-"+month+"-"+date;
    }

    var months = ['Januray', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();
    var todayHTML = getHtmlDate(today);

    var currentMonth = today.getMonth()+1;
    var currentYear = today.getFullYear();

    if ($('#custom-calendar').length){
        monthInit(currentYear, currentMonth);
    }

    function monthInit(year, month){
        var dates = monthInformation(year, month);
        $('#custom-calendar #month-year').text(months[month-1]+" "+year);
        var i = 0;
        $('#custom-calendar td').each(function(){
            $(this).text(dates[i].getDate());
            $(this).attr('data-date', getHtmlDate(dates[i]));
            i++;
        });
        $('#custom-calendar td[data-date="'+todayHTML+'"]').addClass('active today');
        ajaxFetchEvents();
    }

    function monthReset(){
        $('#custom-calendar td').removeClass('active today');
        $('#custom-calendar .calendar-event').remove();
    }

    function ajaxFetchEvents(){
        var start = $('#date-start').attr('data-date');
        var end = $('#date-end').attr('data-date');
        
        $.ajax({
            url:url+"?start="+start+"&end="+end,
            type:"GET",
            success:function(events){
                events.forEach(function(event){
                    var eventElement = $('<div class="calendar-event" data-start-date="'+event.start+'">'+eventDisplay(event)+'</div>');
                    $('#custom-calendar #event-list').append(eventElement);
                    var dateCell = $('#custom-calendar td[data-date="'+event.start+'"]');
                    var numberOfDots = dateCell.children('span').length;
                    var eventDot = $('<span class="event-dot i'+numberOfDots+' '+event.privacy+'"></span>');
                    dateCell.append(eventDot);
                    if (dateCell.hasClass('today')) eventElement.show();
                });
                
            }
        });
    }

    // PREVIOUS MONTH BUTTON
    $('#custom-calendar #previous-month').click(function(){
        currentMonth--;
        if (currentMonth < 1){
            currentMonth = 12;
            currentYear -= 1;
        }
        monthReset();
        monthInit(currentYear, currentMonth);
    });

    // NEXT MONTH BUTTON
    $('#custom-calendar #next-month').click(function(){
        currentMonth++;
        if (currentMonth > 12){
            currentMonth = 1;
            currentYear += 1;
        }
        monthReset();
        monthInit(currentYear, currentMonth);
    });

    // ON DATE CLICK
    $('#custom-calendar td').click(function(){
        $('#custom-calendar td').removeClass('active');
        $(this).addClass('active');
        var clickedDate = $(this).data('date');
        $('#custom-calendar .calendar-event').hide();
        $('#custom-calendar .calendar-event[data-start-date="'+clickedDate+'"]').show();
    });

    // TODAY BUTTON
    $('#custom-calendar #today').click(function () {
        if (currentMonth == today.getMonth() +1){
            $('#custom-calendar td').removeClass('active');
            $('#custom-calendar .calendar-event').hide();
            $('#custom-calendar td[data-date="'+todayHTML+'"]').addClass('active');
            $('#custom-calendar .calendar-event[data-start-date="'+todayHTML+'"]').show();
        } else {
            monthReset();
            monthInit(today.getFullYear(), today.getMonth()+1);
        }
    });

}

function getFormattedTime(date) {
    var period = "AM";
    var minutes = date.getMinutes();
    if (minutes <= 9) mintes = "0"+minutes;
    var hours = date.getHours();
    if (hours >= 12) {
        hours = hours - 12
        period = "PM"; 
    } 
    if (hours <= 9) hours = "0"+hours;

    return hours+":"+minutes+" "+period;
}

eventCalendar('/calendar', function(event){

    return '<h3>'+event.title+'</h3>';

});