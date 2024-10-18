document.addEventListener("DOMContentLoaded", function () {
    const msgerForm = document.querySelector(".msger-inputarea");
    const msgerInput = document.querySelector(".msger-input");
    const msgerChat = document.querySelector(".msger-chat");
    const sendBtn = document.getElementById("sendBtn");
    const clearBtn = document.getElementById("clearBtn"); // Added Clear button

    const BOT_IMG = "bot.jpg";
    const PERSON_IMG = "person.jpg";
    const BOT_NAME = "Bot";
    const PERSON_NAME = "You";

    function clearConversation() {
        const chatContainer = document.getElementById("chatContainer");

        // Keep the default message, which is the first child of chatContainer
        const defaultMessage = chatContainer.firstElementChild;

        // Clear all other messages
        while (chatContainer.children.length > 1) {
            chatContainer.removeChild(chatContainer.children[1]);
        }
    }
      
    

    msgerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const msgText = msgerInput.value.trim().toLowerCase();
        if (!msgText) return;
        appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
        msgerInput.value = "";
        botResponse(msgText);
    });

    clearBtn.addEventListener("click", function () {
        clearConversation();
    });
    
    msgerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const msgText = msgerInput.value.trim().toLowerCase();
        if (!msgText) return;
        appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
        msgerInput.value = "";
        botResponse(msgText);
    });
  
    function appendMessage(name, img, side, text) {
        const msgHTML = `
            <div class="msg ${side}-msg">
                <div class="msg-img" style="background-image: url(${img})"></div>
                <div class="msg-bubble">
                    <div class="msg-info">
                        <div class="msg-info-name">${name}</div>
                        <div class="msg-info-time">${formatDate(new Date())}</div>
                    </div>
                    <div class="msg-text">${text}</div>
                </div>
            </div>
        `;
        msgerChat.insertAdjacentHTML("beforeend", msgHTML);
        msgerChat.scrollTop = msgerChat.scrollHeight;
    }
  
    function botResponse(userInput) {
        const input = userInput.toLowerCase();
        const response = qaDictionary[input] || qaDictionary["default"];
        appendMessage(BOT_NAME, BOT_IMG, "left", response);
    }
  
    function get(selector, root = document) {
        return root.querySelector(selector);
    }
  
    function formatDate(date) {
        const h = "0" + date.getHours();
        const m = "0" + date.getMinutes();
        return `${h.slice(-2)}:${m.slice(-2)}`;
    }
  
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
  
    recognition.addEventListener("result", function (e) {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript).join(' ');
        msgerInput.value = transcript;
        setTimeout(function () {
            sendBtn.click(); // Click the send button
        }, 3000);
    });
  
    function startVoice() {
        recognition.start();
    }
    
    const qaDictionary = {
    "hidden subscription opt-in": "A checkbox or button designed to make it difficult for users to opt-out of a subscription service.",
"misleading urgency": "Creating a false sense of urgency to pressure users into making a quick decision.",
"sneak into basket": "Adding extra items into the user's shopping cart without their explicit consent.",
"hidden costs": "Concealing additional fees or charges until the user is deep into the checkout process.",
"dark patterns in interface design": "Designing interfaces to manipulate users into performing actions they didn't intend to.",
"tricky privacy settings": "Making it difficult for users to find and change their privacy settings or opt-out of data collection.",
"bait and switch": "Advertising a product at a low price to lure users in, then attempting to sell them a different, more expensive product.",
"confirmshaming": "Using guilt or shame to pressure users into taking a desired action, such as opting into marketing emails.",
"roach motel": "Making it easy for users to sign up for a service or subscription but difficult or impossible to cancel or unsubscribe.",
"misdirection": "Using visual cues or distractions to lead users to take unintended actions, such as clicking on ads instead of desired content.",
"forced continuity": "Automatically renewing subscriptions or memberships without clear notification or consent from the user.",
"hidden reversal": "Making it easy for users to sign up for a service but burying or obfuscating the process to cancel or unsubscribe.",
"sneaky redirects": "Automatically redirecting users to a different page or website without their explicit consent or clear indication.",
"social proof manipulation": "Using fake or exaggerated social proof (e.g., fake reviews or testimonials) to influence user behavior.",
"misleading defaults": "Setting default options that benefit the service provider rather than the user, such as automatically opting users into data collection.",
"scare tactics": "Using fear or alarmist language to pressure users into taking actions they may not otherwise take, such as purchasing unnecessary security software.",
"hidden terms and conditions": "Burying important terms and conditions in lengthy documents or small print, making it difficult for users to understand their rights and obligations.",
"pre-selection": "Automatically selecting options or adding items to a user's cart without their explicit consent, forcing them to actively deselect unwanted items.",
"fake discounts": "Advertising fake discounts or inflated original prices to make users believe they're getting a better deal than they actually are.",
"fake reviews": "Publishing fake or biased reviews to manipulate users' perceptions of products or services.",
"limited-time offers": "Claiming that a deal or offer is available for a limited time only to create a sense of urgency, even if the offer is regularly available.",
"hidden unsubscribe button": "Making it difficult for users to find the unsubscribe button for marketing emails, leading them to continue receiving unwanted emails.",
"difficulty in account deletion": "Making it overly complicated or requiring multiple steps for users to delete their accounts, discouraging them from leaving the platform.",
"dark patterns in cookie consent": "Designing cookie consent pop-ups to encourage users to accept all cookies without providing clear options to manage preferences.",
"misleading progress indicators": "Displaying progress indicators or loading bars that create the illusion of progress but don't accurately represent the actual process, leading users to believe tasks are completed sooner than they are.",
"hidden feedback mechanisms": "Not providing clear avenues for users to submit feedback or complaints, making it difficult for them to voice concerns.",
"disguised subscription trials": "Offering a free trial period for a service but requiring credit card information upfront, with the intention of automatically charging users once the trial ends.",
"excessive notification requests": "Prompting users to enable notifications excessively or at inappropriate times, such as immediately upon visiting a website.",
"misleading comparison tables": "Presenting comparison tables between products or services in a biased manner that favors one option over others.",
"selective disclosure of information": "Choosing to disclose only positive or favorable information about a product or service while omitting any negative aspects.",
"fake social proof metrics": "Displaying fabricated numbers or statistics to imply popularity or positive reception of a product or service.",
"exploitative reward programs": "Implementing loyalty or reward programs with overly complex terms and conditions that make it difficult for users to redeem rewards.",
"limited feature access": "Offering a 'free' version of a product or service with severely limited features, pushing users to upgrade to a paid version for full functionality.",
"manipulative comparison pricing": "Displaying pricing information in a way that makes a certain option appear significantly cheaper than others, without providing context or full details.",
"automated phone support loops": "Creating automated phone support systems that intentionally make it difficult for users to reach a human representative, prolonging the resolution process.",
"hidden user tracking": "Secretly tracking user behavior across websites or applications without their knowledge or consent, often for targeted advertising purposes.",
"invasive permission requests": "Prompting users to grant excessive permissions or access to personal data under the guise of providing basic functionality.",
"forced social sharing": "Requiring users to share content on social media platforms in exchange for access to certain features or discounts.",
"misleading user surveys": "Presenting surveys or questionnaires that appear to gather feedback but are designed to gather personal information for marketing purposes.",
"hidden auto-opt-ins": "Automatically opting users into promotional emails, newsletters, or other communications without their explicit consent.",
"fake personalization": "Using generic or fabricated personalization techniques to create a false sense of familiarity and trust with users.",
"exploitative in-app purchases": "Designing apps with addictive features or mechanics that encourage excessive spending on virtual goods or upgrades.",
"deceptive free trials": "Offering free trials of products or services with unclear terms and conditions, leading users to unintentionally subscribe to paid plans.",
"manipulative error messages": "Displaying misleading error messages or warnings to pressure users into taking certain actions, such as upgrading to a premium version.",
"delayed gratification loops": "Introducing artificial delays or barriers to accessing desired content or features, encouraging users to spend more time or money to bypass them.",
"biased product recommendations": "Recommending products or services based on biased algorithms or sponsorships rather than user preferences or needs.",
"intrusive pop-ups": "Displaying pop-up ads or notifications that obstruct content or functionality until users interact with them.",
"persistent notification badges": "Using persistent notification badges or indicators to create a sense of urgency or FOMO (fear of missing out) and encourage repeated engagement with an app or website.",
"misleading gamification rewards": "Implementing gamification elements that promise rewards or bonuses but are difficult or impossible to achieve without spending money or inviting friends.",
"hidden data harvesting": "Collecting and monetizing user data without transparent disclosure or consent, violating privacy expectations.",
"complicated cancellation processes": "Requiring users to navigate through multiple pages or contact customer support to cancel subscriptions or delete accounts, discouraging them from doing so.",
"false feedback prompts": "Soliciting feedback from users with the intent of gathering personal information or preferences rather than genuine feedback on the product or service.",
"manipulative user ratings": "Artificially inflating or deflating user ratings or scores to manipulate perceptions of products or services.",
"covert email harvesting": "Requesting email addresses under the guise of account creation or registration, then using them for marketing purposes without explicit consent.",
"exploitative subscription renewal": "Automatically renewing subscriptions without clear notification or making it excessively difficult for users to cancel.",
"deceptive limited stock claims": "Falsely claiming limited stock availability to pressure users into making immediate purchases.",
"misleading search results": "Manipulating search algorithms to prioritize certain products or services over others, regardless of relevance or user intent.",
"bait-and-switch downloads": "Misleading users by offering one download or software, then delivering a different, often unwanted, product.",
"intrusive location tracking": "Collecting precise location data without transparent disclosure or legitimate need, infringing on user privacy.",
"exploitative personal data sharing": "Sharing user data with third parties without explicit consent or clear disclosure, potentially compromising user privacy and security.",
"deceptive subscription bundles": "Offering subscription bundles with hidden terms or fees, misleading users about the true cost or value.",
"false authority endorsements": "Falsely claiming endorsements or certifications to create a sense of legitimacy or trustworthiness.",
"exploitative user generated content": "Allowing or encouraging users to generate content that benefits the platform or service provider without fair compensation or recognition.",
"deceptive referral programs": "Promoting referral programs with misleading rewards or terms, leading users to make referrals under false pretenses.",
"default opt-ins": "Automatically opting users into services, features, or data collection without their explicit consent."
     };
    });
  