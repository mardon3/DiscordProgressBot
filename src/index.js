require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const getAnimeList = require('./mal.js').getAnimeList;
let startDate = new Date("2023-01-09");
let endDate = new Date("2023-05-09");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} is online!`);
  const channel = client.channels.cache.get("510264568530993183");
  channel.send("ProgressBot is on, dates have been set to their defaults.");
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("$")) {
    const command = message.content.slice(1).toLowerCase().split(" ")[0];

    const currentDate = new Date();

    const totalTime = endDate.getTime() - startDate.getTime();
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const percentage = Math.round((elapsedTime / totalTime) * 100);

    const barLength = 36;

    if (command === "progress") {
      if (percentage <= 100 && percentage >= 0) {
        const progressBar =
          "█".repeat(Math.round((barLength * percentage) / 100)) +
          "░".repeat(barLength - Math.round((barLength * percentage) / 100));

        const progressBarEmbed = new EmbedBuilder()
          .setColor("#2f3136")
          .setTitle("Progress")
          .setDescription(`${progressBar} ${percentage}%`);

        message.channel.send({ embeds: [progressBarEmbed] });
      } else if (percentage > 100) {
        const progressBar = "█".repeat(36);

        const progressBarEmbed = new EmbedBuilder()
          .setColor("#2f3136")
          .setTitle("Progress")
          .setDescription(`${progressBar} 100%`);

        message.channel.send({ embeds: [progressBarEmbed] });
      }
    } else if (command === "help") {
      const helpEmbed = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("List of Commands")
        .setDescription("Here are the available commands for the Progress Bot:")
        .setFooter({
          text: "Commands are not case-sensitive with regards to capitalization.",
        })
        .addFields(
          {
            name: "$progress",
            value: "Displays the progress bar for the current date.",
          },
          {
            name: "$ssd yyyy-mm-dd",
            value:
              "Sets the start date for the progress bar. Date format must be yyyy-mm-dd.",
          },
          {
            name: "$sed yyyy-mm-dd",
            value:
              "Sets the end date for the progress bar. Date format must be yyyy-mm-dd.",
          },
          {
            name: "$reset",
            value:
              "Resets the start and end dates to the UNC semester start and end dates.",
          },
          {
            name: "$dates",
            value:
              "Displays the current start and end dates for the progress bar.",
          }
        );

      message.channel.send({ embeds: [helpEmbed] });
    } else if (command === "ssd") {
      const newStartDate = message.content.slice(1).toLowerCase().split(" ")[1];
      const newDate = new Date(newStartDate);

      if (isNaN(newDate.getTime())) {
        message.channel.send("Invalid date format. Please use yyyy-mm-dd.");
      } else if (newDate.getTime() >= endDate.getTime()) {
        message.channel.send(
          "The start date must be earlier than the end date."
        );
      } else {
        startDate = newDate;
        const ssdEmbed = new EmbedBuilder()
          .setColor("#2f3136")
          .setTitle("Set Start Date")
          .setDescription("Here is the new start date for the progress bar:")
          .addFields({
            name: "Start Date",
            value: startDate.toISOString().slice(0, 10),
          });

        message.channel.send({ embeds: [ssdEmbed] });
      }
    } else if (command === "sed") {
      const newEndDate = message.content.slice(1).toLowerCase().split(" ")[1];
      const newDate = new Date(newEndDate);

      if (isNaN(newDate.getTime())) {
        message.channel.send("Invalid date format. Please use yyyy-mm-dd.");
      } else if (newDate.getTime() <= startDate.getTime()) {
        message.channel.send("The end date must be later than the start date.");
      } else {
        endDate = newDate;
        const sedEmbed = new EmbedBuilder()
          .setColor("#2f3136")
          .setTitle("Set End Date")
          .setDescription("Here is the new end date for the progress bar:")
          .addFields({
            name: "End Date",
            value: endDate.toISOString().slice(0, 10),
          });

        message.channel.send({ embeds: [sedEmbed] });
      }
    } else if (command === "reset") {
      startDate = new Date("2023-01-09");
      endDate = new Date("2023-05-09");
      const resetEmbed = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("Reset")
        .setDescription(
          "The start and end dates for the progress bar have been reset to the UNC semester start and end dates:"
        )
        .addFields(
          {
            name: "Start Date",
            value: startDate.toISOString().slice(0, 10),
          },
          {
            name: "End Date",
            value: endDate.toISOString().slice(0, 10),
          }
        );

      message.channel.send({ embeds: [resetEmbed] });
    } else if (command === "dates") {
      const datesEmbed = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("Dates")
        .setDescription(
          "Here are the current start and end dates for the progress bar:"
        )
        .addFields(
          {
            name: "Start Date",
            value: startDate.toISOString().slice(0, 10),
          },
          {
            name: "End Date",
            value: endDate.toISOString().slice(0, 10),
          }
        );

      message.channel.send({ embeds: [datesEmbed] });
    } else if (command == "mal") {
      const userName = message.content.slice(1).toLowerCase().split(" ")[1];
      let listType = message.content.slice(1).toLowerCase().split(" ")[2];
//# status = 6 plan to watch; status = 1 watching, status = 2 completed; status = 7 all
      switch (listType) {
        case "ptw":
          listType = "6";
          break;
        case "watching":
          listType = "1";
          break;
        case "completed":
          listType = "2";
          break;
        default:
          listType = "all";
      }

      getAnimeList(userName, listType, (error, result) => {
        if (error) {
          message.channel.send("Incorrect inputs");
          console.error(error);
        } else {
          message.channel.send(result);
        }
      });
    }
  }
});

client.login(process.env.TOKEN);
