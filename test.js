// test.js
import { Model } from "./js/models/Model.js";
import { Weapon } from "./js/models/Weapon.js";
import { SpecialRule } from "./js/models/SpecialRule.js";
import { Unit } from "./js/models/Unit.js";
import { Army } from "./js/models/Army.js";

function testUnitBasics() {
  console.log("=== Testing Unit Basics ===");
  const unit = new Unit({
    armyId: "Xo19MAwQPGbs",
    selectionId: "rQIWNXD",
    name: "Light Walker",
    size: 1,
    bases: { round: "60", square: "50" },
    cost: 165,
    defense: 2,
    quality: 4,
    rules: [
      {
        id: "dIQ3SGl2J2Ew",
        name: "Fear",
        rating: 1,
        label: "Fear(1)",
      },
      {
        id: "a0YtInGiUDd6",
        name: "Tough",
        rating: "6",
        label: "Tough(6)",
      },
    ],
  });
  console.log(unit);
}

console.log("Starting tests for OPR Army Tracker data models");

testUnitBasics();

console.log("\nAll tests completed!");
