addLayer("a", {
    symbol: "A",
    color: "#DBD639",
    row: "side",
    position: 0,

    layerShown(){return true},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        firstsecrettimer: 0,
        used: new Decimal(0),
    }},
    tooltip(){return `<h2>Achievements</h2><br>${player.a.achievements.length} achievements`},

    tabFormat: {
        "Achievements": {
            content: [
                ["display-text",
                    function() { return `You have <h2 style="color: #DBD639; text-shadow: #DBD639 0px 0px 10px;">${player.a.achievements.length}</h2> achievements, boosting generator point production by x${format(layers.a.effect())}` }],
                "blank",
                "blank",
                ["achievements",[1,2,3,4,5,6,7,8,9]],
                ["blank",10],
                ["achievements",[10]]
            ]
        },
        "AP": {
            content: [
                ["display-text", function() {return `You have <h2 style="color: #DBD639; text-shadow: #DBD639 0px 0px 10px;">${formatWhole(layers.a.calculateAP().sub(layers.a.calculateUsed()))}/${formatWhole(layers.a.calculateAP())}</h2> achievement points (AP)<br>
                    (Each achievement gives 1 AP)`}],
                "blank",
                "blank",
                ["clickable", 11],
                ["buyables", [1]],
            ],
            unlocked() {return hasAchievement('a', 22)}
        },
    },

    achievements: {
        11: {
            name: "<span class='id'>ACH 11 [★]<br></span>a small start",
            done() {return player.g.points.gte(500)},
            tooltip: "Collect 500 generator dust<br>[★]: Double generator dust gain",
        },
        12: {
            name: "<span class='id'>ACH 12 [★]<br></span>a smaller start",
            done() {return player.g.buyables[31].gte(1)},
            tooltip: "Do a compact<br>[★]: Achievements boost to generator dust is better",
        },
        13: {
            name: "<span class='id'>ACH 13 [★]<br></span>an even smaller start",
            done() {return player.g.buyables[31].gte(2)},
            tooltip: "Do two compacts<br>[★]: Unlocks 2 more compact milestones. Buying the Primary Generator doesn't remove points",
        },
        14: {
            name: "<span class='id'>ACH 14 [★]<br></span>compaction",
            done() {return player.g.buyables[31].gte(4)},
            tooltip: "Do four compacts<br>[★]: Unlocks another compact milestones & a new layer",
        },
        15: {
            name: "<span class='id'>ACH 15 [★]<br></span>more compaction",
            done() {return player.g.buyables[31].gte(7)},
            tooltip: "Compact 7 times<br>[★]: Unlocks new skill upgrades and nerf the skill requirement scaling",
        },
        16: {
            name: "<span class='id'>ACH 16 [★]<br></span><span style='color:red;'>respec hell</span>",
            done() {return player.s.points.gte(7)},
            tooltip: "Have 7 total skill<br>[★]: Compacts are better"
        },
        21: {
            name: "<span class='id'>ACH 21 [★]<br></span>dont cry",
            done() {return player.g.buyables[31].gte(12) || player.d.points.gte(1)},
            tooltip: "Unlock Depression<br>[★]: One skill branch is removed and skill cost is /4",
        },
        22: {
            name: "<span class='id'>ACH 22 [★]<br></span>skilled",
            done() {return player.s.points.gte(10)},
            tooltip: "Have 10 skill at once<br>[★]: Unlock achievement points",
        },
        23: {
            name: "<span class='id'>ACH 23<br></span>''full'' automation",
            done() {return player.sa.points.gte(7)},
            tooltip: "Have atleast 7 automation points",
        },
        24: {
            name: "<span class='id'>ACH 24<br></span>full automation",
            done() {return player.sa.points.gte(10)},
            tooltip: "Have atleast 10 automation points",
        },
        25: {
            name: "<span class='id'>ACH 25<br></span>when is too much?",
            done() {return player.s.points.gte(30)},
            tooltip: "Have atleast 30 skill points",
        },
        31: {
            name: "<span class='id'>ACH 31<br></span>boring",
            done() {return player.d.challenges[11] >= 5},
            tooltip: "Beat 'Baseline V'",
        },
        32: {
            name: "<span class='id'>ACH 32<br></span>large roots",
            done() {return player.d.challenges[12] >= 5},
            tooltip: "Beat 'Supersqrt V'",
        },
        33: {
            name: "<span class='id'>ACH 33<br></span>who needs prestige anyway",
            done() {return player.d.challenges[21] >= 5},
            tooltip: "Beat 'Prestige Nerf V'",
        },
        34: {
            name: "<span class='id'>ACH 34<br></span>who needs points anyway",
            done() {return player.d.challenges[22] >= 5},
            tooltip: "Beat 'Point Drought V'",
        },
        35: {
            name: "<span class='id'>ACH 35 [★]<br></span>partial clear!",
            done() {return player.a.achievements.length >= 11},
            tooltip: "Have 11 achievements<br>Unlock new achievements",
        },
        41: {
            name: "<span class='id'>ACH 41<br></span>Slight inflation",
            done() {return player.s.points.gte(60)},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Obtain 60 skill",
        },
        42: {
            name: "<span class='id'>ACH 42 [★]<br></span>Less slight inflation",
            done() {return player.s.points.gte(80)},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Obtain 80 skill<br>[★]: Tear scaling is decreased",
        },
        43: {
            name: "<span class='id'>ACH 43 [★]<br></span>endgame",
            done() {return player.d.challenges[31] >= 1},
            unlocked() {return hasAchievement("a",this.id) || hasAchievement("a",35)},
            tooltip: "Beat Baseline 2I<br>[★]: You win; Time Warp II's effect is squared.",
        },
        44: {
            name: "<span class='id'>ACH 44 [★]<br></span>outlived the universe",
            done() {return player.g.time >= 2e10},
            unlocked() {return hasAchievement("a",44)},
            tooltip: "outlive the universe (2e10 years)<br>[★]: ooo a hidden achievement oooo (time warp II's effect is ^1.1)",
        },
        45: {
            name: "<span class='id'>ACH 45<br></span>past the endgame",
            done() {return player.s.points.gte(102)},
            unlocked() {return hasAchievement("a",44)},
            tooltip: "102 skill.",
        },
    },
    effect(){
        if(hasAchievement('a', 12)) return new Decimal(player.a.achievements.length).pow_base(1.5)
        return new Decimal(player.a.achievements.length).pow(1.5).div(10).add(1).add(new Decimal(player.a.achievements.length).pow(0.5).div(5))
    },
    automate(){
        player.a.used = layers.a.calculateUsed()
    },
    calculateUsed(){
        let used = new Decimal(0)
        for(i in [11,12,13,14]){
            used = used.add(getBuyableAmount(this.layer, [11,12,13,14][i]))
        }
        return used
    },
    calculateAP(){
        let ap = new Decimal(player.a.achievements.length)
        return ap
    },
    respec() {
        for(i in [1,1,1,1]){
            setBuyableAmount(this.layer, [11,12,13,14][i], new Decimal(0))
        }
    },
    clickables: {
        11: {
            title: "RESPEC",
            tooltip: "resets nothing",
            canClick() {return true},
            onClick() {
                layers.a.respec()
            }
        }
    },
    buyables: {
        11: {
            title() {return `Dust Boost x${formatWhole(getBuyableAmount(this.layer, this.id))}`},
            cost() {return new Decimal(1)},
            display() {return `+^0.01 generator dust gain<br>Currently: ^${format(buyableEffect(this.layer, this.id))}<br><br>Cost: 1 achievement point`},
            effect() {return Decimal.mul(0.01, getBuyableAmount(this.layer, this.id)).add(1)},
            canAfford() {return new Decimal(layers.a.calculateAP()).sub(layers.a.calculateUsed()).gte(1)},
            buy() {addBuyables(this.layer, this.id, new Decimal(1))},
            unlocked() {return hasAchievement('a', 22)},
            style: {
                "height": "125px",
                "width": "125px"
            }
        },
        12: {
            title() {return `Point Boost x${formatWhole(getBuyableAmount(this.layer, this.id))}`},
            cost() {return new Decimal(1)},
            display() {return `+^0.015 generator dust efficiency<br>Currently: +^${format(buyableEffect(this.layer, this.id))}<br><br>Cost: 1 achievement point`},
            effect() {return Decimal.mul(0.015, getBuyableAmount(this.layer, this.id))},
            canAfford() {return new Decimal(layers.a.calculateAP()).sub(layers.a.calculateUsed()).gte(1)},
            buy() {addBuyables(this.layer, this.id, new Decimal(1))},
            unlocked() {return hasAchievement('a', 22)},
            style: {
                "height": "125px",
                "width": "125px"
            }
        },
        13: {
            title() {return `Skill Boost x${formatWhole(getBuyableAmount(this.layer, this.id))}`},
            cost() {return new Decimal(1)},
            display() {return `^0.99 skill requirement<br>Currently: ^${formatSmall(buyableEffect(this.layer, this.id), 4)}<br><br>Cost: 1 achievement point`},
            effect() {return Decimal.pow(0.99, getBuyableAmount(this.layer, this.id))},
            canAfford() {return new Decimal(layers.a.calculateAP()).sub(layers.a.calculateUsed()).gte(1)},
            buy() {addBuyables(this.layer, this.id, new Decimal(1))},
            unlocked() {return hasAchievement('a', 22)},
            style: {
                "height": "125px",
                "width": "125px"
            }
        },
        14: {
            title() {return `Tear Boost x${formatWhole(getBuyableAmount(this.layer, this.id))}`},
            cost() {return new Decimal(1)},
            display() {return `x0.983 tear requirement<br>Currently: x${formatSmall(buyableEffect(this.layer, this.id), 4)}<br><br>Cost: 1 achievement point`},
            effect() {return Decimal.pow(0.983, getBuyableAmount(this.layer, this.id))},
            canAfford() {return new Decimal(layers.a.calculateAP()).sub(layers.a.calculateUsed()).gte(1)},
            buy() {addBuyables(this.layer, this.id, new Decimal(1))},
            unlocked() {return hasAchievement('a', 22)},
            style: {
                "height": "125px",
                "width": "125px"
            }
        },
    }
})