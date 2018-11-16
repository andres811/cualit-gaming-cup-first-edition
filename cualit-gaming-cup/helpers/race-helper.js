module.exports = {
    getRandomTrack: function() {
        var textArray = [

            "Mushroom Cup - Mario Kart Stadium",
            "Mushroom Cup - Water Park",
            "Mushroom Cup - Sweet Sweet Canyon",
            "Mushroom Cup - Thwomp Ruins",

            "Flower Cup - Mario Circuit",
            "Flower Cup - Toad Harbour",
            "Flower Cup - Twisted Mansion",
            "Flower Cup - Shy Guy Falls",

            "Star Cup - Sunshine Airport",
            "Star Cup - Dolphin Shoals",
            "Star Cup - Electrodrome",
            "Star Cup - Mount Wario",

            "Special Cup - Cloudtop Cruise",
            "Special Cup - Bone-Dry Dunes",
            "Special Cup - Bowser's Castle",
            "Special Cup - Rainbow Road",

            "Shell Cup - Moo Moo Meadows (Wii)",
            "Shell Cup - Mario Circuit (GBA)",
            "Shell Cup - Cheep Cheep Beach (DS)",
            "Shell Cup - Toad's Turnpike (N64)",

            "Banana Cup - Dry Dry Desert (GameCube)",
            "Banana Cup - Donut Plains 3 (SNES)",
            "Banana Cup - Royal Raceway (N64)",
            "Banana Cup - DK Jungle (3DS)",

            "Leaf Cup - Wario Stadium (DS)",
            "Leaf Cup - Sherbet Land (GameCube)",
            "Leaf Cup - Music Park (3DS)",
            "Leaf Cup - Yoshi Valley (N64)",

            "Lightning Cup - Tick-Tock Clock (DS)",
            "Lightning Cup - Piranha Plan Slide (3DS)",
            "Lightning Cup - Grumble Volcano (Wii)",
            "Lightning Cup - Rainbow Road (N64)",

            "Egg Cup - Yoshi Circuit (GameCube)",
            "Egg Cup - Excitebike Arena (based on Excitebike)",
            "Egg Cup - Dragon Driftway",
            "Egg Cup - Mute City (based on, F-Zero)",

            "Triforce Cup - Wario's Gold Mine (Wii)",
            "Triforce Cup - Rainbow Road (SNES)",
            "Triforce Cup - Ice Ice Outpost",
            "Triforce Cup - Hyrule Circult (bas,ed on Legend of Zelda)",

            "Crossing Cup - Baby Park (GameCube)",
            "Crossing Cup - Cheese Land (GBA)",
            "Crossing Cup - Wild Woods",
            "Crossing Cup - Animal Crossing (based on Animal Crossing)",

            "Bell Cup - Neo Bowser City (3DS)",
            "Bell Cup - Ribbon Road (GBA)",
            "Bell Cup - Super Bell Subway",
            "Bell Cup - Big Blue (based on F-Zero)"
        ];
        var randomNumber = Math.floor(Math.random()*textArray.length);
        return textArray[randomNumber]
    },
    getRandomBattleTrack: function() {
        var textArray = [
            'Battle Stadium',
            'Sweet Sweet Kingdom',
            'Dragon Palace',
            'Lunar Colony',
            'Wuhu Town',
            'Luigi\'s Mansion',
            'Battle Course 1',
            'Urchin Underpass',
        ];
        var randomNumber = Math.floor(Math.random()*textArray.length);
        return textArray[randomNumber]
    }
}
