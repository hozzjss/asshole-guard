import { Client, Intents, NonThreadGuildBasedChannel } from "discord.js";
import { config } from "dotenv";
config();
const token = process.env["DISCORD_TOKEN"];
const guild_id = process.env["GUILD_ID"];

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

client.on("channelDelete", async (channel) => {
  const guild = client.guilds.cache.get(guild_id);
  const channelDeleteLogs = await guild.fetchAuditLogs({
    type: "CHANNEL_DELETE",
  });
  const log = channelDeleteLogs.entries.find(
    (log) => log.target.id === channel.id
  );
  if (log) {
    const member = await guild.members.fetch(log.executor.id);
    console.log(
      "banning",
      member.displayName,
      "for deleting the channel",
      (channel as NonThreadGuildBasedChannel).name
    );
    // await member.ban({ reason: "Deleted a channel" });
  }
});

client.on("roleDelete", async (role) => {
  const guild = client.guilds.cache.get(guild_id);
  const channelDeleteLogs = await guild.fetchAuditLogs({
    type: "ROLE_DELETE",
  });
  const log = channelDeleteLogs.entries.find(
    (log) => log.target.id === role.id
  );
  if (log) {
    const member = await guild.members.fetch(log.executor.id);
    console.log(
      "banning",
      member.displayName,
      "for deleting the role",
      role.name
    );
    // await member.ban({ reason: "Deleted a channel" });
  }
});

client.login(token);
