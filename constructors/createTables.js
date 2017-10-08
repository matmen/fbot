module.exports = async function (db) {
	await db.query('CREATE TABLE IF NOT EXISTS commands ("id" BIGINT NOT NULL, "command" TEXT NOT NULL, "userid" BIGINT NOT NULL, "channelid" BIGINT NOT NULL, "serverid" BIGINT NOT NULL)');
	await db.query('CREATE TABLE IF NOT EXISTS messages ("id" BIGINT PRIMARY KEY NOT NULL, "userid" BIGINT NOT NULL, "channelid" BIGINT NOT NULL, "serverid" BIGINT NOT NULL)');
	await db.query('CREATE TABLE IF NOT EXISTS stats ("servers" BIGINT NOT NULL, "channels" BIGINT NOT NULL, "users" BIGINT NOT NULL, "messages" BIGINT NOT NULL, "commands" BIGINT NOT NULL, "dbsize" BIGINT NOT NULL, "time" BIGINT NOT NULL)');
	await db.query('CREATE TABLE IF NOT EXISTS settings ("server" BIGINT NOT NULL, "setting" TEXT NOT NULL, "value" TEXT)');
	await db.query('CREATE TABLE IF NOT EXISTS blacklists ("type" TEXT NOT NULL, "id" BIGINT NOT NULL)');
	await db.query('CREATE TABLE IF NOT EXISTS songs ("id" TEXT NOT NULL, "userid" BIGINT NOT NULL)');
	await db.query('CREATE TABLE IF NOT EXISTS tags ("name" TEXT NOT NULL, "content" TEXT NOT NULL, "userid" BIGINT NOT NULL, "guildid" BIGINT)');
	await db.query('CREATE TABLE IF NOT EXISTS xp ("userid" BIGINT NOT NULL, "serverid" BIGINT NOT NULL, "xp" BIGINT NOT NULL, "time" BIGINT NOT NULL)');
};
