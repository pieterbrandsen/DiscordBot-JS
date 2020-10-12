module.exports = {
	token: "",
	language: 'NL',

	prefix: '!',
	serverName: 'PandaBot',
	activities: ['PandaBot'],
	activity_types: ['WATCHING'],
	colour: '#009999',
	err_colour: '#E74C3C',
	cooldown: 5,

	reloadTime: 600*1000, // in ms


	guildId: '725062629541937224',
	staffRoleId: '725241568302333973',

	serverIp: "45.146.252.9:30238",

	announcementsChannelId: "760136360732131339",
	generalChannelId: "760052816197844993",
	ticketCreateChannelId: "751778285507313666",
	suggestionChannelId: ["751770087366721597"],
	serverPlayersChannelId: "763419104680869898",
	serverPlayersMessageId: "763480119326408715",



	music: {
		YOUTUBE_API_KEY: "AIzaSyDln0n84Xeq_xQDCFYpf6jMlI1hkw-G9L8",
		SOUNDCLOUD_CLIENT_ID: "",
		MAX_PLAYLIST_SIZE: 50,
		PRUNING: true
	},

	welcome: {
		enabled: true,
		channelId: "751770026733862913"
	},

	leave: {
		enabled: false
	},

	apply: {
		enabled: true,
        max: 1,
	},

	serverStats: {
		enabled: true,
		category: '761869196581273631',
	},

	serverPlayers: {
		enabled: true,
	},

	tickets: {
		enabled: true,
		category: '760456192551682058',
		panelReaction: "🧾",
		ping: "here",
		sendImg: true,
		pin: false,
        max: 3
	},

	transcripts: {
		text: {
			enabled: true,
			keep_for: 90,
		},
		web: {
			enabled: false,
			server: 'https://tickets.example.com',
		}
	},

	storage: {
		type: 'sqlite'
	},

	logs: {
		files: {
			enabled: true,
			keep_for: 7
		},
		discord: {
			enabled: true,
			channel: '763092029458612254' // ID of your log channel
		}
	},

	debug: false,
};
