module.exports = {
	language: 'NL',

	prefix: '-',
	name: 'GroesbeekRP',
	activities: ['Groesbeek Roleplay'],
	activity_types: ['WATCHING'],
	colour: '#009999',
	err_colour: '#E74C3C',
	cooldown: 3,

	UPDATE_TIME: 60000, // in ms


	guild: '758332017976016937', // ID of your guild
	staff_role: '758642877089185803', // ID of your Support Team role

	ip: "144.91.125.129:3479",

	announcementsChannelId: "758642911968886784",
	generalChannelId: "759080921776521287",
	ticketCreateChannelId: "758755607787864124",
	suggestionChannelId: ["760871983209644032", "760872211086704660", "760872065846476820", "760871983209644032"],
	serverStatsChannelId: "758642914145730570",
	

	music: {
		YOUTUBE_API_KEY: "AIzaSyDln0n84Xeq_xQDCFYpf6jMlI1hkw-G9L8",
		SOUNDCLOUD_CLIENT_ID: "",
		MAX_PLAYLIST_SIZE: 50,
		PRUNING: true
	},


	welcome: {
		enabled: true,
		channelId: "751770026733862913",
		DMMessageTitle: `Hallotjes {{ userName }}.`,
		DMMessageDescription: `Welkom op **{{ guild }}**, hieronder kan je de meest belangrijke kanalen zien:`,
		DMMessageFields: [`panda's zijn cool`, 'apen zijn cool', 'konijnen zijn cool'],
		DMMessageFieldLinks: ['{{ announcements }}', '{{ general }}', '{{ ticketChannel }}'],
		DMMessageFooter: `Met vriendelijke groeten, het staff team van {{ guild }}`,
		message: ["Hoi {{ tag }}, panda's zijn cool.", "Hoi {{ tag }}, apen zijn cool.", "Hoi {{ tag }}, konijnen zijn cool."]
	},
	leave: {
		enabled: true,
		message: `Jammer om te zien dat je de server verlaten hebt.
\nAls je nog terug wilt komen kan dit, hier is een invite zodat je terug kan komen.
\n\nInvite: {{ invite }}`
	},


	serverStats: {
		enabled: true,
		category: '761869196581273631', // ID of your tickets category
		ip: "IP:",
		memberCount: "Leden:",
		userCount: "Gebruikers:",
		botCount: "Bots:",
		roleCount: "Rollen:",
		channelCount: "Kanalen:",
	},
	

	tickets: {
		category: '760864285886513184', // ID of your tickets category
		send_img: true,
		ping: 'here',
		text: `Hallotjes, {{ tag }}!
		Een van ons staff team zal zo snel mogelijk bij u zijn.
		Kunt u ondertussen uw onderwerp zo goed mogelijk uitleggen? 😊`,
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

	panel: {
		title: 'Support Tickets',
		description: 'Hulp nodig? Geen probleem! Reageer op dit paneel om een nieuw support ticket aan te maken zodat ons staff team u kunt helpen.',
		reaction: '🧾'
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
