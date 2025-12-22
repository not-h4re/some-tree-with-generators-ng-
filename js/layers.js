const timeFormat = function(x){
    x = new Decimal(x)

    if(x.gte(3600*24*365*100)) return formatWhole(x.div(3600*24*365)) + "yrs"
    if(x.gte(3600*24*100)) return formatWhole(x.div(3600*24)) + "days"
    if(x.gte(3600*100)) return formatWhole(x.div(3600)) + "hrs"
    if(x.gte(60*100)) return formatWhole(x.div(60)) + "min"
    return formatWhole(x) + "secs"
}
const romanNumeral = function(x){
    if(x <= 10){
        return ["I","II","III","IV","V","VI","VII","VIII","IX","X"][x]
    }
    return x;
}

addLayer("g", {
    symbol: "G",
    color: "#95E856",
    row: 0,
    position: 0,

    resource: "generator dust",
    layerShown(){return true},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        time: 0,
        buys: 0,
    }},
    tooltip(){return `<h2>Generators</h2><br>${formatWhole(player.g.points)} generator dust<br>${timeFormat(player.g.time)} passed`},

    milestonePopups() {return !hasAchievement("a",14)},
    tabFormat: {
        "Generators": {
            content: [
                ["blank",24],
                ["display-text",
                    function() {
                        if(player.g.points.gte(1e9) || hasAchievement("a",14)) return `<h2 style="color: rgb(145, 219, 86); text-shadow: rgb(145, 219, 86) 0px 0px 10px;">${format(player.g.points)}</h2> generator dust, generating ${format(layers.g.effect())} points each second`
                        return `You have <h2 style="color: rgb(145, 219, 86); text-shadow: rgb(145, 219, 86) 0px 0px 10px;">${format(player.g.points)}</h2> generator dust, generating ${format(layers.g.effect())} points each second`
                    }],
                ["display-text",
                    function() { return `(+${format(player.g.buys)} buys per second)` }, {"font-size": "12px"}],
                ["display-text",
                    function() { if(!layers.g.reduction().eq(1)) return `Generator point production is raised to the ${layers.g.reduction()}th power` }, {"font-size": "12px"}],
                "blank",
                ["buyables",[1,2]],
                ["display-text",
                    function() { return `you can hold on all buyables to buy them` }, {"font-size": "10px"}],
            ]
        },
        "Side": {
            content: [
                ["blank",24],
                ["display-text",
                    function() { return `You have <h2 style="color: rgb(145, 219, 86); text-shadow: rgb(145, 219, 86) 0px 0px 10px;">${format(player.g.points)}</h2> generator dust, generating ${format(layers.g.effect())} points each second` }],
                ["display-text",
                    function() { return `(+${format(layers.g.production())}/s)` }, {"font-size": "12px"}],
                ["display-text",
                    function() { if(!layers.g.reduction().eq(1)) return `Generator point production is raised to the ${layers.g.reduction()}th power` }, {"font-size": "12px"}],
                "blank",
                ["buyables",[3,4]],
                "milestones",
            ],
            style: {'borderColor': '#7CBD4A'},
            unlocked() {return hasAchievement("a",11)},
        },
    },

    buyables: {
        11: {
            cost(x) {
                if(player.g.buyables[11].gte(1000)) return new Decimal(1.012).pow(x).mul(15).ceil()
                return new Decimal(10).mul(x.add(1).pow(1.46)).ceil()
            },
            effect(x) {
                let mult = new Decimal(1).div(5);
                if(hasUpgrade("s",11)) mult = mult.mul(tmp.s.upgrades[11].effect)
                if(hasUpgrade("s",12)) mult = mult.mul(tmp.s.upgrades[12].effect)
                if(hasUpgrade("s",13)) mult = mult.mul(tmp.s.upgrades[13].effect)
                if(hasUpgrade("s",23)) mult = mult.mul(tmp.s.upgrades[23].effect)
                
                if(inChallenge("d",12)) return x.mul(2).pow(1.2).mul(mult).pow(tmp.d.challenges[12].nerf)
                return x.mul(1.8).pow(1.1).mul(mult)
            },

            maxbuys(x) {
                let buys = player.points.floor().div(10).pow(1/1.46).ceil()
                if(buys.gte(1000)){
                    return player.points.div(15).log(1.012).ceil().max(1000)
                }
                return buys
            },

            display() { return `<h2>Primary Generator x${formatWhole(getBuyableAmount("g",11))}</h2><br>Generates ${format(this.effect())} generator dust per second.<br>Costs ${formatWhole(this.cost())} points` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if(!hasAchievement("a",13)) player.points = player.points.sub(this.cost())

                let bulk = layers.g.buyables[this.id].maxbuys().sub(getBuyableAmount(this.layer, this.id));
                bulk = bulk.min(player.g.buys+1).max(1).floor()

                if(bulk.isNan()) bulk = new Decimal(1)

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player.g.buys += bulk.pow(0.8).toNumber()/2;

                if(player.points.lt(0)) player.points = new Decimal(0)
            },
            buyMax() {
                setBuyableAmount(this.layer, this.id, Decimal.max(getBuyableAmount(this.layer, this.id),this.maxbuys()))
                if(player.points.lt(0)) player.points = new Decimal(0)
            },
        },
        12: {
            cost(x) {
                if(player.g.buyables[12].gte(1000)) return new Decimal(1.018).pow(x).mul(22.5).ceil()
                return new Decimal(50).mul(x.add(1).pow(2.15)).ceil()
            },
            maxbuys(x) {
                let buys = player.points.floor().div(50).pow(1/2.15).ceil()
                if(buys.gte(1000)){
                    return player.points.div(22.5).log(1.018).ceil().max(1000)
                }
                return buys
            },

            effect(x) {
                let mult = new Decimal(0.92);
                if(hasUpgrade("s",11)) mult = mult.mul(tmp.s.upgrades[11].effect)
                if(hasUpgrade("s",12)) mult = mult.mul(tmp.s.upgrades[12].effect)
                if(hasUpgrade("s",13)) mult = mult.mul(tmp.s.upgrades[13].effect)
                if(hasUpgrade("s",23)) mult = mult.mul(tmp.s.upgrades[23].effect)
                
                if(inChallenge("d",12)) return x.div(3).add(1).pow(0.8).sub(1).mul(mult).add(1).pow(tmp.d.challenges[12].nerf)
                return x.div(3.3).add(1).pow(0.75).sub(1).mul(mult).add(1)
            },
            display() { return `<h2>Primary Multiplier x${formatWhole(getBuyableAmount("g",12))}</h2><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Costs ${formatWhole(this.cost())} points` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if(!hasMilestone("s",1)) player.points = player.points.sub(this.cost())

                let bulk = layers.g.buyables[this.id].maxbuys().sub(getBuyableAmount(this.layer, this.id));
                bulk = bulk.min(player.g.buys+1).max(1).floor()

                if(bulk.isNan()) bulk = new Decimal(1)

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player.g.buys += bulk.pow(0.8).toNumber()/2;

                if(player.points.lt(0)) player.points = new Decimal(0)
            },
            buyMax() {
                setBuyableAmount(this.layer, this.id, Decimal.max(getBuyableAmount(this.layer, this.id),this.maxbuys()))
                if(player.points.lt(0)) player.points = new Decimal(0)
            },
        },
        13: {
            cost(x) {
                if(hasMilestone(this.layer,2)) return new Decimal(1.65).pow(x).mul(1000).ceil()
                return new Decimal(2.65).pow(x).mul(10000).ceil()
            },
            maxbuys(x) {
                let buys = player.points.div(10000).log(2.65).ceil()
                if(hasMilestone(this.layer,2)) {
                    buys = player.points.div(1000).log(1.65).ceil()
                }
                return buys
            },

            effect(x) {
                let mult = new Decimal(1);
                if(hasUpgrade("s",11)) mult = mult.mul(tmp.s.upgrades[11].effect)
                if(hasUpgrade("s",12)) mult = mult.mul(tmp.s.upgrades[12].effect)
                if(hasUpgrade("s",13)) mult = mult.mul(tmp.s.upgrades[13].effect)
                if(hasUpgrade("s",23)) mult = mult.mul(tmp.s.upgrades[23].effect)

                if(inChallenge("d",12)) return x.add(1).pow(1.2).sub(1).mul(mult).add(1).pow(tmp.d.challenges[12].nerf)
                return x.add(1).pow(1.2).sub(1).mul(mult).add(1)
            },
            display() { return `<h2>Secondary Multiplier x${formatWhole(getBuyableAmount("g",13))}</h2><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Costs ${formatWhole(this.cost())} points` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())

                let bulk = layers.g.buyables[this.id].maxbuys().sub(getBuyableAmount(this.layer, this.id));
                bulk = bulk.min(player.g.buys+1).max(1).floor()

                if(bulk.isNan()) bulk = new Decimal(1)

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player.g.buys += bulk.pow(0.8).toNumber()/2;

                if(player.points.lt(0)) player.points = new Decimal(0)
            },
            buyMax() {
                setBuyableAmount(this.layer, this.id, Decimal.max(getBuyableAmount(this.layer, this.id),tmp.g.buyables[this.id].maxbuys))
                if(player.points.lt(0)) player.points = new Decimal(0)
            },

            unlocked() {
                return hasMilestone("g",0)
            }
        },
        21: {
            cost(x) {
                if(hasUpgrade("s",82)) return new Decimal(1.5).pow(x.pow(1.16)).mul(1e5).ceil()
                if(hasUpgrade("s",72)) return new Decimal(1.5).pow(x.pow(1.2)).mul(1e5).ceil()
                return new Decimal(2).pow(x.pow(1.25)).mul(1e6).ceil()
            },
            maxbuys(x) {
                if(hasUpgrade("s",82)) return player.points.div(1e5).log(1.5).pow(1/1.16).ceil()
                if(hasUpgrade("s",72)) return player.points.div(1e5).log(1.5).pow(1/1.2).ceil()
                return player.points.div(1e6).log(2).pow(1/1.25).ceil()
            },

            effect(x) {
                let power = getBuyableAmount(this.layer,this.id).div(50)

                if(power.gte(1)) power = power.pow(0.175)
                else power = power.pow(1.68)

                let mult = player.s.points.mul(new Decimal(player.g.time).pow(power)).add(0.5).max(1);
                
                if(getBuyableAmount(this.layer,this.id).eq(0)) return new Decimal(1)
                return mult
            },
            tooltip() {
                return "gets boosted by time since last row 2+ reset and slightly by total skill"
            },
            display() { return `<h2>Tertiary Time Multiplier x${formatWhole(getBuyableAmount("g",21))}</h2><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Costs ${formatWhole(this.cost())} points` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())

                let bulk = layers.g.buyables[this.id].maxbuys().sub(getBuyableAmount(this.layer, this.id));
                bulk = bulk.min(player.g.buys+1).max(1).floor()

                if(bulk.isNan()) bulk = new Decimal(1)

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player.g.buys += bulk.pow(0.8).toNumber()/2;

                if(player.points.lt(0)) player.points = new Decimal(0)
            },
            buyMax() {
                if(this.unlocked())
                    setBuyableAmount(this.layer, this.id, Decimal.max(getBuyableAmount(this.layer, this.id),tmp.g.buyables[this.id].maxbuys))
                if(player.points.lt(0)) player.points = new Decimal(0)
            },

            unlocked() {
                return hasUpgrade("s",63)
            }
        },
        22: {
            cost(x) {
                return new Decimal(2.25).pow(x.pow(2)).mul(1e32).ceil()
            },
            maxbuys(x) {
                return player.points.div(1e32).log(2.25).pow(1/2).ceil()
            },

            effect(x) {
                return new Decimal(10).pow(getBuyableAmount(this.layer,this.id))
            },
            display() { return `<h2>Quaternary Multiplier x${formatWhole(getBuyableAmount("g",22))}</h2><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Costs ${formatWhole(this.cost())} points` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())

                let bulk = layers.g.buyables[this.id].maxbuys().sub(getBuyableAmount(this.layer, this.id));
                bulk = bulk.min(player.g.buys+1).max(1).floor()

                if(bulk.isNan()) bulk = new Decimal(1)

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(bulk))
                player.g.buys += bulk.pow(0.8).toNumber()/2;

                if(player.points.lt(0)) player.points = new Decimal(0)
            },
            buyMax() {
                if(this.unlocked())
                    setBuyableAmount(this.layer, this.id, Decimal.max(getBuyableAmount(this.layer, this.id),tmp.g.buyables[this.id].maxbuys))
                if(player.points.lt(0)) player.points = new Decimal(0)
            },

            unlocked() {
                return hasUpgrade("s",92)
            }
        },

        31: {
            cost(x) {
                if(hasUpgrade("s",93)) x = x.pow(upgradeEffect("s",93))

                let upgs = hasUpgrade("s",62) + hasUpgrade("s",32) + hasUpgrade("s",22)
                if(upgs >= 3) return new Decimal(12).pow((x.pow(2).div(5)).add(2.8)).div(1.6)
                if(upgs >= 2) return new Decimal(12).pow((x.mul(x.add(1)).div(4.25)).add(3))
                if(upgs >= 1) return new Decimal(12).pow((x.mul(x.add(1)).div(3.5)).add(3)).mul(5)
                return new Decimal(12).pow((x.mul(x.add(1)).div(2)).add(3)).mul(5)
            },
            effect(x) { 
                let base = new Decimal(3.75)
                let eff = base.pow(x);
                if(inChallenge("d",21)) eff = eff.pow(tmp.d.challenges[21].nerf)
                if(hasAchievement('a', 16)) eff = eff.mul(new Decimal(x).pow(2)).add(1)
                return eff;
            },
            display() { return `<h2>Compact x${formatWhole(getBuyableAmount("g",31))}</h2><br>Resets Basic generators, generator dust, and points<br><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Requires ${formatWhole(this.cost())} generator dust` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if(hasUpgrade("sa",21)) return;

                player.points = new Decimal(10)
                player.g.points = new Decimal(0)
                player.g.buyables[11] = new Decimal(0)
            },
        },
        32: {
            cost(x) {
                let boost = new Decimal(1);
                if(hasUpgrade("s",91)) boost = boost.mul(0.5)

                if(hasUpgrade("s",61)) return new Decimal(1.365).pow(x).add(x.div(1.25)).add(2).mul(boost).ceil()
                if(hasUpgrade("s",52)) return new Decimal(1.44).pow(x).add(x.div(1.1)).add(2).floor().mul(boost).ceil()
                return new Decimal(1.7).pow(x).add(x).add(2).floor().mul(boost).ceil()
            },
            effect(x) {
                let effect = new Decimal(5)
                if(hasUpgrade("s",51)) effect = effect.mul(2.5)
                if(inChallenge("d",21)) effect = effect.pow(tmp.d.challenges[21].nerf)
                return new Decimal(effect).pow(x)
            },
            display() { return `<h2>Compress x${formatWhole(getBuyableAmount("g",32))}</h2><br>Resets generator dust and points, and halves your compacts<br><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Requires ${formatWhole(this.cost())} compacts` },
            canAfford() { return player.g.buyables[31].gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if(hasUpgrade("sa",33)) return;

                player.points = new Decimal(10)
                player.g.points = new Decimal(0)
                player.g.buyables[31] = player.g.buyables[31].div(2).ceil()
            },
            unlocked(){ return hasUpgrade("s",42)}
        },
        41: {
            cost(x) {
                let boost = new Decimal(1)
                if(hasUpgrade("s",81)) boost = boost.mul(0.55)
                if(hasUpgrade("s",91)) boost = boost.mul(0.55)

                return new Decimal(1.65).pow(x).add(x).add(2).floor().mul(boost).ceil()
            },
            effect(x) {
                let effect = new Decimal(7)

                if(inChallenge("d",21)) effect = effect.pow(tmp.d.challenges[21].nerf)

                return new Decimal(effect).pow(x)
            },
            display() { return `<h2>Condense x${formatWhole(getBuyableAmount("g",41))}</h2><br>Resets generator dust and points, and halves your compacts & compresses<br><br>Multiplies Generator Dust production by ×${format(this.effect())}.<br>Requires ${formatWhole(this.cost())} compresses` },
            canAfford() { return player.g.buyables[32].gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                if(hasUpgrade("sa",31)) return;

                player.points = new Decimal(10)
                player.g.points = new Decimal(0)
                player.g.buyables[31] = player.g.buyables[31].div(2).ceil()
                player.g.buyables[32] = player.g.buyables[32].div(2).ceil()
            },
            unlocked(){ return hasUpgrade("s",71)}
        },
    },
    milestones: {
        0: {
            requirementDescription: "Do 2 Compacts",
            effectDescription: "Unlock Secondary Multipliers",
            done() { return getBuyableAmount("g",31).gte(2)},
            unlocked() { return hasAchievement("a",13) || getBuyableAmount("g",31).gte(1)},
        },
        1: {
            requirementDescription: "Do 3 Compacts",
            effectDescription: "+0.15 Generator dust efficiency",
            tooltip: "Efficiency: how many points it produces <br>(dust<sup>0.55</sup> -> dust<sup>0.7</sup>)",
            done() { return getBuyableAmount("g",31).gte(3) },
            unlocked() { return hasAchievement("a",13)},
        },
        2: {
            requirementDescription: "Do 4 Compacts",
            effectDescription: "Secondary multiplier cost scaling is reduced<br>Unlock a new layer.",
            tooltip: "10,000(2.65^x) -> 1000(1.65^x)",
            done() { return getBuyableAmount("g",31).gte(4) },
            unlocked() { return hasAchievement("a",13)},
        },
        3: {
            requirementDescription: "Do 12 Compacts",
            effectDescription: "Unlock a new layer.",
            done() { return getBuyableAmount("g",31).gte(12) },
            unlocked() { return hasAchievement("a",14)},
        },
    },

    effect() {
        let exponent = new Decimal(0.55)
        if(hasMilestone(this.layer,1)) exponent = exponent.add(0.15)
        if(hasUpgrade("s",21)) exponent = exponent.add(0.15)
        if(hasUpgrade("s",41)) exponent = exponent.mul(2)

        if(inChallenge("d",22)) exponent = exponent.mul(tmp.d.challenges[22].nerf)

        return player.g.points.pow(exponent)
    },
    reduction() {
        return new Decimal(1)
    },


    production() {
        let gain = layers.g.buyables[11].effect()
        gain = gain.mul(layers.g.buyables[12].effect())
        gain = gain.mul(layers.g.buyables[13].effect())
        gain = gain.mul(layers.g.buyables[21].effect())
        gain = gain.mul(layers.g.buyables[22].effect())

        gain = gain.mul(layers.g.buyables[31].effect())
        gain = gain.mul(layers.g.buyables[32].effect())
        gain = gain.mul(layers.g.buyables[41].effect())
        if(hasUpgrade('sa', 11)) gain = gain.mul(player.s.points.add(1))
        if(hasAchievement('a', 11)) gain = gain.mul(2)
        gain = gain.pow(this.reduction())

        gain = gain.mul(layers.a.effect())
        return gain
    },
    update(diff) {
        player.g.buys /= (4 ** diff)

        let gain = this.production()

        player.g.points = player.g.points.add(gain.mul(diff))

        let gameSpeed = new Decimal(1)
        if(hasUpgrade("s",33)) gameSpeed = gameSpeed.mul(upgradeEffect("s",33))
        if(hasUpgrade("s",43)) gameSpeed = gameSpeed.mul(upgradeEffect("s",43))
        if(hasUpgrade("s",53)) gameSpeed = gameSpeed.mul(upgradeEffect("s",53))
        if(hasUpgrade("s",73)) gameSpeed = gameSpeed.mul(upgradeEffect("s",73))
        if(hasUpgrade("s",83)) gameSpeed = gameSpeed.mul(upgradeEffect("s",83))
        player.g.time += diff * toNumber(gameSpeed)

        if(player.points.lte(0) && player.g.points.lte(0)) player.points = new Decimal(10)
    },
    
    automate() {
        if(hasUpgrade("sa",11)) layers.g.buyables[11].buyMax()
        if(hasUpgrade("sa",12)) layers.g.buyables[12].buyMax()
        if(hasUpgrade("sa",13) && layers.g.buyables[13].unlocked()) layers.g.buyables[13].buyMax()
        if(hasUpgrade("sa",14) && layers.g.buyables[21].unlocked()) layers.g.buyables[21].buyMax()
        if(hasUpgrade("sa",24) && layers.g.buyables[22].unlocked()) layers.g.buyables[22].buyMax()
        
        let bulk = 1
        if(hasUpgrade("sa",41)) bulk *= 3
        if(hasUpgrade("sa",42)) bulk *= 3
        for(var i=0;i<bulk;i++)
            if(hasUpgrade("sa",22) && tmp.g.buyables[31].canAfford) layers.g.buyables[31].buy()
        if(hasUpgrade("sa",23) && tmp.g.buyables[32].canAfford && tmp.g.buyables[32].unlocked) layers.g.buyables[32].buy()
        if(hasUpgrade("sa",32) && tmp.g.buyables[41].canAfford && tmp.g.buyables[41].unlocked) layers.g.buyables[41].buy()
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return;
        
        let milestones = player.g.milestones;

        layerDataReset(this.layer);
        if(hasMilestone("s",4)) player.g.buyables[11] = new Decimal(1)
        if(hasMilestone("s",8)) player.g.milestones = milestones;
    },
})

