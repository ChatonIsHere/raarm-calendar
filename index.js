"use strict";

class RaarmCalendar {
    constructor(location = "./data.json", startingDay = 0) {
        const low = require("lowdb");
        const FileSync = require("lowdb/adapters/FileSync");
        const adapter = new FileSync(location);
        this.data = low(adapter);
        this.data.defaults({ "day": startingDay }).write();
    }

    get rawDay() { return this.data.get("day").value() };
    get dayInWeek() { return this.rawDay % 7 };
    get weekInYear() { return Math.floor((this.rawDay % 350) / 7) };
    get dayOfYear() { return Math.floor(this.rawDay % 350) };
    get year() { return Math.floor(this.rawDay / 350) };

    get text() {
        return {
            days: ["Starday","Plarday","Harday","Midsday","Layday","Marday","Sarmday"],
            months: [{name:"DeepChill",weeks:4},{name:"FirstThaw",weeks:4},{name:"LeafSpring",weeks:4},{name:"SkySorrow",weeks:4},{name:"SunSong",weeks:4},{name:"DayStretch",weeks:4},{name:"ShieldMeet",weeks:2},{name:"Highburn",weeks:4},{name:"GoldReap",weeks:4},{name:"BronzeLeaf",weeks:4},{name:"FieldStark",weeks:4},{name:"FrostWind",weeks:4},{name:"SunSleep",weeks:4}]
        }
    }
 
    get month() {
        let returnVal = Math.floor(this.dayOfYear / 28);
        if (this.dayOfYear > 168) returnVal = Math.floor((this.dayOfYear + 14) / 28);
        return returnVal;
    };

    get day() {
        let dayTemp = this.dayOfYear - this.month * 28;
        if (this.dayOfYear > 181) return dayTemp + 14;
        else return dayTemp;
    }

    get mindar() {
        return `${this.year+1}: ${String(this.day+1).padStart(2, '0')}/${String(this.month+1).padStart(2, '0')}`;
    }

    increment() {
        this.data.update("day", n => n + 1).write();
    }

    add(amount, unit) {
        this.data.update("day", n => n + (amount * this.unitMod(unit))).write();
    }

    subtract(amount, unit) {
        this.data.update("day", n => n - (amount * this.unitMod(unit))).write();
        if (this.data.get("day").value() < 0) this.data.set("day", 0).write();
    }

    ordinal(i) {
        let j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) return i + "st";
        if (j == 2 && k != 12) return i + "nd";
        if (j == 3 && k != 13) return i + "rd";
        return i + "th";
    }

    unitMod(unit) {
        let unitMod = 1;

        switch(unit) {
            case "weeks": unitMod = 7; break;
            case "months": unitMod = 28; break;
            case "years": unitMod = 350; break;
        }

        return unitMod;
    }
}

module.exports = RaarmCalendar;