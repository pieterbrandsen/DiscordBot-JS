module.exports = {
	language: 'NL',

	prefix: '!',
	name: 'GroesbeekRP',
	activities: ['Groesbeek Roleplay'],
	activity_types: ['WATCHING'],
	colour: '#009999',
	err_colour: '#E74C3C',
	cooldown: 5,

	UPDATE_TIME: 60000, // in ms


	guild: '725062629541937224', // ID of your guild
	staff_role: '725241568302333973', // ID of your Support Team role

	ip: "144.91.125.129:3479",

	announcementsChannelId: "760136360732131339",
	generalChannelId: "760052816197844993",
	ticketCreateChannelId: "751778285507313666",
	suggestionChannelId: ["751770087366721597"],
	serverStatsChannelId: "763419104680869898",
	

	music: {
		YOUTUBE_API_KEY: "AIzaSyDln0n84Xeq_xQDCFYpf6jMlI1hkw-G9L8",
		SOUNDCLOUD_CLIENT_ID: "",
		MAX_PLAYLIST_SIZE: 50,
		PRUNING: true
	},

	welcome: {
		enabled: true
	},

	leave: {
		enabled: false
	},

	apply: {
		enabled: true
	},

	serverStats: {
		enabled: true,
	},
	

	tickets: {
		enabled: true
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
			channel: '751778285507313666' // ID of your log channel
		}
	},
	
	debug: false,
};
