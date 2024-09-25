import WebEngage from 'react-native-webengage';
var webengage = new WebEngage();

export const handleBridgetCall = (data) => {
    let message;

    try {
        // Parse the incoming data as JSON
        message = JSON.parse(data);
    } catch (error) {
        console.log("Invalid JSON data:", data);
        return;
    }

    // Check if the parsed message is an object and has a "webengage" type
    if (message && typeof message === 'object' && message.type === "webengage") {
        switch (message.action) {
            case "Login":
                const loginId = message.id;
                console.log(`Login : ${loginId}`);
                webengage.user.login(loginId);
                break;

            case "Logout":
                console.log(`Logout`);
                webengage.user.logout();
                break;

            case "event":
                console.log(`${JSON.stringify(message.data)}`);
                const eventName = message.data.name;
                const eventData = message.data.attr;
                console.log(`Event : ${eventName} - ${JSON.stringify(eventData)}`);
                webengage.track(eventName, eventData);
                break;

            case "setAttribute":
                console.log(JSON.stringify(message));
                break;

            case "screen":
                console.log(`${JSON.stringify(message.data)}`);
                const screenName = message.data.name;
                const screenData = message.data.attr;
                console.log(`Screen : ${screenName} - ${JSON.stringify(screenData)}`);
                if (screenData == null)
                    webengage.screen(screenName);
                else webengage.screen(screenName, screenData);

                break;

            default:
                console.log("Unknown action:", message.action);
                break;
        }
    } else {
        console.log("Invalid or unsupported message type:", message);
    }
};
