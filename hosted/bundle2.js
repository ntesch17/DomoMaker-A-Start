"use strict";

var handleChat = function handleChat(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#chatResponse").val() == '' || $("#chatName").val() == '') {
    handleError("RAWR! Chat fields are required.");
    return false;
  }

  sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function () {
    loadChatFromServer();
  });
  return false;
};

var ChatForm = function ChatForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "chatForm",
    onSubmit: handleChat,
    name: "chatForm",
    action: "/chat",
    method: "POST",
    className: "chatForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "response"
  }, "Enter a response: "), /*#__PURE__*/React.createElement("input", {
    id: "chatResponse",
    type: "text",
    name: "response",
    placeholder: "Response"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "submit",
    className: "makeChatSubmit",
    type: "submit",
    value: "Make Chat"
  }));
};

var ChatList = function ChatList(props) {
  if (props.chat.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "chatList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyChat"
    }, "No Responses Yet!"));
  }

  var chatNodes = props.chat.map(function (chat) {
    return /*#__PURE__*/React.createElement("div", {
      key: chat._id,
      className: "chat"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "chatUser"
    }, " User: ", chat.user, " "), /*#__PURE__*/React.createElement("h3", {
      className: "chatResponse"
    }, " Response: ", chat.response, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "chatList"
  }, chatNodes);
};

var loadChatFromServer = function loadChatFromServer() {
  sendAjax('GET', '/getChat', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ChatList, {
      chat: data.chat
    }), document.querySelector("#chat"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChatForm, {
    csrf: csrf
  }), document.querySelector('#makeChat'));
  ReactDOM.render( /*#__PURE__*/React.createElement(ChatList, {
    chat: []
  }), document.querySelector('#chat'));
  loadChatFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
