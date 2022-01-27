var socket = io.connect('http://' + document.domain + ':' + location.port);
$(".closewin").click(function () {
  socket.emit('leave', {
    username: username,
    pic: pic,
    room: room,
  })
})
$(document).ready(function () {

  $('#MassageBoxId').empty();
  socket.on('connect', function () {
    console.log("dddddddddddd");
    socket.emit('join', {
      username: username,
      pic: pic,
      room: room,
    })
    console.log("Rooooom");
  })
})
socket.on('connect', function () {
  socket.emit('my event', {
    data: 'User Connected',
    pic: pic,
    room: room,
  })
  var form = $('#SendMessage').click(function (e) {
    if ($('#MessageHolder').val() != '') {
      e.preventDefault()
      let user_input = $('#MessageHolder').val()
      socket.emit('Message', {
        type: "normal",
        user_name: user_name,
        message: user_input,
        pic: pic,
        room: room,
      })
      $('#MessageHolder').val('').focus()
    }
  })
})
socket.on('Message', function (msg) {
  console.log(msg)
  if (msg.type == "normal") {

    if (msg.user_name == username) {
      $('#MassageBoxId').prepend(
        `<div class=" d-flex flex-row justify-content-xxl-between align-items-md-end w-390px">
            <div class="chatbox text-light" id="${msg.user_name}" style="background-color: rgb(0, 107, 214);">
  
              <p>${msg.message}</p>
            </div>
            <img class="profimg" src="/static/img/Profile-Pictures/${msg.pic}.png" alt="Avatar">
  
          </div>
`
      )
    } else {
      $('#MassageBoxId').prepend(
        `        <div class=" d-flex flex-row justify-content-xl-between align-items-md-end w-390px">
          <img class="profimg " src="/static/img/Profile-Pictures/${msg.pic}.png" alt="Avatar">

          <div class="chatbox" id="${msg.user_name}">
            <div> <b style="color:darkviolet;">${msg.user_name}</b> <span class="text-secondary "${msg.user_name}"
                style="display: none;">@${msg.user_name}</span></div>
            <p>${msg.message}</p><span class="time-right">${msg.time}</span>
          </div>

        </div>
`
      )
    }
  } else {
    if (msg.type == "checkOnline") {
      socket.emit('Message', {
        room: room,
        type: "ConfigOnline",
        pic: pic,
        user_name: user_name
      })
    } else {
      if (msg.type == "Order") {
        console.log(msg.ids);
        if (msg.ids.search(user_name) >= 0) {
          $("#Ordertext").text(`{
            "type":"Order",
            "title": "${msg.title}",
            "value": "${msg.value}",
            "Ordertype": "${msg.Ordertype}",
            "code":"${msg.code}",
            "tp":"${msg.tp}",
            "sl":"${msg.sl}"
          }`);
        }


      } else {
        if (msg.type == username) {

          $("#Ordertext").text(`{
            "type":"request",
            "request": "${msg.request}"
          }`);
        } else {
          if (msg.type == "close") {
            if (msg.ids.search(user_name) >= 0) {
              $.when($.get(`/user/CodeTomqlCode?code=${msg.code}&t=` + Math.random())).then(function (data, textStatus, jqXHR) {
                $("#Ordertext").text(`{
                "type":"close",
                "code":"${msg.code}",
                "mqlCode": "${data}"
              }`);
              })

            }
          }
        }
      }
    }
  }

})
$('.emojiFrame2').click(function () {
  $('.emojiPicker').toggle(300);
})
$('.emojiFrame1').click(function () {
  $('.emojiPicker').hide(300);
})
$('.emoji').click(function () {
  var t = $(this).attr('id');

  $('#MessageHolder').val($('#MessageHolder').val() + "&#" + t + ";");
})

function sendGetedOrder(title, value, Ordertype, code, tp, sl,mt) {
  $.when($.get(`/send/GetedOrder?title=${title}&value=${value}&Ordertype=${Ordertype}&code=${code}&tp=${tp}&sl=${sl}&mt=${mt}&t=` + Math.random())).then(function (data, textStatus, jqXHR) {
    clearOrdertext()
  })
}

function clearOrdertext() {
  $("#Ordertext").text("")
}

function priceIsChange(code, price) {
  socket.emit('Message', {
    type: "priceIsChange",
    user_name: username,
    code: code,
    price: price,
    pic: pic,
    room: room,
  })
  console.log("Rooooom");
}

function success(code, price, mqlCode) {


  socket.emit('Message', {
    type: "success",
    user_name: username,
    code: code,
    price: price,
    mqlCode: mqlCode,
    pic: pic,
    room: room,
  })
  console.log("Rooooom");
}

function lossed(code, meta_data) {
  socket.emit('Message', {
    type: "lossed",
    meta_data: meta_data,
    user_name: username,
    code: code,
    pic: pic,
    room: room,
  })
  console.log("Rooooom");
}

function closed(code, price) {
  socket.emit('Message', {
    type: "closed",
    username: username,
    code: code,
    price: price,
    pic: pic,
    room: room,
  })
  console.log("Rooooom");
}
function autoClosed(code) {
  socket.emit('Message', {
    type: "autoClosed",
    username: username,
    code: code,
    pic: pic,
    room: room,
  })
  console.log("Rooooom");
}
$("body").keypress(function (e) { 
  var key = e.which;
  if(key == 13)  
   {
  if ($('#MessageHolder').val() != '') {
    let user_input = $('#MessageHolder').val()
    socket.emit('Message', {
      type: "normal",
      user_name: user_name,
      message: user_input,
      pic: pic,
      room: room,
    })
    $('#MessageHolder').val('').focus()
  }}
  });
function GetTpSlOrders() {
  $.when($.get(`/get/TpSlOrders?t=` + Math.random())).then(function (data, textStatus, jqXHR) {

    $('#TpSlOrders').text(JSON.stringify(data));
  })
}