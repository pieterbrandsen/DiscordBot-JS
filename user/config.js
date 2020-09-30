module.exports = {
	prefix: '/',
	name: 'RedeWijk Support',
	activities: ['Redewijk Roleplay'],
	activity_types: ['WATCHING'],
	colour: '#009999',
	err_colour: '#E74C3C',
	cooldown: 3,

	guild: '758332017976016937', // ID of your guild
	staff_role: '758642877089185803', // ID of your Support Team role

	suggestionChannelId: ["760871983209644032", "760872065846476820", "760872211086704660", "760872280376737812"],

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
			channel: '759085501944299531' // ID of your log channel
		}
	},
	
	debug: false,
	updater: true
};
