var socket = io.connect('http://' + document.domain + ':' + location.port);
$(".closewin").click(function () {
  socket.emit('leave', {
    username: username,
    pic: pic,
    room: room,
  })
})
$("#showorderd").click(function () {
  alert($("#lastOrders").val());
})
$("#closebtn").click(function () {
  var ids = "@";
  $(".closeuserslistw").show(function () {
    if ($(this).prop('checked')) {
      ids += $(this).attr('id') + "@";
    }
  })
  var code1 = $("#lastOrders").val();
  socket.emit('Message', {
    type: "close",
    ids: ids,
    code: code1,
    username: user_name,
    room: room,
  });
})
$("#lastOrders").change(function () {
  var code = $(this).val();
  $("#closeuserslist").empty();
  $.when($.get(`/admin/order/users?code=${code}&t=` + Math.random())).then(function (data, textStatus, jqXHR) {

    var dic = data;
    var users = dic["users"];
    var prices = dic["prices"];
    for (let index = 0; index < users.length; index++) {
      const username = users[index];
      const Price = prices[index];

      $("#closeuserslist").prepend(`
      
      <tr>
      <td>
        <div class="form-check form-switch">
          <input type="checkbox" class="form-check-input closeuserslistw" id="${username}">
          <label class="form-check-label" for="${username}">${username}<span
              class="text-secondary">${Price}</span></label>
        </div>
      </td>
    </tr>
      `)
    }
    console.log("lkjhgfrtyuikop");
  })

})
$("#showuserss").click(function () {
  var code = $("#lastOrders").val();
  $("#closeuserslist").empty();
  $.when($.get(`/admin/order/users?code=${code}&t=` + Math.random())).then(function (data, textStatus, jqXHR) {

    var dic = data;
    var users = dic["users"];
    var prices = dic["prices"];
    for (let index = 0; index < users.length; index++) {
      const username = users[index];
      const Price = prices[index];

      $("#closeuserslist").prepend(`
      
      <tr>
      <td>
        <div class="form-check form-switch">
          <input type="checkbox" class="form-check-input" id="${username}">
          <label class="form-check-label" for="${username}">${username}<span
              class="text-secondary">${Price}</span></label>
        </div>
      </td>
    </tr>
      `)
    }

  })

})
$('#OneClickTrade').change(function () {
  $('#Confirmbtn').hide(300);
  $("#Sellbtn").removeClass('btn-secondary');
  $("#Buybtn").removeClass('btn-secondary');
  $("#Buybtn").addClass('btn-success');
  $("#Sellbtn").addClass('btn-danger');
  stat = "";
})

$("#Buybtn").click(function () {
  stat = "Buy";
  if ($('#OneClickTrade').prop('checked') == false) {
    $('#Confirmbtn').hide(300);
    $("#Sellbtn").removeClass('btn-danger');
    $("#Buybtn").removeClass('btn-secondary');
    $("#Buybtn").addClass('btn-success');
    $("#Sellbtn").addClass('btn-secondary');
    $('#Confirmbtn').show(300);
  } else {
    SendOrder(stat);
  }
})
$("#Sellbtn").click(function () {
  stat = "Sell";
  if ($('#OneClickTrade').prop('checked') == false) {

    $('#Confirmbtn').hide(300);
    $("#Sellbtn").addClass('btn-danger');
    $("#Sellbtn").removeClass('btn-secondary');

    $("#Buybtn").removeClass('btn-success');
    $("#Buybtn").addClass('btn-secondary');
    $('#Confirmbtn').show(300);

  } else {
    SendOrder(stat);
  }
})
$('#Confirmbtn').click(function () {
  $('#Confirmbtn').hide(300);
  SendOrder(stat);
  $("#Sellbtn").removeClass('btn-secondary');
  $("#Buybtn").removeClass('btn-secondary');
  $("#Buybtn").addClass('btn-success');
  $("#Sellbtn").addClass('btn-danger');
  stat = "";

})

function SendOrder(OrderType) {
  var ids = "@";
  $(".UserToOrder").show(function () {
    if ($(this).prop('checked')) {
      ids += $(this).attr('id') + "@";
    }
  })
  console.log(ids);
  var symbol = $('#symbolsselect').val();
  var value = $('#valueprice').val();
  var tp = $('#tp').val();
  var sl = $('#sl').val();
  if (tp == '') {
    tp = '0.00000';
  }
  if (sl == '') {
    sl = '0.00000';
  }

  $.when($.get("/get/code?t=" + Math.random())).then(function (data, textStatus, jqXHR) {
    const code1 = data;
    socket.emit('Message', {
      type: "Order",
      title: symbol,
      value: value,
      ids: ids,
      code: code1,
      tp: tp,
      sl: sl,
      Ordertype: OrderType,
      username: user_name,
      room: room,
    });
    $("#lastOrders").prepend(`<option value="${code1}">${symbol} ${OrderType} ${value}</option>`);
  });


}

