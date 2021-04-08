const handleChat = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#chatResponse").val() == ''){
        handleError("RAWR! Chat field is required.");
        return false;
    }

    sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function() {
        loadChatFromServer();
    });

    return false;
};


const ChatForm = (props) =>{
    console.log("hereeeee");
    return (
        <form id="chatForm" 
        onSubmit={handleChat}
        name="chatForm"
        action="/chat"
        method="POST"
        className="chatForm"
        >
            <label htmlFor="response">Enter a response: </label>
            <input id="chatResponse" type="text" name="response" placeholder="Response"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeChatSubmit" type="submit" value="Make Chat" />

        </form>
    );
};

const ChatList = function(props){
    if(props.chat.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Responses Yet!</h3>
            </div>
        );
    }

    const chatNodes = props.chat.map(function(chat) {
        return (
            <div key={chat._id} className="chat">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="chatResponse"> Response: {chat.response} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {chatNodes}
        </div>
    );
};

const loadChatFromServer = () => {
    sendAjax('GET', '/getChat', null, (data) => {
        ReactDOM.render(
            <ChatList chat={data.chat} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <ChatForm csrf={csrf} />, document.querySelector('#makeDomo')
    );

    ReactDOM.render(
        <ChatList chat={[]} />, document.querySelector('#domos'),
    );

    loadChatFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});