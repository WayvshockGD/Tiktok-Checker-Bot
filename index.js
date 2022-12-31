const Eris = require("eris");
const fetch = require("node-fetch");

// Replace these values with your own
const BOT_TOKEN = "YOUR_BOT_TOKEN";
const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";

// Replace these values with the IDs of the users you want to send messages to
const USER_IDS = ["USER_ID_1", "USER_ID_2", "USER_ID_3"];

// Create a Discord client
const client = new Eris(BOT_TOKEN, {
  // Set some client options
  disableEveryone: true,
  getAllUsers: true,
});

client.on("error", (error) => {
  console.error(error);
});

async function sendMessage() {
  try {
    // Get the TikTok app's information from the Google Play store
    const url =
      "https://www.googleapis.com/androidpublisher/v3/applications/com.zhiliaoapp.musically";
    const headers = {
      Authorization: `Bearer ${CLIENT_SECRET}`,
    };
    const params = {
      packageName: "com.zhiliaoapp.musically",
    };
    const response = await fetch(url, { headers, params });
    const data = await response.json();

    // Check if the TikTok app is available
    const available = data.available;
    let status;
    let emoji;
    if (available) {
      status = "available";
      emoji = "✅";
    } else {
      status = "not available";
      emoji = "❌";
    }

    // Create an embed with the availability status
    const embed = new Eris.RichEmbed()
      .setTitle("TikTok App Availability")
      .setDescription(`The TikTok app is currently ${status} on the Google Play store.`)
      .setColor(available ? "GREEN" : "RED")
      .setTimestamp()
      .setFooter(emoji);

    // Send the embed to the specified users
    for (const userId of USER_IDS) {
      const user = client.users.get(userId);
      await user.send({ embed });
    }
  } catch (error) {
    console.error(error);
  }
}


client.on("ready", () => {
  // Send a message every 24 hours
  setInterval(sendMessage, 86400);
});

client.connect();
