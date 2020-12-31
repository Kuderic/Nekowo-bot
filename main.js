const Discord = require('discord.js');
const Giphy = require('giphy-api')();
const client = new Discord.Client();

const discord_bot_token = '';
const giphy_token = '';

const prefix = 'neko';
const oopsie = 'OOPSIE WOOPSIE!! uwu you made a fucky wucky'

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

// Parse user messages
client.on('message', msg => {
    if (msg.author.bot) return;
    var msg_lowered = msg.content.toLowerCase();

    if (msg_lowered === 'who' || msg_lowered === 'who?') {
        var responses = {   "cares? no one" :  1,
                            "cares? your mom" : 1,
                            "cares?" : 3};
        msg.channel.send(pick_weighted_message(responses));
    }
    else if (msg_lowered === 'uwu') {
        msg.channel.send("owo");
    }
    else if (msg_lowered === 'owo') {
        msg.channel.send("uwu");
    }

    // neko prefixed commands
    if (!msg_lowered.startsWith(prefix)) return;
    const without_prefix = msg_lowered.slice(prefix.length);
    var words = without_prefix.split(' ');
    words = words.slice(1, words.length);
    const command = words[0];
    const args = words.slice(1);

    console.log('words: %s | command: %s | args: %s', words, command, args);
    //console.log('metions: %s | length: %s', msg.mentions, msg.mentions.length);

	//msg.channel.send(`${msg.author.displayAvatarURL({ dynamic: true })}`);

    if (command === 'help') {
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            //.setTitle('Commands')
            .setURL('https://isfycsmn.ytmnd.com/')
            .setAuthor('Commands', msg.author.displayAvatarURL())
            .setDescription('ヾ(^▽^*)))\nHewo uwu nozzles u :3\nFor more info on a specific command, use `neko help [command]`.')
            //.setThumbnail('https://i.imgur.com/WHeAvlc.jpg')
            .addFields(
                { name: '🐈 Cat Things', value: '`neko meow` `neko lewd`' },
                { name: '🤗 Actions', value: '`neko [action] [@user]`' }
            )
        msg.channel.send(exampleEmbed);
    }
    else if (command === 'meow') {
        var num = 1;
        if (args.length > 0) {
            num = parseInt(args[0], 10);
            if (isNaN(num)) {
                msg.channel.send(oopsie);
                return;
            }
        }

        var bases = {
                        "nya" : 3,
                        "meow" : 3,
                        "mew" : 2,
                        "woof" : 1,
                        "yiff" : 1
                    };
        var suffixes1 = {
                            "~" : 2,
                            "!" : 2,
                            "~!" : 2,
                            "" : 2
                        };
        var suffixes2 = {
                            " <3" : 1,
                            " uwu" : 1,
                            " 🥰" : 1,
                            " 💖" : 1,
                            "" : 2
                        };
        
        for (var i = 0; i < num; i++) {
            var response = pick_weighted_message(bases)
                           + pick_weighted_message(suffixes1)
                           + pick_weighted_message(suffixes2);
            msg.channel.send(response);
        }
    }
    else if (command === 'lewdmeow' || command === 'lewd') {
        var responses = {   "fuck me daddy 💦💦😩" :  1,
                            "m-meoww >///<" : 2,
                            "nyaa!! 🥰😜💖" : 2};
        msg.channel.send(pick_weighted_message(responses));
    }
    else if (words.length > 1) {
        // check if message is of the form `neko [action] @user`
        var victim = get_user_from_mention(words[words.length - 1]);
        var action = words.slice(0, words.length - 1).join(' ');
        console.log('action: %s | victim: %s', action, victim);
        if (victim) { // if last word is a mention, send a gif
            Giphy.search({
                limit: 10,
                q: action,
                fmt: 'json'
            }, function (err, res) {
                console.log(res);
                if (res.data && res.data.length > 0) {
                    var n = rand_int(0, res.data.length - 1);
                    const embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setAuthor(`${msg.author.username} ${action}s ${victim.username}!!! xDDDDD`, msg.author.displayAvatarURL())
                        .setImage('https://media.giphy.com/media/'+res.data[n].id+'/giphy.gif');
                    msg.channel.send(embed);
                } else {
                    msg.channel.send("Try again later (giphy wants me to slow down 😢)");
                }
            });
        }
    }
    else {
        msg.channel.send('wtf do u want from me');
    }
})

client.login(discord_bot_token);


// Helper functions

function rand_int(a, b) {
    var n = a + Math.floor(Math.random() * (1 + b - a));
    //console.log('rand(%s,%s) : %s',a,b,n);
    return n;
}

function pick_rand_message(msgs) {
    // takes an array of msgs to send with uniform probability
    return msgs[rand_int(0, msgs.length)];
}

function pick_weighted_message(dict) {
    // takes an array of msgs to send with given (non-zero) weightings 
    total_weights = 0;
    for(var key in dict) {
        var value = dict[key];
        total_weights += value;
    }
    
    var weight_left = rand_int(1, total_weights);

    for(var key in dict) {
        var value = dict[key];
        weight_left -= value;
        // do something with "key" and "value" variables
        if (weight_left <= 0) {
            return key;
        }
    }
      
    return "N/A";
}

function get_user_from_mention(mention) {
    // takes a string and returns the user object or NaN if not a user
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}
