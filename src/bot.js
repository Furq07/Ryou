const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const mongoose = require("mongoose");
const chalk = require("chalk");
const {
  Guilds,
  GuildMembers,
  GuildMessages,
  MessageContent,
  GuildVoiceStates,
  GuildBans,
  GuildInvites,
} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const { loadEvents } = require("../src/Handlers/eventHandler");
const client = new Client({
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    MessageContent,
    GuildVoiceStates,
    GuildBans,
    GuildInvites,
    GuildVoiceStates,
  ],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

loadEvents(client)
  .then(() =>
    console.log(chalk.gray("Events Initiation:"), chalk.green("Successful"))
  )
  .catch((err) =>
    console.log(
      chalk.gray("Events Initiation:"),
      chalk.red("Failed"),
      chalk.gray(`\n${err}`)
    )
  );

mongoose.set("strictQuery", false);
mongoose
  .connect(client.config.MongoDBConnect)
  .then(() => console.log(chalk.gray("Connected To"), chalk.yellow(`MongoDB`)))
  .catch((err) => console.error(err));
// ———————————————[Login Into Bot]———————————————
client.login(client.config.token);

// ———————————————[Error Handling]———————————————
process.on("unhandledRejection", (reason, p) => {
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(
    chalk.white("["),
    chalk.red.bold("AntiCrash"),
    chalk.white("]"),
    chalk.gray(" : "),
    chalk.white.bold("Unhandled Rejection/Catch")
  );
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(
    chalk.white("["),
    chalk.red.bold("AntiCrash"),
    chalk.white("]"),
    chalk.gray(" : "),
    chalk.white.bold("Uncaught Exception/Catch")
  );
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(err, origin);
});
