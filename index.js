import { request } from "../requestV2";

let api_key = 'Place here youre api key!'

let ingame = false
let stage = 0
let game = ''
let names = ''
let player_data = {}
let ranks = [
    '[VIP]',
    '[VIP+]',
    '[MVP]',
    '[MVP+]',
    '[MVP++]',
    '[HELPER]',
    '[MOD]',
    '[ADMIN]',
    '[OWNER]',
    '[YOUTUBE]'
]

const toRoman = (num, i="I", v="V", x="X", l="L", c="C", d="D", m="M") =>
    num ? toRoman(num/10|0, x, l, c, d, m, "?", "?", num%=10) +
          (i + ["",v,x][++num/5|0] + i.repeat(num%5)).replace(/^(.)(.*)\1/, "$2")
        : "";

function FilterRank(name){
    let name1 = name;
    for(let i = 0; i < ranks.length; i++){
        name1 = name1.replace(ranks[i], '')
    }
    return name1
}

function IfUndefined(data){
    if(data === undefined){
        return 0
    }else{
        return data
    }
}

function  GetPrestige(data, game, display){
    if(data[game + '_rookie_title_prestige'] <= 5 && data[game + '_iron_title_prestige'] === undefined){
        prestige = display + ' rookie ' + toRoman(data[game + '_rookie_title_prestige'])
    }else if(data[game + '_iron_title_prestige'] <= 5 && data[game + '_gold_title_prestige'] === undefined){
        prestige = display + ' iron ' + toRoman(data[game + '_iron_title_prestige'])
    }else if(data[game + '_gold_title_prestige'] <= 5 && data[game + '_diamond_title_prestige'] === undefined){
        prestige = display + ' gold ' + toRoman(data[game + '_gold_title_prestige'])
    }else if(data[game + '_diamond_title_prestige'] <= 5 && data[game + '_master_title_prestige'] === undefined){
        prestige = display + ' diamond ' + toRoman(data[game + '_diamond_title_prestige'])
    }else if(data[game + '_master_title_prestige'] <= 5 && data[game + '_legend_title_prestige'] === undefined){
        prestige = display + ' master ' + toRoman(data[game + '_master_title_prestige'])
    }else if(data[game + '_legend_title_prestige'] <= 5){
        prestige = display + ' legend ' + toRoman(data[game + '_legend_title_prestige'])
    }
    return prestige
}

function setgame(trigger, game_name, msg){
    if(!(msg.search(trigger) === -1) && msg.search('Winstreak:') === -1 && ingame === false){
        ingame = true
        stage = 1
        game = game_name
    }else if(!(msg.search(trigger) === -1) && msg.search('Winstreak:') === -1 && ingame === true){
        ingame = false
        stage = 0
        game = ''
        name = ''
        player_data = {}
    }
}

function setplayergamedata(wins, losses, prestige, response){
    return {
        'wins': IfUndefined(response['player']['stats']['Duels'][wins]),
        'losses': IfUndefined(response['player']['stats']['Duels'][losses]),
        'prestige': prestige
    }
}

function filterNaN(nan){
    if(nan === NaN){
        return 0.00
    }else{
        return Math.round(nan*100)/100
    }
}