$(document).ready(function () {

  $('#MassageBoxId').empty();
  socket.on('connect', function () {
    console.log("dddddddddddd");
    socket.emit('join', {
      username: username,
      room: room,
      pic: pic,
    })
    console.log("Rooooom");
  })
  $(".useridlist").removeClass('list-group-item-success');
  $(".useridlist").addClass('list-group-item-danger');
  socket.emit('Message', {
    type: "checkOnline",
    room: room,
    pic: pic,
  })
  $("#UsersToOrder").empty();
})
socket.on('connect', function () {
  socket.emit('my event', {
    data: 'User Connected',
    room: room,
    pic: pic,
  })
  var form = $('#SendMessage').click(function (e) {
    if ($('#MessageHolder').val() != '') {
      e.preventDefault();
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
  var form = $('#RefreshUsers').click(function (e) {
    e.preventDefault();
    $(".useridlist").removeClass('list-group-item-success');
    $(".useridlist").addClass('list-group-item-danger');
    socket.emit('Message', {
      type: "checkOnline",
      room: room,
      pic: pic
    })
    $("#UsersToOrder").empty();

  })
})
socket.on('Message', function (msg) {
  console.log(msg)
  if (msg.type == "normal") {

    if (msg.user_name == username) {
      $('#MassageBoxId').prepend(
        `<div class=" d-flex flex-row justify-content-xxl-between align-items-md-end w-390px">
            <div class=" chatbox text-light" id="${msg.user_name}" style="background-color: rgb(0, 107, 214);">
  
              <p>${msg.message}</p>
              <br><span
              class="text-light">${msg.time}</span>
            </div>
            <img class="profimg" src="/static/img/Profile-Pictures/${msg.pic}.png" alt="Avatar">
  
          </div>
`
      )
    } else {
      $('#MassageBoxId').prepend(
        `        <div class=" d-flex flex-row justify-content-xl-between align-items-md-end w-390px">
          <img class="profimg " src="/static/img/Profile-Pictures/${msg.pic}.png" alt="Avatar">

          <div class="card chatbox" id="${msg.user_name}">
            <div> <b style="color:darkviolet;">${msg.user_name}</b> <span class="text-secondary "${msg.user_name}"
                style="display: none;">@${msg.user_name}</span></div>
            <p>${msg.message}</p><span class="time-right">${msg.time}</span>
          </div>

        </div>
`
      )
    }
    if (msg.message.search("join") >= 0 && msg.user_name != username) {
      $(".useridlist").removeClass('list-group-item-success');
      $(".useridlist").addClass('list-group-item-danger');
      socket.emit('Message', {
        type: "checkOnline",
        room: room,
        pic: pic
      })
      $("#UsersToOrder").empty();

    }
  } else {
    if (msg.type == "ConfigOnline") {

      $('#MassageBoxId').prepend(
        `        <div class=" d-flex flex-row justify-content-xl-between align-items-md-end w-390px">
          <img class="profimg " src="/static/img/Profile-Pictures/${msg.pic}.png" alt="Avatar">

          <div class="chatbox" id="${msg.user_name}">
            <div> <b style="color:darkviolet;">${msg.user_name}</b> <span class="text-secondary "${msg.user_name}"
                style="display: none;">@${msg.user_name}</span></div>
            <p>${msg.user_name} im Online</p><span class="time-right">${msg.time}</span>
          </div>

        </div>
`

      )
      $(`#${msg.user_name}`).removeClass('list-group-item-danger');
      $(`#${msg.user_name}`).addClass('list-group-item-success');
      $("#UsersToOrder").prepend(`
      <tr>
      <td>
        <div class="form-check form-switch">
          <input type="checkbox" class="form-check-input UserToOrder" id="${msg.user_name}">
          <label class="form-check-label" for="${msg.user_name}">${msg.user_name}<br><span
              class="text-secondary">${msg.time}</span></label>
        </div>
      </td>
    </tr>`)


    } else {
      if (msg.type == "priceIsChange") {
        $('#MassageBoxId').prepend(
          `<div class=" d-flex flex-row justify-content-xl-between align-items-md-end w-390px ${msg.user_name}">
        <img class="profimg " src="/static/img/Profile-Pictures/${msg.pic}.png" alt="Avatar">

        <div class="chatbox" id="${msg.user_name}">
          <div> <b style="color:darkviolet;">${msg.user_name}</b><span class="text-secondary ${msg.user_name}"
              style="display: none;">@${msg.user_name}</span></div>
          <p><b><u>Price : ${msg.price} </u></b>Are you Accept Me?<img src="https://img.icons8.com/nolan/64/no-cash.png"/></p><span class="time-right">${msg.time}</span>
          <button onclick="Accept('${msg.user_name}')" class="btn btn-success Accept">Accept</button>
          <button onclick="reject('${msg.user_name}')" class="btn btn-danger reject">reject</button>
        </div>
      </div>`);
      } else {
        if (msg.type == "success") {
          $('#MassageBoxId').prepend(
            `        <div class=" d-flex flex-row justify-content-xl-between align-items-md-end w-390px">
              <img class="profimg " src="/static/img/Profile-Pictures/${msg.pic}.png" alt="Avatar">
    
              <div class="chatbox text-dark " style="background-color:rgb(0, 182, 39);" id="${msg.user_name}">
                <div> <b style="color:darkviolet;">${msg.user_name}</b> <span class="text-secondary "${msg.user_name}"
                    style="display: none;">@${msg.user_name}</span></div>
                <p>Order ${msg.code} is successful with price ${msg.price} <img src="https://img.icons8.com/nolan/64/ok-hand.png"/></p><span class="text-dark time-right">${msg.time}</span>
              </div>
    
            </div>
    `
          )
        } else {
          if (msg.type == "lossed") {
            $('#MassageBoxId').prepend(
              `        <div class=" d-flex flex-row justify-content-xl-between align-items-md-end w-390px">
                <img class="profimg " src="/static/img/Profile-Pictures/${msg.pic}.png" alt="Avatar">
      
                <div class="chatbox bg-danger text-light" id="${msg.user_name}">
                  <div> <b style="color:darkviolet;">${msg.user_name}</b> <span class="text-secondary "${msg.user_name}"
                      style="display: none;">@${msg.user_name}</span></div>
                  <p>Order ${msg.code} is Lossed<img src="https://img.icons8.com/nolan/64/bearish.png"/> </p><span class="text-light time-right">${msg.time}</span>
                </div>
      
              </div>
      `
            )
          } else {
            if (msg.type == "closed") {
              $('#MassageBoxId').prepend(
                `        <div class=" d-flex flex-row justify-content-xl-between align-items-md-end w-390px">
                  <img class="profimg " src="/static/img/Profile-Pictures/${msg.pic}.png" alt="Avatar">
        
                  <div class="chatbox bg-warning" id="${msg.username}">
                    <div> <b style="color:darkviolet;">${msg.username}</b> <span class="text-secondary "${msg.username}"
                        style="display: none;">@${msg.username}</span></div>
                    <p>Order ${msg.code} is Closed in price ${msg.price}<img src="https://img.icons8.com/nolan/64/close-sign.png"/></p><span class="text-dark time-right">${msg.time}</span>
                  </div>
        
                </div>
        `
              )
            } else {
              if (msg.type == "autoClosed") {
                $('#MassageBoxId').prepend(
                  `        <div class=" d-flex flex-row justify-content-xl-between align-items-md-end w-390px">
                      <img class="profimg " src="/static/img/Profile-Pictures/${msg.pic}.png" alt="Avatar">
            
                      <div class="chatbox bg-info" id="${msg.username}">
                        <div> <b style="color:darkviolet;">${msg.username}</b> <span class="text-secondary "${msg.username}"
                            style="display: none;">@${msg.username}</span></div>
                        <p>Order ${msg.code} is Auto Closed<img src="https://img.icons8.com/nolan/64/close-sign.png"/></p><span class="text-dark time-right">${msg.time}</span>
                      </div>
            
                    </div>
            `
                )
              }
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

function Accept(id) {
  console.log(id)
  socket.emit('Message', {
    type: id,
    request: "Accept",
    pic: pic,
    room: room,
  })
  var e = `.${id}`;
  $(e).remove();
}

function reject(id) {
  socket.emit('Message', {
    type: id,
    request: "reject",
    pic: pic,
    room: room,
  })
  var e = `.${id}`;
  $(e).remove();



}

$('.emoji').click(function () {
  var t = $(this).attr('id');

  $('#MessageHolder').val($('#MessageHolder').val() + "&#" + t + ";");
})