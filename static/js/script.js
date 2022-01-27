window.ononline = (event) => {
    document.getElementById("onlinecheck").className = "btn btn-success on onoff";
    document.getElementById("onlinecheck").innerHTML = "Online";
    document.getElementById("conection").className = "text-success";
    document.getElementById("conection").innerHTML = "Shared Area Connected";

};
window.onoffline = (event) => {
    document.getElementById("onlinecheck").className = "btn btn-danger off onoff";
    document.getElementById("onlinecheck").innerHTML = "Offline";
    document.getElementById("conection").className = "text-danger";
    document.getElementById("conection").innerHTML = "Shared Area Disconnected!";
};


$(document).ready(function () {
    if (localStorage.getItem('c1')) {
        dr = localStorage.getItem('c1').split(',');
        $("#c1").css({
            "left": dr[0],
            "top": dr[1]
        });
        dr = localStorage.getItem('c2').split(',');
        $("#c2").css({
            "left": dr[0],
            "top": dr[1]
        });
        dr = localStorage.getItem('c3').split(',');
        $("#c3").css({
            "left": dr[0],
            "top": dr[1]
        });
        dr = localStorage.getItem('c4').split(',');
        $("#c4").css({
            "left": dr[0],
            "top": dr[1]
        });
        dr = localStorage.getItem('c5').split(',');
        $("#c5").css({
            "left": dr[0],
            "top": dr[1]
        });
        dr = localStorage.getItem('c6').split(',');
        $("#c6").css({
            "left": dr[0],
            "top": dr[1]
        });
    }
});
$(document).unload(function () {
    var left = $("#c1").css("left");
    var top = $("#c1").css("top");
    localStorage.setItem('c1', [left, top]);
    var left = $("#c2").css("left");
    var top = $("#c2").css("top");
    localStorage.setItem('c2', [left, top]);
    var left = $("#c3").css("left");
    var top = $("#c3").css("top");
    localStorage.setItem('c3', [left, top]);
    var left = $("#c4").css("left");
    var top = $("#c4").css("top");
    localStorage.setItem('c4', [left, top]);
    var left = $("#c5").css("left");
    var top = $("#c5").css("top");
    localStorage.setItem('c5', [left, top]);
    var left = $("#c6").css("left");
    var top = $("#c6").css("top");
    localStorage.setItem('c6', [left, top]);

});
$("#resetlocation").click(function () {
    if (localStorage.getItem('c1')) {
        $("#c1").css({
            "left": "0px",
            "top": "0px"
        });
        $("#c2").css({
            "left": "0px",
            "top": "0px"
        });
        $("#c3").css({
            "left": "0px",
            "top": "0px"
        });
        $("#c4").css({
            "left": "0px",
            "top": "0px"
        });
        $("#c5").css({
            "left": "0px",
            "top": "0px"
        });
        $("#c6").css({
            "left": "0px",
            "top": "0px"
        });
        var left = $("#c1").css("left");
        var top = $("#c1").css("top");
        localStorage.setItem('c1', [left, top]);
        var left = $("#c2").css("left");
        var top = $("#c2").css("top");
        localStorage.setItem('c2', [left, top]);
        var left = $("#c3").css("left");
        var top = $("#c3").css("top");
        localStorage.setItem('c3', [left, top]);
        var left = $("#c4").css("left");
        var top = $("#c4").css("top");
        localStorage.setItem('c4', [left, top]);
        var left = $("#c5").css("left");
        var top = $("#c5").css("top");
        localStorage.setItem('c5', [left, top]);
        var left = $("#c6").css("left");
        var top = $("#c6").css("top");
        localStorage.setItem('c6', [left, top]);
    }

});
$("#setlocation").click(function () {
    var left = $("#c1").css("left");
    var top = $("#c1").css("top");
    localStorage.setItem('c1', [left, top]);
    var left = $("#c2").css("left");
    var top = $("#c2").css("top");
    localStorage.setItem('c2', [left, top]);
    var left = $("#c3").css("left");
    var top = $("#c3").css("top");
    localStorage.setItem('c3', [left, top]);
    var left = $("#c4").css("left");
    var top = $("#c4").css("top");
    localStorage.setItem('c4', [left, top]);
    var left = $("#c5").css("left");
    var top = $("#c5").css("top");
    localStorage.setItem('c5', [left, top]);
    var left = $("#c6").css("left");
    var top = $("#c6").css("top");
    localStorage.setItem('c6', [left, top]);

});

function Raise() {

    let val = Number(document.querySelector("#valueprice").value);
    val += 0.01;

    console.log(val);
    document.querySelector("#valueprice").value = "" + val.toFixed(2);

}
Raisetpsl = (e) => {
   
    let val = Number(document.querySelector(`#${e}`).value);
    val += 0.00001;

    console.log(val);
    document.querySelector(`#${e}`).value = "" + val.toFixed(5);

  }
lessetpsl = (e) => {
   

    let val = Number(document.querySelector(`#${e}`).value);
    if (val > 0.00000) {
        val -= 0.00001;
        console.log(val);
        document.querySelector(`#${e}`).value = "" + val.toFixed(5);
    }
  }
function less() {

    let val = Number(document.querySelector("#valueprice").value);
    if (val > 0.01) {
        val -= 0.01;
        console.log(val);
        document.querySelector("#valueprice").value = "" + val.toFixed(2);
    }

}
$(function () {
    $(".draggable").draggable();
});



$(document).ready(function () {
    $("#Search-1").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#UsersToOrder tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function () {
    $("#Search-2").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#lastOrders option").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
$(document).ready(function () {
    $("#Search-3").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#closeuserslist tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
})
$("#them").change(function () {
    if($(this).prop('checked')){
        $(".card").addClass("bg-dark");
        $(".card").addClass("text-light");

    }else{
        $(".card").removeClass("bg-dark");
        $(".card").removeClass("text-light");
    }
})
$("#setlocation").mouseup(function () { 
    $("#saveic").attr('src','https://img.icons8.com/nolan/37/checkmark.png')
});