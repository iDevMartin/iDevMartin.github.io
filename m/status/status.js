

/* ──────────────────────────────────────────────────────────────────────────────────────────────────── *
 * :::::::::::::::::::::::::::::: S T A T U S   P A G E   S O F T W A R E ::::::::::::::::::::::::::::: *
 * ──────────────────────────────────────────────────────────────────────────────────────────────────── */


// ────────────────────────────────────────────────────────────────────────────────────────────────────


function daysBetween( first , second ) {

    var one = new Date( first.getFullYear( )  , first.getMonth( )   , first.getDate( )  );

    var two = new Date( second.getFullYear( ) , second.getMonth( )  , second.getDate( ) );


    // Do the math.

    var millisecondsPerDay  = 1000 * 60 * 60 * 24;

    var millisBetween       = two.getTime( ) - one.getTime( );

    var days                = millisBetween / millisecondsPerDay;


    // Round down.

    return Math.floor( days );

}


// ────────────────────────────────────────────────────────────────────────────────────────────────────


var monthNames = [  "January"   , "February"  , "March"     , "April"     , 

                    "May"       , "June"      , "July"      , "August"    , 

                    "September" , "October"   , "November"  , "December"  ];


// ────────────────────────────────────────────────────────────────────────────────────────────────────


function dateToString( date ) {

    return "<strong>" + monthNames[ date.getMonth( ) ] + ' ' + date.getDate( ) +

        'th of ' + date.getFullYear( ) + "</strong>";

}


// ────────────────────────────────────────────────────────────────────────────────────────────────────

function updateStatusScreen( StatusDates ) {

    view = document.getElementById( "view" );

    chart_datas = [ ];


    // ──────────────────────────────────────────────────────────────────────────────────────────


    for ( var index = 0; index < StatusDates.length; index++ ) {


        //
        // ─── DATA ───────────────────────────────────────────────────────────────────────
        //

        var _date = StatusDates[ index ];



        //
        // ─── DATES ──────────────────────────────────────────────────────────────────────
        //

        var _start_date = new Date( _date.start );

        var _end_date   = new Date( _date.end   );

        var _today      = new Date(             );



        //
        // ─── ELAPSED TIMES ──────────────────────────────────────────────────────────────
        //

        var _from_start_to_now = daysBetween( _start_date , _today    );

        var _from_start_to_end = daysBetween( _start_date , _end_date );

        var _from_now_to_end   = daysBetween( _today      , _end_date );



        //
        // ─── COLORING ───────────────────────────────────────────────────────────────────
        //

        var _chart_color = "#8C007F";

        if ( _from_start_to_now > _from_now_to_end ) {

            if ( _from_now_to_end < 30 ) {

                _chart_color = '#red';

            } else {

                _chart_color = '#B6005E';

            }

        }



        //
        // ─── CHART INFO ─────────────────────────────────────────────────────────────────
        //

        var _bar_chart_data = {

            labels: [ "Total Days" , "Days Past" , "Days Remaining" ],

            datasets: [

                {
                    fillColor: _chart_color,

                    strokeColor: _chart_color,

                    highlightFill: _chart_color,

                    highlightStroke: _chart_color,

                    data: [ _from_start_to_end , _from_start_to_now , _from_now_to_end ]
                }

            ]

        }

        chart_datas.push( _bar_chart_data );



        //
        // ─── HTML ───────────────────────────────────────────────────────────────────────
        //

        view.innerHTML += "<h3>" + _date.event + "</h3>"                                              +

                          "<h4>Timing</h4>"                                                           +

                          "<canvas id=\"canvas" + index + "\" width=\"720\" height=\"250\"></canvas>" +

                          "<p>Started at: " + dateToString(_start_date) + " and "                     +

                          "ends at: " + dateToString(_end_date)                                       +

                          "<br><b>" + _from_start_to_now + "</b> days have passed and <b>"            +

                          _from_now_to_end + "</b> days to go. (total of <b>" + _from_start_to_end    +

                          "</b> days)</p>"                                                            ;



        //
        // ─── TODO LISTS ─────────────────────────────────────────────────────────────────
        //

        var todo_string = '';

        for ( var index2 = 0; index2 < _date.todos.length; index2++ ) {


            // Getting the task

            var _task_check_box = _date.todos[ index2 ][ 0 ];

            var _task_title     = _date.todos[ index2 ][ 1 ];


            // Themeing the task

            var _taks_status = 'Active';

            if ( _task_check_box ) {

                _taks_status = 'Done';

            }


            // Generating the task

            todo_string +=  '<tr>'                          +

                            '<td>' + _task_title + '</td>'  +

                            '<td>' + _taks_status + '</td>' +

                            '</tr>'                         ;

        }


        //
        // ─── ADDING THE TABLES ──────────────────────────────────────────────────────────
        //

        if ( _date.todos.length != 0 ) {

            view.innerHTML +=   '<h4>Tasks</h4><table>'                         +

                                '<thead><td>Task</td><td>Status</td></thead>'   +

                                todo_string + '</table><br /><br />'            ;

        }


        // ────────────────────────────────────────────────────────────────────────────────

    }


    //
    // ─── ADDING THE CHARTS ────────────────────────────────────────────────────────────────────
    //

    for ( var index = 0; index < chart_datas.length; index++ ) {

        var ctx = document.getElementById( "canvas" + index ).getContext( "2d" );

        new Chart( ctx ).Bar( chart_datas[ index ] , {

            responsive: true

        });

    }

    // ──────────────────────────────────────────────────────────────────────────────────────────

}


//
// ─── MAIN ───────────────────────────────────────────────────────────────────────────────────────────
//

$.ajax( {

    url: "data.json",

    dataType: "text",

    success: function( dataTest ) {

        updateStatusScreen ( $.parseJSON( dataTest ) );

    }

} );


// ────────────────────────────────────────────────────────────────────────────────────────────────────
