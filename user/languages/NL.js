module.exports = {
    prefix: '!',
	name: 'RedeWijk Support',
	activities: ['Redewijk Roleplay'],
	activity_types: ['WATCHING'],
    colour: '#009999',
    
    // Channels
    ticketCreateChannelId: "751778285507313666",

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

    apply: {
        wrongArgs: "Kies uit een van de volgende solicitaties:",
        applyWelcomeMessage: "Welkom bij je solicitatie",
        questions: {
            politie: ["1", "2", "3"], 
            ambulance: ["1", "2", "3"],
        },
        timedOutTitle: "Applicatie Verlopen",
        timedOutDescription: "Je applicatie is verlopen, je hebt 10 minuten per vraag.",

        succesfullySendTitle: "Je applicatie is succesvol ontvangen",
        succesfullySendDescription: "We gaan je applicatie bekijken en je hoort met ongeveer 2 dagen van ons.",

        max: 1,
    }
}