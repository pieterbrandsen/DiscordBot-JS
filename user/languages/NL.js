module.exports = {
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

    errors: {
        noStaffRole: {
        }
    },


    admin: {
        announcement: {
            command: {
                name: "announcement",
                description: "Stuur een embed announcement naar de server met jouw text",
                cooldown: 120,
                usage: "🎉 Server is open 🎉",
                aliases: ["anno", "announce", "mededelingen"],
                example: "announcement",
                args: true,
                permission: "MANAGE_CHANNELS"
            },
            text: {
                embedTitle: "🚨 **Mededeling** 🚨",
            },
            returnText: {
            },
            logText: {
                sentSuccesful: "A announcement with the message: {{ messageText }} was sent!",
                sentError: "There was an error while sending an announcement:\n{{ errorBlock }}"
            }
        },
        reload: {
            command: {
                name: "herlaad",
                description: "Herlaad een commando",
                usage: "[commando]",
                aliases: ["reload"],
                example: "herlaad ping",
                args: true,
                permission: "ADMINISTRATOR"
            },
            text: {
                embedTitle: "🚨 **Mededeling** 🚨",
            },
            returnText: {
                noCommand: "Er is geen commando met de naam {{ commandBlock }}",
                reloadedCommand: "Commando {{ commandBlock }} is herladen!"
            },
            logText: {
                reloadSuccesful: "Command {{ commandBlock }} was reloaded!",
                reloadError: "There was an error while reloading a command {{ commandBlock }}:\n{{ errorBlock }}"
            }
        },
        fiveMServerStatus: {
            command: {
                name: "server-status",
                description: "Zet een custom status voor het bericht in serverStatus",
                usage: "[Nieuwe auto's]",
                aliases: ["status"],
                example: "server-status nieuwe auto's",
                args: true,
                permission: "MANAGE_CHANNELS"
            },
            text: {
            },
            returnText: {
            },
            logText: {
                updatedSuccesful: "Server Status was updated to {{ newServerStatus }}!",
                updatedError: "There was an error while updating the serverStatus:\n{{ errorBlock }}"
            }
        }
    },

    welcome: {
		DMMessageTitle: `Hallotjes {{ userName }}.`,
		DMMessageDescription: `Welkom op **{{ guild }}**, hieronder kan je de meest belangrijke kanalen zien:`,
		DMMessageFields: [`panda's zijn cool`, 'apen zijn cool', 'konijnen zijn cool'],
		DMMessageFieldLinks: ['{{ announcements }}', '{{ general }}', '{{ ticketChannel }}'],
		DMMessageFooter: `Met vriendelijke groeten, het staff team van {{ guild }}`,
		message: ["Hoi {{ tag }}, panda's zijn cool.", "Hoi {{ tag }}, apen zijn cool.", "Hoi {{ tag }}, konijnen zijn cool."]
	},
	leave: {
		message: `Jammer om te zien dat je de server verlaten hebt.
\nAls je nog terug wilt komen kan dit, hier is een invite zodat je terug kan komen.
\n\nInvite: {{ invite }}`
	},

    apply: {
        wrongArgs: "Kies uit een van de volgende solicitaties:",
        applyWelcomeMessage: "Welkom bij je solicitatie",
        timedOutTitle: "Applicatie Verlopen",
        timedOutDescription: "Je applicatie is verlopen, je hebt 10 minuten per vraag.",

        succesfullySendTitle: "Je applicatie is succesvol ontvangen",
        succesfullySendDescription: "We gaan je applicatie bekijken en je hoort met ongeveer 2 dagen van ons.",

        max: 1,
    },

    tickets: {
		ping: 'here',
		text: `Hallotjes, {{ tag }}!
		Een van ons staff team zal zo snel mogelijk bij u zijn.
		Kunt u ondertussen uw onderwerp zo goed mogelijk uitleggen? 😊`,
		pin: false,
        max: 3,
        panel: {
            title: 'Support Tickets',
            description: 'Hulp nodig? Geen probleem! Reageer op dit paneel om een nieuw support ticket aan te maken zodat ons staff team u kunt helpen.',
            reaction: '🧾'
        }
    },

    serverStats: {
		ip: "IP:",
		memberCount: "Leden:",
		userCount: "Gebruikers:",
		botCount: "Bots:",
		roleCount: "Rollen:",
		channelCount: "Kanalen:",
    },
}
