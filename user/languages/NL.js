module.exports = {
    logs: {
        files: {
            enabled: true,
            keep_for: 7
        },
        discord: {
            enabled: true,
            channel: "763092029458612254" // ID of your log channel
        }
    },

    errors: {
        noStaffRole: {
        }
    },

    commands: {
        admin: {
            announcement: {
                command: {
                    name: "mededeling",
                    description: "Stuur een embed announcement naar de server met jouw text",
                    cooldown: 120,
                    usage: "mededeling <tekst>",
                    aliases: ["announcement", "anno", "announce", "mededelingen"],
                    example: "mededeling 🎉 Server is open 🎉",
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
        basic: {
            ip: {
                command: {
                    name: "ip",
                    description: "Stuurt het IP naar je via DM",
                    cooldown: 5,
                    usage: "",
                    aliases: ["connect"],
                    example: "ip",
                    args: false,
                    permission: ""
                },
                text: {
                    embedTitle: "**Hallo {{ username }}, je had {{ messageContent }} gedaan om te connecten met {{ serverName }}**",
                    embedDescription: `Volg deze stappen om te connecten!\n
                    Stap 1: Open FiveM
                    Stap 2: Druk F8 -> **{{ ip }}**\n
                    **Veel Plezier in onze Stad!**`
                },
                returnText: {
                    sendInDm: "Verstuurt in DM"
                },
                logText: {
                }
            },
            ping: {
                command: {
                    name: "ping",
                    description: "Check of de bot nog werkt",
                    usage: "",
                    aliases: [""],
                    example: "ping",
                    args: false,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    pinging: "Pinging...",
                    pong: "**:ping_pong: Pong! Je ping is: ** {{ pongBlock }}"
                },
                logText: {
                }
            },
            suggestion: {
                command: {
                    name: "suggestie",
                    description: "Stuur een suggestie voor de server in het suggestie kanaal.",
                    cooldown: 60,
                    usage: "<tekst>",
                    aliases: ["suggestion", "sugg"],
                    example: `Meer auto\"s voor iedereen!`,
                    args: false,
                    permission: ""
                },
                text: {
                    embedTitle: "Suggestie",
                    thumbsUp: "👍",
                    thumbsDown: "👎"
                },
                returnText: {
                    embedTitle: ":x: **Verkeerd kanaal**",
                    embedDescription: "Verstuur je suggestie alsjeblieft in een suggestie kanaal zoals <#{{ firstSuggestionChannel }}>",
                    embedFooter: "{{ botUsername }} | Dit bericht wordt in 15 seconden verwijderd"
                },
                logText: {
                    sendError: "Could not react to suggestion or send suggestion"
                }
            },
        },
        music: {
            loop: {
                command: {
                    name: "loop",
                    description: "Laad muziek zichzelf herhalen óf stopt de lus",
                    usage: "",
                    aliases: ["l", "loep"],
                    example: "Loop",
                    args: false,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    nothingPlaying: "Er speelt op dit moment geen muziek",
                    loopIs: "Lus is nu {{ on/off }}",
                    on: "**Aan**",
                    off: "**Uit**"
                },
                logText: {
                }
            },
            lyrics: {
                command: {
                    name: "lyrics",
                    description: "Krijg de tekst van het liedje wat nu speelt",
                    usage: "[title]",
                    aliases: ["ly", "tekst"],
                    example: "lyrics",
                    args: false,
                    permission: ""
                },
                text: {
                    embedTitle: "Tekst"
                },
                returnText: {
                    nothingPlaying: "Er speelt op dit moment geen muziek",
                    nothingFound: "Kon geen teksten vinden van {{ songTitle }}",
                },
                logText: {
                }
            },
            nowPlaying: {
                command: {
                    name: "now-playing",
                    description: "Krijg het lied wat nu afgespeeld wordt",
                    usage: "",
                    aliases: ["np"],
                    example: "",
                    args: false,
                    permission: ""
                },
                text: {
                    embedTitle: "Speelt nu"
                },
                returnText: {
                    nothingPlaying: "Er speelt op dit moment geen muziek"
                },
                logText: {
                }
            },
            pause: {
                command: {
                    name: "pause",
                    description: "Pauzeur het lied wat nu afgespeeld wordt",
                    usage: "",
                    aliases: ["p"],
                    example: "",
                    args: false,
                    permission: ""
                },
                text: {
                    pausedMusic: "{{ author }} ⏸ pauzeerde de muziek."
                },
                returnText: {
                    nothingPlaying: "Er speelt op dit moment geen muziek"
                },
                logText: {
                }
            },
            play: {
                command: {
                    name: "play",
                    description: "Speel muziek van Youtube of Soundcloud",
                    usage: "[lied]",
                    aliases: ["p", "speel"],
                    example: "play ik wil muziek",
                    args: true,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    addedToQueue: "✅ **{{ songTitle }}** is toegevoegd aan de wachtrij door {{ author }}",
                    notInVoiceChannel: "Betreed eerst een spreek kanaal",
                    wrongVoiceChannel: "Ga naar het zelfde spreek kanaal als ik",
                    missingConnectPerm: "Ik kan niet het kanaal betreden, weet je zeker dat ik dat mag?",
                    missingSpeakPerm: "Ik kan niet praten in dat kanaal, weet je zeker dat ik dat mag?",
                    missingSoundCloudId: "Ik mis een SoundCloud ID, vraag staff om dit probleem op te lossen.",
                    couldNotFindMusic: "Kon geen video of afspeellijst vinden met die zoek opdracht",
                    couldNotPlayMusic: "Er ging iets mis met het afspelen van je zoek opdracht",
                },
                logText: {
                }
            },
            playlist: {
                command: {
                    name: "playlist",
                    description: "Speel muziek van Youtube of Soundcloud",
                    usage: "[afspeellijst]",
                    aliases: ["afspeellijst", "pl", "al"],
                    example: "play mijn afspeellijst",
                    args: true,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    addedToQueue: "✅ **{{ songTitle }}** is toegevoegd aan de wachtrij door {{ author }}",
                    startedPlaylist: "{{ author }} koos een afspeellijst",

                    notInVoiceChannel: "Betreed eerst een spreek kanaal",
                    wrongVoiceChannel: "Ga naar het zelfde spreek kanaal als ik",
                    missingConnectPerm: "Ik kan niet het kanaal betreden, weet je zeker dat ik dat mag?",
                    missingSpeakPerm: "Ik kan niet praten in dat kanaal, weet je zeker dat ik dat mag?",
                    couldNotFindPlaylist: "Kon geen video of afspeellijst vinden met die zoek opdracht",
                    playlistIsTooLong: "{{ embedDescription }}\nJe playlist is langer dan de karakter limiet...",
                },
                logText: {
                }
            },
            queue: {
                command: {
                    name: "queue",
                    description: "Laat de huidige wachtrij zien",
                    usage: "",
                    aliases: ["q", "wachtwrij"],
                    example: "queue",
                    args: false,
                    permission: ""
                },
                text: {
                    embedTitle: "Wachtrij"
                },
                returnText: {
                    nothingPlaying: "Er speelt op dit moment geen muziek"
                },
                logText: {
                }
            },
            remove: {
                command: {
                    name: "remove-music",
                    description: "Haal een liedje uit de wachtrij",
                    usage: "<wachtrij nummer>",
                    aliases: [""],
                    example: "remove-music <wachtrij nummer>",
                    args: true,
                    permission: ""
                },
                text: {
                    embedTitle: "Wachtrij"
                },
                returnText: {
                    noQueue: "Er is geen wachtrij",
                    usage: "Gebruik: {{ prefix }}remove <Wachtrij nummer>",
                    removedSong: "{{ author }} ❌ verwijderde **{{ songTitle }}** van de wachtrij.",
                    coudntFindSong: "Ik kan dat nummer niet vinden in de wachtrij."
                },
                logText: {
                }
            },
            resume: {
                command: {
                    name: "resume",
                    description: "Hervat je wachtrij",
                    usage: "",
                    aliases: [""],
                    example: "remove <wachtrij nummer>",
                    args: false,
                    permission: ""
                },
                text: {
                    embedTitle: "Wachtrij"
                },
                returnText: {
                    noQueue: "Er is geen wachtrij",
                    resumed: "{{ author }} ▶ hervatte de muziek.",
                    nothingPaused: "Er is niks gepauzeerd."
                },
                logText: {
                }
            },
            search: {
                command: {
                    name: "search",
                    description: "Zoek en selecteer liedjes om te spelen",
                    usage: "<lied>",
                    aliases: [""],
                    example: "search <lied>",
                    args: true,
                    permission: ""
                },
                text: {
                    embedTitle: "**Kies het liedje wat je wil spelen.**",
                    embedDescription: "Zoekresultaat: {{ searchCommand }}",
                },
                returnText: {
                    activeCollector: "Er wordt al gewacht op een reactie in dit kanaal",
                    notInVoiceChannel: "Je moet eerst in een spreek kanaal zitten.",
                },
                logText: {
                }
            },
            shuffle: {
                command: {
                    name: "shuffle",
                    description: "Gooit je wachtrij door elkaar ",
                    usage: "",
                    aliases: ["shuf"],
                    example: "shuffle",
                    args: false,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    noQueue: "Er is geen wachtrij",
                    shuffled: "{{ author }} 🔀 shuffelde de wachtrij.",
                },
                logText: {
                }
            },
            skip: {
                command: {
                    name: "skip",
                    description: "Slaat dit lied over.",
                    usage: "",
                    aliases: ["s"],
                    example: "skip",
                    args: false,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    noSong: "Er is op dit niks aan het afspelen",
                    skipped: "{{ author }} ⏭ sloeg dit liedje over.",
                },
                logText: {
                }
            },
            skipTo: {
                command: {
                    name: "skip-to",
                    description: "Sla alle liedjes over tot gekozen nummer in de wachtrij.",
                    usage: "skip-to <nummer>",
                    aliases: ["st"],
                    example: "skip-to 4",
                    args: true,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    noQueue: "Er is geen wachtrij",
                    smallerQueue: "De wachtrij is maar {{ queueLength }} liedjes lang.",
                    skipped: "{{ author }} ⏭ sloeg {{ amount }} liedjes over.",
                },
                logText: {
                }
            },
            stop: {
                command: {
                    name: "stop",
                    description: "Stop helemaal met afspelen",
                    usage: "stop",
                    aliases: ["leave"],
                    example: "stop",
                    args: false,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    nothingPlaying: "Er is niks aan het spelen",
                    stopped: "{{ author }} ⏹ stopte de muziek.",
                },
                logText: {
                }
            },
            volume: {
                command: {
                    name: "volume",
                    description: "Pas het volume van de muziek aan.",
                    usage: "volume [nummer]",
                    aliases: ["v"],
                    example: "volume 100",
                    args: false,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    nothingPlaying: "Er is niks aan het spelen",
                    notInVoiceChannel: "Betreed eerst een spreek kanaal",
                    currentVolume: "🔊 Het huidigde volume is: **{{ volume }}%**",
                    isNaN: "Gebruik een nummer om het volume te kiezen",
                    notInRange: "Kies een nummer tussen 0 - 100",
                    volumeChanged: "Volume is aangepast naar: **{{ volume }}%**"
                },
                logText: {
                }
            },
        },
        solicitation: {
            applicationTranscript: {
                command: {
                    name: "solicitatie-copie",
                    description: "Krijg een copie van je solicitatie",
                    usage: "<solicitatie-id>",
                    aliases: ['solicitatie-transcript', 'solicitatie-archief', 'solicitatie-archive', 'solicitatie-download'],
                    example: "solicitatieCopie 57",
                    args: true,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    sendingEmbedTitle: "Applicatie {{ id }}",
                    sendingEmbedField: ["Tekst Copie", "Zie bijlage"],
                    nothingFoundEmbedTitle: ":x: **Onbekende sollicitatie**",
                    nothingFoundEmbedDescription: "Kan geen gesloten sollicitatie vinden met dat ID",
                    noPermissionEmbedTitle: ":x: **Geen permissie**",
                    noPermissionEmbedDescription: "Je hebt geen permissie om die sollicitatie te zien omdat het niet jouw solicitatie is of je bent geen staff.",
                },
                logText: {
                }
            },
            apply: {
                command: {
                    name: "soli",
                    description: "Maak een nieuwe solicitatie aan",
                    usage: "[solicitatieBaan]",
                    aliases: ["solicitatie", "apply"],
                    example: "soli politie",
                    args: false,
                    permission: ""
                },
                text: {
                    thisMessageDelete: "{{ guildName }} | Dit bericht wordt verwijderd in 15 seconden",
                    sentInDm: "Verstuurt in DM",
                    stopCommand: "{{ prefix }}stop",
                    fullQuestion: "Vraag {{ questionNumber }}: {{ questionText }}",
                    applyWelcomeMessage: "Welkom bij je solicitatie voor {{ jobTitle }}",
                    question: "{{ question }}: {{ answer }}",

                    questions: {
                        politie: ["Hoe heet je", "Waar woon je", "Hoe oud ben je"],
                        ambulance: ["Hoe heet je", "Waar woon je", "Hoe oud ben je"],
                    },
                },
                returnText: {
                    maxCount: ":x: **Je hebt al {{ count }} of meer open applicaties**",
                    getHelpAt: "Vraag een admin om applicaties te sluiten in <#{{ ticketChannel }}>.\n\n{{ solicationsList }}",
                    completedSolicitation: "{{ author }} ({{ authorTag }}) heeft gesoliciteerd,",
                    failedSolicitation: "{{ author }} ({{ authorTag }}) heeft gesoliciteerd maar was niet op tijd met alle vragen te beantwoorden,",

                    timedOutTitle: "Applicatie Verlopen",
                    timedOutDescription: "Je applicatie is verlopen, je hebt 10 minuten per vraag.",
            
                    succesfullySendTitle: "Je applicatie is succesvol ontvangen",
                    succesfullySendDescription: "We gaan je applicatie bekijken en je hoort met ongeveer 2 dagen van ons.",

                    wrongArgs: "Kies uit een van de volgende solicitaties:",

                },
                logText: {
                    applyError: "There was an error for {{ username }} when applying."
                }
            },
            myApplications: {
                command: {
                    name: "mijn-solicitaties",
                    description: "Haal al je solicitaties op",
                    usage: "mijn-solicitaties",
                    aliases: ["my-applications"],
                    example: "mijn-solicitaties",
                    args: false,
                    permission: ""
                },
                text: {
                    viewTranscript: "\n> Typ {{ prefix }}application-transcript {{ closedApplicationsId }} om te  bekijken  "
                },
                returnText: {
                    sentInDm: "Verstuurt in DM",
                    noStaffEmbedTitle: ":x: **Fout**",
                    noStaffEmbedDescription: "{{ serverName }} is niet juist geconfigureerd. Kan geen staff role vinden met het id \`{{ staffRoleId }}\`",
                    noPermsEmbedTitle: ":x: **Geen permissie**",
                    noPermsEmbedDescription: "Je hebt geen permissie om andermans solicitaties te bekijken omdat je geen staff bent.",
                    noPermsEmbedFieldUsage: "Gebruik",
                    noPermsEmbedFieldHelp: ["Help", "Typ \`{{ prefix }}{{ helpCommand }0} {{ thisCommand }}\` voor meer informatie"],
                    succesfulEmbedTitle: "{{ user }} solicitaties",
                    succesfulEmbedFooter: "{{ serverName }} | Dit bericht wordt verwijderd in 60 seconden}",
                    has: "heeft",
                    youHave: "Je hebt",
                    hasOpenApplications: "Open solicitaties",
                    hasClosedApplications: "Gesloten solicitaties",
                    noOpenApplications: "geen open solicitaties",
                    noClosedApplications: "geen oude solicitaties"
                },
                logText: {
                }
            }
        },
        ticket: {
            add: {
                command: {
                    name: "add",
                    description: "Voeg een lid toe tot een ticket kanaal",
                    usage: "<@lid> [#kanaal]",
                    aliases: [""],
                    example: "add @Panda #ticket-23",
                    args: true,
                    permission: ""
                },
                text: {
                    viewTranscript: "\n> Typ {{ prefix }}application-transcript {{ closedApplicationsId }} om te  bekijken"
                },
                returnText: {
                    notATicketEmbedTitle: [":x: **Dit is geen ticket kanaal**", ":x: **Kanaal is niet een ticket**"],
                    notATicketDescription: ["Gebruik dit commando om in een ticket kanaal iemand toe te voegen", "{{ channel }}is een ticket kanaal."],
                    notATicketEmbedField: ["Gebruik', `\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"],
                    noPermsEmbedTitle: ":x: **Geen permissies**",
                    noPermsEmbedDescription: "Je hebt geen permissie om {{ channel }} aan te passen omdat het niet jouw ticket is of je bent geen staff.",
                    noPermsEmbedField: ["Usage",
                        "`\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "Help",
                        "typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"],
                    unknownUserEmbedTitle: ":x: **Onbekend lid**",
                    unknownUserEmbedDescription: "Alsjeblieft vermeld een lid.",
                    unknownUserEmbedField: ["Usage",
                        "`\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "Help",
                        "typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"],
                    addedUserEmbedTitle: "**Lid toegevoegd**",
                    addedUserEmbedDescription: "{{ addedUser }} is toegevoegd door {{ authorUser }}",
                    userWasAddedEmbedTitle: ":white_check_mark: **Lid Toegevoegd**",
                    userWasAddedEmbedDescription: "{{ addedUser }} is toegevoegd in <#{{ channelId }}>"
                },
                logText: {
                    addedUser: "{{ authorTag }} added a user to ticket (#{{ channelId }})"
                }
            },
            close: {
                command: {
                    name: "sluit",
                    description: "Sluit een ticket, voer dit commando uit in eem ticket of vermeld een ticket kanaal.",
                    usage: "[#kanaal]",
                    aliases: ["close"],
                    example: "sluit #ticket-23",
                    args: false,
                    permission: ""
                },
                text: {
                    viewTranscript: "Je kan later een gearchiveerde versie zien met \`{{ prefix }}transcript {{ ticketId }}\`",
                },
                returnText: {
                    notATicketEmbedTitle: [":x: **Dit is geen ticket kanaal**", ":x: **Kanaal is niet een ticket**"],
                    notATicketDescription: ["Sluit een ticket, voer dit commando uit in eem ticket of vermeld een ticket kanaal.", "{{ channel }}is een ticket kanaal."],
                    notATicketEmbedField: ["Gebruik", "\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "Help", "typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie",],
                    noPermsEmbedTitle: ":x: **Geen permissies**",
                    noPermsEmbedDescription: "Je hebt geen permissie om {{ channel }} aan te passen omdat het niet jouw ticket is of je bent geen staff.",
                    noPermsEmbedField: ["Gebruik",
                        "`\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "Help",
                        "Typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"],
                    closeTicketEmbedTitle: [":grey_question: Weet je het zeker?", 
                    "**Ticket gesloten**",
                ":white_check_mark: **Ticket {{ ticketId }} gesloten**"],
                    closeTicketEmbedDescription: ["{{ pre }}\n**Reageer met een :white_check_mark: om te conformeren.**", 
                    "Ticket gesloten door {{ author }}",
                "Dit kanaal wordt automatisch verwijderd nadat de berichten gearchiveerd zijn."],
                    closedTicketEmbedField: ["Maker",
                "Gesloten door",
            "Id"],
                    closeTicketEmbedFooter: "{{ serverName }} | Verloopt in 15 seconden",
                    noArchive: "Geen tekst archief is beschikbaar voor ticket {{ ticketId }}",
                    expiredEmbedTitle: ":x: **Verlopen**",
                    expiredEmbedDescription: "Je deed er te lang over om te reageren\n Conformatie mislukt."

                },
                logText: {
                    cantDm: "Could not send a DM to {{ targetUser }}",
                    closedTicket: "{{ authorTag }} closed a ticket (#ticket-{{ ticketId }})"
                }
            },
            myTickets: {
                command: {
                    name: "tickets",
                    description: "Krijg een lijst van je recente tickets om de copieën te downloaden.",
                    usage: "[@lid]",
                    aliases: ["myTickets"],
                    example: "tickets",
                    args: false,
                    permission: ""
                },
                text: {
                    viewTranscript: "\n> Typ {{ prefix }}ticket-copie <id> om te bekijken  "
                },
                returnText: {
                    notATicketEmbedTitle: ":x: **Dit is geen ticket kanaal**",
                    notATicketDescription: "Gebruik dit commando om in een ticket kanaal iemand toe te voegen",
                    notATicketEmbedField: ["Gebruik', `\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "'Help', `typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"],
                        sentInDm: "Verstuurt in DM",
                        noStaffEmbedTitle: ":x: **Fout**",
                        noStaffEmbedDescription: "{{ serverName }} is niet juist geconfigureerd. Kan geen staff role vinden met het id \`{{ staffRoleId }}\`",
                        noPermsEmbedTitle: ":x: **Geen permissie**",
                        noPermsEmbedDescription: "Je hebt geen permissie om andermans tickets te bekijken omdat je geen staff bent.",
                        noPermsEmbedFieldUsage: "Gebruik",
                        noPermsEmbedFieldHelp: ["Help", "Typ \`{{ prefix }}{{ helpCommand }} {{ thisCommand }}\` voor meer informatie"],
                        succesfulEmbedTitle: "{{ user }} tickets",
                        succesfulEmbedFooter: "{{ serverName } | Dit bericht wordt verwijderd in 60 seconden}",
                        has: "heeft",
                        youHave: "Je hebt",
                        hasOpenTickets: "Open tickets",
                        hasClosedTickets: "Gesloten tickets",
                        noOpenTickets: "geen open tickets",
                        noClosedTickets: "geen oude tickets"
                },
                logText: {
                }
            },
            new: {
                command: {
                    name: "ticket",
                    description: "Voeg een lid toe tot een ticket kanaal",
                    usage: "[onderwerp]",
                    aliases: ["new", "nieuw", "open"],
                    example: "ticket ik kan niet joinen",
                    args: false,
                    permission: ""
                },
                text: {
                    noSubject: "Geen onderwerp ingevoerd",
                    ticketCreated: "{{ ping }} {{ authorUsername }} heeft een nieuw ticket gemaakt",
                    subject: "Onderwerp",
                    newTicket: "Nieuw ticket",
                    creator: "Maker",
                    channel: "Kanaal",
                    createdTicket: [`Hallotjes {{ username }}!
                    Een van ons staff team zal zo snel mogelijk bij u zijn.
                    Kunt u ondertussen uw onderwerp zo goed mogelijk uitleggen? 😊`,
                    "Onderwerp", "\`{{ topic }}\`"],
                },
                returnText: {
                    noStaffEmbedTitle: ":x: **Fout**",
                    noStaffEmbedDescription: "{{ serverName }} is niet juist geconfigureerd. Kan geen staff role vinden met het id \`{{ staffRoleId }}\`",
                    maxTicketsEmbedTitle: ":x: **Je hebt al {{ ticketsCount }} of meer open tickets**",
                    maxTicketsEmbedDescription: "Gebruik \`{{ prefix }}close\` om onnodige tickets te sluiten.\n\n",
                    maxTicketsEmbedFooter: "{{ serverName }} | Dit bericht wordt verwijderd in 15 seconden",
                    maxDescriptionLengthEmbedTitle: ":x: **Descriptie is te lang**",
                    maxDescriptionLengthEmbedDescription: "Limiteer je ticket onderwerp, maximaal 255 karakters. Een korte zin is genoeg.",
                    ticketCreatedEmbedTitle: ":white_check_mark: **Ticket gemaakt**",
                    ticketCreatedEmbedDescription: "Je ticket is gemaakt: {{ c }}",
                    ticketCreatedEmbedFooter: "{{ botName }} | Dit bericht wordt in 15 seconden verwijderd"
                },
                logText: {
                    userCreatedTicket: "{{ authorTag }} created a new ticket (#{{ channelName }})"
                }
            },
            panel: {
                command: {
                    name: "paneel",
                    description: "Maak een paneel scherm in het kanaal waar dit commando wordt gebruikt. Er kan maar een paneel werken.",
                    usage: "",
                    aliases: ["panel","widget"],
                    example: "paneel",
                    args: false,
                    permission: "MANAGE_GUILD"
                },
                text: {
                    newPanel: "Nieuw paneel wordt gemaakt",
                    newPanelEmbedTitle: "Support Tickets",
                    newPanelEmbedDescription: "Hulp nodig? Geen probleem! Reageer op dit paneel om een nieuw support ticket aan te maken zodat ons staff team u kunt helpen.",
                    newPanelEmbedReaction: "🧾"
                },
                returnText: {
                    notATicketEmbedTitle: ":x: **Dit is geen ticket kanaal**",
                    notATicketDescription: "Gebruik dit commando om in een ticket kanaal iemand toe te voegen",
                    notATicketEmbedField: ["Gebruik', `\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "'Help', `typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"]
                },
                logText: {
                    deletedOldPanel: "Deleted old panel",
                    createdNewPanel: "{{ authorTag }} created a panel widget"
                }
            },
            remove: {
                command: {
                    name: "verwijder",
                    description: "Verwijder een lid van een ticket kanaal",
                    usage: "<@lid> [#kanaal]",
                    aliases: ["remove"],
                    example: "verwijder @member van #ticket-23",
                    args: true,
                    permission: "MANAGE_CHANNELS"
                },
                text: {
                },
                returnText: {
                    notATicketEmbedTitle: [":x: **Dit is geen ticket kanaal**", ":x: **Kanaal is niet een ticket**"],
                    notATicketDescription: ["Gebruik dit commando om in een ticket kanaal iemand toe te voegen", "{{ channel }}is een ticket kanaal."],
                    notATicketEmbedField: ["Gebruik', `\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                    "'Help', `typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie",],
                    noPermsEmbedTitle: ":x: **Geen permissies**",
                    noPermsEmbedDescription: "Je hebt geen permissie om in {{ channel }} een lid te verwijderen omdat het ticket niet van jou is of je bent geen staff.",
                    noPermsEmbedField: ["Gebruik",
                        "`\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "Help",
                        "typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"],
                    unknownUserEmbedTitle: ":x: **Onbekend lid**",
                    unknownUserEmbedDescription: "Alsjeblieft vermeld een lid.",
                    unknownUserEmbedField: ["Usage",
                        "`\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "Help",
                        "typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"],
                        removedUserEmbedTitle: "**Lid verwijderd**",
                        removedUserEmbedDescription: "{{ removedUser }} is verwijderd door {{ authorUser }}",
                        userWasRemovedEmbedTitle: ":white_check_mark: **Lid verwijderd**",
                        userWasRemovedEmbedDescription: "{{ removedUser }} is verwijderd in <#{{ channelId }}>"
                    
                },
                logText: {
                    removedUser: "{{ authorTag }} removed a user from ticket (#{{ channelId }})"
                }
            },
            stats: {
                command: {
                    name: "ticket-stats",
                    description: "Bekijk ticket statestieken",
                    usage: "",
                    aliases: ["statistieken", "statistiek", "data", "stats"],
                    example: "stats",
                    args: false,
                    permission: ""
                },
                text: {
                    statsEmbedTitle: ":bar_chart: Statistieken",
                    statsEmbedFields: ["Open tickets",
                "Gesloten tickets",
            "Totaal tickets"]
                },
                returnText: {
                },
                logText: {
                    addedUser: "{{ userTag }} added a user to a ticket (#{{ channelId }})"
                }
            },
            ticketTranscript: {
                command: {
                    name: "ticket-copie",
                    description: "Krijg een copie van je ticket",
                    usage: "<ticket-id>",
                    aliases: ["ticket-transcript"],
                    example: "ticket-copie 57",
                    args: true,
                    permission: ""
                },
                text: {
                    textCopy: ["Tekst Copie",
                "Zie bijlage"]
                },
                returnText: {
                    notATicketEmbedTitle: ":x: **Dit is geen ticket kanaal**",
                    notATicketDescription: "Gebruik dit commando om in een ticket kanaal iemand toe te voegen",
                    notATicketEmbedField: ["Gebruik', `\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"],
                        unknownTicketEmbedTitle: ":x: **Onbekend ticket**",
                        unknownTicketEmbedDescription: "Kan geen gesloten ticket met dat ID",
                        noPermsEmbedTitle: ":x: **Geen permissie**",
                        noPermsEmbedDescription: "Je hebt geen permissie om dat ticket te zien omdat het niet jouw ticket is of je bent geen staff.",
                        noArchiveAvailable: "Geen text archief is beschikbaar voor dit ticket {{ id }}"
                },
                logText: {
                }
            },
            topic: {
                command: {
                    name: "onderwerp",
                    description: "Bewerk een ticket naam",
                    usage: "<onderwerp>",
                    aliases: ["topic", "topic", "edit"],
                    example: "onderwerp ticket is klaar",
                    args: true,
                    permission: ""
                },
                text: {
                },
                returnText: {
                    notATicketEmbedTitle: ":x: **Dit is geen ticket kanaal**",
                    notATicketDescription: "Gebruik dit commando om in een ticket kanaal iemand toe te voegen",
                    notATicketEmbedField: ["Gebruik', `\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                        "'Help', `typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"],
                        maxDescriptionLengthEmbedTitle: ":x: **Descriptie is te lang**",
                        maxDescriptionLengthEmbedDescription: "Limiteer je ticket onderwerp, maximaal 255 karakters. Een korte zin is genoeg.",
                        ticketUpdatedEmbedTitle: ":white_check_mark: **Ticket geupdate**",
                        ticketUpdatedEmbedDescription: "Het onderwerp is veranderd."
                },
                logText: {
                }
            },
        },
        help: {
            command: {
                name: "help",
                description: "Toon help menu",
                usage: "[commando]",
                aliases: ["h", "hulp", "command", "commands"],
                example: "help new",
                args: false,
                permission: ""
            },
            text: {
                commandCats: "**{{ message }} {{ command }}** **·** Alle commands van commando **{{ command }}**",
                accesableCatsEmbedTitle: "Catogerieën",
                accesableCatsEmbedDescription: ["\nDe commandos waar je toegang tot hebt zijn hieronder te zien. typ \`{{ prefix }}help <catogerie>\` voor meer informatie over een gekozen commando.", "\nContact staff als je meer hulp of vragen hebt."],
                accesableCommandsEmbedTitle: "Alle commands's van catogerie: **{{ cat }}**",
                accesableCommandsEmbedDescription: ["\nDe commandos waar je toegang tot hebt zijn hieronder te zien. typ \`{{ prefix }}help <command>\` voor meer informatie over een gekozen commando.", "Contact staff als je meer hulp of vragen hebt."],
                alias: "Alliasen",
                usage: "Gebruik",
                example: "Voorbeeld",
                neededPermissions: ["Benodigde Permissies", ":Rede: Je hebt geen permissies om dit commando te gebruiken.", "geen"]
            },
            returnText: {
                commandsEmbedTitle: "Commando's",
                wrongCommandName: ":x: **Onjuist commando naam** (\`{{ prefix }}help\`)"

            },
            logText: {
                cantSend: "Could not send help menu",
                closedTicket: "{{ authorTag }} closed a ticket (#ticket-${ticket.id})"
            }
        },
    },
    events: {
        guildMemberAdd: {
            text: {
                welcomeToServer: "Welkom op de server,",
                welcomeMessage: ["Hoi {{ tag }}, panda's zijn cool.", "Hoi {{ tag }}, apen zijn cool.", "Hoi {{ tag }}, konijnen zijn cool."]
            },
            returnText: {
                DmMessageTitle: `Hallotjes {{ username }}.`,
                DmMessageDescription: `Welkom op **{{ serverName }}**, hieronder kan je de meest belangrijke kanalen zien:`,
                DMMessageFields: [`Mededelingen`, "OOC", "Tickets"],
                DMMessageFieldLinks: ["{{ announcements }}", "{{ general }}", "{{ ticketChannel }}"],
                DmMessageFooter: `Met vriendelijke groeten, het staff team van {{ serverName }}`,
            },
            logText: {
                newUserJoined: "New User {{ username }} has joined {{ guildName }}"
            }
        },
        guildMemberRemove: {
            text: {
                leaveMessage: `Jammer om te zien dat je de server verlaten hebt.
                \nAls je nog terug wilt komen kan dit, hier is een invite zodat je terug kan komen.
                \n\nInvite: {{ invite }}`
            },
            returnText: {
            },
            logText: {
                userLeft: "A user {{ username }} has left {{ guildName }}"
            }
        },
        message: {
            text: {
                stillCooldown: ":x: Alsjeblieft wacht {{ cooldown }} seconden bevoor je \`{{ commandName }}\` opnieuw gebruikt."
            },
            returnText: {
                noPermsEmbedTitle: ":x: Geen permissie",
                noPermsEmbedDescription: "**Je hebt geen permissie om \`{{ commandName }}\` te gebruiken** (bennodigd \`{{ commandPerms }}\`).",
                noPermsEmbedField: ["Gebruik",
                "`\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                "Help",
                "typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"],
                errorWithCommand: ":x: Een ging iets fout tijdens het uitvoeren van  \`{{ commandName }}\`.",
                needsArgsEmbedFields: ["Gebruik", "\`{{ prefix }}{{ commandName }} {{ commandUsage }}\`\n",
                "Help", "typ \`{{ prefix }}help {{ commandName }}\` voor meer informatie"]
            },
            logText: {
                dmMessage: "Received a DM from {{ authorTag }}: {{ cleanMessage }}",
                userHasNoCommandPerms: "{{ authorTag }} tried to use the '{{ commandName }}' command without permission",
                stillCooldown: "{{ authorTag }} attempted to use the '{{ commandName }}' command before the cooldown was over",
                userUsedCommand: "{{ authorTag }} used the '{{ commandName }}' command",
                errorWhileExecutingCommand: "An error occurred whilst executing the '{{ commandName }}' command"
            }
        },
        messageDelete: {
            text: {
            },
            returnText: {
            },
            logText: {
                cantFetch: "Failed to fetch deleted messaged"
            }
        },
        messageReactionAdd: {
            text: {
                noSubject: "Geen onderwerp gegeven",
                madeTicketSubject: "Lid maakte een ticket kanaal aan.",
                madeTicket: "{{ ping }} {{ username }} heeft een ticket gemaakt",
                createdTicketUsingPanel: [`Hallotjes {{ username }}!
                Een van ons staff team zal zo snel mogelijk bij u zijn.
                Kunt u ondertussen uw onderwerp zo goed mogelijk uitleggen? 😊`,
                "Onderwerp", "\`{{ topic }}\` (via paneel)"],
            },
            returnText: {
                noStaffEmbedTitle: ":x: **Fout**",
                noStaffEmbedDescription: "{{ serverName }} is niet juist geconfigureerd. Kan geen staff role vinden met het id \`{{ staffRoleId }}\`",
                maxTicketsEmbedTitle: ":x: **Je hebt al {{ count }} of meer open tickets**",
                maxTicketsEmbedDescription: "Gebruik \`{{ prefix }}sluit\` om een onnodig ticket te sluiten.\n\n${{ ticketList }}",
                maxTicketsEmbedFooter: "{{ serverName }} | Dit bericht wordt verwijderd in 15 seconden.",
                newTicketEmbedTitle: "Nieuw ticket (via paneel)",
                newTicketEmbedFields: ["Maker", "Kanaal"]
            },
            logText: {
                userCreatedNewTicket: "{{ authorTag }} created a new ticket (#{{ channelName }}) via paneel"
            }
        },
        rateLimit: {
            text: {
            },
            returnText: {
            },
            logText: {
                rateLimited: "Rate-limited! (Enable debug mode in config for details)"
            }
        },
        ready: {
            text: {
            },
            returnText: {
            },
            logText: {
                succesfullyAuthenticated: "Authenticated as {{ botTag }}",
                updatedPressence: "Updated presence: {{ activityType }} {{ activityText }}",
                administratorGranted:"\'ADMINISTRATOR\' permission has been granted",
                administratorMissing:"Bot does not have \'ADMINISTRATOR\' permission",
            }
        }
    },
    modules: {
        fiveMServerPlayers: {
            text: {
                usersname: "**Inwoners:**\n"
            },
            returnText: {
                updateEmbedTitle: "{{ serverName }} Server Status",
                updateEmbedFields: ["\n\u200b\nHoe kan je de server joinen?", 
                "Je kan de server joinen doormiddel van **{{ prefix }}ip** te typen. Onderaan staat de server status om te kijken hoeveel mensen er online zijn en in de wachtrij staan\n\u200b\n",
            ":warning: Actuele server status:"],
            offlineEmbedTitle: ["Server Status", ":x: Offline", 
            "'Wachtrij", "?",
        "Online spelers", "?\n\u200b\n"],
        updateMessageEmbedFields: ["Server Status", ":white_check_mark: Online",
    "Wachtrij",
"Online spelers"]
            },
            logText: {
                loopCallback: "Loop callback called after timeout",
                updateSucces: "Update success",
                updateFailed: "Update failed",
                noUpdateChannel: "Update channel not set for fiveM",
                serverOffline: "Server offline",
                sentNewMessage: "Sent message ({{ messageId }})",
                playerCount: "{{ playerCount }} players"
            }
        },
        play: {
            text: {
                queueEnded: "🚫 Music queue ended.",
                startedPlaying: "🎶 Started playing: **{{ songTitle }}** {{ songUrl }}",
                playingReactions: ["⏭", "⏯", "🔁", "⏹"],
                userSkippedSong: "{{ user }} ⏩ skipped the song",
                userPausedSong: "{{ user }} ⏸ paused the music.",
                userResumedSong: "{{ user }} ▶ resumed the music!",
                loopIsNow: ["Loop is now ", "**on**", "**off**"],
                userStoppedSong: "{{ user }} ⏹ stopped the music!",
            },
            returnText: {
            },
            logText: {
            }
        },
        updater: {
            text: {
                ip: "IP:",
                memberCount: "Leden:",
                userCount: "Gebruikers:",
                botCount: "Bots:",
                roleCount: "Rollen:",
                channelCount: "Kanalen:",
                missedChannel: "Missed ServerStats channel: {{ channelName }}"
            },
            returnText: {
            },
            logText: {
                couldntCreateChannel: "Could not create channel for {{ channelName }}"
            }
        }
    }
}