function GetData(name){
    data = {
        'name': name,
        'rank': '',
        'uuid': '',
        'nicked': true,
        'level': 0,
        'game': {}
    }

    request({
        url: "https://minecraft-api.com/api/uuid/" + name + "/json",
        json: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0'
        },
    }).then(function(response) {
        data['uuid'] = response['uuid']
        request({
            url: "https://api.hypixel.net/player?key=" + api_key +"&uuid=" + response['uuid'],
            json: true,
        }).then(function(response) {
            data['nicked'] = false
            data['rank'] = response['player']['newPackageRank']

            data['level'] = (Math.sqrt((2 * response['player']['networkExp']) + 30625) / 50) - 2.5
            if(!(response['player'] === null)){
                if(game === 'classic'){
                    data['game'] = setplayergamedata('classic_duel_wins', 'classic_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'classic', 'Classic'), response)
                }else if(game === 'UHC'){
                    data['game'] = setplayergamedata('uhc_duel_wins', 'uhc_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'uhc', 'UHC'), response)
                }else if(game === 'TNT'){
                    data['game'] = setplayergamedata('bowspleef_duel_wins', 'bowspleef_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'tnt_games', 'TNT'), response)
                }else if(game === 'sw'){
                    data['game'] = setplayergamedata('sw_duel_wins', 'sw_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'skywars', 'SkyWars'), response)
                }else if(game === 'bridge'){
                    data['game'] = setplayergamedata('bridge_duel_wins', 'bridge_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'bridge', 'Bridge'), response)
                }else if(game === 'sumo'){
                    data['game'] = setplayergamedata('sumo_duel_wins', 'sumo_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'sumo', 'Sumo'), response)
                }else if(game === 'boxing'){
                    data['game'] = setplayergamedata('boxing_duel_wins', 'boxing_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'boxing', 'Boxing'), response)
                }else if(game === 'bow'){
                    data['game'] = setplayergamedata('bow_duel_wins', 'bow_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'bow', 'Bow'), response)
                }else if(game === 'nodebuff'){
                    data['game'] = setplayergamedata('potion_duel_wins', 'potion_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'no_debuff', 'nodebuff'), response)
                }else if(game === 'combo'){
                    data['game'] = setplayergamedata('combo_duel_wins', 'combo_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'combo', 'Combo'), response)
                }else if(game === 'op'){
                    data['game'] = setplayergamedata('op_duel_wins', 'op_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'op', 'OP'), response)
                }else if(game === 'mw'){
                    data['game'] = setplayergamedata('mw_duel_wins', 'mw_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'mega_walls', 'MegaWalls'), response)
                }else if(game === 'blitz'){
                    data['game'] = setplayergamedata('blitz_duel_wins', 'blitz_duel_losses', GetPrestige(response['player']['stats']['Duels'], 'blitz', 'Blitz'), response)
                }
            }

            player_data = data
        }).catch(function(error) {
            player_data = data
            ChatLib.chat(error);
        });
    }).catch(function(error) {
        player_data = data
    });
}

register("renderOverlay", render);
register("tick", () => {
    if(stage === 3 && !(JSON.stringify(player_data) === "{}")){
        stage = 4
    }
});

register('chat',(msg) => {
    //set name
    if(!(game === '') && ingame === true && !(msg.search('Opponent:') === -1) && stage === 1){
        opponent_raw = String(msg).replace('Opponent:', '')
        opponent_raw = opponent_raw.replace(' ', '')

        opponent = ''
        for(let i = 0; i < opponent_raw.length; i++){
            if(!(opponent_raw[i] === ' ')){
                opponent += opponent_raw[i]
            }
        }

        opponent = FilterRank(opponent)

        names = opponent
        stage = 2
    }

    //get data
    if(stage === 2 && !(game === '')){
        GetData(names)
        stage = 3
    }

    //set game
    setgame('Bow Duel', 'bow', msg)
    setgame('Boxing Duel', 'boxing', msg)
    setgame('Sumo Duel', 'sumo', msg)
    setgame('Bridge Duel', 'bridge', msg)
    setgame('SkyWars Duel', 'sw', msg)
    setgame('Bow Spleef Duel', 'TNT', msg)
    setgame('UHC Duel', 'UHC', msg)
    setgame('Classic Duel', 'classic', msg)
    setgame('NoDebuff Duel', 'nodebuff', msg)
    setgame('Combo Duel', 'combo', msg)
    setgame('OP Duel', 'op', msg)
    setgame('MegaWalls Duel', 'mw', msg)
    setgame('Blitz Duel', 'blitz', msg)
}).setCriteria("${msg}")

var rectangle, name, nicked, level, rank, wins, losses, winloserate, prestige, waiting;

waiting = new Text('Loading data!', 15, 15);
rectangle = new Rectangle(0x50000000, 10, 10, 200, 75);

function render(){
    if(stage === 4){
        name = new Text('Name: '+ names, 15, 15);
        prestige = new Text('Prestige: '+ player_data['game']['prestige'], 15, 35);
        nicked = new Text('Nicked: '+ player_data['nicked'], 15, 25);
        rank = new Text('Rank: '+ player_data['rank'], 15, 25);
        level = new Text('Level: '+ (Math.round(player_data['level']*100)/100), 15, 45);
        wins = new Text('Wins: '+ player_data['game']['wins'], 15, 55);
        losses = new Text('Losses: '+ player_data['game']['losses'], 15, 65);
        winloserate = new Text('W/L: '+ filterNaN(player_data['game']['wins'] / player_data['game']['losses']) , 15, 75);
        stage = 5
    }

    if(stage === 3){
        rectangle.draw()
        waiting.draw()
    }

    if(stage === 5){
        rectangle.draw()

        name.draw()

        if(player_data['nicked'] === false){
            rank.draw()
            prestige.draw()
            level.draw()
            losses.draw()
            wins.draw()
            winloserate.draw()
        }else{
            nicked.draw()

        }
    }
}