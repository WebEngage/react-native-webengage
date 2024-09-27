import WebEngage from 'react-native-webengage';
var webengage = new WebEngage();

export const handleWebEngageBridgeCall = (data) => {
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
                const attributes = message.data;
                handleAttributes(attributes);
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


const handleAttributes = (attributes) => {
    if (!attributes || typeof attributes !== 'object') {
        console.error('Invalid attributes data');
        return;
    }

    let optInKey = "";

    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            const value = attributes[key];
            console.log(`Key: ${key}, Value: ${value}`);

            if (value) {
                switch (key) {
                    case FIRST_NAME:
                        webengage.user.setFirstName(value);
                        break;
                    case LAST_NAME:
                        webengage.user.setLastName(value);
                        break;
                    case EMAIL:
                        webengage.user.setEmail(value);
                        break;
                    case BIRTH_DATE:
                        webengage.user.setBirthDateString(value);
                        break;
                    case PHONE:
                        webengage.user.setPhone(value);
                        break;
                    case GENDER:
                        webengage.user.setGender(value);
                        break;
                    case COMPANY:
                        webengage.user.setCompany(value);
                        break;
                    case HASHED_EMAIL:
                        webengage.user.setHashedEmail(value);
                        break;
                    case HASHED_PHONE:
                        webengage.user.setHashedPhone(value);
                        break;
                    case PUSH_OPT_IN:
                        optInKey = "push";
                        break;
                    case SMS_OPT_IN:
                        optInKey = "sms";
                        break;
                    case EMAIL_OPT_IN:
                        optInKey = "email";
                        break;
                    case WHATSAPP_OPT_IN:
                        optInKey = "whatsapp";
                        break;
                    case VIBER_OPT_IN:
                        optInKey = "viber";
                        break;
                    default:
                        // Set custom attribute for any key not matched by predefined cases
                        console.log(`CUSTOM attribute: ${key} = ${value}`);
                        webengage.user.setAttribute(key, value);
                        break;
                }

                // If optInKey is set, convert the value to boolean and set opt-in
                if (optInKey) {
                    const booleanValue = (value === "true" || value === true);
                    webengage.user.setOptIn(optInKey, booleanValue);
                    optInKey = ""; // Reset optInKey after use
                }
            } else {
                console.log(`Value for ${key} is invalid or undefined.`);
            }
        }
    }
};




const FIRST_NAME = "we_first_name";
const LAST_NAME = "we_last_name";
const EMAIL = "we_email";
const BIRTH_DATE = "we_birth_date";
const PHONE = "we_phone";
const GENDER = "we_gender";
const COMPANY = "we_company";
const HASHED_EMAIL = "we_hashed_email";
const HASHED_PHONE = "we_hashed_phone";
const PUSH_OPT_IN = "we_push_opt_in";
const SMS_OPT_IN = "we_sms_opt_in";
const EMAIL_OPT_IN = "we_email_opt_in";
const WHATSAPP_OPT_IN = "we_whatsapp_opt_in";
const VIBER_OPT_IN = "we_viber_opt_in";