addLayer("s", {
    symbol: "S",
    color: "#58D699",
    row: 1,
    position: 0,

    layerShown(){return hasAchievement("a",14)},
    tooltip(){return `<h2>Skill</h2><br>${formatWhole(player.s.points.sub(player.s.used))}/${formatWhole(player.s.points)} skill`},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        used: new Decimal(0),
        best: new Decimal(0),
    }},
    branches: ["g"],

    type: "static",
    resource: "skill",
    baseResource: "generator dust",
    baseAmount() {return player.g.points},

    requires: new Decimal(1e12), 
    exponent(){
        var exp = new Decimal(1.5)
        
        if(player.s.points.gte(100)) exp = exp.add(new Decimal(0.01).mul(player.s.points.sub(99)))

        return exp.sub(tmp.d.challenges[11].reward)
    },
    base(){
        return new Decimal(11).sub(tmp.d.challenges[22].reward).sub(hasAchievement("a",15)*2)
    },
    gainMult() {
        if(player.d.activeChallenge) return new Decimal(0)
        
        mult = new Decimal(1)
        if(hasAchievement('a', 21)) mult = mult.mul(4)
        return mult.recip()
    },
    gainExp() {
        return new Decimal(1)
    },
    
    tabFormat: {
        "Skill Tree": {
            content: [
                ["blank",24],
                ["display-text",
                    function() { return `You have <h2 style="color: rgb(86, 204, 163); text-shadow: rgb(86, 204, 163) 0px 0px 10px;">${formatWhole(player.s.points.sub(player.s.used))} / ${formatWhole(player.s.points)}</h2> skill` }],

                "blank",
                "prestige-button",
                ["display-text",
                    function() { return `Note: for any node with two branches; you only need one or the other to buy that upgrade.` }, {"fontSize": "12px"}],
                
                "blank",
                ["clickables",1],
                "upgrades",
            ]
        },
        Automation: {
            content: [
                ["microtabs","Automation"]
            ],
            prestigeNotify(){
                return tmp.sa.prestigeNotify;
            }
        },
    },
    microtabs: {
        Automation: {
            Upgrades: {
                embedLayer: "sa",
                buttonStyle: {"fontSize":"0.85em","borderColor":"#4DB080"},
            },
            Milestones: {
                content: [
                    ["blank",24],
                    ["clickables",[2]],
                    "blank",
                    ["display-text",
                        function() { return `You have <h2 style="color: rgb(86, 204, 163); text-shadow: rgb(86, 204, 163) 0px 0px 10px;">${formatWhole(player.s.points.sub(player.s.used))} / ${formatWhole(player.s.points)}</h2> skill` }],
                    "blank",
                    "milestones"
                ],
                buttonStyle: {"fontSize":"0.85em","borderColor":"#4DB080"},
            }
        },
    },

    milestones: {
        0: {
            requirementDescription: "1 Skill",
            effectDescription: "Unlock a new skill tab",

            done() { return player.s.points.gte(1) },
            unlocked() {return true},
        },
        1: {
            requirementDescription: "2 Skill",
            effectDescription: "+1 automation point",

            done() { return player.s.points.gte(2) },
            unlocked() {return hasMilestone("s",0) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        2: {
            requirementDescription: "5 Skill",
            effectDescription: "+1 automation point",

            done() { return player.s.points.gte(5) },
            unlocked() {return hasMilestone("s",0) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        3: {
            requirementDescription: "10 Skill",
            effectDescription: "+1 automation point",

            done() { return player.s.points.gte(10) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        4: {
            requirementDescription: "12 Skill",
            effectDescription: "+1 automation point. Keep one compact on all row 2 resets",

            done() { return player.s.points.gte(12) },
            unlocked() {return hasMilestone("s",this.id-2)},
        },
        5: {
            requirementDescription: "13 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(13) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        6: {
            requirementDescription: "15 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(15) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        7: {
            requirementDescription: "17 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(17) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        8: {
            requirementDescription: "20 Skill",
            effectDescription: "+1 automation point; generator milestones are kept on row 2 resets",
            
            done() { return player.s.points.gte(20) },
            unlocked() {return hasMilestone("s",this.id-2)},
        },
        9: {
            requirementDescription: "26 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(26) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        10: {
            requirementDescription: "33 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(33) },
            unlocked() {return hasMilestone("s",this.id-2) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        11: {
            requirementDescription: "60 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(60) },
            unlocked() {return hasMilestone("s",this.id-1) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
        12: {
            requirementDescription: "70 Skill",
            effectDescription: "+1 automation point",
            
            done() { return player.s.points.gte(70) },
            unlocked() {return hasMilestone("s",this.id-1) && !player.g.clickables[21]},
            style: {"font-size": "0.8em", "height": "0px"}
        },
    },

    clickables: {
        11: {
            display() {return "<h3>Respec</h3><br>Reset your skill points to reallocate them."},
            tooltip() {return "Resets <em>nothing</em><br>Hotkey: R (only usable in-tab)"},
            canClick() {return player.s.upgrades.length > 0 || player.s.used.gt(0)},
            onClick() {
                player.s.used = new Decimal(0)
                player.s.upgrades = []
            }
        },
        12: {
            display() {return "<h3>Buy all</h3><br>Buys as many upgrades as possible"},
            tooltip() {return "Buys left to right; top to bottom"},
            canClick() {return player.s.points.gt(player.s.used)},
            onClick() {
                let upgs = [11,12,13,21,22,23,32,33,41,42,43,51,52,53,61,62,63,71,72,73,81,82,83,91,92,93]
                let j;

                for(var i=0;i<upgs.length;i++){
                    j = layers.s.upgrades[upgs[i]];
                    if(
                        (typeof j.unlocked == "function" ? j.unlocked() : j.unlocked) &&
                        layers.s.upgrades[upgs[i]].canAfford() && !player.s.upgrades.includes(upgs[i])
                    ){
                        layers.s.upgrades[upgs[i]].pay()
                        player.s.upgrades.push(upgs[i])
                    }
                }
                
            }
        },
        21: {
            display() {
                if(player.g.clickables[21]) return "Show non-unique milestones"
                return "Only show unique milestones"
            },
            canClick() {return player.s.points.gt(player.s.used)},
            onClick() {
                player.g.clickables[21] = !player.g.clickables[21]
            },
            style() {
                let styles = {
                    "min-height": "0px",
                    "padding": "15px 10px",
                    "font-size": "11px",
                    "borderRadius": "5px",
                    "width": "200px",
                }
                if(player.g.clickables[21]) styles["backgroundColor"] = "#9AEB57"
                else styles["backgroundColor"] = "#EB5778"
                return styles
            },
        },
    },

    upgrades: {
        11: {
            title: "A generic boost",
            description: "All generators are stronger based on total real time played.",

            effect(){
                return new Decimal(player.timePlayed).add(1).tetrate(
                    new Decimal(0.13).add(tmp.d.challenges[21].reward)
                ).sub(1).max(1.5)
            },
            effectDisplay(){return "×" + format(this.effect(),3)},

            cost: new Decimal(1),

            canAfford() { return player.s.points.sub(player.s.used).gte(this.cost)},
            pay() { player.s.used = player.s.used.add(this.cost)},
        },
        21: {
            title: "A generic power",
            description: "Buff generator dust effect by ^+0.15",
            cost: new Decimal(1),
            branches: ["11"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        22: {
            title: "Compact+",
            description: "Compact scaling is better",
            cost: new Decimal(1),
            branches: ["11"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        31: {style: {"visibility": "hidden"},canAfford(){return false}},
        32: {
            title: "Compact++",
            description: "Compact scaling is better",
            cost: new Decimal(1),
            branches: ["22"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        41: {
            title: "Power Surge",
            description: "DOUBLE generator dust effect",
            cost: new Decimal(1),
            branches: ["21","32"],

            canAfford() {
                if(!player.s.points.sub(player.s.used).gte(this.cost)) return false
                for(var i=0;i<this.branches.length;i++){ if(hasUpgrade(this.layer,this.branches[i])) return true}
                return false
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },

        42: {
            title: "New compact methods",
            description: "Unlock Compression",
            cost: new Decimal(1),
            branches(){if(!hasAchievement("a",21)) return [32]},

            canAfford() {
                if(hasAchievement("a",21)) return player.s.points.sub(player.s.used).gte(this.cost)
                return hasUpgrade(this.layer, 32) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },
        51: {
            title: "Compress Power",
            description: "Compress strength is x2.5",
            tooltip() {return "5^x => 12.5^x"},
            cost: new Decimal(1),
            branches: ["42"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },
        52: {
            title: "Compress Slowdown",
            description: "Slightly reduce the scaling of compresses",
            cost: new Decimal(1),
            branches: ["42"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },
        61: {
            title: "Compress Slowdown II",
            description: "Reduce the scaling of compresses",
            cost: new Decimal(1),
            branches: ["52"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },
        62: {
            title: "Compact Slowdown",
            description: "Reduce the scaling of compacting",
            cost: new Decimal(1),
            branches: ["52"],

            canAfford() {
                for(var i=0;i<this.branches.length;i++){ if(!hasUpgrade(this.layer,this.branches[i])) return false }
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },
        71: {
            title: "More!!",
            description: "Unlock Condensing",
            cost: new Decimal(2),
            branches: ["61","62"],

            canAfford() {
                if(!player.s.points.sub(player.s.used).gte(this.cost)) return false
                for(var i=0;i<this.branches.length;i++)
                    if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false
            }, pay() { player.s.used = player.s.used.add(this.cost)},
            unlocked() {return hasAchievement("a",15)}
        },

        81: {
            title: "Squishable",
            description: "Condenses require 50% less compresses (rounded up)",
            cost: new Decimal(1),
            branches: ["71"],

            unlocked() {return player.d.challenges[12] >= 1},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        63: {
            title: "Clockwork",
            description: "Unlock Time Multipliers",
            cost: new Decimal(2),
            branches: ["52"],

            unlocked() {return player.d.challenges[12] >= 1},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },

        72: {
            title: "Clockwork II",
            description: "Time multiplier cost scaling is heavily nerfed",
            tooltip: "1e6*2^(x^1.2) => 1e5*1.5^(x^1.16)",
            cost: new Decimal(1),
            branches: ["63"],

            
            unlocked() {return player.d.challenges[12] >= 2},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        82: {
            title: "Clockwork III",
            description: "Time multiplier cost scaling is heavily nerfed",
            tooltip: "1e5*1.5^(x^1.16) => 1e5*1.5^(x^1.12)",
            cost: new Decimal(2),
            branches: ["72"],

            unlocked() {return player.d.challenges[12] >= 2},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        91: {
            title: "Squishability+",
            description: "Condense and Compress requirements are nerfed by 50%",
            cost: new Decimal(2),
            branches: ["81","82"],

            unlocked() {return player.d.challenges[12] >= 2},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        23: {
            title: "A more basic boost",
            description: "All generators are stronger based on time since last row 2 reset.",

            effect(){
                return new Decimal(player.g.time).tetrate(
                    new Decimal(0.6)
                ).pow(1.25).max(1)
            },
            effectDisplay(){return "×" + format(this.effect(),3)},

            cost: new Decimal(1),

            unlocked() {return player.d.challenges[12] >= 2},

            canAfford() {
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        33: {
            title: "Time Warp",
            description: "Speed up time since last row 2 reset based on total skill points",
            tooltip: "(boosts A more basic boost and Tertiary Time Generators)",

            effect(){
                return player.s.total.div(2)
            },
            effectDisplay(){return "×" + format(this.effect(),1)},

            cost: new Decimal(1),

            branches: ["23"],

            unlocked() {return player.d.challenges[12] >= 2},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },

        43: {
            title: "Time Warp II",
            description: "Speed up time since last row 2 reset based on time since last row 2 reset",
            tooltip: "(Time Warp upgrades boost this)",

            effect(){
                if(hasAchievement("a",44)) return new Decimal(player.g.time).pow(0.3).add(1).pow(2.2)
                if(hasAchievement("a",43)) return new Decimal(player.g.time).pow(0.3).add(1).pow(2)
                return new Decimal(player.g.time).pow(0.3).add(1)
            },
            effectDisplay(){return "×" + format(this.effect(),2)},

            cost: new Decimal(1),

            branches: ["33"],

            unlocked() {return player.d.challenges[12] >= 3},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },

        53: {
            title: "Time Warp III",
            description: "Speeds up time based on tears",

            effect(){
                return new Decimal(2).mul(player.d.points.pow(2))
            },
            effectDisplay(){return "×" + format(this.effect(),2)},

            cost: new Decimal(1),

            branches: ["43"],

            unlocked() {return player.d.challenges[12] >= 4},
            style(){
                if(this.effect().lte(1) && hasUpgrade("s",this.id)) return {"backgroundColor":"#CC4E6A"}
                if(this.effect().lte(1) && this.canAfford()) return {"backgroundColor":"#996E78"}
            },

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        12: {
            title: "A generic-er boost",
            description: "Boosts generators based on skill points",

            effect(){
                return player.s.points.pow(0.7)
            },
            effectDisplay(){return "×" + format(this.effect(),2)},

            cost: new Decimal(1),


            unlocked() {return player.d.challenges[12] >= 4},

            canAfford() {
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        13: {
            title: "A generic-er-er boost",
            description: "Boosts generators based on tears",

            effect(){
                return player.d.points.pow(0.9).mul(3)
            },
            effectDisplay(){return "×" + format(this.effect(),2)},

            cost: new Decimal(1),


            unlocked() {return player.d.challenges[12] >= 4},
            style(){
                if(this.effect().lte(1) && hasUpgrade("s",this.id)) return {"backgroundColor":"#CC4E6A"}
                if(this.effect().lte(1) && this.canAfford()) return {"backgroundColor":"#996E78"}
            },

            canAfford() {
                return player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        92: {
            title: "Expensive Upgrade",
            description: "Unlock Quaternary Multipliers",
            cost: new Decimal(10),
            branches: ["82"],

            unlocked() {return player.d.challenges[12] >= 4},

            canAfford() {
                for(var i=0;i<this.branches.length;i++) if(hasUpgrade(this.layer,this.branches[i])) return player.s.points.sub(player.s.used).gte(this.cost)
                return false;
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },

        73: {
            title: "Time Warp IV",
            description: "Speeds up time based on Compacts",

            effect(){
                return new Decimal(player.g.buyables[31]).mul(2).pow(0.5).add(3)
            },
            effectDisplay(){return "×" + format(this.effect())},

            cost: new Decimal(1),

            unlocked() {return player.d.challenges[12] >= 5},

            branches: [63],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        83: {
            title: "Time Warp V",
            description: "Speeds up time based on Compresses",

            effect(){
                return new Decimal(player.g.buyables[32]).mul(3).pow(0.8).add(3)
            },
            effectDisplay(){return "×" + format(this.effect())},

            cost: new Decimal(4),

            unlocked() {return player.d.challenges[12] >= 5},

            branches: [73],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
        93: {
            title: "Power bump",
            description: "Compact scaling price is decreased",

            effect(){
                return new Decimal(0.85)
            },
            effectDisplay(){return "^" + format(this.effect())},

            cost: new Decimal(25),

            unlocked() {return player.d.challenges[12] >= 5},

            branches: [82],
            canAfford() {
                return hasUpgrade("s",this.branches[0]) && player.s.points.sub(player.s.used).gte(this.cost)
            }, pay() { player.s.used = player.s.used.add(this.cost)},
        },
    },

    hotkeys: [//player.tab
        {key: "r", description: "R: Respecs skill upgrades (only usable in S-tab)", onPress(){if (player.tab === "s" && tmp.s.clickables[11].canClick) tmp.s.clickables[11].onClick()}},
        {key: "s", description: "S: Skill reset", onPress(){if (tmp.s.canReset) doReset("s")}},
    ],
})
addLayer("sa", {
    color: "#58D699",

    layerShown(){return false},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        used: new Decimal(0),
    }},

    tabFormat: [
        ["blank",24],
        ["display-text",
            function() { return `You have <h2 style="color: rgb(86, 204, 163); text-shadow: rgb(86, 204, 163) 0px 0px 10px;">${formatWhole(player.s.points.sub(player.s.used))} / ${formatWhole(player.s.points)}</h2> skill` }],
        ["blank",2],
        ["display-text",
            function() {
                let req = layers.s.milestones[player.s.milestones.length];
                if(req) req = req.requirementDescription
                else req = "Infinity Skill"
                return `You have <h2 style="color: rgb(86, 204, 163); text-shadow: rgb(86, 204, 163) 0px 0px 10px;">${formatWhole(player.sa.points.sub(player.sa.used))} / ${formatWhole(player.sa.points)}</h2> automation points (+1 at ${req})`
            }],
        //[1,2,6,9,12,13,15,18,20,26]
        "blank",
        "clickables",
        "upgrades",
    ],
    prestigeNotify(){return player.sa.points.sub(player.sa.used).gte(1)},

    clickables: {
        11: {
            display() {return "Respec<br><br>Reset your automation points to reallocate them."},
            canClick() {return player.sa.upgrades.length > 0 || player.sa.used.gt(0)},
            onClick() {
                player.sa.used = new Decimal(0)
                player.sa.upgrades = []
            }
        },
    },

    upgrades: {
        11: {
            fullDisplay: "<h2>Primary Generator</h2><br>automate primary generator purchasing and (total skill+1) multiplies generator dust gain",

            cost: new Decimal(1),

            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost)},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        12: {
            fullDisplay: "<h2>Primary Multiplier</h2><br>automate primary multipliers purchasing & they no longer take away points",

            branches: [11],
            cost: new Decimal(1),

            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        13: {
            fullDisplay: "<h2>Secondary Multiplier</h2><br>automate secondary multipliers purchasing & they no longer take away points",

            branches: [12],
            cost: new Decimal(1),

            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        14: {
            fullDisplay: "<h2>Time Multiplier</h2><br>automate tertiary time multipliers purchasing & they no longer take away points",

            branches: [13],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(4) && player.d.challenges[12] >= 1},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        21: {
            fullDisplay: "<h2>Compact II</h2><br>compacting resets nothing",

            branches: [22],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(5)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        22: {
            fullDisplay: "<h2>Compact</h2><br>automate compacts",

            branches: [13],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(4)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        23: {
            fullDisplay: "<h2>Compress</h2><br>automate compressing",

            branches: [22],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(4)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        24: {
            fullDisplay: "<h2>Quaternary Multi</h2><br>automate quaternary multipliers purchasing & they no longer take away points",

            branches: [14],
            cost: new Decimal(1),

            unlocked() {return player.d.challenges[12] >= 4},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        31: {
            fullDisplay: "<h2>Condense II</h2><br>condensing resets nothing",

            branches: [32],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(5)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        32: {
            fullDisplay: "<h2>Condense</h2><br>automate condensing",

            branches: [23],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(4)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        33: {
            fullDisplay: "<h2>Compress II</h2><br>compressing resets nothing",

            branches: [23],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(5)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        41: {
            fullDisplay: "<h2>Compact III</h2><br>triple compact bulk",
            tooltip: "(it resets 3x as fast)",

            branches: [31],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(11)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
        42: {
            fullDisplay: "<h2>Compact IV</h2><br>triple compact bulk again",
            tooltip: "(it resets 3x as fast)",

            branches: [41],
            cost: new Decimal(1),

            unlocked() {return player.sa.points.gte(11)},
            canAfford() { return player.sa.points.sub(player.sa.used).gte(this.cost) && hasUpgrade("sa",this.branches[0])},
            pay() { player.sa.used = player.sa.used.add(this.cost)},
        },
    },
    update() {
        player.sa.points = new Decimal(player.s.milestones.length);
    }
})

addLayer("d", {
    symbol: "D",
    color: "#5373DB",
    row: 1,
    position: 1,

    layerShown(){return hasAchievement("a",21)},
    tooltip(){return `<h2>Depression</h2><br>${formatWhole(player.d.points)} tears`},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		best: new Decimal(0),
    }},
    branches: ["g"],

    type: "static",
    resource: "tears",
    baseResource: "primary generators",
    baseAmount() {return player.g.buyables[11]},

    requires: new Decimal(18500), 
    exponent(){
        let exponent = 1.1;
        if(player.d.points.gte(4)) exponent = 1.3

        if(hasAchievement("a",42)) exponent -= 0.035;
        return exponent
    },
    base: 1.35,
    gainMult() {
        if(inChallenge("d",31)) return new Decimal(0)
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },

    tabFormat: {
        "Depression": {
            content: [
                ["blank",24],
                ["infobox","intro"],
                ["blank",12],
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return `Entering Depression causes a skill reset.` }, {"font-size": "12px"}],
                ["display-text",
                    function() { if(player.d.points.gte(1)) return `Ring I Depression` }, {"font-size": "18px"}],

                "blank",
                ["challenges",[1,2]],
                "blank",

                ["display-text",
                    function() { if(player.d.best.gte(5)) return `Ring II Depression.` }, {"font-size": "18px"}],
                "blank",
                ["challenges",[3,4]],
            ]
        },
    },

    infoboxes: {
        intro: {
            title: "Introduction!",
            body() { return `
                welcome to depression!<br><br>
                a quick note that skill respec ONLY resets skill upgrades; any locked mechanic's boost will still stay but you can't use it anymore.<br><br>
                also the compact scaling decreases are pretty strong<br><br>goodluck!` },
        },
    },

    challenges: {
        11: {
            name() {return `Baseline (${romanNumeral(player.d.challenges[this.id])})`},
            challengeDescription() {return `Divide skill by ${player.d.challenges[this.id] + 2}`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription: "Reduce skill requirement (-^0.04)",
            goal(){
                let req = new Decimal(1e15)
                req = req.mul(new Decimal(1e5).pow(new Decimal(2).pow(player.d.challenges[this.id])))
                if(player.d.challenges[11] >= 2) req = req.div(1e5)
                if(player.d.challenges[11] === 4) req = req.mul(1e5)
                return req;
            },
            canComplete: function() {
                return player.g.points.gte(this.goal())
            },
            reward() {
                return new Decimal(0.04).mul(player.d.challenges[this.id])
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = player.s.best.div(player.d.challenges[this.id] + 2).floor()
            },
            onExit(){player.s.points = player.s.best},
            unlocked(){return player.d.points.gte(1)},
            completionLimit: 5,
        },
        12: {
            name() {return `Supersqrt (${romanNumeral(player.d.challenges[this.id])})`},
            challengeDescription() {return `Divide skill by ${player.d.challenges[this.id] + 2}<br>Nerf all G-layer generators by ^^${format(this.nerf())}`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription: "Unlock new skill upgrades (each completion)",
            goal() {
                let req = new Decimal(1e25)
                req = req.mul(new Decimal(1e5).pow(player.d.challenges[this.id]))

                if(player.d.challenges[this.id] >= 1) req = req.div(1e5)
                if(player.d.challenges[this.id] === 3) req = req.div(1e5)
                if(player.d.challenges[this.id] >= 5) req = req.mul(1e5)

                return req;
            },
            canComplete() {
                let req = this.goal()
                return player.g.points.gte(req)
            },
            nerf() {
                return new Decimal(0.65).div(new Decimal(1.2).pow(player.d.challenges[this.id]))
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = player.s.best.div(player.d.challenges[this.id] + 2).floor()
            },
            onExit(){player.s.points = player.s.best},
            unlocked(){return player.d.points.gte(2)},
            completionLimit: 5,
        },
        21: {
            name() {return `Prestige Nerf (${romanNumeral(player.d.challenges[this.id])})`},
            challengeDescription() {return `Divide skill by ${player.d.challenges[this.id] + 2}<br>Nerf all compact/compress/condense by ^${format(this.nerf())}`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription: "S11: 'A generic Boost' is stronger",
            goal() {
                let req = new Decimal(1e15)
                req = req.mul(new Decimal(1e5).pow(player.d.challenges[this.id]))
                if(player.d.challenges[this.id] === 1) req = req.mul(1e5)
                if(req.gte(1e35)) req = req.mul(1e10)
                return req;
            },
            canComplete() {
                let req = this.goal()
                return player.g.points.gte(req)
            },
            reward() {
                return new Decimal(0.11).mul(new Decimal(player.d.challenges[this.id]).pow(0.65))
            },
            nerf() {
                return new Decimal(0.5).div(new Decimal(1.4).pow(player.d.challenges[this.id]))
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = player.s.best.div(player.d.challenges[this.id] + 2).floor()
            },
            onExit(){player.s.points = player.s.best},
            unlocked(){return player.d.points.gte(3)},
            completionLimit: 5,
        },
        22: {
            name() {return `Point Drought (${romanNumeral(player.d.challenges[this.id])})`},
            challengeDescription() {return `Divide skill by ${player.d.challenges[this.id] + 2}<br>Generator Dust efficiency is nerfed by ${format(this.nerf().mul(100))}%`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription: "Reduce the skill point requirement formula",
            goal() {
                let req = new Decimal(1e40)
                req = req.mul(new Decimal(1e5).pow(player.d.challenges[this.id]))
                if(player.d.challenges[this.id] === 0) req = req.mul(1e5)
                return req;
            },
            canComplete() {
                let req = this.goal()
                return player.g.points.gte(req)
            },
            reward() {
                return new Decimal(player.d.challenges[this.id]).pow(0.6)
            },
            nerf() {
                return new Decimal(0.1).div(new Decimal(5).pow(player.d.challenges[this.id]))
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = player.s.best.div(player.d.challenges[this.id] + 2).floor()
            },
            onExit(){player.s.points = player.s.best},
            unlocked(){return player.d.points.gte(4)},
            completionLimit: 5,
        },
        31: {
            name() {return `Baseline 2: ${romanNumeral(player.d.challenges[this.id])}`},
            challengeDescription() {return `Divide skill by ${player.d.challenges[this.id]*2 + 6}<br>Lose all depression`},
            goalDescription() {return `${format(this.goal())} generator dust`},
            rewardDescription: "you beat the game!!!",
            goal() {
                let req = new Decimal(["1e100","Infinity"][player.d.challenges[this.id]])
                //req = req.mul(new Decimal(1e5).pow(player.d.challenges[this.id]))
                return req;
            },
            canComplete() {
                let req = this.goal()
                return player.g.points.gte(req)
            },
            reward() {
                return new Decimal(player.d.challenges[this.id]).mul(3).pow(0.65)
            },
            nerf() {
                return new Decimal(0.1).div(new Decimal(5).pow(player.d.challenges[this.id]))
            },

            onEnter(){
                tmp.s.clickables[11].onClick()
                player.s.points = player.s.best.div(player.d.challenges[this.id]*2 + 6).floor()
                player.d.points = new Decimal(0)
            },
            onExit(){
                player.s.points = player.s.best
                player.d.points = player.d.best
            },
            unlocked(){return player.d.points.gte(5) || inChallenge("d",31)},
            completionLimit: 1,
        },
    }
})